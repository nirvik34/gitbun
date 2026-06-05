import { describe, expect, it } from "vitest";
import {
  analyzeCommitQuality,
  shouldBlockCommitForQuality,
} from "./commitQuality";

describe("analyzeCommitQuality", () => {
  it("accepts basic Conventional Commit messages", () => {
    expect(analyzeCommitQuality("feat: add auth").warnings).not.toContain(
      "Invalid Conventional Commit format",
    );
    expect(analyzeCommitQuality("fix(core): resolve bug").score).toBe(100);
  });

  it("warns for invalid Conventional Commit messages", () => {
    expect(analyzeCommitQuality("update code").warnings).toContain(
      "Invalid Conventional Commit format",
    );
    expect(analyzeCommitQuality("fix stuff").warnings).toContain(
      "Invalid Conventional Commit format",
    );
  });

  it("detects generic commit messages case-insensitively", () => {
    expect(analyzeCommitQuality("WIP").warnings).toContain(
      "Generic commit message",
    );
  });

  it("applies simple score penalties", () => {
    expect(analyzeCommitQuality("fix stuff")).toEqual({
      score: 0,
      warnings: [
        "Invalid Conventional Commit format",
        "Generic commit message",
        "Subject too short",
      ],
    });
  });

  it("blocks only in strict mode when score is below 60", () => {
    const result = analyzeCommitQuality("changes");

    expect(shouldBlockCommitForQuality(result, true)).toBe(true);
    expect(shouldBlockCommitForQuality(result, false)).toBe(false);
  });
});
