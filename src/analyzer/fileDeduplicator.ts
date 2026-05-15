import type { FileChange } from "./fileFilter";

export type FileGroup = {
  representative: FileChange;
  count: number;
  label: string;
};

export type DeduplicatedResult = {
  groups: FileGroup[];
  singles: FileChange[];
};

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function getDirectory(path: string): string {
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf("/");

  return lastSlash === -1 ? "" : normalized.slice(0, lastSlash);
}

function getGroupRepresentative(files: FileChange[]): FileChange {
  return files.reduce((best, current) => {
    const bestSize = best.additions + best.deletions;
    const currentSize = current.additions + current.deletions;

    return currentSize > bestSize ? current : best;
  });
}

function buildGroupLabel(directory: string, extension: string): string {
  if (!directory) {
    return extension ? `*${extension}` : "*";
  }

  return extension ? `${directory}/*${extension}` : `${directory}/*`;
}

export function getExtension(path: string): string {
  const normalized = normalizePath(path);
  const fileName = normalized.split("/").pop() || "";
  const lastDot = fileName.lastIndexOf(".");

  return lastDot <= 0 ? "" : fileName.slice(lastDot).toLowerCase();
}

export function groupByDirectory(files: FileChange[]): Map<string, FileChange[]> {
  const groups = new Map<string, FileChange[]>();

  for (const file of files) {
    const directory = getDirectory(file.path);
    const existing = groups.get(directory) || [];
    existing.push(file);
    groups.set(directory, existing);
  }

  return groups;
}

export function deduplicateFiles(
  files: FileChange[],
  maxPerGroup: number
): DeduplicatedResult {
  if (maxPerGroup <= 1) {
    return {
      groups: [],
      singles: [...files],
    };
  }

  const directoryGroups = groupByDirectory(files);
  const groups: FileGroup[] = [];
  const singles: FileChange[] = [];
  const groupedPaths = new Set<string>();

  for (const [directory, directoryFiles] of directoryGroups) {
    const byExtension = new Map<string, FileChange[]>();

    for (const file of directoryFiles) {
      const extension = getExtension(file.path);
      const existing = byExtension.get(extension) || [];
      existing.push(file);
      byExtension.set(extension, existing);
    }

    let groupedInDirectory = false;

    for (const [extension, extensionFiles] of byExtension) {
      if (extensionFiles.length >= maxPerGroup) {
        groups.push({
          representative: getGroupRepresentative(extensionFiles),
          count: extensionFiles.length,
          label: buildGroupLabel(directory, extension),
        });

        for (const file of extensionFiles) {
          groupedPaths.add(file.path);
        }

        groupedInDirectory = true;
      }
    }

    if (groupedInDirectory) {
      continue;
    }

    if (directoryFiles.length >= 4 && byExtension.size > 1) {
      groups.push({
        representative: getGroupRepresentative(directoryFiles),
        count: directoryFiles.length,
        label: buildGroupLabel(directory, ""),
      });

      for (const file of directoryFiles) {
        groupedPaths.add(file.path);
      }
    }
  }

  for (const file of files) {
    if (!groupedPaths.has(file.path)) {
      singles.push(file);
    }
  }

  return {
    groups,
    singles,
  };
}
