export interface CommitQualityResult {
  score: number;
  warnings: string[];
}

const GENERIC_MESSAGES = [
  "update code",
  "fix stuff",
  "misc changes",
  "changes",
  "update files",
  "work in progress",
  "wip",
];

const CONVENTIONAL_COMMIT_PATTERN =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9._-]+\))?: .+/i;

function getSubject(message: string): string {
  const separatorIndex = message.indexOf(":");
  return separatorIndex >= 0
    ? message.slice(separatorIndex + 1).trim()
    : message.trim();
}

export function analyzeCommitQuality(message: string): CommitQualityResult {
  const normalizedMessage = message.trim().toLowerCase();
  const warnings: string[] = [];
  let score = 100;

  if (!CONVENTIONAL_COMMIT_PATTERN.test(message.trim())) {
    score -= 40;
    warnings.push("Invalid Conventional Commit format");
  }

  if (GENERIC_MESSAGES.includes(normalizedMessage)) {
    score -= 40;
    warnings.push("Generic commit message");
  }

  if (getSubject(message).length < 10) {
    score -= 20;
    warnings.push("Subject too short");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    warnings,
  };
}

export function shouldBlockCommitForQuality(
  result: CommitQualityResult,
  strictQuality = false,
): boolean {
  return strictQuality && result.score < 60;
}
