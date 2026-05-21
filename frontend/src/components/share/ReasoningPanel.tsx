import { C } from "@/styles/palette";
import TypeBadge from "@/components/ui/TypeBadge";

interface ReasoningPanelProps {
  type: string;
  scope: string;
  provider: string;
  model: string;
  reasoning: string;
  expiresAt: number | null;
}

function formatExpiry(expiresAt: number | null): string {
  if (!expiresAt) return "—";
  const ms = expiresAt - Date.now();
  if (ms <= 0) return "expired";
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (hours >= 1) return `expires in ${hours}h`;
  const minutes = Math.max(1, Math.floor(ms / (60 * 1000)));
  return `expires in ${minutes}m`;
}

export default function ReasoningPanel({
  type,
  scope,
  provider,
  model,
  reasoning,
  expiresAt,
}: ReasoningPanelProps) {
  return (
    <aside
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "20px 24px",
        color: C.cream,
        fontFamily: "'Inter', system-ui, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <TypeBadge type={type} />
        <span style={{ color: "rgba(239,236,227,0.6)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
          scope: {scope || "—"}
        </span>
      </div>

      <h2 style={{ margin: "8px 0 12px", fontSize: "16px", fontWeight: 600 }}>
        Why this message
      </h2>
      <p style={{ margin: 0, fontSize: "14px", color: "rgba(239,236,227,0.85)" }}>
        {reasoning}
      </p>

      <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "20px 0" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          columnGap: "12px",
          rowGap: "6px",
          fontSize: "12px",
          color: "rgba(239,236,227,0.6)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <span>provider</span>
        <span>{provider}</span>
        <span>model</span>
        <span>{model}</span>
        <span>link</span>
        <span>{formatExpiry(expiresAt)}</span>
      </div>
    </aside>
  );
}
