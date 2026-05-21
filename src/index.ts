import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { execFileSync } from "node:child_process";

import { isGitRepo } from "./git/checkRepo";
import { getStagedFiles } from "./git/getStagedFiles";
import { getDiffStats } from "./git/getDiffStats";
import { detectScope } from "./analyzer/scopeDetector";
import { classifyCommitType } from "./analyzer/typeClassifier";
import { generateSummaryFromResult } from "./analyzer/summarizer";
import {
  filterLowSignalFiles,
  type FileChange,
} from "./analyzer/fileFilter";
import { sortBySignal } from "./analyzer/fileScorer";
import { deduplicateFiles } from "./analyzer/fileDeduplicator";
import { generateCommitMessage } from "./generator/commitGenerator";
import { confirmCommit } from "./ui/interactive";
import { commit } from "./git/commit";
import { push } from "./git/push";
import { loadConfig } from "./config/loadConfig";
import { createProvider } from "./llm";
import type { LLMProvider, ProviderConfig } from "./llm";
import { explainCommit } from "./llm/explain";
import { createShare, ShareError } from "./share/shareClient";
import type { SharePayload } from "./share/types";
import { ValidationError, CancellationError } from "./utils/errors";

interface CliOptions {
  ai?: boolean;
  model?: string;
  auto?: boolean;
  dryRun?: boolean;
  share?: boolean;
  [key: string]: unknown;
}

function getDiffForFile(path: string): string {
  try {
    return execFileSync("git", ["diff", "--cached", "-U0", "--", path], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

function getHeadCommitDiff(): string {
  try {
    return execFileSync("git", ["show", "--no-color", "--patch", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return "";
  }
}

function resolveShareUrl(config: Record<string, unknown>): string | undefined {
  const fromEnv = process.env.GITBUN_SHARE_URL?.trim();
  if (fromEnv) return fromEnv;
  const fromConfig = config.shareUrl;
  if (typeof fromConfig === "string" && fromConfig.trim().length > 0) {
    return fromConfig.trim();
  }
  return undefined;
}

async function runShareFlow(
  options: CliOptions,
  config: Record<string, unknown>,
  provider: LLMProvider | undefined,
  selectedModel: string | undefined,
  message: string,
  summary: string,
  type: string,
  scope: string,
  shareUrl: string
): Promise<void> {
  const spinner = ora();

  // 1. Generate reasoning. Soft-fails to deterministic explanation.
  spinner.start("Generating commit explanation...");
  const effectiveProvider = provider ?? createProvider({}, process.env);
  const reasoningModel =
    selectedModel ?? (await effectiveProvider.resolveModel()) ?? "rule-based";
  let reasoning: string;
  try {
    reasoning = await explainCommit(effectiveProvider, {
      message,
      summary,
      type,
      scope,
      model: reasoningModel,
    });
    spinner.succeed("Generated commit explanation.");
  } catch (error) {
    spinner.fail("Explanation generation failed; continuing.");
    console.log(chalk.yellow(`  ${(error as Error).message}`));
    reasoning = `Type \`${type}\` was selected for scope \`${scope}\`.`;
  }

  // 2. Push (confirm unless --auto).
  let pushed: { remote: string; branch: string } | null = null;
  let shouldPush = Boolean(options.auto);
  if (!options.auto) {
    const { ok } = await inquirer.prompt([
      {
        type: "confirm",
        name: "ok",
        message: "Push current branch to its upstream remote?",
        default: true,
      },
    ]);
    shouldPush = Boolean(ok);
    if (!shouldPush) {
      console.log(chalk.yellow("Skipped push. Continuing with share link generation."));
    }
  }

  if (shouldPush) {
    spinner.start("Pushing branch...");
    try {
      const result = await push();
      pushed = { remote: result.remote, branch: result.branch };
      spinner.succeed(`Pushed ${result.branch} to ${result.remote}.`);
    } catch (error) {
      spinner.fail("Push failed.");
      console.log(
        chalk.yellow(
          `  ${(error as Error).message}\n  Continuing — the share link will still be generated.`
        )
      );
    }
  }

  // 3. POST payload.
  const diff = getHeadCommitDiff();
  const payload: SharePayload = {
    message,
    diff,
    reasoning,
    type,
    scope,
    provider: effectiveProvider.name,
    model: reasoningModel,
    createdAt: new Date().toISOString(),
  };

  spinner.start("Creating share link...");
  try {
    const result = await createShare(payload, shareUrl);
    spinner.succeed("Share link ready.");
    console.log(
      chalk.cyan(`\nShare: ${result.url}`) +
        (pushed ? chalk.gray(`  (pushed ${pushed.branch} → ${pushed.remote})`) : "")
    );
  } catch (error) {
    spinner.fail("Could not create share link.");
    if (error instanceof ShareError) {
      console.log(chalk.yellow(`  ${error.message}`));
    } else {
      console.log(chalk.yellow(`  ${(error as Error).message}`));
    }
  }

}

export async function run(options: CliOptions) {
  // Ensure we are inside a Git repo
  const repo = await isGitRepo();
  if (!repo) {
    throw new ValidationError("Not inside a Git repository.");
  }

  const stagedFiles = await getStagedFiles();

  if (stagedFiles.length === 0) {
    throw new ValidationError("No staged changes found.\nStage changes using: git add <file>");
  }

  const config = await loadConfig();

  // Validate share configuration early — fail fast before committing.
  let shareUrl: string | undefined;
  if (options.share) {
    shareUrl = resolveShareUrl(config);
    if (!shareUrl) {
      throw new ValidationError(
        "--share requires shareUrl in .smartcommitrc or GITBUN_SHARE_URL in the environment."
      );
    }
  }

  const spinner = ora();
  let commitMessage = "";
  let summary = "";
  let scope = "";
  let type = "";
  let provider: LLMProvider | undefined;
  let selectedModel: string | undefined;

  try {
    const enrichedFiles: FileChange[] = [];
    spinner.start("Analyzing staged changes...");
    for (const file of stagedFiles) {
      const stats = await getDiffStats(file.path);
      enrichedFiles.push({
        path: file.path,
        additions: stats.additions,
        deletions: stats.deletions,
        status: file.status,
      });
    }

    const filteredFiles = filterLowSignalFiles(enrichedFiles);
    const prioritizedCandidates = sortBySignal(filteredFiles, getDiffForFile);
    const prioritizedFiles =
      prioritizedCandidates.length > 0 ? prioritizedCandidates : enrichedFiles;
    const MIN_GROUP_SIZE = 2;
    const deduplicatedResult = deduplicateFiles(
      prioritizedFiles,
      MIN_GROUP_SIZE
    );

    scope = detectScope(prioritizedFiles.map((f) => f.path));
    type = await classifyCommitType(prioritizedFiles);
    summary = generateSummaryFromResult(deduplicatedResult);

    spinner.succeed("Analyzing staged changes...");

    spinner.start("Generating commit message...");
    commitMessage = generateCommitMessage(
      type,
      scope,
      prioritizedFiles,
      config.format
    );
    spinner.succeed("Generating commit message...");

    // AI enhancement (optional)
    if (options.ai) {
      provider = createProvider(config as ProviderConfig, process.env);
      const available = await provider.isAvailable();

      if (!available) {
        console.log(
          chalk.yellow(
            `\n${provider.name} is not available. Using rule-based commit.`
          )
        );
      } else {
        const resolved = await provider.resolveModel(
          options.model || config.model
        );

        if (!resolved) {
          console.log(
            chalk.yellow(
              `\nNo model resolved for ${provider.name}. Using rule-based commit.`
            )
          );
        } else {
          selectedModel = resolved;
          spinner.start(
            `Enhancing commit with ${provider.name} (${selectedModel})...`
          );

          try {
            commitMessage = await provider.enhanceCommit(
              commitMessage,
              summary,
              selectedModel
            );
            spinner.succeed(
              `Enhanced commit with ${provider.name} (${selectedModel})`
            );
          } catch {
            spinner.fail("AI enhancement failed");
          }
        }
      }
    }
  } catch (error) {
    spinner.fail("Failed during analysis or generation.");
    console.error(error);
    process.exit(1);
  }

  // Dry run: print message and exit without committing
  if (options.dryRun) {
    console.log("\n" + commitMessage + "\n");
    process.exit(0);
  }

  // Confirmation flow
  let finalMessage: string;

  if (options.auto) {
    finalMessage = commitMessage;
  } else {
    const result = await confirmCommit(commitMessage);

    if (!result) {
      throw new CancellationError();
    }

    finalMessage = result;
  }

  // Perform commit (git-native output)
  const output = await commit(finalMessage);

  console.log("\n" + output);

  if (options.share && shareUrl) {
    await runShareFlow(
      options,
      config,
      provider,
      selectedModel,
      finalMessage,
      summary,
      type,
      scope,
      shareUrl
    );
  }
}
