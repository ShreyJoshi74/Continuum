import type { ReactNode } from "react";
import "./Badge.css";

export interface BadgeProps {
  variant?: "neutral" | "brand";
  children: ReactNode;
}

/** A small label — "4K", "NEW", "S2 E4" — never a focus target. */
export function Badge({ variant = "neutral", children }: BadgeProps) {
  const variantClass = variant === "brand" ? "badge--brand" : "badge--neutral";

  return <span className={`badge ${variantClass}`}>{children}</span>;
}
