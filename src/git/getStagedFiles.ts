import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import ignore from "ignore";
import { execSync } from "child_process";

const git = simpleGit();

export type FileStatus = "A" | "M" | "D";

/**
 * Helper function to safely fetch the root absolute path of the current Git repository.
 */
function getGitRepoRoot(): string {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
  } catch (error) {
    // Fallback to process.cwd() if not inside a valid git repo
    return process.cwd();
  }
}

export async function getStagedFiles(): Promise<
  { path: string; status: FileStatus }[]
> {
  const output = await git.diff(["--cached", "--name-status"]);

  const lines = output
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const files = lines.map((line) => {
    const parts = line.split(/\s+/);
    let status = parts[0];
    if (status === "R") {
      return {
        path: parts[2],
        status: "M" as FileStatus,
      };
    }

    if (status !== "A" && status !== "M" && status !== "D") {
      status = "M";
    }
    return {
      path: parts[1],
      status: status as FileStatus,
    };
  });

  // --- GITBUNIGNORE FILTERING LOGIC ---
  const ig = ignore();
  
  // FIXED: Now dynamically resolves the actual git repository root directory
  const repoRoot = getGitRepoRoot();
  const ignorePath = path.join(repoRoot, ".gitbunignore");

  // 1. Check if .gitbunignore exists at the root
  if (fs.existsSync(ignorePath)) {
    ig.add(fs.readFileSync(ignorePath).toString());
  } else {
    // 2. Default out-of-the-box exclusions to save tokens
    ig.add([
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "dist/",
      "build/",
      "node_modules/",
    ]);
  }

  // 3. Filter the staged files array before returning it
  return files.filter((file) => !ig.ignores(file.path));
}
