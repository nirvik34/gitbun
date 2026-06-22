import * as fs from "fs";
import * as path from "path";
import * as micromatch from "micromatch";

// Hardcoded patterns for files that commonly contain secrets or credentials.
// These are checked against the file's basename and full relative path.
const BUILT_IN_SENSITIVE_PATTERNS: string[] = [
  // dotenv variants
  ".env",
  ".env.*",
  "*.env",

  // credential / secret files
  "credentials.json",
  "credentials.yml",
  "credentials.yaml",
  "secrets.json",
  "secrets.yml",
  "secrets.yaml",
  "secret.json",
  "*.secret",

  // private keys and certificates
  "*.pem",
  "*.key",
  "*.p12",
  "*.pfx",
  "*.crt",
  "*.cer",
  "*.der",

  // SSH keys (no extension)
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  "id_rsa.pub",
  "id_ed25519.pub",

  // service account / auth tokens
  "service-account*.json",
  "serviceAccount*.json",
  "token.json",
  "auth.json",
  "gcloud-*.json",

  // CI / infra secrets
  ".npmrc",
  ".pypirc",
  ".netrc",
  "*.tfvars",
  "terraform.tfstate",
  "terraform.tfstate.backup",
  "kubeconfig",
  "*.kubeconfig",

  // password / vault files
  "*.vault",
  "vault*.json",
  "password*.txt",
  "passwd*.txt",
];

// Reads .gitbunignore from the repo root (cwd) and returns its non-empty,
// non-comment lines as additional glob patterns.
function loadGitbunIgnorePatterns(repoRoot: string): string[] {
  const ignoreFilePath = path.join(repoRoot, ".gitbunignore");

  if (!fs.existsSync(ignoreFilePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(ignoreFilePath, "utf-8");
    return content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith("#"));
  } catch {
    return [];
  }
}

// Returns the combined set of sensitive patterns: built-in defaults merged
// with any patterns found in .gitbunignore at the given repoRoot.
export function getSensitivePatterns(repoRoot: string = process.cwd()): string[] {
  const userPatterns = loadGitbunIgnorePatterns(repoRoot);
  return [...BUILT_IN_SENSITIVE_PATTERNS, ...userPatterns];
}

// Returns true if the given filePath matches any sensitive pattern.
// Matching is performed against both the full path and the basename so that
// patterns like ".env" catch "config/.env" as well as a root-level ".env".
export function isSensitiveFile(
  filePath: string,
  repoRoot: string = process.cwd()
): boolean {
  const patterns = getSensitivePatterns(repoRoot);
  const basename = path.basename(filePath);
  const normalizedPath = filePath.replace(/\\/g, "/");

  return (
    micromatch.isMatch(basename, patterns, { dot: true }) ||
    micromatch.isMatch(normalizedPath, patterns, { dot: true })
  );
}

// Filters an array of file paths, returning only those that are NOT sensitive.
// Also returns the list of files that were filtered out so callers can warn.
export function filterSensitiveFiles(
  files: string[],
  repoRoot: string = process.cwd()
): { safe: string[]; blocked: string[] } {
  const safe: string[] = [];
  const blocked: string[] = [];

  for (const file of files) {
    if (isSensitiveFile(file, repoRoot)) {
      blocked.push(file);
    } else {
      safe.push(file);
    }
  }

  return { safe, blocked };
}