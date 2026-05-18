// src/generator/commitGenerator.ts
import { FileInfo } from "../analyzer/summarizer";
import { SemanticEvent } from "../analyzer/semanticTypes";

const DEFAULT_TEMPLATE = "{type}{scope}: {message}";

function normalizeTemplate(template: string): string {
  const validPlaceholders = ["{type}", "{scope}", "{message}"];

  // Required placeholders
  if (!template.includes("{message}")) {
    return DEFAULT_TEMPLATE;
  }
  // Detect invalid placeholders like {mesage}
  const matches = template.match(/{.*?}/g) || [];

  for (const match of matches) {
    if (!validPlaceholders.includes(match)) {
      return DEFAULT_TEMPLATE;
    }
  }

  return template;
}

/**
 * Generate a semantic description from detected AST events.
 */
function generateSemanticDescription(events: SemanticEvent[]): string {
  if (events.length === 0) return "";

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
      const details = main.details as { oldName: string; newName: string };
      return `rename ${details.oldName} to ${details.newName}`;
    }
    case "api_signature_change": {
      const details = main.details as { changes: string[] };
      return `update ${main.entityName} signature (${details.changes.join(", ")})`;
    }
    case "interface_change": {
      const details = main.details as { added?: string[]; removed?: string[] };
      if (details.added && details.added.length) {
        return `add ${details.added.join(", ")} to ${main.entityName} interface`;
      }
      if (details.removed && details.removed.length) {
        return `remove ${details.removed.join(", ")} from ${main.entityName} interface`;
      }
      return `modify ${main.entityName} interface`;
    }
    default:
      return "";
  }
}

/**
 * Build the commit description (the part after the colon).
 * Uses semantic events if available, otherwise falls back to file‑based heuristics.
 */
function buildDescription(
  type: string,
  scope: string | null,
  files: FileInfo[],
  semanticEvents?: SemanticEvent[],
): string {
  // If we have semantic events, use them to generate a precise description
  if (semanticEvents && semanticEvents.length > 0) {
    const semanticDesc = generateSemanticDescription(semanticEvents);
    if (semanticDesc) {
      return semanticDesc;
    }
  }

  // Fallback to original heuristic logic
  const nouns = files.map((f) => extractNoun(f.path)).filter(Boolean);

  const unique = Array.from(new Set(nouns));

  if (files.every((f) => f.status === "D")) {
    return "remove unused files";
  }

  if (unique.length === 1) {
    return `${selectVerb(type)} ${unique[0]}`;
  }

  if (unique.length === 2) {
    return `${selectVerb(type)} ${unique[0]} and ${unique[1]}`;
  }

  if (scope) {
    return `${selectVerb(type)} ${scope} logic`;
  }

  return `${selectVerb(type)} project structure`;
}

function selectVerb(type: string): string {
  const verbs: Record<string, string[]> = {
    feat: ["add", "implement", "introduce"],
    fix: ["fix", "resolve", "correct"],
    refactor: ["refactor", "simplify", "restructure"],
    docs: ["update", "improve", "clarify"],
    test: ["add", "update"],
    chore: ["update", "adjust"],
    build: ["configure", "update"],
    ci: ["update", "configure"],
    perf: ["optimize", "improve"],
  };

  const options = verbs[type] || ["update"];
  return options[0];
}

function extractNoun(path: string): string {
  const parts = path.split("/");

  if (parts.length > 2) {
    return parts[parts.length - 2];
  }

  // Fix regex: match a dot followed by any characters except dot or slash until end
  return parts[parts.length - 1].replace(/\.[^/.]+$/, "");
}

function enforceRules(message: string): string {
  const parts = message.split(": ");

  if (parts.length === 2) {
    // Modify the second part in place
    parts[1] = parts[1].charAt(0).toLowerCase() + parts[1].slice(1);
  }

  let formatted = parts.join(": ");

  formatted = formatted.replace(/\.$/, "");

  if (formatted.length > 72) {
    formatted = formatted.slice(0, 69) + "...";
  }

  return formatted;
}

/**
 * Generate a conventional commit message.
 * @param type - commit type (feat, fix, etc.)
 * @param scope - affected scope (may be empty)
 * @param files - list of changed files with stats
 * @param format - optional template string (default: "{type}{scope}: {message}")
 * @param semanticEvents - optional semantic events from AST analysis
 * @returns formatted commit message
 */
export function generateCommitMessage(
  type: string,
  scope: string,
  files: FileInfo[],
  format: string = DEFAULT_TEMPLATE,
  semanticEvents?: SemanticEvent[],
): string {
  const description = buildDescription(type, scope, files, semanticEvents);

  const safeTemplate = normalizeTemplate(format);

  const message = formatCommitMessage(safeTemplate, {
    type,
    scope: scope ? `(${scope})` : "",
    message: description,
  });

  return enforceRules(message);
}

function formatCommitMessage(
  template: string,
  data: { type: string; scope: string; message: string },
): string {
  return template
    .replace(/{type}/g, data.type)
    .replace(/{scope}/g, data.scope)
    .replace(/{message}/g, data.message);
}
