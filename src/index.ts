import chalk from "chalk";
import ora from "ora";

import { isGitRepo } from "./git/checkRepo";
import { getStagedFiles } from "./git/getStagedFiles";
import { getDiffStats } from "./git/getDiffStats";
import { detectScope } from "./analyzer/scopeDetector";
import { classifyCommitType } from "./analyzer/typeClassifier";
import { generateSummary } from "./analyzer/summarizer";
import { generateCommitMessage } from "./generator/commitGenerator";
import { confirmCommit } from "./ui/interactive";
import { commit } from "./git/commit";
import { enhanceCommit } from "./llm/ollamaEnhancer";
import { loadConfig } from "./config/loadConfig";
import { isOllamaRunning } from "./llm/checkOllama";

export async function run(options: any) {
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
  const enrichedFiles = [];

  for (const file of stagedFiles) {
    const stats = await getDiffStats(file.path);

    enrichedFiles.push({
      path: file.path,
      additions: stats.additions,
      deletions: stats.deletions
    });
  }

  const scope = detectScope(enrichedFiles.map(f => f.path));
  const type = classifyCommitType(enrichedFiles);
  const summary = generateSummary(enrichedFiles);

  let commitMessage = generateCommitMessage(type, scope, enrichedFiles);

  // Load config
  const config = await loadConfig();

  const model =
    options.model ||
    config.model ||
    "deepseek-coder:6.7b";

  // AI enhancement (optional)
  if (options.ai) {
    const running = await isOllamaRunning();

    if (!running) {
      console.log(
        chalk.yellow("Ollama is not running. Using rule-based commit.")
      );
    } else {
      const spinner = ora("Enhancing commit with AI...").start();

      try {
        commitMessage = await enhanceCommit(
          commitMessage,
          summary,
          model
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
