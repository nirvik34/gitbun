import simpleGit from "simple-git";

export async function getDiffStats(filePath: string) {
  const git = simpleGit();
  const diff = await git.diff(["--cached", "--numstat","--" ,filePath]);

  if (!diff.trim()) {
    return { additions: 0, deletions: 0 };
  }

  const parts = diff.trim().split("\t");

  return {
    additions: Number(parts[0]) || 0,
    deletions: Number(parts[1]) || 0
  };
}
