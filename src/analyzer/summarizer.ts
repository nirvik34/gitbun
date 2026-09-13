import type { FileChange } from "./fileFilter";
import type { DeduplicatedResult } from "./fileDeduplicator";
import type { DiffSignals } from "./diffScanner";

export interface FileInfo {
  path: string;
  additions: number;
  deletions: number;
  status: "A" | "M" | "D";
}

export function generateSummaryFromResult(result: DeduplicatedResult): string {
  const groupSummaries = result.groups.map((group) => {
    const { representative } = group;
    return `${group.label} (${group.count} files, +${representative.additions} -${representative.deletions})`;
  });
  const singleSummaries = result.singles.map((file) => {
    return `${file.path} (+${file.additions} -${file.deletions})`;
  });
  return [...groupSummaries, ...singleSummaries].join("\n");
}

export function generateDetailedDescription(
  signals: DiffSignals,
  files: FileChange[],
): string {
  const parts: string[] = [];

  if (signals.newFiles.length > 0) {
    const names = signals.newFiles
      .map((f) => f.split("/").pop()?.replace(/\.[^/.]+$/, "") || f)
      .filter(Boolean);
    if (names.length === 1) {
      parts.push(`new ${names[0]} module`);
    } else {
      parts.push(`new ${names.join(", ")} modules`);
    }
  }

  if (signals.deletedFiles.length > 0) {
    const names = signals.deletedFiles
      .map((f) => f.split("/").pop()?.replace(/\.[^/.]+$/, "") || f)
      .filter(Boolean);
    if (names.length === 1) {
      parts.push(`remove ${names[0]}`);
    } else {
      parts.push(`remove ${names.join(", ")}`);
    }
  }

  if (signals.renamedFiles.length > 0) {
    const names = signals.renamedFiles.map(
      (r) => `${r.oldPath.split("/").pop()} to ${r.newPath.split("/").pop()}`,
    );
    parts.push(`rename ${names.join(", ")}`);
  }

  if (signals.newImports.length > 0) {
    const libs = signals.newImports.slice(0, 3);
    parts.push(`integrate ${libs.join(", ")}`);
  }

  if (signals.removedImports.length > 0) {
    const libs = signals.removedImports.slice(0, 3);
    parts.push(`remove ${libs.join(", ")} dependency`);
  }

  if (signals.newClasses.length > 0) {
    const names = signals.newClasses.map((c) => c.name);
    parts.push(`add ${names.join(", ")}`);
  }

  if (signals.removedClasses.length > 0) {
    const names = signals.removedClasses.map((c) => c.name);
    parts.push(`remove ${names.join(", ")}`);
  }

  if (signals.newFunctions.length > 0) {
    const names = signals.newFunctions.map((f) => f.name);
    if (names.length === 1) {
      parts.push(`add ${names[0]} function`);
    } else {
      parts.push(`add ${names.slice(0, 3).join(", ")} functions`);
    }
  }

  if (signals.removedFunctions.length > 0) {
    const names = signals.removedFunctions.map((f) => f.name);
    parts.push(`remove ${names.slice(0, 3).join(", ")}`);
  }

  if (signals.functionSignatureChanges.length > 0) {
    const changes = signals.functionSignatureChanges.slice(0, 3);
    const changeDesc = changes
      .map((c) => `${c.name} (${c.change})`)
      .join("; ");
    parts.push(`update ${changeDesc}`);
  }

  if (signals.addedLines > 50 && parts.length === 0) {
    parts.push(`add ${signals.addedLines} lines of code`);
  }
  if (signals.deletedLines > 50 && parts.length === 0) {
    parts.push(`remove ${signals.deletedLines} lines of code`);
  }

  if (parts.length === 0) {
    const nouns = files
      .map((f) => f.path.split("/").pop()?.replace(/\.[^/.]+$/, "") || f.path)
      .filter((v, i, a) => a.indexOf(v) === i);
    if (nouns.length === 1) {
      return `update ${nouns[0]}`;
    }
    if (nouns.length <= 3) {
      return `update ${nouns.join(", ")}`;
    }
    return `update ${files.length} files`;
  }

  return parts.join("; ");
}
