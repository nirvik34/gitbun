import { describe, expect, it } from "vitest";

import {
  filterLowSignalFiles,
  isFormattingOnlyDiff,
  isGeneratedFile,
  isSnapshotFile,
  type FileChange,
} from "./fileFilter";

describe("fileFilter", () => {
  it("identifies generated file paths", () => {
    expect(isGeneratedFile("dist/assets/app.js")).toBe(true);
    expect(isGeneratedFile("dist\\app.min.js")).toBe(true);
    expect(isGeneratedFile("package-lock.json")).toBe(true);
    expect(isGeneratedFile("src/app.ts")).toBe(false);
  });

  it("identifies snapshot and fixture paths", () => {
    expect(isSnapshotFile("src/__snapshots__/button.test.ts.snap")).toBe(true);
    expect(isSnapshotFile("testdata/request.json")).toBe(true);
    expect(isSnapshotFile("src/components/button.tsx")).toBe(false);
  });

  it("classifies whitespace-only diffs as formatting-only", () => {
    const diffText = `diff --git a/src/example.ts b/src/example.ts
index 1111111..2222222 100644
--- a/src/example.ts
+++ b/src/example.ts
@@ -1 +1 @@
-const value = { foo: "bar" };
+const value={foo:"bar"};`;

    expect(isFormattingOnlyDiff(diffText)).toBe(true);
  });

  it("does not classify real code changes as formatting-only", () => {
    const diffText = `diff --git a/src/example.ts b/src/example.ts
index 1111111..2222222 100644
--- a/src/example.ts
+++ b/src/example.ts
@@ -1 +1 @@
-return total;
+return total + tax;`;

    expect(isFormattingOnlyDiff(diffText)).toBe(false);
  });

  it("removes low-signal files from a mixed file list", () => {
    const files: FileChange[] = [
      { path: "dist/app.min.js", additions: 20, deletions: 10, status: "M" },
      { path: "src/__snapshots__/button.test.ts.snap", additions: 2, deletions: 2, status: "M" },
      { path: "src/feature.ts", additions: 1, deletions: 1, status: "M" },
      { path: "src/logic.ts", additions: 3, deletions: 1, status: "M" },
    ];

    const fakeDiff = (path: string): string => {
      if (path === "src/feature.ts") {
        return [
          "diff --git a/src/feature.ts b/src/feature.ts",
          "--- a/src/feature.ts",
          "+++ b/src/feature.ts",
          "@@ -1 +1 @@",
          "-const x = 1;",
          "+const x=1;",
        ].join("\n");
      }
      if (path === "src/logic.ts") {
        return [
          "diff --git a/src/logic.ts b/src/logic.ts",
          "--- a/src/logic.ts",
          "+++ b/src/logic.ts",
          "@@ -1 +1 @@",
          "-return value;",
          "+return value + 1;",
        ].join("\n");
      }
      return "";
    };

    expect(filterLowSignalFiles(files, fakeDiff)).toEqual([
      { path: "src/logic.ts", additions: 3, deletions: 1, status: "M" },
    ]);
  });
});
