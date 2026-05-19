import { existsSync, unlinkSync, readFileSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";

const HOOK_MARKER = "# Installed by gitbun";

export async function uninstallHook(): Promise<void> {
  const hookPath = join(process.cwd(), ".git", "hooks", "prepare-commit-msg");

  if (!existsSync(hookPath)) {
    console.log(chalk.yellow("No prepare-commit-msg hook found."));
    return;
  }

  const content = readFileSync(hookPath, "utf8");

  if (!content.includes(HOOK_MARKER)) {
    console.log(
      chalk.red(
        "This hook was not installed by gitbun. Remove it manually to avoid data loss."
      )
    );
    process.exit(1);
  }

  unlinkSync(hookPath);
  console.log(chalk.green("✓ Gitbun hook removed successfully."));
}
