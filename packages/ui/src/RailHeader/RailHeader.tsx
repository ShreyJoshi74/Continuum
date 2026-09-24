import type { ReactNode } from "react";
import "./RailHeader.css";

export interface RailHeaderProps {
  children: ReactNode;
}

/** A rail's title. One level below the page's own <h1>. */
export function RailHeader({ children }: RailHeaderProps) {
  return <h2 className="rail-header">{children}</h2>;
}
