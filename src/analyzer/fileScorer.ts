import type { FileChange } from "./fileFilter";

export type ScoreResult = {
  file: FileChange;
  score: number;
};

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").toLowerCase();
}

function isTestFile(path: string): boolean {
  const normalized = normalizePath(path);

  return /(^|\/)__tests__\/|\.test\.|\.spec\.|\/tests?\//.test(normalized);
}

function isDocsFile(path: string): boolean {
  const normalized = normalizePath(path);

  return (
    normalized.endsWith(".md") ||
    normalized.endsWith(".rst") ||
    normalized.includes("readme")
  );
}

function isBuildOrConfigFile(path: string): boolean {
  const normalized = normalizePath(path);

  return (
    normalized.includes("package.json") ||
    normalized.includes("tsconfig") ||
    normalized.includes("vite.config") ||
    normalized.includes("webpack") ||
    normalized.includes("requirements.txt") ||
    normalized.includes("pyproject.toml") ||
    normalized.includes("pom.xml") ||
    normalized.includes("build.gradle") ||
    normalized.includes("go.mod") ||
    normalized.includes("cargo.toml") ||
    normalized.includes(".env") ||
    normalized.includes(".eslintrc") ||
    normalized.includes(".prettierrc") ||
    normalized.endsWith(".yml") ||
    normalized.endsWith(".yaml") ||
    normalized.includes("dockerfile") ||
    normalized.includes("makefile")
  );
}

function countFunctionSignals(diffText: string): number {
  const count = diffText
    .split("\n")
    .filter(line => line.startsWith("+") && !line.startsWith("+++"))
    .reduce((total, line) => {
      let lineCount = 0;

      if (line.includes("function ")) {
        lineCount += 1;
      }

      if (line.includes("class ")) {
        lineCount += 1;
      }

      if (line.includes("def ")) {
        lineCount += 1;
      }

      if (line.includes("fn ")) {
        lineCount += 1;
      }

      return total + lineCount;
    }, 0);

  return Math.min(count * 3, 6);
}

export function scoreFile(file: FileChange, diffText: string): number {
  let score = 0;

  if (file.status === "A") {
    score += 3;
  } else if (file.status === "D") {
    score += 2;
  }

  score += countFunctionSignals(diffText);

  if (isTestFile(file.path)) {
    score -= 2;
  }

  if (isBuildOrConfigFile(file.path)) {
    score -= 2;
  }

  if (isDocsFile(file.path)) {
    score -= 1;
  }

  const changedLines = file.additions + file.deletions;

  if (changedLines > 200) {
    score -= 1;
  }

  if (changedLines < 5) {
    score -= 1;
  }

  return score;
}

export function scoreAll(
  files: FileChange[],
  getDiff: (path: string) => string
): ScoreResult[] {
  return files.map(file => ({
    file,
    score: scoreFile(file, getDiff(file.path)),
  }));
}

export function sortBySignal(
  files: FileChange[],
  getDiff: (path: string) => string
): FileChange[] {
  return scoreAll(files, getDiff)
    .map((result, index) => ({ ...result, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(result => result.file);
}
