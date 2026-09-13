#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import { run } from "../src/index";
import { installHook } from "../src/hooks/install";
import { uninstallHook } from "../src/hooks/uninstall";
import { CancellationError } from "../src/utils/errors";
import pkg from "../package.json";

program
  .name("gitbun")
  .description("AI-powered commit assistant")
  .version(pkg.version)
  .option("--ai", "Enhance commit message using AI")
  .option("--auto", "Auto accept commit without confirmation")
  .option("--model <name>", "Specify Ollama model")
  .option("--min-group-size <n>", "Minimum files per group for deduplication", "2")
  .option("--generate-only", "Print generated commit message to stdout (used by git hooks)")
  .option("--dry-run", "Print the generated commit message and exit without committing");

program.action(async (options) => {
  try {
    const opts = {
      ...options,
      minGroupSize: options.minGroupSize ? parseInt(options.minGroupSize, 10) : undefined,
    };
    await run(opts);
    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof CancellationError) {
      console.log(error.message);
      process.exit(0);
    }

    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red("An unknown error occurred."));
    }
    process.exit(1);
  }
});

// hooks subcommand
const hooks = program.command("hooks").description("Manage gitbun git hooks");

hooks
  .command("install")
  .description("Install a prepare-commit-msg hook in the current git repository")
  .option("--force", "Overwrite an existing hook")
  .action(async (options: { force?: boolean }) => {
    await installHook(options.force ?? false);
  });

hooks
  .command("uninstall")
  .description("Remove the gitbun-installed prepare-commit-msg hook")
  .action(async () => {
    await uninstallHook();
  });

program.parse();
