type FileInfo = {
  path: string;
  additions: number;
  deletions: number;
  status: "A" | "M" | "D";
};

const DEFAULT_TEMPLATE = "{type}{scope}: {message}";

function normalizeTemplate(template: string): string {
  const validPlaceholders = [
    "{type}",
    "{scope}",
    "{message}"
  ];

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

export function generateCommitMessage(
  type: string,
  scope: string,
  files: FileInfo[],
  format: string = DEFAULT_TEMPLATE
): string {
  const description = buildDescription(type, scope, files);

  const safeTemplate = normalizeTemplate(format);

  const message = formatCommitMessage(safeTemplate, {
    type,
    scope: scope ? `(${scope})` : "",
    message: description
  });

  return enforceRules(message);
}

function formatCommitMessage(
  template: string,
  data: {
    type: string;
    scope: string;
    message: string;
  }
): string {
  return template
    .replace(/{type}/g, data.type)
    .replace(/{scope}/g, data.scope)
    .replace(/{message}/g, data.message);
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
  const parts = path.split("/");

  if (parts.length > 2) {
    return parts[parts.length - 2];
  }

  return parts[parts.length - 1].replace(/\.[^/.]+$/, "");
}

function enforceRules(message: string): string {
  const parts = message.split(": ");

  if (parts.length === 2) {
    parts[1] =
      parts[1].charAt(0).toLowerCase() +
      parts[1].slice(1);
  }

  let formatted = parts.join(": ");

  formatted = formatted.replace(/\.$/, "");

  if (formatted.length > 72) {
    formatted = formatted.slice(0, 69) + "...";
  }

  return formatted;
}