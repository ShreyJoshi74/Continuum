import { useId, type InputHTMLAttributes } from "react";
import "../FocusRing/FocusRing.css";
import "./TextField.css";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
}

/**
 * Label association is generated (useId), not left to the caller — the
 * same idea as IconButton's required aria-label, just enforced
 * structurally instead of at the type level: there's no `id` prop to
 * forget to wire up.
 */
export function TextField({ label, className, ...props }: TextFieldProps) {
  const id = useId();
  const classes = ["text-field__input", "focus-ring", className].filter(Boolean).join(" ");

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className={classes} {...props} />
    </div>
  );
}
