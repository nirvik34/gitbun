"use client";

import { useState } from "react";
import { C } from "@/styles/palette";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "⎘ COPY" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        width:         "100%",
        marginTop:     "14px",
        padding:       "10px",
        background:    "transparent",
        border:        `1px solid rgba(74,112,169,0.25)`,
        borderRadius:  "5px",
        color:         copied ? C.steel : C.steel,
        cursor:        "pointer",
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "11px",
        letterSpacing: "0.08em",
        transition:    "all 0.2s",
        opacity:       copied ? 1 : 0.75,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,112,169,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {copied ? "✓ COPIED!" : label}
    </button>
  );
}
