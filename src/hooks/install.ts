import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, chmodSync, readFileSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";

const HOOK_MARKER = "# Installed by gitbun";

// ASCII dashes only -- no Unicode em dashes that can break shell scripts
const HOOK_SCRIPT = `#!/bin/sh
${HOOK_MARKER} -- remove with: gitbun hooks uninstall
COMMIT_MSG_FILE="$1"
COMMIT_SOURCE="$2"

# Skip for special commits (amend, merge, squash, template)
if [ -n "$COMMIT_SOURCE" ]; then
  exit 0
fi

# Generate commit message -- only write on success to avoid corrupting the commit file
GENERATED=$(gitbun --generate-only 2>/dev/null)
if [ $? -eq 0 ] && [ -n "$GENERATED" ]; then
  printf '%s\\n' "$GENERATED" > "$COMMIT_MSG_FILE"
fi
`;

function getHooksDir(): string {
  try {
    const gitDir = execFileSync("git", ["rev-parse", "--git-dir"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return join(gitDir, "hooks");
  } catch {
    return join(process.cwd(), ".git", "hooks");
  }
}

export async function installHook(force = false): Promise<void> {
  const hooksDir = getHooksDir();

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
    // On Windows, git manages hook permissions -- chmod is a no-op
  }

  console.log(chalk.green("✓ Gitbun hook installed (prepare-commit-msg)"));
  console.log(
    chalk.dim(
      "Run `git commit` to use it. Gitbun will pre-fill the message editor."
    )
  );
  console.log(chalk.dim("To remove: gitbun hooks uninstall"));
}
