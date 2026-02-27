"use client";

import { useState } from "react";
import { C } from "@/styles/palette";
import { FLAGS } from "@/constants/flags";

const INSTALL_BLOCKS = [
  {
    label: "Clone & Install",
    lines: [
      "git clone https://github.com/nirvik34/gitbun.git",
      "cd gitbun",
      "npm install",
    ],
  },
  {
    label: "Global Usage",
    lines: ["npm link", "# or use directly:", "npx gitbun --ai"],
  },
];

export default function Docs() {
  const [active, setActive] = useState(0);

  return (
    <section id="docs" style={{ padding:"100px 2rem", maxWidth:"1100px", margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:"60px" }}>
        <span style={{ fontFamily:"'JetBrains Mono', monospace", color:C.steel, fontSize:"11px", letterSpacing:"0.15em" }}>
          DOCUMENTATION
        </span>
        <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(28px,5vw,48px)", fontWeight:800, color:C.ink, margin:"12px 0 0", letterSpacing:"-0.03em" }}>
          CLI Reference
        </h2>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"24px" }}>
        {/* Flags list */}
        <div style={{ background:C.cream, border:`1px solid ${C.creamDeep}`, borderRadius:"10px", overflow:"hidden" }}>
          <div style={{ padding:"11px 16px", borderBottom:`1px solid ${C.creamDeep}`, background:C.creamDark, fontFamily:"'JetBrains Mono', monospace", fontSize:"10px", color:C.steel, letterSpacing:"0.15em" }}>
            FLAGS
          </div>
          {FLAGS.map((f, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding:      "14px 18px",
              cursor:       "pointer",
              borderBottom: `1px solid ${C.creamDeep}`,
              background:   active === i ? "rgba(74,112,169,0.07)" : "transparent",
              borderLeft:   `3px solid ${active === i ? C.steel : "transparent"}`,
              transition:   "all 0.15s",
            }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"13px", color:active === i ? C.steel : C.inkMid, fontWeight:active === i ? 600 : 400 }}>
                {f.flag}
              </span>
            </div>
          ))}
        </div>

        {/* Flag detail */}
        <div style={{ background:C.cream, border:`1px solid ${C.creamDeep}`, borderRadius:"10px", padding:"30px" }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"26px", color:C.steel, marginBottom:"14px", fontWeight:700 }}>
            {FLAGS[active].flag}
          </div>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"15px", color:C.inkMid, lineHeight:1.7, marginBottom:"22px" }}>
            {FLAGS[active].desc}
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:C.creamDark, border:`1px solid ${C.creamDeep}`, borderRadius:"5px", marginBottom:"22px" }}>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"10px", color:C.inkLight, letterSpacing:"0.1em" }}>DEFAULT:</span>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"12px", color:FLAGS[active].default === "enabled" ? C.steel : C.inkMid, fontWeight:600 }}>
              {FLAGS[active].default}
            </span>
          </div>
          <div style={{ background:C.ink, border:"1px solid rgba(143,171,212,0.15)", borderRadius:"6px", padding:"14px 18px", fontFamily:"'JetBrains Mono', monospace", fontSize:"13px", color:"rgba(239,236,227,0.8)" }}>
            <span style={{ color:C.lightBlue, opacity:0.55 }}>$ </span>
            gitbun {FLAGS[active].flag !== "--ai" ? FLAGS[active].flag : ""}
          </div>
        </div>
      </div>

      {/* Install blocks */}
      <div style={{ marginTop:"28px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        {INSTALL_BLOCKS.map(block => (
          <div key={block.label} style={{ background:C.ink, border:"1px solid rgba(143,171,212,0.1)", borderRadius:"10px", overflow:"hidden" }}>
            <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontFamily:"'JetBrains Mono', monospace", fontSize:"10px", color:C.lightBlue, letterSpacing:"0.1em", background:"rgba(255,255,255,0.03)" }}>
              {block.label.toUpperCase()}
            </div>
            <div style={{ padding:"16px 18px" }}>
              {block.lines.map((line, i) => (
                <div key={i} style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"13px", lineHeight:2, color:line.startsWith("#") ? "rgba(143,171,212,0.3)" : "rgba(239,236,227,0.8)" }}>
                  {!line.startsWith("#") && <span style={{ color:"rgba(143,171,212,0.4)" }}>$ </span>}
                  {line}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
