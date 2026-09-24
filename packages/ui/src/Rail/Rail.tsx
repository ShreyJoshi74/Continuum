import { Children, type ReactNode } from "react";
import { RailHeader } from "../RailHeader/RailHeader.js";
import "./Rail.css";

export interface RailProps {
  title: string;
  children: ReactNode;
}

/**
 * Presentational shell only: every child is mounted, always. Windowed
 * rendering — only the rails and cards intersecting the viewport (plus
 * overscan) actually mounted — is packages/virtual's job and lands in M2.
 * This component doesn't know virtualization exists yet; that's
 * deliberate, so the M1 exit bar (no density branches, tokens only) stays
 * true independent of M2's rendering strategy.
 */
export function Rail({ title, children }: RailProps) {
  return (
    <section className="rail" aria-label={title}>
      <RailHeader>{title}</RailHeader>
      <div className="rail__track">
        {Children.map(children, (child, index) => (
          <div className="rail__item" key={index}>
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
