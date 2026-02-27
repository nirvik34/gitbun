"use client";

import { useState } from "react";
import { C } from "@/styles/palette";
import TerminalWindow from "@/components/ui/TerminalWindow";
import { TERMINAL_LINES } from "@/constants/terminalLines";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText("npm install -g gitbun");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{
      minHeight:      "100vh",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "100px 2rem 80px",
      position:       "relative",
      overflow:       "hidden",
    }}>
      {/* Blueprint grid */}
      <div style={{
        position:        "absolute",
        inset:           0,
        backgroundImage: `linear-gradient(rgba(74,112,169,0.07) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(74,112,169,0.07) 1px, transparent 1px)`,
        backgroundSize:  "52px 52px",
        maskImage:       "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
      }} />

      {/* Glow blob */}
      <div style={{
        position:     "absolute",
        top:          "35%",
        left:         "50%",
        transform:    "translate(-50%,-50%)",
        width:        "700px",
        height:       "420px",
        background:   "radial-gradient(ellipse, rgba(143,171,212,0.16) 0%, transparent 70%)",
        pointerEvents:"none",
      }} />

      <div style={{ position:"relative", textAlign:"center", maxWidth:"860px" }}>
        {/* Badge */}
        <div style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "8px",
          background:    "rgba(74,112,169,0.08)",
          border:        "1px solid rgba(74,112,169,0.22)",
          borderRadius:  "20px",
          padding:       "6px 18px",
          marginBottom:  "38px",
          fontSize:      "11px",
          color:         C.steel,
          fontFamily:    "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:C.steel, display:"inline-block", animation:"pulse 2s infinite" }} />
          AI-POWERED · CONTEXT-AWARE · CONVENTIONAL COMMITS
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily:    "'Syne', sans-serif",
          fontSize:      "clamp(50px, 8.5vw, 94px)",
          fontWeight:    800,
          lineHeight:    0.93,
          margin:        "0 0 28px",
          letterSpacing: "-0.04em",
          color:         C.ink,
        }}>
          Commit messages<br />
          <span style={{
            color:                "transparent",
            backgroundClip:       "text",
            WebkitBackgroundClip: "text",
            backgroundImage:      `linear-gradient(105deg, ${C.steel}, ${C.lightBlue}, ${C.steel})`,
            backgroundSize:       "200% 100%",
            animation:            "shimmer 3.5s linear infinite",
          }}>
            that write themselves
          </span>
        </h1>

        {/* Subhead */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize:   "18px",
          color:      C.inkMid,
          maxWidth:   "520px",
          margin:     "0 auto 52px",
          lineHeight: 1.65,
        }}>
          Gitbun analyzes your staged diffs and generates meaningful,
          context-aware commit messages using local or remote LLMs.
        </p>

        {/* CTAs */}
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", marginBottom:"64px" }}>
          <button
            onClick={copy}
            style={{
              background:    "rgba(74,112,169,0.07)",
              border:        "1.5px solid rgba(74,112,169,0.3)",
              color:         C.steel,
              padding:       "13px 28px",
              borderRadius:  "6px",
              cursor:        "pointer",
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      "13px",
              display:       "flex",
              alignItems:    "center",
              gap:           "10px",
              letterSpacing: "0.04em",
              transition:    "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,112,169,0.14)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(74,112,169,0.07)")}
          >
            {copied ? "✓ Copied!" : "$ npm install -g gitbun"}
            <span style={{ opacity:0.5, fontSize:"11px" }}>{copied ? "" : "⎘"}</span>
          </button>

          <a
            href="#playground"
            style={{
              background:    C.steel,
              color:         C.cream,
              padding:       "13px 30px",
              borderRadius:  "6px",
              fontFamily:    "'DM Sans', sans-serif",
              fontWeight:    700,
              fontSize:      "14px",
              textDecoration:"none",
              letterSpacing: "0.02em",
              transition:    "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.steelDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.steel;     e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Try the Playground →
          </a>
        </div>

        {/* Terminal */}
        <div style={{ maxWidth:"640px", margin:"0 auto" }}>
          <TerminalWindow lines={TERMINAL_LINES} title="~/my-project — bash" />
        </div>
      </div>
    </section>
  );
}
