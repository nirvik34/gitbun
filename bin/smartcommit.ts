#!/usr/bin/env node

import { program } from "commander";
import { run } from "../src/index";
import { installHook } from "../src/hooks/install";
import { uninstallHook } from "../src/hooks/uninstall";
import pkg from "../package.json";

program
  .name("gitbun")
  .description("AI-powered commit assistant")
  .version(pkg.version)
  .option("--ai", "Enhance commit message using AI")
  .option("--auto", "Auto accept commit without confirmation")
  .option("--model <name>", "Specify Ollama model")
  .option("--generate-only", "Print generated commit message to stdout (used by git hooks)");

program.action(async (options: { ai?: boolean; auto?: boolean; model?: string; generateOnly?: boolean }) => {
  await run(options);
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
