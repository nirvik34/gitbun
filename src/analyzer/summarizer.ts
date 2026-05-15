import type { DeduplicatedResult } from "./fileDeduplicator";
import type { FileChange } from "./fileFilter";

export function generateSummary(files: FileChange[]): string {
  const summaries = files.map(file => {
    return `${file.path} (+${file.additions} - ${file.deletions})`;
  });

  return summaries.join("\n");
}

export function generateSummaryFromResult(result: DeduplicatedResult): string {
  const groupSummaries = result.groups.map(group => {
    const { representative } = group;
    return `${group.label} (${group.count} files, +${representative.additions} - ${representative.deletions})`;
  });

  const singleSummaries = result.singles.map(file => {
    return `${file.path} (+${file.additions} - ${file.deletions})`;
  });

  return [...groupSummaries, ...singleSummaries].join("\n");
}
