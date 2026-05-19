const SENSITIVE_PATTERNS = [
  // Environment & credential files
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test",
  ".env.staging",
  ".env.example",
  ".env.backup",
  ".env.bak",
  ".env.save",
  ".env.dist",
  // AWS & cloud credentials
  "credentials.json",
  "aws-credentials",
  "aws_secrets",
  "service-account.json",
  "service_account.json",
  "gcp-credentials.json",
  "azure-credentials.json",
  // SSH & TLS
  "id_rsa",
  "id_rsa.pub",
  "id_ed25519",
  "id_ed25519.pub",
  "id_dsa",
  "id_dsa.pub",
  "id_ecdsa",
  "id_ecdsa.pub",
  "authorized_keys",
  "known_hosts",
  "*.pem",
  "*.key",
  "*.p12",
  "*.pfx",
  "*.jks",
  "*.keystore",
  "*.crt",
  "*.cer",
  // Database dumps & secrets
  "*.sql",
  "database.yml",
  "database.json",
  "secrets.yml",
  "secrets.json",
  // Token & auth files
  ".npmrc",
  ".yarnrc",
  ".pypirc",
  ".dockerconfigjson",
  "kubeconfig",
  ".kube/config",
  "htpasswd",
  "shadow",
  // IDE & OS secrets
  ".DS_Store",
  "Thumbs.db",
  // Terraform state (may contain secrets)
  "*.tfstate",
  "*.tfstate.backup",
  // Other sensitive patterns
  ".DS_Store",
  "Thumbs.db",
  // Terraform state (may contain secrets)
  "*.tfstate",
  "*.tfstate.backup",
  // Git internal files
  ".git/credentials",
  ".git/config",
  "package-lock.json",
  "npm-debug.log",
  "yarn-debug.log",
  "yarn-error.log",
];

const SENSITIVE_CONTENT_PATTERNS = [
  // API keys and tokens
  /api[_-]?key\s*[=:]\s*["'][A-Za-z0-9]{16,}/i,
  /secret[_-]?key\s*[=:]\s*["'][A-Za-z0-9]{16,}/i,
  /access[_-]?token\s*[=:]\s*["'][A-Za-z0-9]{16,}/i,
  /private[_-]?key\s*[=:]\s*["'][A-Za-z0-9\-/+=]{16,}/i,
  /password\s*[=:]\s*["'][^"']{8,}/i,
  /bearer\s+[A-Za-z0-9\-_.+/=]{20,}/i,
  /ghp_[A-Za-z0-9]{36}/, // GitHub personal access token
  /gho_[A-Za-z0-9]{36}/, // GitHub OAuth access token
  /ghu_[A-Za-z0-9]{36}/, // GitHub user-to-server token
  /ghs_[A-Za-z0-9]{36}/, // GitHub server-to-user token
  /ghr_[A-Za-z0-9]{36}/, // GitHub refresh token
  /sk-[A-Za-z0-9]{20,}/, // OpenAI secret key
  /AKIA[0-9A-Z]{16}/, // AWS access key ID
  /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/,
  /-----BEGIN CERTIFICATE-----/,
];

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").toLowerCase();
}

function matchesSensitivePattern(path: string): boolean {
  const normalized = normalizePath(path);
  const basename = normalized.split("/").pop() || "";

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.startsWith("*.")) {
      const ext = pattern.slice(1);
      if (normalized.endsWith(ext)) return true;
    } else if (pattern.includes("/")) {
      if (normalized.includes(pattern.toLowerCase())) return true;
    } else if (basename === pattern.toLowerCase()) {
      return true;
    }
  }

  return false;
}

function containsSensitiveContent(content: string): boolean {
  for (const pattern of SENSITIVE_CONTENT_PATTERNS) {
    if (pattern.test(content)) return true;
  }
  return false;
}

export function isSensitiveFile(path: string): boolean {
  return matchesSensitivePattern(path);
}

export function filterSensitiveFiles(
  files: { path: string; additions: number; deletions: number; status: "A" | "M" | "D" }[],
  getDiff?: (path: string) => string
): { path: string; additions: number; deletions: number; status: "A" | "M" | "D" }[] {
  return files.filter(file => {
    if (isSensitiveFile(file.path)) {
      return false;
    }

    if (getDiff) {
      const diffText = getDiff(file.path);
      if (diffText && containsSensitiveContent(diffText)) {
        return false;
      }
    }

    return true;
  });
}
