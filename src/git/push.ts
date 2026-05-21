import simpleGit from "simple-git";

import { ValidationError } from "../utils/errors";

export interface PushResult {
  remote: string;
  branch: string;
  output: string;
}

export async function push(): Promise<PushResult> {
  const git = simpleGit();
  const branchSummary = await git.branch();
  const branch = branchSummary.current;

  if (!branch) {
    throw new ValidationError("Unable to determine the current branch.");
  }

  let upstream: string;
  try {
    upstream = (
      await git.raw([
        "rev-parse",
        "--abbrev-ref",
        "--symbolic-full-name",
        "@{u}",
      ])
    ).trim();
  } catch {
    throw new ValidationError(
      `Branch '${branch}' has no upstream. Set one with: git push -u <remote> ${branch}`
    );
  }

  const [remote] = upstream.split("/");

  const output = await git.raw(["push", remote, branch]);
  return { remote, branch, output };
}
