// src/analyzer/summarizer.ts
import { SemanticEvent } from "./semanticTypes";

export interface FileInfo {
  path: string;
  additions: number;
  deletions: number;
  status: "A" | "M" | "D";
}

/**
 * Determine commit type based on changed files.
 * Heuristics:
 * - New files (.ts, .js, etc.) + additions > 0 → feat
 * - Files containing "test", "spec" → test
 * - Files containing "fix", "bug", "hotfix" → fix
 * - Deletions only → chore
 * - Documentation (.md, .txt) → docs
 * - Config files (.json, .yml, .toml) → chore
 * - Default → refactor
 */
function detectType(files: FileInfo[]): string {
  let hasNewCode = false;
  let hasTest = false;
  let hasFix = false;
  let hasDoc = false;
  let hasConfig = false;
  let hasDeletionsOnly = true;

  for (const file of files) {
    const path = file.path.toLowerCase();
    if (
      file.status === "A" &&
      (path.endsWith(".ts") ||
        path.endsWith(".js") ||
        path.endsWith(".jsx") ||
        path.endsWith(".tsx"))
    ) {
      hasNewCode = true;
    }
    if (path.includes("test") || path.includes("spec")) {
      hasTest = true;
    }
    if (
      path.includes("fix") ||
      path.includes("bug") ||
      path.includes("hotfix")
    ) {
      hasFix = true;
    }
    if (path.endsWith(".md") || path.includes("docs")) {
      hasDoc = true;
    }
    if (
      path.endsWith(".json") ||
      path.endsWith(".yml") ||
      path.endsWith(".yaml") ||
      path.endsWith(".toml")
    ) {
      hasConfig = true;
    }
    if (file.additions > 0) {
      hasDeletionsOnly = false;
    }
  }

  if (hasTest) return "test";
  if (hasFix) return "fix";
  if (hasNewCode) return "feat";
  if (hasDoc) return "docs";
  if (hasConfig || hasDeletionsOnly) return "chore";
  return "refactor";
}

/**
 * Extract a meaningful scope from file paths.
 * Uses the first directory name or filename prefix.
 */
function detectScope(files: FileInfo[]): string {
  const scopes: string[] = [];
  for (const file of files) {
    const parts = file.path.split("/");
    if (parts.length > 1) {
      scopes.push(parts[0]); // top-level folder
    } else {
      // file in root – use filename without extension
      const name = parts[0].split(".")[0];
      scopes.push(name);
    }
  }
  // Return the most common scope, or first one
  const freq: Record<string, number> = {};
  for (const s of scopes) {
    freq[s] = (freq[s] || 0) + 1;
  }
  let maxScope = scopes[0] || "general";
  let maxCount = 0;
  for (const [s, count] of Object.entries(freq)) {
    if (count > maxCount) {
      maxCount = count;
      maxScope = s;
    }
  }
  return maxScope;
}

/**
 * Generate the base subject line from file changes.
 * Example: "add user authentication" or "update config schema"
 */
function generateSubject(files: FileInfo[]): string {
  // Simple heuristics for verb+noun
  const addedFiles = files.filter(
    (f) =>
      f.status === "A" && (f.path.endsWith(".ts") || f.path.endsWith(".js")),
  );
  const modifiedFiles = files.filter((f) => f.status === "M");

  if (addedFiles.length > 0) {
    const firstFile =
      addedFiles[0].path.split("/").pop()?.split(".")[0] || "component";
    return `add ${firstFile}`;
  } else if (modifiedFiles.length > 0) {
    const firstFile =
      modifiedFiles[0].path.split("/").pop()?.split(".")[0] || "code";
    return `update ${firstFile}`;
  } else {
    return "update files";
  }
}

/**
 * Enhance the subject with semantic event information.
 * Returns the modified subject string.
 */
function enhanceWithSemanticEvents(
  subject: string,
  events: SemanticEvent[],
): string {
  if (events.length === 0) return subject;

  // Prioritize rename > signature > interface
  const priority: Record<string, number> = {
    function_rename: 1,
    api_signature_change: 2,
    interface_change: 3,
    logic_extraction: 4,
    logic_movement: 5,
  };
  const sortedEvents = [...events].sort(
    (a, b) => (priority[a.type] || 99) - (priority[b.type] || 99),
  );

  const main = sortedEvents[0];

  switch (main.type) {
    case "function_rename": {
      const details = main.details as {
        oldName: string;
        newName: string;
      };

      return `rename ${details.oldName} to ${details.newName}`;
    }

    case "api_signature_change": {
      const details = main.details as { changes: string[] };

      return `update ${main.entityName} signature (${details.changes.join(", ")})`;
    }

    case "interface_change": {
      const props = main.details as {
        added?: string[];
        removed?: string[];
      };

      if (props.added && props.added.length) {
        return `add ${props.added.join(", ")} to ${main.entityName} interface`;
      }

      if (props.removed && props.removed.length) {
        return `remove ${props.removed.join(", ")} from ${main.entityName} interface`;
      }

      return `modify ${main.entityName} interface`;
    }

    default:
      return subject;
  }
}

/**
 * Main entry point: generates a Conventional Commit message.
 * @param files Array of FileInfo (staged file changes)
 * @param semanticEvents Optional semantic events from AST analysis
 * @returns Commit message string, e.g., "feat(analyzer): add semantic diff understanding"
 */
export function generateSummary(
  files: FileInfo[],
  semanticEvents?: SemanticEvent[],
): string {
  const type = detectType(files);
  const scope = detectScope(files);
  let subject = generateSubject(files);

  if (semanticEvents && semanticEvents.length > 0) {
    subject = enhanceWithSemanticEvents(subject, semanticEvents);
  }

  // Capitalize subject and ensure no trailing dot
  subject = subject.charAt(0).toUpperCase() + subject.slice(1);
  if (subject.endsWith(".")) subject = subject.slice(0, -1);

  return `${type}(${scope}): ${subject}`;
}
