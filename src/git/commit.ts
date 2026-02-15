import simpleGit from "simple-git";

export async function commit(message: string) {
  const git = simpleGit();

  const output = await git.raw([
    "commit",
    "-m",
    message
  ]);

  return output;
}
