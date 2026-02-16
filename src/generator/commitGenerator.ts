type FileInfo = {
  path: string;
  additions: number;
  deletions: number;
  status: "A" | "M" | "D";
};

  export function generateCommitMessage(
    type: string,
    scope: string,
    files: FileInfo[]
  ): string {
    const description = buildDescription(type, scope, files);
    const message = scope ? `${type}(${scope}): ${description}` : `${type}: ${description}`;
    return enforceRules(message);
  }

function buildDescription(
  type: string,
  scope: string | null,
  files: FileInfo[]
): string {
  const nouns = files
    .map(f => extractNoun(f.path))
    .filter(Boolean);

  const unique = Array.from(new Set(nouns));

  if (files.every(f => f.status === "D")) {
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
    perf: ["optimize", "improve"]
  };

  const options = verbs[type] || ["update"];
  return options[0];
}

function extractNoun(path: string): string {
  // Extracts the main file/folder name as a noun, e.g. analyzer, diffScanner, etc.
  const parts = path.split("/");
  // Prefer folder if inside a subfolder, else file name without extension
  if (parts.length > 2) return parts[parts.length - 2];
  return parts[parts.length - 1].replace(/\.[^/.]+$/, "");
}

function enforceRules(message: string): string {
  const parts = message.split(": ");
  if (parts.length === 2) {
    parts[1] = parts[1].charAt(0).toLowerCase() + parts[1].slice(1);
  }

  let formatted = parts.join(": ");

  formatted = formatted.replace(/\.$/, "");

  if (formatted.length > 72) {
    formatted = formatted.slice(0, 69) + "...";
  }

  return formatted;
}
