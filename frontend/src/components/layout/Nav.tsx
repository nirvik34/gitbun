"use client";

export default function Nav() {
  const copyInstall = () => {
    navigator.clipboard.writeText("npm install -g gitbun");
  };

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "24px 32px",
      maxWidth: "1280px",
      margin: "0 auto",
      width: "100%",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "32px", height: "32px",
          background: "#fff",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span className="material-symbols-outlined" style={{ color: "#000", fontSize: "18px" }}>terminal</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em" }}>gitbun</span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px", fontWeight: 500, color: "#9ca3af" }}>
        <a href="https://github.com/nirvik34/gitbun" target="_blank" rel="noreferrer"
          style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
        >Documentation</a>
        <a href="https://www.npmjs.com/package/gitbun" target="_blank" rel="noreferrer"
          style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
        >Pricing</a>
        <a href="https://github.com/nirvik34/gitbun/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer"
          style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
        >Changelog</a>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <a href="https://github.com/nirvik34/gitbun" target="_blank" rel="noreferrer"
          style={{ fontSize: "14px", fontWeight: 500, color: "#fff", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
          onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
        >Sign in</a>
        <button
          onClick={copyInstall}
          style={{
            background: "#fff", color: "#000",
            padding: "8px 20px", borderRadius: "9999px",
            fontSize: "14px", fontWeight: 700,
            border: "none", cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#e5e7eb")}
          onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
        >
          Install npm package
        </button>
      </div>
    </nav>
  );
}
