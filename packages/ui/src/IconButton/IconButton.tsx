import type { ButtonHTMLAttributes, ReactNode } from "react";
import "../FocusRing/FocusRing.css";
import "./IconButton.css";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  /**
   * Required, not optional: an icon-only control has no visible text for a
   * screen reader to announce, so a caller cannot leave this out — the
   * absence would be a silent accessibility regression rather than a type
   * error.
   */
  "aria-label": string;
}

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  const classes = ["icon-btn", "focus-ring", className].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {icon}
    </button>
  );
}
