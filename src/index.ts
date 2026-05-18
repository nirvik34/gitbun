// src/index.ts
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
import { enhanceCommit } from "./llm/ollamaEnhancer";
import { loadConfig } from "./config/loadConfig";
import { isOllamaRunning, getBestModel } from "./llm/checkOllama";
import { analyzeSemanticChanges } from "./analyzer/semanticAnalyzer";
import { SemanticEvent } from "./analyzer/semanticTypes";

interface CliOptions {
  ai?: boolean;
  model?: string;
  auto?: boolean;
  verbose?: boolean;
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
    console.log(chalk.red("Not inside a Git repository."));
    process.exit(1);
  }

  const stagedFiles = await getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log(chalk.yellow("No staged changes found."));
    console.log("Stage changes using: git add <file>");
    process.exit(0);
  }

  // Enrich file stats
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

// --- Semantic Analysis (AST-based) ---
let semanticEvents: SemanticEvent[] = [];

// Run semantic analysis
if (options.ai !== false) {
  try {
    const filePaths = enrichedFiles.map((f) => f.path);

    const semanticResult = await analyzeSemanticChanges(filePaths);

    if (!semanticResult.skipped && semanticResult.events.length > 0) {
      semanticEvents = semanticResult.events;

      if (options.verbose) {
        console.log(
          chalk.dim(
            `[semantic] Detected ${semanticEvents.length} structural changes`,
          ),
        );
      }
    } else if (options.verbose && semanticResult.skipped) {
      console.log(
        chalk.dim("[semantic] Analysis skipped (timeout or error)"),
      );
    }
  } catch {
    if (options.verbose) {
      console.warn(
        chalk.yellow(
          "[semantic] Semantic analysis failed, falling back to diff-based analysis",
        ),
      );
    }
  }
}

const filteredFiles = filterLowSignalFiles(enrichedFiles);

const prioritizedCandidates = sortBySignal(
  filteredFiles,
  getDiffForFile,
);

const prioritizedFiles =
  prioritizedCandidates.length > 0
    ? prioritizedCandidates
    : enrichedFiles;

const MIN_GROUP_SIZE = 2;

const deduplicatedResult = deduplicateFiles(
  prioritizedFiles,
  MIN_GROUP_SIZE,
);

const scope = detectScope(
  prioritizedFiles.map((f) => f.path),
);

const type = await classifyCommitType(prioritizedFiles);

const summary = generateSummaryFromResult(
  deduplicatedResult,
);

  // Load config
  const config = await loadConfig();

let commitMessage = generateCommitMessage(
  type,
  scope,
  prioritizedFiles,
  config.format,
  semanticEvents,
);

  // AI enhancement (optional)
  if (options.ai) {
    const running = await isOllamaRunning();

    if (!running) {
      console.log(
        chalk.yellow("Ollama is not running. Using rule-based commit."),
      );
    } else {
      let selectedModel = options.model || config.model;

      if (!selectedModel) {
        selectedModel = (await getBestModel()) || "deepseek-coder:6.7b";
      }

      const spinner = ora(
        `Enhancing commit with AI (${selectedModel})...`,
      ).start();

      try {
        commitMessage = await enhanceCommit(
          commitMessage,
          summary,
          selectedModel,
        );
        spinner.succeed();
      } catch {
        spinner.fail("AI enhancement failed");
      }
    }
  }

  // Confirmation flow
  let finalMessage: string;

  if (options.auto) {
    finalMessage = commitMessage;
  } else {
    const result = await confirmCommit(commitMessage);

    if (!result) {
      console.log("Commit cancelled.");
      process.exit(0);
    }

    finalMessage = result;
  }

  // Perform commit (git-native output)
  const output = await commit(finalMessage);

  console.log("\n" + output);
}
