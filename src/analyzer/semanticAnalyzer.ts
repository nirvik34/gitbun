import { Project, FunctionDeclaration } from "ts-morph";
import { SemanticEvent, SemanticAnalysisResult } from "./semanticTypes";
import {
  getStagedFileContent,
  getWorkingFileContent,
} from "../git/getFileContent";

const TIMEOUT_MS = 500;

/**
 * Compute a key for a function that uniquely identifies its signature and body,
 * ignoring the function name.
 */
function getFunctionKey(fn: FunctionDeclaration): string {
  const paramTypes = fn
    .getParameters()
    .map((p) => p.getType().getText())
    .join("|");
  const returnType = fn.getReturnType().getText();
  const body = fn.getBody()?.getText() || "";
  // Normalize whitespace to reduce false negatives
  const normalizedBody = body.replace(/\s+/g, " ").trim();
  return `${paramTypes}|${returnType}|${normalizedBody}`;
}

/**
 * Detect function/method renames by comparing signature and body.
 */
function detectRenames(
  oldProject: Project,
  newProject: Project,
  filePath: string,
): SemanticEvent[] {
  const events: SemanticEvent[] = [];
  const oldSource = oldProject.getSourceFiles()[0];
  const newSource = newProject.getSourceFiles()[0];
  if (!oldSource || !newSource) return events;

  const oldFunctions = oldSource.getFunctions();
  const newFunctions = newSource.getFunctions();

  // Build a map for new functions: key -> function
  const newFunctionsByKey = new Map<string, FunctionDeclaration>();
  for (const fn of newFunctions) {
    const key = getFunctionKey(fn);
    newFunctionsByKey.set(key, fn);
  }

  for (const oldFn of oldFunctions) {
    const oldName = oldFn.getName();
    if (!oldName) continue;
    const key = getFunctionKey(oldFn);
    const matchingNewFn = newFunctionsByKey.get(key);
    if (matchingNewFn) {
      const newName = matchingNewFn.getName();
      if (newName && newName !== oldName) {
        events.push({
          type: "function_rename",
          file: filePath,
          entityName: oldName,
          details: { oldName, newName },
        });
      }
    }
  }
  return events;
}

/**
 * Detect signature changes (parameter count/types, return type).
 */
function detectSignatureChanges(
  oldProject: Project,
  newProject: Project,
  filePath: string,
): SemanticEvent[] {
  const events: SemanticEvent[] = [];
  const oldSource = oldProject.getSourceFiles()[0];
  const newSource = newProject.getSourceFiles()[0];
  if (!oldSource || !newSource) return events;

  const oldFunctions = oldSource.getFunctions();
  const newFunctions = newSource.getFunctions();

  for (const oldFn of oldFunctions) {
    const name = oldFn.getName();
    if (!name) continue;
    const newFn = newFunctions.find((fn) => fn.getName() === name);
    if (!newFn) continue;

    const oldParams = oldFn.getParameters().map((p) => p.getStructure());
    const newParams = newFn.getParameters().map((p) => p.getStructure());
    const oldReturn = oldFn.getReturnType().getText();
    const newReturn = newFn.getReturnType().getText();

    const changes: string[] = [];
    if (oldParams.length !== newParams.length) {
      changes.push(
        `parameter count changed from ${oldParams.length} to ${newParams.length}`,
      );
    } else {
      for (let i = 0; i < oldParams.length; i++) {
        if (
          oldParams[i].name !== newParams[i].name ||
          oldParams[i].type !== newParams[i].type
        ) {
          changes.push(`parameter "${oldParams[i].name}" changed`);
        }
      }
    }
    if (oldReturn !== newReturn) {
      changes.push(`return type changed from ${oldReturn} to ${newReturn}`);
    }

    if (changes.length > 0) {
      events.push({
        type: "api_signature_change",
        file: filePath,
        entityName: name,
        details: { changes },
      });
    }
  }
  return events;
}

/**
 * Detect interface/type changes.
 */
function detectInterfaceChanges(
  oldProject: Project,
  newProject: Project,
  filePath: string,
): SemanticEvent[] {
  const events: SemanticEvent[] = [];
  const oldSource = oldProject.getSourceFiles()[0];
  const newSource = newProject.getSourceFiles()[0];
  if (!oldSource || !newSource) return events;

  const oldInterfaces = oldSource.getInterfaces();
  const newInterfaces = newSource.getInterfaces();

  for (const oldInt of oldInterfaces) {
    const name = oldInt.getName();
    const newInt = newInterfaces.find((i) => i.getName() === name);
    if (!newInt) continue;

    const oldProps = oldInt.getProperties().map((p) => p.getStructure());
    const newProps = newInt.getProperties().map((p) => p.getStructure());

    const added = newProps.filter(
      (np) => !oldProps.some((op) => op.name === np.name),
    );
    const removed = oldProps.filter(
      (op) => !newProps.some((np) => np.name === op.name),
    );

    if (added.length || removed.length) {
      events.push({
        type: "interface_change",
        file: filePath,
        entityName: name,
        details: {
          added: added.map((p) => p.name),
          removed: removed.map((p) => p.name),
        },
      });
    }
  }

  // Type aliases (simplified)
  const oldTypes = oldSource.getTypeAliases();
  const newTypes = newSource.getTypeAliases();
  for (const oldType of oldTypes) {
    const name = oldType.getName();
    const newType = newTypes.find((t) => t.getName() === name);
    if (newType && oldType.getText() !== newType.getText()) {
      events.push({
        type: "interface_change",
        file: filePath,
        entityName: name,
        details: { typeChanged: true },
      });
    }
  }

  return events;
}

/**
 * Main entry point for semantic analysis.
 * @param changedFiles list of file paths that have changes (from git status)
 * @returns SemanticAnalysisResult
 */
export async function analyzeSemanticChanges(
  changedFiles: string[],
): Promise<SemanticAnalysisResult> {
  const startTime = Date.now();
  const result: SemanticAnalysisResult = {
    events: [],
    durationMs: 0,
    skipped: false,
  };

  // Only analyze .ts/.tsx/.js/.jsx files
  const tsFiles = changedFiles.filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));
  if (tsFiles.length === 0) {
    result.durationMs = Date.now() - startTime;
    return result;
  }

  // Timeout promise
  let cancelled = false;

  const timeoutPromise = new Promise<SemanticAnalysisResult>((resolve) => {
    const timeoutId = setTimeout(() => {
      cancelled = true;

      resolve({
        events: [],
        durationMs: TIMEOUT_MS,
        skipped: true,
      });
    }, TIMEOUT_MS);

    timeoutId.unref?.();
  });

  const analysisPromise = (async () => {
    const events: SemanticEvent[] = [];
    for (const file of tsFiles) {
      if (cancelled) break;
      try {
        const oldContent = await getStagedFileContent(file);
        const newContent = await getWorkingFileContent(file);
        if (!newContent) continue; // file deleted, skip

        // Create projects only for this file (lightweight)
        const oldProject = new Project({ useInMemoryFileSystem: true });
        const newProject = new Project({ useInMemoryFileSystem: true });

        if (oldContent) {
          oldProject.createSourceFile(file, oldContent);
        }
        if (newContent) {
          newProject.createSourceFile(file, newContent);
        }

        if (!oldContent) {
          // New file – no comparison, but we could detect "new file" events later
          continue;
        }

        // Run detectors
        events.push(...detectRenames(oldProject, newProject, file));
        events.push(...detectSignatureChanges(oldProject, newProject, file));
        events.push(...detectInterfaceChanges(oldProject, newProject, file));
      } catch (err) {
        console.warn(`[semanticAnalyzer] Failed to analyze ${file}:`, err);
      }
    }
    return { events, durationMs: Date.now() - startTime, skipped: false };
  })();

  const finalResult = await Promise.race([analysisPromise, timeoutPromise]);
  result.events = finalResult.events;
  result.durationMs = finalResult.durationMs;
  result.skipped = finalResult.skipped;
  if (result.skipped) {
    console.warn(
      "[semanticAnalyzer] Timeout reached, skipping semantic analysis",
    );
  }
  return result;
}
