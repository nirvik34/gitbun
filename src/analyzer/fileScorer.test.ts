import { describe, expect, it } from "vitest";

import type { FileChange } from "./fileFilter";
import { scoreFile, sortBySignal } from "./fileScorer";

describe("fileScorer", () => {
  it("scores a new file higher than a modified config file", () => {
    const newFile: FileChange = {
      path: "src/feature.ts",
      additions: 10,
      deletions: 0,
      status: "A",
    };
    const configFile: FileChange = {
      path: "tsconfig.json",
      additions: 10,
      deletions: 0,
      status: "M",
    };

    expect(scoreFile(newFile, "")).toBeGreaterThan(scoreFile(configFile, ""));
  });

  it("scores a file with function keywords in diff higher than one without", () => {
    const file: FileChange = {
      path: "src/feature.ts",
      additions: 10,
      deletions: 2,
      status: "M",
    };

    expect(scoreFile(file, "+export function buildFeature() {}")).toBeGreaterThan(
      scoreFile(file, "const label = 'feature';")
    );
  });

  it("scores a test file lower than a feature file with the same diff", () => {
    const testFile: FileChange = {
      path: "src/__tests__/feature.test.ts",
      additions: 12,
      deletions: 3,
      status: "M",
    };
    const featureFile: FileChange = {
      path: "src/feature.ts",
      additions: 12,
      deletions: 3,
      status: "M",
    };
    const diffText = "function buildFeature() { return true; }";

    expect(scoreFile(testFile, diffText)).toBeLessThan(scoreFile(featureFile, diffText));
  });

  it("sorts files by descending signal score", () => {
    const files: FileChange[] = [
      { path: "README.md", additions: 10, deletions: 0, status: "M" },
      { path: "src/newFeature.ts", additions: 12, deletions: 0, status: "A" },
      { path: "src/config.ts", additions: 6, deletions: 0, status: "M" },
    ];

    const diffs: Record<string, string> = {
      "README.md": "update installation notes",
      "src/newFeature.ts": "export function createFeature() {}",
      "src/config.ts": "const value = 1;",
    };

    expect(sortBySignal(files, path => diffs[path])).toEqual([
      files[1],
      files[2],
      files[0],
    ]);
  });

  it("applies the large diff penalty for files over 200 changed lines", () => {
    const largeFile: FileChange = {
      path: "src/largeFeature.ts",
      additions: 201,
      deletions: 10,
      status: "M",
    };
    const mediumFile: FileChange = {
      path: "src/mediumFeature.ts",
      additions: 120,
      deletions: 10,
      status: "M",
    };

    // Files with more than 200 changed lines take a 1-point penalty compared
    // with an otherwise identical file whose total changes stay below that threshold.
    expect(scoreFile(largeFile, "")).toBeLessThan(scoreFile(mediumFile, ""));
  });
});
