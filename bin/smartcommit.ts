#!/usr/bin/env node

import { program } from "commander";
import { run } from "../src/index";
import pkg from "../package.json";
program
  .name("smartcommit")
  .description("AI-powered commit assistant")
  .version(pkg.version)
  .option("--ai", "Enhance commit message using AI")
  .option("--auto", "Auto accept commit without confirmation")
  .option("--model <name>", "Specify Ollama model");
program.action(async (options) => {
  try {
    await run(options);
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
});

program.parse();
