import { describe, expect, it } from "vitest";

import { isSensitiveFile, filterSensitiveFiles } from "./sensitiveFileFilter";

describe("sensitiveFileFilter", () => {
  describe("isSensitiveFile", () => {
    it("detects .env files", () => {
      expect(isSensitiveFile(".env")).toBe(true);
      expect(isSensitiveFile(".env.local")).toBe(true);
      expect(isSensitiveFile(".env.production")).toBe(true);
      expect(isSensitiveFile("config/.env")).toBe(true);
      expect(isSensitiveFile("src/index.ts")).toBe(false);
    });

    it("detects credential and key files", () => {
      expect(isSensitiveFile("credentials.json")).toBe(true);
      expect(isSensitiveFile("service-account.json")).toBe(true);
      expect(isSensitiveFile("id_rsa")).toBe(true);
      expect(isSensitiveFile("id_ed25519.pub")).toBe(true);
      expect(isSensitiveFile("server.pem")).toBe(true);
      expect(isSensitiveFile("cert.key")).toBe(true);
      expect(isSensitiveFile("src/server.ts")).toBe(false);
    });

    it("detects terraform state files", () => {
      expect(isSensitiveFile("terraform.tfstate")).toBe(true);
      expect(isSensitiveFile("terraform.tfstate.backup")).toBe(true);
      expect(isSensitiveFile("infra/main.tf")).toBe(false);
    });

    it("detects database and secrets config", () => {
      expect(isSensitiveFile("database.yml")).toBe(true);
      expect(isSensitiveFile("secrets.json")).toBe(true);
      expect(isSensitiveFile("config/database.yml")).toBe(true);
    });

    it("detects npm and docker config", () => {
      expect(isSensitiveFile(".npmrc")).toBe(true);
      expect(isSensitiveFile(".dockerconfigjson")).toBe(true);
    });

    it("detects git internal files", () => {
      expect(isSensitiveFile(".git/config")).toBe(true);
      expect(isSensitiveFile(".git/credentials")).toBe(true);
    });
  });

  describe("filterSensitiveFiles", () => {
    const mockFiles = [
      { path: "src/index.ts", additions: 5, deletions: 2, status: "M" },
      { path: ".env", additions: 3, deletions: 0, status: "A" },
      { path: "src/utils.ts", additions: 10, deletions: 1, status: "M" },
      { path: "credentials.json", additions: 15, deletions: 0, status: "A" },
      { path: "server.key", additions: 1, deletions: 0, status: "A" },
      { path: "src/app.ts", additions: 8, deletions: 3, status: "M" },
    ];

    it("removes sensitive files by path", () => {
      const result = filterSensitiveFiles(mockFiles);
      expect(result).toEqual([
        { path: "src/index.ts", additions: 5, deletions: 2, status: "M" },
        { path: "src/utils.ts", additions: 10, deletions: 1, status: "M" },
        { path: "src/app.ts", additions: 8, deletions: 3, status: "M" },
      ]);
    });

    it("removes files with sensitive content in diff", () => {
      const filesWithSecrets = [
        { path: "config.ts", additions: 2, deletions: 0, status: "M" },
        { path: "src/auth.ts", additions: 3, deletions: 1, status: "M" },
      ];

      const fakeDiff = (path: string): string => {
        if (path === "config.ts") {
          return "+ const apiKey = 'sk-abc123def456ghi789jkl012mno345';";
        }
        return "+ function handleAuth() { return true; }";
      };

      const result = filterSensitiveFiles(filesWithSecrets, fakeDiff);
      expect(result).toEqual([
        { path: "src/auth.ts", additions: 3, deletions: 1, status: "M" },
      ]);
    });

    it("detects AWS access key patterns", () => {
      const files = [
        { path: "deploy.ts", additions: 1, deletions: 0, status: "M" },
      ];

      const fakeDiff = () => '+ const awsKey = "AKIAIOSFODNN7EXAMPLE";';
      const result = filterSensitiveFiles(files, fakeDiff);
      expect(result).toEqual([]);
    });

    it("detects private key headers", () => {
      const files = [
        { path: "crypto.ts", additions: 1, deletions: 0, status: "M" },
      ];

      const fakeDiff = () => "+ -----BEGIN RSA PRIVATE KEY-----";
      const result = filterSensitiveFiles(files, fakeDiff);
      expect(result).toEqual([]);
    });

    it("detects GitHub token patterns", () => {
      const files = [
        { path: "ci.ts", additions: 1, deletions: 0, status: "M" },
      ];

      const fakeDiff = () => '+ const token = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij";';
      const result = filterSensitiveFiles(files, fakeDiff);
      expect(result).toEqual([]);
    });

    it("keeps all files when no sensitive content detected", () => {
      const files = [
        { path: "src/index.ts", additions: 5, deletions: 2, status: "M" },
        { path: "src/utils.ts", additions: 3, deletions: 1, status: "M" },
      ];

      const fakeDiff = () => "+ console.log('hello');";
      const result = filterSensitiveFiles(files, fakeDiff);
      expect(result).toHaveLength(2);
    });

    it("works without diff provider (path-only filtering)", () => {
      const files = [
        { path: ".env.local", additions: 1, deletions: 0, status: "A" },
        { path: "src/main.ts", additions: 5, deletions: 0, status: "A" },
      ];

      const result = filterSensitiveFiles(files);
      expect(result).toEqual([
        { path: "src/main.ts", additions: 5, deletions: 0, status: "A" },
      ]);
    });
  });
});
