"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const C = {
    bg: "#0A0A0A",
    cardBg: "#0D0D0D",
    border: "rgba(255,255,255,0.08)",
    accent: "#3F83F8",
    text: "#EDEDED",
    textMuted: "#9ca3af",
    textDark: "#6b7280",
};

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll("section[id]").forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const menuItems = [
        {
            title: "Getting Started",
            items: [
                { label: "Introduction", id: "introduction" },
                { label: "Installation", id: "installation" },
                { label: "Quick Start", id: "quick-start" },
            ],
        },
        {
            title: "Usage & Guides",
            items: [
                { label: "Basic Commands", id: "usage" },
                { label: "CLI Flags", id: "options" },
                { label: "Configuration", id: "configuration" },
            ],
        },
        {
            title: "Core Concepts",
            items: [
                { label: "AI Backends", id: "ai-backends" },
                { label: "Features", id: "features" },
            ],
        },
        {
            title: "Development",
            items: [
                { label: "Contributing", id: "development" },
                { label: "Testing", id: "testing" },
                { label: "CI/CD Workflow", id: "cicd" },
            ],
        },
        {
            title: "Reference",
            items: [
                { label: "CLI Reference", id: "cli-reference" },
                { label: "Exit Codes", id: "exit-codes" },
            ],
        },
    ];

    return (
        <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header style={{
                position: "fixed", top: 0, width: "100%", zIndex: 50,
                background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${C.border}`,
                height: "64px",
            }}>
                <div style={{ maxWidth: "1440px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                        <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "32px", height: "32px", background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "#000", fontSize: "20px", fontWeight: "bold" }}>terminal</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: "20px", letterSpacing: "-0.02em" }}>Gitbun</span>
                        </Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link href="/" style={{ color: "black", background: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
                            Home
                        </Link>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px", display: "flex" }}>
                {/* Sidebar */}
                <aside style={{
                    width: "260px", position: "fixed", top: "64px", bottom: 0,
                    borderRight: `1px solid ${C.border}`,
                    paddingTop: "32px", overflowY: "auto",
                }}>
                    <nav style={{ paddingBottom: "40px" }}>
                        {menuItems.map((group) => (
                            <div key={group.title} style={{ marginBottom: "32px" }}>
                                <h5 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", marginBottom: "16px" }}>{group.title}</h5>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {group.items.map((item) => (
                                        <li key={item.id} style={{ marginBottom: "6px" }}>
                                            <a
                                                href={`#${item.id}`}
                                                style={{
                                                    textDecoration: "none", fontSize: "14px",
                                                    color: activeSection === item.id ? C.accent : C.textDark,
                                                    fontWeight: activeSection === item.id ? 600 : 400,
                                                    transition: "color 0.2s",
                                                    display: "block", padding: "4px 0"
                                                }}
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, marginLeft: "280px", paddingTop: "64px", paddingBottom: "100px" }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 0" }}>

                        {/* Introduction */}
                        <section id="introduction" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <p style={{ color: C.accent, fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px" }}>Guide</p>
                            <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "24px" }}>Getting Started</h1>
                            <p style={{ fontSize: "20px", color: C.textMuted, lineHeight: 1.6, fontWeight: 300, marginBottom: "32px" }}>
                                Gitbun is an open-source AI CLI tool that streamlines your git workflow by generating intelligent commit messages instantly.
                            </p>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px", marginTop: "48px" }}>Introduction</h2>
                            <p style={{ color: C.textDark, lineHeight: 1.7, marginBottom: "24px" }}>
                                Gitbun generates intelligent commit messages from staged diffs using AI or heuristics. It analyzes your code changes to understand the intent and scope, ensuring your commit history remains clean, professional, and descriptive without the manual effort.
                            </p>
                        </section>

                        {/* Installation */}
                        <section id="installation" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Installation</h2>
                            <p style={{ color: C.textDark, marginBottom: "24px" }}>Install Gitbun globally using your favorite package manager to access it from any repository.</p>
                            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                                <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "10px", color: C.textDark, fontFamily: "monospace" }}>GLOBAL INSTALL</span>
                                </div>
                                <div style={{ padding: "20px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>
                                    <span style={{ color: C.accent }}># install via npm</span><br />
                                    <span style={{ color: "#fff" }}>npm install -g gitbun</span>
                                </div>
                            </div>
                        </section>

                        {/* Quick Start */}
                        <section id="quick-start" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Quick Start</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                                {[
                                    { step: 1, title: "Stage changes", desc: "Add files to your git staging area.", cmd: "git add ." },
                                    { step: 2, title: "Run Gitbun", desc: "Generate a message based on staged diff.", cmd: "gitbun" },
                                    { step: 3, title: "Commit", desc: "Apply the generated message.", cmd: "git commit -m \"...\"" },
                                ].map(s => (
                                    <div key={s.step} style={{ display: "flex", gap: "20px" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(63,131,248,0.1)", border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: C.accent }}>{s.step}</div>
                                        <div>
                                            <h4 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{s.title}</h4>
                                            <p style={{ fontSize: "14px", color: C.textDark, marginBottom: "8px" }}>{s.desc}</p>
                                            <code style={{ background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", color: C.accent, fontFamily: "monospace" }}>{s.cmd}</code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Basic Commands */}
                        <section id="usage" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Basic Commands</h2>
                            <p style={{ color: C.textDark, marginBottom: "24px" }}>Gitbun provides a simple set of commands to manage your commit workflow.</p>
                            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", lineHeight: 2 }}>
                                <div><span style={{ color: C.accent }}>gitbun</span> <span style={{ color: C.textDark }}># Generate message for current staged diff</span></div>
                                <div><span style={{ color: C.accent }}>gitbun --amend</span> <span style={{ color: C.textDark }}># Regenerate and replace last commit message</span></div>
                                <div><span style={{ color: C.accent }}>gitbun --config</span> <span style={{ color: C.textDark }}># Interactive configuration menu</span></div>
                                <div><span style={{ color: C.accent }}>gitbun --version</span> <span style={{ color: C.textDark }}># Show current version</span></div>
                            </div>
                        </section>

                        {/* Flags */}
                        <section id="options" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>CLI Flags</h2>
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                                    <thead style={{ background: "rgba(255,255,255,0.03)" }}>
                                        <tr>
                                            <th style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, color: C.textDark }}>Flag</th>
                                            <th style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, color: C.textDark }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { flag: "--ai", desc: "Force use of AI models (Default)" },
                                            { flag: "--no-ai", desc: "Use local heuristic summarizers (Offline)" },
                                            { flag: "--interactive, -i", desc: "Choose from multiple generated suggestions" },
                                            { flag: "--prompt", desc: "Provide custom instructions for the AI" },
                                            { flag: "--help, -h", desc: "Show help information" },
                                        ].map(f => (
                                            <tr key={f.flag}>
                                                <td style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, color: C.accent, fontFamily: "monospace" }}>{f.flag}</td>
                                                <td style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, color: C.textDark }}>{f.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Configuration */}
                        <section id="configuration" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Configuration</h2>
                            <p style={{ color: C.textDark, marginBottom: "24px" }}>
                                Configure Gitbun globally via <code style={{ color: C.accent }}>~/.gitbunrc</code> or per-project via <code style={{ color: C.accent }}>.gitbunrc</code>.
                            </p>
                            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px" }}>
                                <pre style={{ margin: 0 }}>
                                    <span style={{ color: "#fff" }}>{`{`}</span>{"\n"}
                                    {"  "}<span style={{ color: "#60a5fa" }}>"useAI"</span>: <span style={{ color: "#fb923c" }}>true</span>,{"\n"}
                                    {"  "}<span style={{ color: "#60a5fa" }}>"backend"</span>: <span style={{ color: "#4ade80" }}>"local"</span>,{"\n"}
                                    {"  "}<span style={{ color: "#60a5fa" }}>"model"</span>: <span style={{ color: "#4ade80" }}>"llama3"</span>,{"\n"}
                                    {"  "}<span style={{ color: "#60a5fa" }}>"conventional"</span>: <span style={{ color: "#fb923c" }}>true</span>{"\n"}
                                    <span style={{ color: "#fff" }}>{`}`}</span>
                                </pre>
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>Environment Variables</h3>
                            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "16px", fontFamily: "monospace", fontSize: "13px" }}>
                                <div style={{ color: C.textDark }}># For remote backends (OpenAI)</div>
                                <div style={{ color: "#fff" }}>export OPENAI_API_KEY="sk-..."</div>
                            </div>
                        </section>

                        {/* AI Backends */}
                        <section id="ai-backends" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>AI Backends</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div style={{ padding: "24px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="material-symbols-outlined" style={{ color: C.accent, fontSize: "18px" }}>terminal</span>
                                        Local (Ollama)
                                    </h4>
                                    <p style={{ fontSize: "13px", color: C.textDark, lineHeight: 1.6 }}>Ideal for privacy. Run Llama 3 or Mistral on your personal hardware with zero latency and cost.</p>
                                </div>
                                <div style={{ padding: "24px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="material-symbols-outlined" style={{ color: C.accent, fontSize: "18px" }}>cloud</span>
                                        Remote APIs
                                    </h4>
                                    <p style={{ fontSize: "13px", color: C.textDark, lineHeight: 1.6 }}>Connect to GPT-4o or Claude for complex diff reasoning and higher quality suggestions.</p>
                                </div>
                            </div>
                        </section>

                        {/* Features */}
                        <section id="features" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Core Features</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                                {[
                                    { icon: "psychology", title: "AI Generation", desc: "Summarize thousands of lines of code changes into concise, accurate commit headers and bodies." },
                                    { icon: "offline_bolt", title: "Heuristic Mode", desc: "No internet? No problem. Rule-based local summarizers work instantly without APIs." },
                                    { icon: "history", title: "Amend Helper", desc: "Forgot a detail? Regenerate your last commit message instantly with --amend." },
                                    { icon: "format_list_bulleted", title: "Conventional Commits", desc: "Automatic categorization into 'feat', 'fix', 'refactor', and more based on code intent." },
                                ].map(f => (
                                    <div key={f.title} style={{ padding: "24px", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
                                        <span className="material-symbols-outlined" style={{ color: C.accent, fontSize: "24px", marginBottom: "16px", display: "block" }}>{f.icon}</span>
                                        <h4 style={{ fontWeight: 700, marginBottom: "8px", color: "#fff" }}>{f.title}</h4>
                                        <p style={{ fontSize: "13px", color: C.textDark, lineHeight: 1.6 }}>{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Development & Contributing */}
                        <section id="development" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Contributing</h2>
                            <p style={{ color: C.textDark, lineHeight: 1.7, marginBottom: "24px" }}>
                                We welcome contributions! Gitbun is built with Node.js and TypeScript. Follow our standard workflow to get started:
                            </p>
                            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px" }}>
                                <ol style={{ margin: 0, paddingLeft: "16px", color: C.textDark, fontSize: "14px", lineHeight: 2 }}>
                                    <li><strong>Fork the repo:</strong> Create your own copy of the repository.</li>
                                    <li><strong>Branch:</strong> Create a feature branch (<code style={{ color: C.accent }}>feat/my-feature</code>).</li>
                                    <li><strong>Code:</strong> Implement your changes and ensure they follow our linting rules.</li>
                                    <li><strong>PR:</strong> Submit a pull request with a detailed summary of changes.</li>
                                </ol>
                            </div>
                        </section>

                        {/* Testing */}
                        <section id="testing" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Testing</h2>
                            <p style={{ color: C.textDark, marginBottom: "24px" }}>
                                Gitbun uses <strong>Vitest</strong> for unit and integration testing. Always run tests before submitting a PR.
                            </p>
                            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "13px" }}>
                                <div style={{ color: C.accent }}># Run all tests</div>
                                <div style={{ color: "#fff", marginBottom: "16px" }}>npm test</div>
                                <div style={{ color: C.accent }}># Run in watch mode</div>
                                <div style={{ color: "#fff" }}>npm run test:watch</div>
                            </div>
                        </section>

                        {/* CI/CD */}
                        <section id="cicd" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>CI/CD Workflow</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {[
                                    { title: "GitHub Actions", desc: "Automated test suites runner on every push and PR across multiple environments." },
                                    { title: "Semantic Release", desc: "Automated versioning and npm package publishing based on commit messages." },
                                    { title: "Husky", desc: "Pre-commit hooks to ensure code is linted and tested before it leaves your machine." },
                                ].map(item => (
                                    <div key={item.title} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px" }}>
                                        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{item.title}</h4>
                                        <p style={{ fontSize: "13px", color: C.textDark }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CLI Reference */}
                        <section id="cli-reference" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>CLI Reference</h2>
                            <p style={{ color: C.textDark, marginBottom: "24px" }}>Detailed reference for individual CLI command behaviors.</p>
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
                                <div style={{ padding: "20px", background: C.cardBg }}>
                                    <p style={{ fontSize: "14px", color: "#fff", marginBottom: "12px", fontWeight: 700 }}>gitbun [options]</p>
                                    <p style={{ fontSize: "13px", color: C.textDark, lineHeight: 1.6 }}>
                                        Analyzes the output of <code style={{ color: C.accent }}>git diff --cached</code> to generate a commit message. If no changes are staged, it will prompt you to stage them.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Exit Codes */}
                        <section id="exit-codes" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
                            <h2 style={{ fontSize: "24px", fontWeight: 700, borderBottom: `1px solid ${C.border}`, paddingBottom: "8px", marginBottom: "24px" }}>Exit Codes</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {[
                                    { code: 0, desc: "Operation successful." },
                                    { code: 1, desc: "General CLI error or crash." },
                                    { code: 2, desc: "API failure (Network or Auth)." },
                                    { code: 130, desc: "Process cancelled by user (Ctrl+C)." },
                                ].map(ec => (
                                    <div key={ec.code} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px", border: `1px solid ${C.border}`, borderRadius: "8px" }}>
                                        <div style={{ padding: "4px 12px", background: "white", color: "black", fontWeight: 900, fontSize: "12px", borderRadius: "4px", minWidth: "48px", textAlign: "center" }}>{ec.code}</div>
                                        <div style={{ fontSize: "14px", color: C.textDark }}>{ec.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </main>
            </div>

            <footer style={{ marginLeft: "260px", borderTop: `1px solid ${C.border}`, padding: "64px 0" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", color: C.textDark, fontSize: "13px", fontFamily: "monospace" }}>
                    Built by developers, for developers. © 2025 Gitbun
                </div>
            </footer>
        </div>
    );
}
