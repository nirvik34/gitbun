#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import { run } from "../src/index";
import { CancellationError } from "../src/utils/errors";
import pkg from "../package.json";
program
  .name("smartcommit")
  .description("AI-powered commit assistant")
  .version(pkg.version)
  .option("--ai", "Enhance commit message using AI")
  .option("--auto", "Auto accept commit without confirmation")
  .option("--model <name>", "Specify Ollama model")
  .option("--dry-run", "Print the generated commit message and exit without committing")
  .option("--share", "Push and generate a shareable explainer link");
program.action(async (options) => {
  try {
    await run(options);
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

program.parse();
