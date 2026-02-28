"use client";
import { useState, useEffect, useRef } from "react";




function ScrollFeature({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold: 0.8,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      style={{
        fontSize: "clamp(28px, 4.5vw, 56px)",
        fontWeight: 700,
        lineHeight: 1.3,
        color: isActive ? "#fff" : "#262626",
        marginBottom: "8px",
        transition: "color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
    >
      {text}
    </p>
  );
}

export default function Hero() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g gitbun");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 32px 160px" }}>
      {/* Hero text */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "4px 12px", borderRadius: "9999px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "12px", fontWeight: 500, color: "#93c5fd",
          marginBottom: "32px",
        }}>
          <span style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
            <span className="ping" style={{
              position: "absolute", inset: 0,
              borderRadius: "50%", background: "#93c5fd", opacity: 0.75,
            }} />
            <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }} />
          </span>
          Powered by local AI via Ollama
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(48px, 8vw, 96px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          marginBottom: "32px",
          maxWidth: "900px",
        }}>
          Commit messages<br />as easy as snapshots
        </h1>

        {/* Subtext */}
        <p style={{
          color: "#9ca3af", fontSize: "20px", maxWidth: "560px",
          marginBottom: "48px", fontWeight: 300, lineHeight: 1.6,
        }}>
          Transform complex code diffs into clean, professional, and descriptive commit messages using high-performance AI. Built for the modern terminal workflow.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "128px", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="https://www.npmjs.com/package/gitbun"
            target="_blank" rel="noreferrer"
            style={{
              background: "#fff", color: "#000",
              padding: "16px 32px", borderRadius: "9999px",
              fontSize: "17px", fontWeight: 700,
              textDecoration: "none",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Install npm package
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </a>
          <a
            href="https://github.com/nirvik34/gitbun"
            target="_blank" rel="noreferrer"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "16px 32px", borderRadius: "9999px",
              fontSize: "17px", fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Terminal 3D */}
      <div style={{ perspective: "2000px", maxWidth: "900px", margin: "0 auto 160px", position: "relative" }}>
        {/* Glow */}
        <div style={{
          position: "absolute", bottom: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "80%", height: "160px",
          background: "rgba(63,131,248,0.2)",
          filter: "blur(60px)", borderRadius: "50%",
          zIndex: -1, opacity: 0.5,
        }} />
        <div className="terminal-float" style={{
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 50px 100px -20px rgba(0,0,0,0.6), 0 30px 60px -30px rgba(0,0,0,0.5), 0 0 40px rgba(63,131,248,0.08)",
          transform: "rotateX(15deg) rotateY(-10deg) rotateZ(2deg)",
        }}>
          {/* Terminal titlebar */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => (
                <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            <span className="jetbrains" style={{ fontSize: "11px", color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              zsh — 144x40
            </span>
          </div>

          {/* Terminal body */}
          <div className="jetbrains" style={{ padding: "32px", minHeight: "380px", fontSize: "14px" }}>
            {/* git status */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ color: "#3b82f6" }}>➜</span>
              <span style={{ color: "#fff" }}>~/projects/gitbun</span>
              <span style={{ color: "#6b7280" }}>git status</span>
            </div>
            <div style={{ color: "#6b7280", marginLeft: "24px", marginBottom: "24px", lineHeight: 1.8 }}>
              modified:&nbsp;&nbsp; src/core/generator.ts<br />
              modified:&nbsp;&nbsp; package.json
            </div>

            {/* gitbun command */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              <span style={{ color: "#3b82f6" }}>➜</span>
              <span style={{ color: "#fff" }}>~/projects/gitbun</span>
              <span style={{ color: "#fff" }}>gitbun</span>
            </div>

            {/* AI suggestion box */}
            <div style={{
              background: "rgba(59,130,246,0.08)",
              borderLeft: "2px solid #3b82f6",
              padding: "24px",
              borderRadius: "0 8px 8px 0",
              marginBottom: "24px",
            }}>
              <div style={{ color: "#60a5fa", marginBottom: "8px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                AI Suggestion
              </div>
              <div style={{ color: "#fff", fontSize: "15px", marginBottom: "16px" }}>
                feat(core): implement adaptive token limit based on diff size
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8 }}>
                <div>• Added calculateTokenLimit helper in generator.ts</div>
                <div>• Updated dependencies for better context handling</div>
              </div>
            </div>

            {/* Confirm prompt */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#6b7280" }}>? Confirm commit? (Y/n)</span>
              <span className="cursor-blink" style={{ width: "8px", height: "18px", background: "#fff", display: "inline-block" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Install CTA */}
      <section style={{ paddingBottom: "128px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "32px" }}>
            Ready to automate your workflow?
          </h2>
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "8px",
            width: "100%", maxWidth: "520px",
            transition: "border-color 0.2s",
          }}>
            <div className="jetbrains" style={{
              flex: 1, padding: "12px 24px",
              color: "#60a5fa", textAlign: "left",
            }}>
              <span style={{ opacity: 0.5, userSelect: "none", marginRight: "8px" }}>$</span>
              npm install -g gitbun
            </div>
            <button
              onClick={handleCopy}
              title="Copy"
              style={{
                padding: "12px", borderRadius: "10px",
                background: "transparent", border: "none",
                color: copied ? "#4ade80" : "#9ca3af",
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Scrolling text features */}
      <section style={{ padding: "160px 0" }}>
        <div style={{ maxWidth: "900px" }}>
          {[
            "Intelligent diff analysis for every language.",
            "Supports conventional commits by default.",
            "Seamless integration with your existing CLI.",
            "Privacy first: your code never leaves the session.",
            "Customizable prompts for your team's style.",
          ].map((text, i) => (
            <ScrollFeature key={i} text={text} />
          ))}
        </div>
      </section>

      {/* How it works cards */}
      <section style={{ padding: "0 0 128px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {[
            {
              step: "01", title: "Stage changes",
              icon: "add_task",
              text: "Run your usual git add command. Gitbun looks at what's in your staging area to understand the context.",
            },
            {
              step: "02", title: "Run gitbun",
              icon: "auto_awesome",
              text: "Type gitbun and let the AI analyze your diff. It generates a semantic message in milliseconds.",
            },
            {
              step: "03", title: "Done",
              icon: "check_circle",
              text: "Review the generated message, hit Enter, and your commit is pushed. No more context switching.",
            },
          ].map(card => (
            <div key={card.step}
              style={{
                padding: "40px",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                display: "flex", flexDirection: "column", gap: "24px",
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: "rgba(63,131,248,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="material-symbols-outlined" style={{
                  color: "#3b82f6",
                  fontSize: "22px",
                }}>{card.icon}</span>
              </div>
              <div>
                <h3 style={{ fontSize: "19px", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.01em" }}>
                  {card.step} {card.title}
                </h3>
                <p style={{
                  color: "#9ca3af",
                  lineHeight: 1.6, fontSize: "15px", fontWeight: 400,
                }}>
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
