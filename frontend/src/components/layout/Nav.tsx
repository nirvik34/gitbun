"use client";

import { useState, useEffect } from "react";
import { C } from "@/styles/palette";

interface NavProps {
  activeSection: string;
  setActiveSection: (s: string) => void;
}

export default function Nav({ activeSection, setActiveSection }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = ["playground", "docs", "github"];

  return (
    <nav style={{
      position:       "fixed",
      top:            0,
      left:           0,
      right:          0,
      zIndex:         100,
      padding:        "0 2.5rem",
      height:         "58px",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      background:     scrolled ? "rgba(239,236,227,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom:   scrolled ? `1px solid ${C.creamDeep}` : "none",
      transition:     "all 0.3s ease",
      fontFamily:     "'JetBrains Mono', monospace",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ color:C.steel, fontSize:"20px" }}>⬡</span>
        <span style={{ color:C.ink, fontWeight:700, fontSize:"15px", letterSpacing:"0.05em" }}>
          git<span style={{ color:C.steel }}>bun</span>
        </span>
        <span style={{
          background:    "rgba(74,112,169,0.1)",
          border:        "1px solid rgba(74,112,169,0.3)",
          color:         C.steel,
          fontSize:      "9px",
          padding:       "2px 7px",
          borderRadius:  "3px",
          letterSpacing: "0.1em",
        }}>
          v1.0
        </span>
      </div>

      {/* Links */}
      <div style={{ display:"flex", gap:"2rem", alignItems:"center" }}>
        {navLinks.map(s => (
          <button
            key={s}
            onClick={() => {
              setActiveSection(s);
              document.getElementById(s)?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              background:    "none",
              border:        "none",
              cursor:        "pointer",
              color:         activeSection === s ? C.steel : C.inkMid,
              fontSize:      "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding:       "4px 0",
              fontFamily:    "inherit",
              borderBottom:  activeSection === s ? `2px solid ${C.steel}` : "2px solid transparent",
              transition:    "all 0.2s",
            }}
          >
            {s}
          </button>
        ))}

        <a
          href="https://github.com/nirvik34/gitbun"
          target="_blank"
          rel="noreferrer"
          style={{
            background:    C.steel,
            color:         C.cream,
            padding:       "7px 16px",
            borderRadius:  "4px",
            fontSize:      "11px",
            letterSpacing: "0.07em",
            textDecoration:"none",
            display:       "flex",
            alignItems:    "center",
            gap:           "6px",
            fontFamily:    "inherit",
            fontWeight:    600,
            transition:    "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.steelDark)}
          onMouseLeave={e => (e.currentTarget.style.background = C.steel)}
        >
          ★ GitHub
        </a>
      </div>
    </nav>
  );
}
