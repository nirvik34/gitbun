import { notFound } from "next/navigation";

import DiffView from "@/components/share/DiffView";
import ReasoningPanel from "@/components/share/ReasoningPanel";
import { getExpiry, getShare } from "@/lib/shareStore";
import { C } from "@/styles/palette";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const payload = getShare(id);
  if (!payload) notFound();

  const expiresAt = getExpiry(id);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: C.cream }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <header style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgba(239,236,227,0.45)" }}>
            gitbun · commit explainer
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "22px",
              lineHeight: 1.4,
              color: C.cream,
              wordBreak: "break-word",
            }}
          >
            {payload.message}
          </h1>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(239,236,227,0.35)" }}>
            {new Date(payload.createdAt).toUTCString()}
          </span>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <DiffView raw={payload.diff} />
          <ReasoningPanel
            type={payload.type}
            scope={payload.scope}
            provider={payload.provider}
            model={payload.model}
            reasoning={payload.reasoning}
            expiresAt={expiresAt}
          />
        </div>
      </div>
    </div>
  );
}
