"use client";

import { useState, useEffect } from "react";
import { C } from "@/styles/palette";
import type { TerminalLine } from "@/constants/terminalLines";

interface TerminalWindowProps {
  lines: TerminalLine[];
  title?: string;
}

const lineColor = (type: string): string => ({
  cmd:     C.cream,
  info:    "rgba(239,236,227,0.45)",
  result:  C.lightBlue,
  sub:     "rgba(143,171,212,0.7)",
  success: "#8FABD4",
  spacer:  "transparent",
}[type] ?? "transparent");

export default function TerminalWindow({ lines, title = "bash" }: TerminalWindowProps) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || count >= lines.length) return;
    const delay = count === 0 ? 0 : lines[count].delay - lines[count - 1].delay;
    const t = setTimeout(() => setCount(c => c + 1), Math.max(delay, 80));
    return () => clearTimeout(t);
  }, [count, started, lines]);

  return (
    <div style={{
      background:   C.ink,
      border:       "1px solid rgba(0,0,0,0.15)",
      borderRadius: "10px",
      overflow:     "hidden",
      boxShadow:    "0 4px 48px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)",
      fontFamily:   "'JetBrains Mono', monospace",
      fontSize:     "13px",
    }}>
      {/* Title bar */}
      <div style={{
        background:   "rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding:      "10px 16px",
        display:      "flex",
        alignItems:   "center",
        gap:          "8px",
      }}>
        <span style={{ width:10, height:10, borderRadius:"50%", background:"#ff5f56", display:"block" }} />
        <span style={{ width:10, height:10, borderRadius:"50%", background:"#ffbd2e", display:"block" }} />
        <span style={{ width:10, height:10, borderRadius:"50%", background:"#27c93f", display:"block" }} />
        <span style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", marginLeft:"8px" }}>{title}</span>
      </div>

      {/* Lines */}
      <div style={{ padding:"20px 24px", minHeight:"220px" }}>
        {lines.slice(0, count).map((line, i) => (
          <div key={i} style={{ color: lineColor(line.type), lineHeight:"1.9", animation:"fadeIn 0.2s ease" }}>
            {line.type === "cmd" && (
              <span style={{ color: C.lightBlue, opacity: 0.5 }}></span>
            )}
            {line.text || "\u00A0"}
          </div>
        ))}

        {count < lines.length && started && (
          <span style={{
            display:       "inline-block",
            width:         "8px",
            height:        "14px",
            background:    C.lightBlue,
            animation:     "blink 1s step-end infinite",
            verticalAlign: "text-bottom",
          }} />
        )}
      </div>
    </div>
  );
}
