import type { ReactNode } from "react";
import "./GridCell.css";

export interface GridCellProps {
  children: ReactNode;
}

/**
 * One cell in a paginated CSS grid — the genre-browse layout (FR-06) reuses
 * the same Card component as rails, just arranged in rows instead of one
 * scrolling track. Genre browse itself lands in M5; this is the primitive
 * it will be built on, built now while Card already exists.
 */
export function GridCell({ children }: GridCellProps) {
  return <div className="grid-cell">{children}</div>;
}
