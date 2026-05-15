import { describe, expect, it } from "vitest";

import type { FileChange } from "./fileFilter";
import { deduplicateFiles } from "./fileDeduplicator";

describe("fileDeduplicator", () => {
  it("collapses tsx files in the same directory into one group", () => {
    const files: FileChange[] = [
      { path: "src/components/Button.tsx", additions: 3, deletions: 1, status: "M" },
      { path: "src/components/Card.tsx", additions: 4, deletions: 2, status: "M" },
      { path: "src/components/Modal.tsx", additions: 2, deletions: 1, status: "M" },
    ];

    const result = deduplicateFiles(files, 2);

    expect(result.groups).toEqual([
      {
        representative: files[1],
        count: 3,
        label: "src/components/*.tsx",
      },
    ]);
    expect(result.singles).toEqual([]);
  });

  it("collapses mixed extensions in the same directory into a wildcard group", () => {
    const files: FileChange[] = [
      { path: "src/components/Button.tsx", additions: 3, deletions: 1, status: "M" },
      { path: "src/components/styles.css", additions: 4, deletions: 1, status: "M" },
      { path: "src/components/index.ts", additions: 2, deletions: 2, status: "M" },
      { path: "src/components/schema.json", additions: 1, deletions: 1, status: "M" },
    ];

    // Each file has a unique extension, so no same-extension group forms here.
    // This exercises only the 4-file mixed-extension fallback path.
    const result = deduplicateFiles(files, 2);

    expect(result.groups).toEqual([
      {
        representative: files[1],
        count: 4,
        label: "src/components/*",
      },
    ]);
    expect(result.singles).toEqual([]);
  });

  it("keeps a lone file as a single", () => {
    const files: FileChange[] = [
      { path: "src/utils/format.ts", additions: 5, deletions: 0, status: "M" },
    ];

    const result = deduplicateFiles(files, 2);

    expect(result.groups).toEqual([]);
    expect(result.singles).toEqual(files);
  });

  it("chooses the file with the highest change count as representative", () => {
    const files: FileChange[] = [
      { path: "src/components/Button.tsx", additions: 1, deletions: 1, status: "M" },
      { path: "src/components/Card.tsx", additions: 10, deletions: 3, status: "M" },
      { path: "src/components/Modal.tsx", additions: 2, deletions: 0, status: "M" },
    ];

    const result = deduplicateFiles(files, 2);

    expect(result.groups[0]?.representative).toEqual(files[1]);
  });

  it("disables grouping when maxPerGroup is 1", () => {
    const files: FileChange[] = [
      { path: "src/components/Button.tsx", additions: 3, deletions: 1, status: "M" },
      { path: "src/components/Card.tsx", additions: 4, deletions: 2, status: "M" },
      { path: "src/components/Modal.tsx", additions: 2, deletions: 1, status: "M" },
    ];

    const result = deduplicateFiles(files, 1);

    expect(result.groups).toEqual([]);
    expect(result.singles).toEqual(files);
  });

  it("keeps odd files out as singles when only one extension bucket groups", () => {
    const files: FileChange[] = [
      { path: "src/components/Button.tsx", additions: 3, deletions: 1, status: "M" },
      { path: "src/components/Card.tsx", additions: 4, deletions: 2, status: "M" },
      { path: "src/components/index.ts", additions: 2, deletions: 1, status: "M" },
    ];

    const result = deduplicateFiles(files, 2);

    expect(result.groups).toEqual([
      {
        representative: files[1],
        count: 2,
        label: "src/components/*.tsx",
      },
    ]);
    expect(result.singles).toEqual([files[2]]);
  });

  it("uses root-relative labels for root-level grouped files", () => {
    const files: FileChange[] = [
      { path: "index.ts", additions: 3, deletions: 1, status: "M" },
      { path: "main.ts", additions: 4, deletions: 2, status: "M" },
    ];

    const result = deduplicateFiles(files, 2);

    expect(result.groups).toEqual([
      {
        representative: files[1],
        count: 2,
        label: "*.ts",
      },
    ]);
    expect(result.singles).toEqual([]);
  });

  it("handles a mix of grouped and ungrouped files", () => {
    const files: FileChange[] = [
      { path: "src/components/Button.tsx", additions: 2, deletions: 1, status: "M" },
      { path: "src/components/Card.tsx", additions: 7, deletions: 1, status: "M" },
      { path: "src/docs/guide.md", additions: 3, deletions: 0, status: "M" },
      { path: "src/pages/index.ts", additions: 1, deletions: 1, status: "M" },
    ];

    const result = deduplicateFiles(files, 2);

    expect(result.groups).toEqual([
      {
        representative: files[1],
        count: 2,
        label: "src/components/*.tsx",
      },
    ]);
    expect(result.singles).toEqual([files[2], files[3]]);
  });
});
