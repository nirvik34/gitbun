import { C } from "@/styles/palette";

const FEATURES = [
  { icon:"⚡", title:"AI-Powered Analysis",   desc:"Uses Gemini to deeply analyze your diff and understand change intent — not just syntax." },
  { icon:"◈",  title:"Conventional Commits",  desc:"Generates perfectly formatted feat/fix/docs/chore commits with optional scope, subject, and body." },
  { icon:"⬡",  title:"Rule-Based Fallback",   desc:"No API key? No problem. --no-ai triggers a fast, deterministic offline summarizer." },
  { icon:"✦",  title:"Interactive Mode",      desc:"Review, edit, and approve generated messages before committing with the --interactive flag." },
  { icon:"⊕",  title:"Custom Config",         desc:"Point Gitbun at any config file with --config to override model, scope detection, and output format." },
  { icon:"◻",  title:"Zero Setup",            desc:"Works out of the box with npx gitbun. No account required in rule-based mode." },
];

export default function Features() {
  return (
    <section style={{
      padding:       "80px 2rem",
      background:    C.creamDark,
      borderTop:     `1px solid ${C.creamDeep}`,
      borderBottom:  `1px solid ${C.creamDeep}`,
    }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"56px" }}>
          <span style={{ fontFamily:"'JetBrains Mono', monospace", color:C.steel, fontSize:"11px", letterSpacing:"0.15em" }}>
            WHY GITBUN
          </span>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(28px,5vw,48px)", fontWeight:800, color:C.ink, margin:"12px 0 0", letterSpacing:"-0.03em" }}>
            Everything you need
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{ background:C.cream, border:`1px solid ${C.creamDeep}`, borderRadius:"10px", padding:"28px 24px", transition:"all 0.25s ease", cursor:"default" }}
              onMouseEnter={e => {
                e.currentTarget.style.background    = "rgba(74,112,169,0.05)";
                e.currentTarget.style.border        = "1px solid rgba(74,112,169,0.3)";
                e.currentTarget.style.transform     = "translateY(-2px)";
                e.currentTarget.style.boxShadow     = "0 8px 24px rgba(74,112,169,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background    = C.cream;
                e.currentTarget.style.border        = `1px solid ${C.creamDeep}`;
                e.currentTarget.style.transform     = "translateY(0)";
                e.currentTarget.style.boxShadow     = "none";
              }}
            >
              <div style={{ fontSize:"20px", marginBottom:"14px", color:C.steel }}>{f.icon}</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"16px", color:C.ink, marginBottom:"8px" }}>
                {f.title}
              </div>
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"14px", color:C.inkMid, lineHeight:1.65 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
