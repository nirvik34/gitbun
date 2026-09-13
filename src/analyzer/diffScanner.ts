import simpleGit from "simple-git";

const git = simpleGit();

export type DiffSignalDetail = {
  name: string;
  file: string;
};

export type DiffSignals = {
  hasNewFunction: boolean;
  hasRemovedCode: boolean;
  hasBugFix: boolean;
  hasRefactor: boolean;
  hasOptimization: boolean;
  newFunctions: DiffSignalDetail[];
  removedFunctions: DiffSignalDetail[];
  renamedFunctions: { oldName: string; newName: string; file: string }[];
  newClasses: DiffSignalDetail[];
  removedClasses: DiffSignalDetail[];
  newImports: string[];
  removedImports: string[];
  newFiles: string[];
  deletedFiles: string[];
  renamedFiles: { oldPath: string; newPath: string }[];
  functionSignatureChanges: { name: string; file: string; change: string }[];
  addedLines: number;
  deletedLines: number;
};

function extractFunctionNames(line: string, prefix: string): string | null {
  const patterns = [
    new RegExp(`${prefix}function\\s+(\\w+)`),
    new RegExp(`${prefix}def\\s+(\\w+)`),
    new RegExp(`${prefix}(public|private|protected|static|async)\\s+(\\w+)\\s*\\(`),
    new RegExp(`${prefix}export\\s+(default\\s+)?function\\s+(\\w+)`),
    new RegExp(`${prefix}export\\s+(\\w+)\\s*\\(`),
  ];
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) return match[match.length - 1];
  }
  return null;
}

function extractClassName(line: string, prefix: string): string | null {
  const match = line.match(new RegExp(`${prefix}class\\s+(\\w+)`));
  return match ? match[1] : null;
}

function extractImport(line: string): string | null {
  const match = line.match(/^(?:import\s+.*?from\s+|import\s+)['"](\S+)['"]/);
  if (match) return match[1];
  const requireMatch = line.match(/require\(['"](\S+)['"]\)/);
  return requireMatch ? requireMatch[1] : null;
}

export async function scanDiff(): Promise<DiffSignals> {
  const diff = await git.diff(["--cached", "-U0"]);
  const lower = diff.toLowerCase();

  const newFunctions: DiffSignalDetail[] = [];
  const removedFunctions: DiffSignalDetail[] = [];
  const renamedFunctions: { oldName: string; newName: string; file: string }[] = [];
  const newClasses: DiffSignalDetail[] = [];
  const removedClasses: DiffSignalDetail[] = [];
  const newImports: string[] = [];
  const removedImports: string[] = [];
  const newFiles: string[] = [];
  const deletedFiles: string[] = [];
  const renamedFiles: { oldPath: string; newPath: string }[] = [];
  const functionSignatureChanges: { name: string; file: string; change: string }[] = [];
  let addedLines = 0;
  let deletedLines = 0;

  const lines = diff.split("\n");
  let currentFile = "";
  let newFunctionNames: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("diff --git ")) {
      const match = line.match(/diff --git a\/(.+?) b\/(.+)/);
      if (match) {
        const oldPath = match[1];
        const newPath = match[2];
        currentFile = newPath;
        if (oldPath !== newPath && oldPath !== "/dev/null") {
          renamedFiles.push({ oldPath, newPath });
        }
      }
      newFunctionNames = [];
      continue;
    }

    if (line.startsWith("new file") || line.startsWith("deleted file") || line.startsWith("rename")) {
      continue;
    }

    if (line.startsWith("@@") || line.startsWith("---") || line.startsWith("+++")) {
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      addedLines++;
      const fnName = extractFunctionNames(line, "+");
      if (fnName) newFunctionNames.push(fnName);
      const className = extractClassName(line, "+");
      if (className) newClasses.push({ name: className, file: currentFile });
      const imp = extractImport(line);
      if (imp) newImports.push(imp);
    }

    if (line.startsWith("-") && !line.startsWith("---")) {
      deletedLines++;
      const fnName = extractFunctionNames(line, "-");
      if (fnName) removedFunctions.push({ name: fnName, file: currentFile });
      const className = extractClassName(line, "-");
      if (className) removedClasses.push({ name: className, file: currentFile });
      const imp = extractImport(line);
      if (imp) removedImports.push(imp);
    }
  }

  for (const fn of newFunctionNames) {
    if (!removedFunctions.some((r) => r.name === fn)) {
      newFunctions.push({ name: fn, file: currentFile });
    }
  }

  for (const fn of removedFunctions) {
    if (!newFunctionNames.includes(fn.name)) {
      const match = newFunctionNames.find(
        (n) => n.toLowerCase() === fn.name.toLowerCase()
      );
      if (match) {
        renamedFunctions.push({
          oldName: fn.name,
          newName: match,
          file: currentFile,
        });
      }
    }
  }

  for (const rf of renamedFunctions) {
    functionSignatureChanges.push({
      name: rf.newName,
      file: rf.file,
      change: `renamed from ${rf.oldName}`,
    });
  }

  const hasBugFix =
    lower.includes("fix") ||
    lower.includes("bug") ||
    lower.includes("null") ||
    lower.includes("undefined") ||
    lower.includes("error");

  const hasOptimization =
    lower.includes("optimize") ||
    lower.includes("memo") ||
    lower.includes("cache") ||
    lower.includes("performance");

  const hasRefactor =
    lower.includes("rename") ||
    lower.includes("restructure") ||
    lower.includes("cleanup");

  return {
    hasNewFunction: newFunctions.length > 0,
    hasRemovedCode: removedFunctions.length > 0,
    hasBugFix,
    hasRefactor,
    hasOptimization,
    newFunctions,
    removedFunctions,
    renamedFunctions,
    newClasses,
    removedClasses,
    newImports,
    removedImports,
    newFiles,
    deletedFiles,
    renamedFiles,
    functionSignatureChanges,
    addedLines,
    deletedLines,
  };
}
