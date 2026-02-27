import { C } from "@/styles/palette";

export default function Footer() {
  return (
    <footer style={{
      borderTop:  `1px solid ${C.creamDeep}`,
      padding:    "36px 2rem",
      textAlign:  "center",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize:   "12px",
      color:      C.inkLight,
      background: C.cream,
    }}>
      <div style={{ marginBottom:"12px", display:"flex", justifyContent:"center", gap:"10px", alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ color:C.steel, fontSize:"16px" }}>⬡</span>
        <span style={{ color:C.ink }}>
          git<span style={{ color:C.steel }}>bun</span>
        </span>
        <span>·</span>
        <span>MIT License</span>
        <span>·</span>
        <a
          href="https://github.com/nirvik34/gitbun"
          target="_blank"
          rel="noreferrer"
          style={{ color:C.steel, textDecoration:"none" }}
        >
          github.com/nirvik34/gitbun
        </a>
      </div>
      <div>Built by nirvik34 — Node.js ≥ 18 required</div>
    </footer>
  );
}
