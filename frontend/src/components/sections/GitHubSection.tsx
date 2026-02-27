import { C } from "@/styles/palette";
import TypeBadge from "@/components/ui/TypeBadge";

const STATS = [
  { label: "Stars", value: "★ 0" },
  { label: "Forks", value: "⑂ 0" },
  { label: "License", value: "MIT" },
  { label: "Node", value: "≥ 18" },
];

const RECENT_COMMITS = [
  { hash: "a3f92b1", message: "feat(analyzer): add type classifier", time: "just now", type: "feat" },
  { hash: "b12cc4e", message: "chore: add npm link instructions", time: "1d ago", type: "chore" },
  { hash: "c88d119", message: "docs: update README with flags reference", time: "2d ago", type: "docs" },
  { hash: "d4501fa", message: "feat: initial CLI scaffolding", time: "3d ago", type: "feat" },
];

export default function GitHubSection() {
  return (
    <section id="github" style={{ padding: "100px 2rem", background: C.creamDark, borderTop: `1px solid ${C.creamDeep}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.steel, fontSize: "11px", letterSpacing: "0.15em" }}>
            OPEN SOURCE
          </span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: C.ink, margin: "12px 0 0", letterSpacing: "-0.03em" }}>
            GitHub Integration
          </h2>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: C.cream, border: `1px solid ${C.creamDeep}`, borderRadius: "8px", padding: "22px", textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "22px", color: C.steel, fontWeight: 700, marginBottom: "6px" }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: C.inkLight, letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Commits table */}
        <div style={{ background: C.ink, border: "1px solid rgba(143,171,212,0.12)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.lightBlue, letterSpacing: "0.1em" }}>
              RECENT COMMITS — nirvik34/gitbun
            </span>
            <a
              href="https://github.com/nirvik34/gitbun"
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto", color: "rgba(143,171,212,0.45)", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.lightBlue)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(143,171,212,0.45)")}
            >
              VIEW ON GITHUB →
            </a>
          </div>
          {RECENT_COMMITS.map((c, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderBottom: i < RECENT_COMMITS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "default" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(143,171,212,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <TypeBadge type={c.type} size="sm" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "rgba(239,236,227,0.75)", flex: 1 }}>{c.message}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(143,171,212,0.3)", whiteSpace: "nowrap" }}>{c.hash}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(143,171,212,0.3)", whiteSpace: "nowrap" }}>{c.time}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a
            href="https://github.com/nirvik34/gitbun"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: C.steel, color: C.cream, padding: "14px 36px", borderRadius: "6px", textDecoration: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.02em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.steelDark; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(74,112,169,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.steel; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            ★ Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
