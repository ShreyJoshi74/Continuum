import type { HTMLAttributes, ReactNode } from "react";
import "./FocusRing.css";

export interface FocusRingProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Makes arbitrary non-native-interactive content (a custom thumbnail, a
 * hand-rolled control) keyboard-focusable and gives it the same focus
 * treatment Button/IconButton use — without every future component
 * reimplementing the outline+glow rule. Prefer a real <button> when you
 * can; reach for this only when the element genuinely can't be one.
 */
export function FocusRing({ className, children, tabIndex = 0, ...props }: FocusRingProps) {
  const classes = ["focus-ring", className].filter(Boolean).join(" ");
  return (
    <div className={classes} tabIndex={tabIndex} {...props}>
      {children}
    </div>
  );
}
