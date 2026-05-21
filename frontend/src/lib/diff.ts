export type DiffLineKind = "add" | "remove" | "context" | "hunk" | "meta";

export interface DiffLine {
  kind: DiffLineKind;
  text: string;
}

export interface DiffHunk {
  file: string;
  lines: DiffLine[];
}

export function parseUnifiedDiff(raw: string): DiffHunk[] {
  if (!raw) return [];
  const hunks: DiffHunk[] = [];
  let current: DiffHunk | null = null;
  let inHunk = false;

  for (const rawLine of raw.split(/\r?\n/)) {
    if (rawLine.startsWith("diff --git")) {
      const match = /b\/(.+)$/.exec(rawLine);
      current = { file: match?.[1] ?? "(unknown)", lines: [] };
      hunks.push(current);
      inHunk = false;
      continue;
    }

    if (!current) continue;

    if (rawLine.startsWith("@@")) {
      current.lines.push({ kind: "hunk", text: rawLine });
      inHunk = true;
      continue;
    }

    if (!inHunk) {
      // Skip noisy git headers (index, +++, ---, etc.) before the first hunk.
      continue;
    }

    if (rawLine.startsWith("+") && !rawLine.startsWith("+++")) {
      current.lines.push({ kind: "add", text: rawLine.slice(1) });
    } else if (rawLine.startsWith("-") && !rawLine.startsWith("---")) {
      current.lines.push({ kind: "remove", text: rawLine.slice(1) });
    } else if (rawLine.startsWith(" ")) {
      current.lines.push({ kind: "context", text: rawLine.slice(1) });
    } else if (rawLine.length > 0) {
      current.lines.push({ kind: "meta", text: rawLine });
    }
  }

  return hunks;
}
