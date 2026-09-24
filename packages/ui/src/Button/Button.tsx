import type { ButtonHTMLAttributes, ReactNode } from "react";
import "../FocusRing/FocusRing.css";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

/**
 * The one Button for every surface. There is no `tv` variant: the same
 * markup renders at phone, desktop and TV density because every dimension
 * comes from a `var(--...)` token, not a literal value (see Button.css and
 * §9 rule 2). Zero density branches here is not a simplification — it's
 * the thing M1 exists to prove.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? "btn--primary" : "btn--secondary";
  const classes = ["btn", "focus-ring", variantClass, className].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
