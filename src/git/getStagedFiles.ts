import simpleGit from "simple-git";
import { filterSensitiveFiles } from "./sensitiveFiles";

const git = simpleGit();

export type FileStatus = "A" | "M" | "D";

export type StagedFile = {
  path: string;
  status: FileStatus;
};

export type StagedFilesResult = {
  files: StagedFile[];
  blockedFiles: string[];
};

export async function getStagedFiles(): Promise<StagedFilesResult> {
  const output = await git.diff(["--cached", "--name-status"]);

  const lines = output
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const parsed: StagedFile[] = lines.map(line => {
    const parts = line.split("\t");
    const statusCode = parts[0];

    if (statusCode.startsWith("R")) {
      return {
        path: parts[2],
        status: "M" as FileStatus,
      };
    }

    const status: FileStatus =
      statusCode === "A" || statusCode === "M" || statusCode === "D"
        ? statusCode
        : "M";

    return {
      path: parts[1],
      status,
    };
  });

  // Separate sensitive files from safe ones before they can reach the LLM.
  const allPaths = parsed.map(f => f.path);
  const { safe, blocked } = filterSensitiveFiles(allPaths);

  if (blocked.length > 0) {
    console.warn(
      `[gitbun] Auto-ignore: the following staged files were excluded from AI analysis ` +
        `because they may contain secrets:\n` +
        blocked.map(f => `  - ${f}`).join("\n")
    );
  }

  const safeSet = new Set(safe);
  const files = parsed.filter(f => safeSet.has(f.path));

  return { files, blockedFiles: blocked };
}