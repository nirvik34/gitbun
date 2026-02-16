import simpleGit from "simple-git";

const git = simpleGit();

export type FileStatus = "A" | "M" | "D";

export async function getStagedFiles(): Promise<{ path: string; status: FileStatus }[]> {
  const output = await git.diff(["--cached", "--name-status"]);

  const lines = output
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  return lines.map(line => {
    const parts = line.split(/\s+/);
    let status = parts[0];
    if (status === "R") {
      return {
        path: parts[2],
        status: "M" as FileStatus
      };
    }
    
    if (status !== "A" && status !== "M" && status !== "D") {
      status = "M";
    }
    return {
      path: parts[1],
      status: status as FileStatus
    };
  });
}
