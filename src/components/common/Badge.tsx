import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`c-badge c-badge--${tone}`}>{children}</span>;
}
