import * as childProcess from "node:child_process";

export type FileChange = {
  path: string;
  additions: number;
  deletions: number;
  status: "A" | "M" | "D";
};

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").toLowerCase();
}

export function isGeneratedFile(path: string): boolean {
  const normalized = normalizePath(path);

  return (
    normalized.endsWith(".min.js") ||
    normalized.endsWith(".min.css") ||
    normalized === "package-lock.json" ||
    normalized === "yarn.lock" ||
    normalized === "pnpm-lock.yaml" ||
    normalized.endsWith(".pb.go") ||
    /(^|\/)(dist|build|\.next|out)\//.test(normalized) ||
    /(^|\/)generated\//.test(normalized) ||
    /\.generated\./.test(normalized) ||
    /_gen\./.test(normalized)
  );
}

export function isSnapshotFile(path: string): boolean {
  const normalized = normalizePath(path);

  return (
    /(^|\/)__snapshots__\//.test(normalized) ||
    normalized.endsWith(".snap") ||
    /\.fixture\./.test(normalized) ||
    /(^|\/)testdata\//.test(normalized)
  );
}

function collectChangedLines(diffText: string, prefix: "+" | "-"): string[] {
  return diffText
    .split("\n")
    .filter(line => line.startsWith(prefix) && !line.startsWith(prefix + prefix + prefix))
    .map(line => line.slice(1));
}

function normalizeDiffContent(lines: string[]): string {
  return lines.map(line => line.replace(/\s+/g, "")).join("");
}

export function isFormattingOnlyDiff(diffText: string): boolean {
  const removedLines = collectChangedLines(diffText, "-");
  const addedLines = collectChangedLines(diffText, "+");

  if (removedLines.length === 0 && addedLines.length === 0) {
    // Empty diffs, such as mode-only changes, are not formatting-only.
    // Keeping them avoids filtering files when there is no textual diff to compare.
    return false;
  }

  return normalizeDiffContent(removedLines) === normalizeDiffContent(addedLines);
}

function getStagedDiffForFile(path: string): string {
  try {
    return childProcess.execSync(`git diff --cached -U0 -- "${path}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

export function filterLowSignalFiles(
  files: FileChange[],
  getDiff: (path: string) => string = getStagedDiffForFile
): FileChange[] {
  return files.filter(file => {
    if (isGeneratedFile(file.path) || isSnapshotFile(file.path)) {
      return false;
    }

    if (file.additions + file.deletions === 0) {
      // A zero-stat file has no meaningful textual diff to inspect, so skip the
      // formatting-only check and keep it unless another low-signal rule matched.
      return true;
    }

    const diffText = getDiff(file.path);
    if (!diffText) {
      return true;
    }

    return !isFormattingOnlyDiff(diffText);
  });
}
