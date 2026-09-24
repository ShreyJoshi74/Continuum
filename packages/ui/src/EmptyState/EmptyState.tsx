import type { ReactNode } from "react";
import "./EmptyState.css";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** A failed rail degrades to a Skeleton first (NFR-16); EmptyState is for "loaded, but genuinely nothing here" — search with no results, an empty watchlist. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
