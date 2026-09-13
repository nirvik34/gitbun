// src/index.ts
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { execFileSync } from "node:child_process";

import { isGitRepo, isFirstCommit } from "./git/checkRepo";
import { getStagedFiles } from "./git/getStagedFiles";
import { getDiffStats } from "./git/getDiffStats";
import { scanDiff } from "./analyzer/diffScanner";
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
import { enhanceCommit } from "./llm/ollamaEnhancer";
import { loadConfig } from "./config/loadConfig";
import { isOllamaRunning, getBestModel } from "./llm/checkOllama";
import { analyzeSemanticChanges } from "./analyzer/semanticAnalyzer";
import { SemanticEvent } from "./analyzer/semanticTypes";
import { ValidationError, CancellationError } from "./utils/errors";
import { colorizeCommitMessage } from "./utils/commitColors";

interface CliOptions {
  ai?: boolean;
  model?: string;
  auto?: boolean;
  generateOnly?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  minGroupSize?: number;
  [key: string]: unknown;
}

async function launchStagingUI(options: CliOptions) {
  try {
    const modifiedFiles = execFileSync("git", ["ls-files", "--modified"])
      .toString()
      .split("\n")
      .filter(Boolean);
    const untrackedFiles = execFileSync("git", [
      "ls-files",
      "--others",
      "--exclude-standard",
    ])
      .toString()
      .split("\n")
      .filter(Boolean);
    const unstagedFiles = [...modifiedFiles, ...untrackedFiles];

    if (unstagedFiles.length === 0) {
      console.log("No changes detected to commit.");
      process.exit(0);
    }

    const { filesToStage } = await inquirer.prompt([{
      type: "checkbox",
      name: "filesToStage",
      message: "No files staged. Select files to stage (Space=select, Enter=confirm):",
      choices: unstagedFiles
    }]);

    if (filesToStage.length === 0) {
      console.log("Nothing selected. Exiting.");
      process.exit(0);
    }

    execFileSync("git", ["add", ...filesToStage], { stdio: "inherit" });

    const verified = execFileSync("git", ["diff", "--cached", "--name-only"])
      .toString()
      .trim();

    if (!verified) {
      console.log(chalk.red("Staging failed. No files were staged."));
      process.exit(1);
    }

    await run(options);
  } catch (error) {
    if (error instanceof CancellationError) {
      throw error;
    }
    console.error(chalk.red("Failed to launch staging UI:"), error);
    process.exit(1);
  }
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
  const repo = await isGitRepo();
  if (!repo) {
    throw new ValidationError("Not inside a Git repository.");
  }

  const stagedFiles = await getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log(chalk.yellow("No staged changes found."));
    console.log("Stage changes using: git add <file>");
    await launchStagingUI(options);
    return;
  }

  const firstCommit = await isFirstCommit();

  const spinner = ora();
  let commitMessage = "";

  if (firstCommit) {
    commitMessage = "first commit";
    if (!options.generateOnly && !options.dryRun && !options.auto) {
      const result = await confirmCommit(commitMessage);
      if (!result) {
        throw new CancellationError();
      }
      const output = await commit(result);
      console.log("\n" + output);
    } else {
      if (options.generateOnly) console.log(commitMessage);
      if (options.dryRun) console.log("\n" + colorizeCommitMessage(commitMessage) + "\n");
      if (options.auto) {
        const output = await commit(commitMessage);
        console.log("\n" + output);
      }
    }
    return;
  }

  try {
    // --- Build enriched files (from main, but without spinner yet) ---
    const enrichedFiles: FileChange[] = [];
    for (const file of stagedFiles) {
      const stats = await getDiffStats(file.path);
      enrichedFiles.push({
        path: file.path,
        additions: stats.additions,
        deletions: stats.deletions,
        status: file.status,
      });
    }

    // --- Semantic analysis (from semantic branch) ---
    let semanticEvents: SemanticEvent[] = [];
    if (options.ai !== false) {
      try {
        const filePaths = enrichedFiles.map((f) => f.path);
        const semanticResult = await analyzeSemanticChanges(filePaths);

        if (!semanticResult.skipped && semanticResult.events.length > 0) {
          semanticEvents = semanticResult.events;
          if (options.verbose) {
            console.log(
              chalk.dim(
                `[semantic] Detected ${semanticEvents.length} structural changes`
              )
            );
          }
        } else if (options.verbose && semanticResult.skipped) {
          console.log(chalk.dim("[semantic] Analysis skipped (timeout or error)"));
        }
      } catch {
        if (options.verbose) {
          console.warn(
            chalk.yellow(
              "[semantic] Semantic analysis failed, falling back to diff-based analysis"
            )
          );
        }
      }
    }

    // --- File filtering & prioritisation (from both branches, identical) ---
    const filteredFiles = filterLowSignalFiles(enrichedFiles);
    const prioritizedCandidates = sortBySignal(filteredFiles, getDiffForFile);
    const prioritizedFiles =
      prioritizedCandidates.length > 0 ? prioritizedCandidates : enrichedFiles;
    const MIN_GROUP_SIZE = options.minGroupSize ?? 2;
    const deduplicatedResult = deduplicateFiles(prioritizedFiles, MIN_GROUP_SIZE);

    const scope = detectScope(prioritizedFiles.map((f) => f.path));
    const type = await classifyCommitType(prioritizedFiles);
    const summary = generateSummaryFromResult(deduplicatedResult);

    const diffSignals = await scanDiff();

    // --- Generate commit message (pass semantic events and diff signals) ---
    spinner.start("Generating commit message...");
    const config = await loadConfig();
    commitMessage = generateCommitMessage(
      type,
      scope,
      prioritizedFiles,
      config.format,
      semanticEvents,
      diffSignals,
    );
    spinner.succeed("Generating commit message...");

    // --- AI enhancement (optional, from both branches) ---
    if (options.ai) {
      const running = await isOllamaRunning();
      if (!running) {
        console.log(chalk.yellow("\nOllama is not running. Using rule-based commit."));
      } else {
        let selectedModel = options.model || config.model;
        if (!selectedModel) {
          selectedModel = (await getBestModel()) || "deepseek-coder:6.7b";
        }
        spinner.start(`Enhancing commit with AI (${selectedModel})...`);
        try {
          commitMessage = await enhanceCommit(
            commitMessage,
            summary,
            selectedModel,
            config,
          );
          spinner.succeed(`Enhanced commit with AI (${selectedModel})`);
        } catch {
          spinner.fail("AI enhancement failed");
        }
      }
    }
  } catch (error) {
    spinner.fail("Failed during analysis or generation.");
    console.error(error);
    process.exit(1);
  }

  // Hook mode: print message to stdout and exit without committing
  if (options.generateOnly) {
    console.log(commitMessage);
    return;
  }

  // Dry run
  if (options.dryRun) {
    console.log("\n" + colorizeCommitMessage(commitMessage) + "\n");
    process.exit(0);
  }

  // Confirmation
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

  // Perform commit
  const output = await commit(finalMessage);
  console.log("\n" + output);
}
