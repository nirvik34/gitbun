import { scanDiff } from "./diffScanner";


type FileInfo = {
  path: string;
  additions: number;
  deletions: number;
  status: "A" | "M" | "D";
};

export async function classifyCommitType(files: FileInfo[]): Promise<string> {
    // Docs-only override
    const allDocs = files.every(f =>
      f.path.endsWith(".md") ||
      f.path.toLowerCase().includes("readme") ||
      f.path.toLowerCase().includes("docs")
    );
    if (allDocs) return "docs";

    // Test-only override
    const allTests = files.every(f =>
      f.path.includes("test") ||
      f.path.endsWith(".test.js") ||
      f.path.endsWith(".spec.js")
    );
    if (allTests) return "test";

    // Mixed docs + tests override
    const onlyDocsAndTests = files.every(f =>
      isDocs(f.path) || isTest(f.path)
    );
    if (onlyDocsAndTests) {
      if (files.some(f => isTest(f.path))) return "test";
      return "docs";
    }
  const score: Record<string, number> = {
    feat: 0,
    fix: 0,
    refactor: 0,
    docs: 0,
    test: 0,
    chore: 0,
    build: 0,
    ci: 0,
    style: 0,
    perf: 0,
  };

  const deletedFiles = files.filter(f => f.status === "D").length;
  const addedFiles = files.filter(f => f.status === "A").length;

  if (deletedFiles > 0 && addedFiles === 0) {
    score.refactor += 3;
  }

  if (addedFiles > 0 && deletedFiles === 0) {
    score.feat += 2;
  }

  let totalAdd = 0;
  let totalDel = 0;
  let fileCount = files.length;

  const isDocs = (path: string) =>
    path.endsWith(".md") ||
    path.endsWith(".rst") ||
    path.endsWith(".adoc") ||
    path.toLowerCase().includes("readme") ||
    path.toLowerCase().includes("docs");

  const isTest = (path: string) =>
    path.includes("test") ||
    path.includes("__tests__") ||
    path.endsWith("_test.go") ||
    path.endsWith("Test.java") ||
    path.startsWith("test_") ||
    path.endsWith(".spec.ts") ||
    path.endsWith(".test.ts");

  const isCI = (path: string) =>
    path.includes(".github/workflows") ||
    path.includes(".gitlab-ci") ||
    path.includes("azure-pipelines");

  const isBuild = (path: string) =>
    path.includes("package.json") ||
    path.includes("tsconfig") ||
    path.includes("vite.config") ||
    path.includes("webpack") ||
    path.includes("requirements.txt") ||
    path.includes("pyproject.toml") ||
    path.includes("pom.xml") ||
    path.includes("build.gradle") ||
    path.includes("go.mod") ||
    path.includes("Cargo.toml");

  const isConfig = (path: string) =>
    path.includes(".env") ||
    path.includes(".eslintrc") ||
    path.includes(".prettierrc") ||
    path.endsWith(".yml") ||
    path.endsWith(".yaml") ||
    path.includes("Dockerfile") ||
    path.includes("Makefile");

  for (const file of files) {
    totalAdd += file.additions;
    totalDel += file.deletions;

    if (isDocs(file.path)) score.docs += 3;
    if (isTest(file.path)) score.test += 3;
    if (isCI(file.path)) score.ci += 3;
    if (isBuild(file.path)) score.build += 2;
    if (isConfig(file.path)) score.chore += 2;
  }

  // Diff signals scoring
  const diffSignals = await scanDiff();
  if (diffSignals.hasNewFunction) score.feat += 2;
  if (diffSignals.hasRemovedCode) score.refactor += 2;
  if (diffSignals.hasBugFix) score.fix += 3;
  if (diffSignals.hasRefactor) score.refactor += 2;
  if (diffSignals.hasOptimization) score.perf = (score.perf || 0) + 3;

  const diffBalance = Math.abs(totalAdd - totalDel);

  if (totalAdd > totalDel && totalAdd > 5) score.feat += 2;

  if (diffBalance < 10 && totalAdd > 5 && totalDel > 5) {
    score.refactor += 3;
  }

  if (totalDel > totalAdd) score.fix += 2;

  if (fileCount > 6) score.chore += 1;

  // Remove default fix bias

  const sorted = Object.entries(score)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  return sorted.length ? sorted[0][0] : "chore";
}
