import chalk from "chalk";
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
import { loadConfig } from "./config/loadConfig";
import { createProvider } from "./llm";
import type { ProviderConfig } from "./llm";
import { ValidationError, CancellationError } from "./utils/errors";

interface CliOptions {
  ai?: boolean;
  model?: string;
  auto?: boolean;
  dryRun?: boolean;
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

  const spinner = ora();
  let commitMessage = "";

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

    const scope = detectScope(prioritizedFiles.map((f) => f.path));
    const type = await classifyCommitType(prioritizedFiles);
    const summary = generateSummaryFromResult(deduplicatedResult);

    spinner.succeed("Analyzing staged changes...");

    // Load config
    const config = await loadConfig();

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
      const provider = createProvider(config as ProviderConfig, process.env);
      const available = await provider.isAvailable();

      if (!available) {
        console.log(
          chalk.yellow(
            `\n${provider.name} is not available. Using rule-based commit.`
          )
        );
      } else {
        const selectedModel = await provider.resolveModel(
          options.model || config.model
        );

        if (!selectedModel) {
          console.log(
            chalk.yellow(
              `\nNo model resolved for ${provider.name}. Using rule-based commit.`
            )
          );
        } else {
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
}
