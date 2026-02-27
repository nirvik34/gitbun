import { TYPE_COLORS } from "@/constants/typeColors";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export default function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const tc = TYPE_COLORS[type] ?? TYPE_COLORS.feat;
  const fontSize = size === "sm" ? "9px" : "10px";
  const padding  = size === "sm" ? "2px 8px" : "2px 10px";

  return (
    <span
      style={{
        background:    tc.bg,
        border:        `1px solid ${tc.border}`,
        color:         tc.text,
        padding,
        borderRadius:  "3px",
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize,
        letterSpacing: "0.08em",
        whiteSpace:    "nowrap",
        display:       "inline-block",
      }}
    >
      {type}
    </span>
  );
}
