"use client";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "80px 0",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "0 32px",
        display: "flex", flexWrap: "wrap", justifyContent: "space-between",
        alignItems: "center", gap: "40px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "24px", height: "24px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "14px" }}>terminal</span>
          </div>
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>gitbun</span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "48px", fontSize: "14px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>
          {[
            { label: "GitHub", href: "https://github.com/nirvik34/gitbun" },
            { label: "npm", href: "https://www.npmjs.com/package/gitbun" },
            { label: "Discord", href: "#" },
            { label: "Terms", href: "#" },
          ].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
              style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
            >{link.label}</a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: "12px", color: "#4b5563", fontFamily: "'JetBrains Mono', monospace" }}>
          © 2025 Gitbun. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
