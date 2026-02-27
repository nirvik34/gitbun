"use client";

import { useState } from "react";
import { C } from "@/styles/palette";
import { TYPE_COLORS } from "@/constants/typeColors";
import { MOCK_COMMITS } from "@/constants/mockCommits";
import { generateCommit, type CommitResult, type Mode } from "@/lib/generateCommit";
import TypeBadge from "@/components/ui/TypeBadge";
import CopyButton from "@/components/ui/CopyButton";

export default function Playground() {
  const [diff,    setDiff]    = useState(MOCK_COMMITS[0].diff);
  const [result,  setResult]  = useState<CommitResult | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preset,  setPreset]  = useState(0);
  const [mode,    setMode]    = useState<Mode>("ai");

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await generateCommit(diff, mode);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
    setLoading(false);
  };

  const tc = result ? (TYPE_COLORS[result.type] ?? TYPE_COLORS.feat) : null;
  const commitStr = result
    ? `${result.type}${result.scope ? `(${result.scope})` : ""}: ${result.subject}`
    : null;

  return (
    <section id="playground" style={{ padding:"100px 2rem", maxWidth:"1100px", margin:"0 auto" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"60px" }}>
        <span style={{ fontFamily:"'JetBrains Mono', monospace", color:C.steel, fontSize:"11px", letterSpacing:"0.15em" }}>
          INTERACTIVE DEMO
        </span>
        <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(30px,5vw,50px)", fontWeight:800, color:C.ink, margin:"12px 0 0", letterSpacing:"-0.03em" }}>
          Try the Playground
        </h2>
        <p style={{ color:C.inkMid, fontFamily:"'DM Sans', sans-serif", marginTop:"12px", fontSize:"15px" }}>
          Paste a real diff or pick a preset — Gitbun generates your commit message live
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>

        {/* ── LEFT: Input ── */}
        <div>
          {/* Mode toggle */}
          <div style={{ display:"flex", borderRadius:"6px", overflow:"hidden", border:`1px solid ${C.creamDeep}`, marginBottom:"16px" }}>
            {(["ai", "rule-based"] as Mode[]).map((m, i) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex:          1,
                padding:       "9px",
                border:        "none",
                cursor:        "pointer",
                background:    mode === m ? C.steel : C.creamDark,
                color:         mode === m ? C.cream : C.inkMid,
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      "11px",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                transition:    "all 0.2s",
                borderRight:   i === 0 ? `1px solid ${C.creamDeep}` : "none",
              }}>
                {m === "ai" ? "⚡ AI Mode" : "⚙ Rule-Based"}
              </button>
            ))}
          </div>

          {/* Presets */}
          <div style={{ display:"flex", gap:"8px", marginBottom:"12px", flexWrap:"wrap" }}>
            {MOCK_COMMITS.map((p, i) => (
              <button key={i} onClick={() => { setPreset(i); setDiff(p.diff); setResult(null); setError(null); }} style={{
                padding:      "5px 14px",
                borderRadius: "4px",
                cursor:       "pointer",
                border:       `1px solid ${preset === i ? C.steel : C.creamDeep}`,
                background:   preset === i ? "rgba(74,112,169,0.08)" : C.creamDark,
                color:        preset === i ? C.steel : C.inkMid,
                fontFamily:   "'JetBrains Mono', monospace",
                fontSize:     "11px",
                transition:   "all 0.15s",
              }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={diff}
            onChange={e => { setDiff(e.target.value); setResult(null); setError(null); setPreset(-1); }}
            placeholder="Paste your git diff here..."
            style={{
              width:       "100%",
              height:      "270px",
              background:  C.ink,
              border:      "1px solid rgba(74,112,169,0.2)",
              borderRadius:"8px",
              padding:     "16px",
              color:       "rgba(239,236,227,0.85)",
              fontFamily:  "'JetBrains Mono', monospace",
              fontSize:    "12px",
              lineHeight:  1.75,
              resize:      "vertical",
              outline:     "none",
              boxSizing:   "border-box",
            }}
            onFocus={e => (e.target.style.border = "1px solid rgba(74,112,169,0.5)")}
            onBlur={e  => (e.target.style.border = "1px solid rgba(74,112,169,0.2)")}
          />

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !diff.trim()}
            style={{
              width:         "100%",
              marginTop:     "12px",
              padding:       "14px",
              background:    loading ? C.creamDark : C.steel,
              border:        "none",
              borderRadius:  "6px",
              color:         loading ? C.steel : C.cream,
              fontFamily:    "'Syne', sans-serif",
              fontWeight:    700,
              fontSize:      "14px",
              cursor:        loading ? "wait" : "pointer",
              letterSpacing: "0.04em",
              transition:    "all 0.2s",
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
              gap:           "8px",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.steelDark; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = C.steel; }}
          >
            {loading
              ? <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>◌</span> Generating...</>
              : "⚡ Generate Commit Message"
            }
          </button>
        </div>

        {/* ── RIGHT: Output ── */}
        <div style={{ background:C.cream, border:`1px solid ${C.creamDeep}`, borderRadius:"10px", overflow:"hidden", minHeight:"420px", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"11px 16px", borderBottom:`1px solid ${C.creamDeep}`, display:"flex", alignItems:"center", gap:"8px", background:C.creamDark }}>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"10px", color:C.steel, letterSpacing:"0.12em" }}>OUTPUT</span>
            {result && <span style={{ marginLeft:"auto" }}><TypeBadge type={result.type} /></span>}
          </div>

          <div style={{ padding:"24px", flex:1 }}>
            {/* Empty state */}
            {!result && !loading && !error && (
              <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:C.inkLight, fontFamily:"'JetBrains Mono', monospace", fontSize:"13px", gap:"12px", textAlign:"center" }}>
                <span style={{ fontSize:"32px", color:C.lightBlue, opacity:0.4 }}>⬡</span>
                <span>Hit generate to see the magic</span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ height:"100%", display:"flex", flexDirection:"column", gap:"14px", justifyContent:"center" }}>
                {["Analyzing diff…","Detecting scope…","Classifying type…","Writing message…"].map((s, i) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:"12px", color:C.steel, fontFamily:"'JetBrains Mono', monospace", fontSize:"12px", animation:`fadeIn 0.4s ease ${i * 0.25}s both` }}>
                    <span style={{ animation:`pulse 1.5s infinite`, animationDelay:`${i * 0.2}s` }}>✦</span>
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ color:"#AA3232", fontFamily:"'JetBrains Mono', monospace", fontSize:"13px" }}>
                ✗ {error}
              </div>
            )}

            {/* Result */}
            {result && !error && (
              <div style={{ animation:"fadeIn 0.4s ease" }}>
                <div style={{ background:"rgba(74,112,169,0.07)", border:"1.5px solid rgba(74,112,169,0.22)", borderRadius:"7px", padding:"16px 18px", marginBottom:"18px" }}>
                  <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:"14px", color:C.steel, marginBottom:"10px", fontWeight:600 }}>
                    {commitStr}
                  </div>
                  {result.body.map((line, i) => (
                    <div key={i} style={{ color:C.lightBlue, fontFamily:"'JetBrains Mono', monospace", fontSize:"12px", lineHeight:1.85 }}>
                      — {line}
                    </div>
                  ))}
                </div>

                {/* Meta grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  {[
                    { label:"Type",       value:result.type,                  color: tc?.text },
                    { label:"Scope",      value:result.scope ?? "none",       color: C.inkMid },
                    { label:"Confidence", value:`${result.confidence}%`,      color: result.confidence > 80 ? C.steel : "#6E5A1E" },
                    { label:"Mode",       value:mode === "ai" ? "AI ⚡" : "Rule-based", color: C.inkMid },
                  ].map(item => (
                    <div key={item.label} style={{ background:C.creamDark, border:`1px solid ${C.creamDeep}`, borderRadius:"5px", padding:"10px 13px" }}>
                      <div style={{ color:C.inkLight, fontFamily:"'JetBrains Mono', monospace", fontSize:"9px", letterSpacing:"0.1em", marginBottom:"4px" }}>
                        {item.label.toUpperCase()}
                      </div>
                      <div style={{ color:item.color, fontFamily:"'JetBrains Mono', monospace", fontSize:"13px", fontWeight:600 }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {commitStr && <CopyButton text={commitStr} label="⎘ COPY COMMIT MESSAGE" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
