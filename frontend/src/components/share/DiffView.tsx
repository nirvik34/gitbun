import { C } from "@/styles/palette";
import { parseUnifiedDiff, type DiffLine } from "@/lib/diff";

const KIND_STYLES: Record<DiffLine["kind"], { color: string; background: string }> = {
  add: { color: "#9fd49f", background: "rgba(80,200,120,0.10)" },
  remove: { color: "#e08a8a", background: "rgba(220,90,90,0.10)" },
  context: { color: "rgba(239,236,227,0.75)", background: "transparent" },
  hunk: { color: C.lightBlue, background: "rgba(74,112,169,0.10)" },
  meta: { color: "rgba(239,236,227,0.45)", background: "transparent" },
};

const PREFIX: Record<DiffLine["kind"], string> = {
  add: "+ ",
  remove: "- ",
  context: "  ",
  hunk: "",
  meta: "",
};

export default function DiffView({ raw }: { raw: string }) {
  const hunks = parseUnifiedDiff(raw);

  if (hunks.length === 0) {
    return (
      <div
        style={{
          padding: "24px",
          color: "rgba(239,236,227,0.5)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
        }}
      >
        No diff available for this commit.
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.ink,
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: "10px",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        boxShadow: "0 4px 48px rgba(0,0,0,0.22)",
      }}
    >
      {hunks.map((h, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(255,255,255,0.05)",
              color: C.cream,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {h.file}
          </div>
          <pre
            style={{
              margin: 0,
              padding: "12px 16px",
              whiteSpace: "pre",
              overflowX: "auto",
              lineHeight: 1.6,
            }}
          >
            {h.lines.map((line, j) => {
              const s = KIND_STYLES[line.kind];
              return (
                <div
                  key={j}
                  style={{
                    color: s.color,
                    background: s.background,
                    paddingLeft: "6px",
                    paddingRight: "6px",
                  }}
                >
                  {PREFIX[line.kind]}
                  {line.text || " "}
                </div>
              );
            })}
          </pre>
        </div>
      ))}
    </div>
  );
}
