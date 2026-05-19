import { existsSync, writeFileSync, chmodSync, readFileSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";

const HOOK_MARKER = "# Installed by gitbun";

const HOOK_SCRIPT = `#!/bin/sh
${HOOK_MARKER} — remove with: gitbun hooks uninstall
COMMIT_MSG_FILE="$1"
COMMIT_SOURCE="$2"

# Skip for special commits (amend, merge, squash, template)
if [ -n "$COMMIT_SOURCE" ]; then
  exit 0
fi

# Generate commit message and pre-fill the editor
gitbun --generate-only > "$COMMIT_MSG_FILE"
`;

export async function installHook(force = false): Promise<void> {
  const hooksDir = join(process.cwd(), ".git", "hooks");

  if (!existsSync(hooksDir)) {
    console.log(
      chalk.red("No .git/hooks directory found. Are you inside a git repository?")
    );
    process.exit(1);
  }

  const hookPath = join(hooksDir, "prepare-commit-msg");

  if (existsSync(hookPath) && !force) {
    const existing = readFileSync(hookPath, "utf8");
    if (!existing.includes(HOOK_MARKER)) {
      console.log(
        chalk.yellow(
          "A prepare-commit-msg hook already exists and was not installed by gitbun."
        )
      );
      console.log(chalk.dim("Use --force to overwrite it."));
      process.exit(1);
    }
  }

  writeFileSync(hookPath, HOOK_SCRIPT, { encoding: "utf8" });

  try {
    chmodSync(hookPath, "755");
  } catch {
    // On Windows, git manages hook permissions — chmod is a no-op
  }

  console.log(chalk.green("✓ Gitbun hook installed (prepare-commit-msg)"));
  console.log(
    chalk.dim(
      "Run `git commit` to use it. Gitbun will pre-fill the message editor."
    )
  );
  console.log(chalk.dim("To remove: gitbun hooks uninstall"));
}
