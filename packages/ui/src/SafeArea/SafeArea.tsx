import type { ReactNode } from "react";
import "./SafeArea.css";

export interface SafeAreaProps {
  children: ReactNode;
}

/**
 * Applied once at the app shell (FR-24) — 0 padding on web, 5% on TV
 * (--safe-inset-*), so a TV's overscan never crops the outermost content.
 * Individual rails already inset their own track (Rail.css), but the shell
 * is what protects page-level chrome (a future control bar, headers) that
 * sits outside any rail.
 */
export function SafeArea({ children }: SafeAreaProps) {
  return <div className="safe-area">{children}</div>;
}
