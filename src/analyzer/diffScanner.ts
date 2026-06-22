import simpleGit from "simple-git";
import { isSensitiveFile } from "../git/sensitiveFiles";

const git = simpleGit();

export type DiffSignals = {
  hasNewFunction: boolean;
  hasRemovedCode: boolean;
  hasBugFix: boolean;
  hasRefactor: boolean;
  hasOptimization: boolean;
};

// Splits a unified diff string into per-file hunks.
// Each entry maps the file path to its diff content.
function splitDiffByFile(rawDiff: string): Map<string, string> {
  const fileMap = new Map<string, string>();

  // A new file block starts with "diff --git a/<path> b/<path>"
  const fileDiffPattern = /^diff --git a\/.+ b\/(.+)$/m;
  const blocks = rawDiff.split(/(?=^diff --git )/m);

  for (const block of blocks) {
    if (!block.trim()) {
      continue;
    }

    const match = fileDiffPattern.exec(block);
    if (match) {
      fileMap.set(match[1], block);
    }
  }

  return fileMap;
}

// Returns a filtered diff string with all hunks belonging to sensitive files
// removed. Files that are stripped are reported via the second return value.
export function stripSensitiveDiff(rawDiff: string): {
  safeDiff: string;
  blockedFiles: string[];
} {
  const fileMap = splitDiffByFile(rawDiff);
  const safeParts: string[] = [];
  const blockedFiles: string[] = [];

  for (const [filePath, diffBlock] of fileMap.entries()) {
    if (isSensitiveFile(filePath)) {
      blockedFiles.push(filePath);
    } else {
      safeParts.push(diffBlock);
    }
  }

  if (blockedFiles.length > 0) {
    console.warn(
      `[gitbun] Auto-ignore: diff content from the following files was excluded ` +
        `from AI analysis because they may contain secrets:\n` +
        blockedFiles.map(f => `  - ${f}`).join("\n")
    );
  }

  return { safeDiff: safeParts.join(""), blockedFiles };
}

export async function scanDiff(): Promise<DiffSignals> {
  const rawDiff = await git.diff(["--cached", "-U0"]);

  // Strip any hunks that touch sensitive files before pattern matching.
  const { safeDiff } = stripSensitiveDiff(rawDiff);

  const lower = safeDiff.toLowerCase();

  return {
    hasNewFunction:
      lower.includes("function ") ||
      lower.includes("class ") ||
      lower.includes("def ") ||
      lower.includes("public ") ||
      lower.includes("export "),

    hasRemovedCode:
      lower.includes("-function ") ||
      lower.includes("-class ") ||
      lower.includes("-def "),

    hasBugFix:
      lower.includes("fix") ||
      lower.includes("bug") ||
      lower.includes("null") ||
      lower.includes("undefined") ||
      lower.includes("error"),

    hasRefactor:
      lower.includes("rename") ||
      lower.includes("restructure") ||
      lower.includes("cleanup"),

    hasOptimization:
      lower.includes("optimize") ||
      lower.includes("memo") ||
      lower.includes("cache") ||
      lower.includes("performance"),
  };
}