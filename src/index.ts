// src/index.ts
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { execFileSync } from "node:child_process";
import { program } from "commander";
import { runInitWizard } from './commands/init';
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
import { ValidationError, CancellationError } from "./utils/errors";
import { colorizeCommitMessage } from "./utils/commitColors";

interface CliOptions {
  ai?: boolean;
  model?: string;
  auto?: boolean;
  generateOnly?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  [key: string]: unknown;
}

// Helper to exit safely - can be mocked in tests
function safeExit(code: number): never {
  if (process.env.NODE_ENV === 'test') {
    throw new Error(`process.exit called with ${code}`);
  }
  process.exit(code);
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
      safeExit(0);
    }

    const { filesToStage } = await inquirer.prompt([{
      type: "checkbox",
      name: "filesToStage",
      message: "No files staged. Select files to stage (Space=select, Enter=confirm):",
      choices: unstagedFiles
    }]);

    if (filesToStage.length === 0) {
      console.log("Nothing selected. Exiting.");
      safeExit(0);
    }

    execFileSync("git", ["add", ...filesToStage], { stdio: "inherit" });

    const verified = execFileSync("git", ["diff", "--cached", "--name-only"])
      .toString()
      .trim();

    if (!verified) {
      console.log(chalk.red("Staging failed. No files were staged."));
      safeExit(1);
    }

    await run(options);
  } catch (error) {
    if (error instanceof CancellationError) {
      throw error;
    }
    console.error(chalk.red("Failed to launch staging UI:"), error);
    safeExit(1);
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

  const spinner = ora();
  let commitMessage = "";

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
    const MIN_GROUP_SIZE = 2;
    const deduplicatedResult = deduplicateFiles(prioritizedFiles, MIN_GROUP_SIZE);

    const scope = detectScope(prioritizedFiles.map((f) => f.path));
    const type = await classifyCommitType(prioritizedFiles);
    const summary = generateSummaryFromResult(deduplicatedResult);

    // --- Generate commit message (pass semantic events) ---
    spinner.start("Generating commit message...");
    const config = await loadConfig();
    commitMessage = generateCommitMessage(
      type,
      scope,
      prioritizedFiles,
      config.format,
      semanticEvents  // added from semantic branch
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
            config
          );
          commitMessage = await enhanceCommit(commitMessage, summary, selectedModel, config);
          spinner.succeed(`Enhanced commit with AI (${selectedModel})`);
        } catch {
          spinner.fail("AI enhancement failed");
        }
      }
    }
  } catch (error) {
    spinner.fail("Failed during analysis or generation.");
    console.error(error);
    safeExit(1);
  }

  // Hook mode: print message to stdout and exit without committing
  if (options.generateOnly) {
    console.log(commitMessage);
    return;
  }

  // Dry run
  if (options.dryRun) {
    console.log("\n" + colorizeCommitMessage(commitMessage) + "\n");
    safeExit(0);
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
  safeExit(0);
}

// ============================================
// CLI Command Registration
// ============================================

// Set up the CLI program
program
  .name('git-commit-assistant')
  .description('AI-powered commit message generator with semantic analysis')
  .version('1.0.0');

// Main commit command (existing functionality)
program
  .command('commit')
  .description('Generate and commit with AI assistance')
  .option('--ai', 'Use AI enhancement with Ollama')
  .option('--model <model>', 'Specify the AI model to use')
  .option('--auto', 'Skip confirmation and commit automatically')
  .option('--generate-only', 'Only generate the commit message without committing')
  .option('--verbose', 'Show verbose output during processing')
  .option('--dry-run', 'Show the commit message without committing')
  .action(async (options) => {
    try {
      await run(options);
    } catch (error) {
      if (error instanceof CancellationError) {
        console.log(chalk.yellow('\nCommit cancelled.'));
        safeExit(0);
      }
      console.error(chalk.red('\nError:'), error);
      safeExit(1);
    }
  });

// NEW: Init command for interactive setup wizard
program
  .command('init')
  .description('Interactive setup wizard for configuring the commit assistant')
  .option('--yes', 'Accept all defaults (non-interactive mode)')
  .action(async (opts) => {
    try {
      await runInitWizard({ yes: opts.yes });
      safeExit(0);
    } catch (error) {
      console.error(chalk.red('\nInit failed:'), error);
      safeExit(1);
    }
  });

// Default command: if no command is specified, run the commit command
program
  .command('*', { isDefault: true })
  .description('Default command - run commit assistant')
  .action(() => {
    // Parse the original arguments to check for options
    const args = process.argv.slice(2);
    const options: CliOptions = {};
    
    // Simple parsing for common options
    if (args.includes('--ai')) options.ai = true;
    if (args.includes('--auto')) options.auto = true;
    if (args.includes('--generate-only')) options.generateOnly = true;
    if (args.includes('--verbose')) options.verbose = true;
    if (args.includes('--dry-run')) options.dryRun = true;
    
    // Parse --model value
    const modelIndex = args.indexOf('--model');
    if (modelIndex !== -1 && args[modelIndex + 1]) {
      options.model = args[modelIndex + 1];
    }
    
    // Run the commit command
    run(options).catch((error) => {
      if (error instanceof CancellationError) {
        console.log(chalk.yellow('\nCommit cancelled.'));
        safeExit(0);
      }
      console.error(chalk.red('\nError:'), error);
      safeExit(1);
    });
  });

// Only parse if this is the main module (not being imported for tests)
if (require.main === module) {
  program.parse();
}

// Export for testing
export { program, safeExit };