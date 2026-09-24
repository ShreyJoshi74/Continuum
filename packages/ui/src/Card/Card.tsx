import type { ButtonHTMLAttributes } from "react";
import { Badge } from "../Badge/Badge.js";
import "./Card.css";

export interface CardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  imageUrl: string;
  imageAlt?: string;
  orientation?: "landscape" | "portrait";
  /** Only the first two render (FR-03: "up to two badges") — this is enforced, not just documented. */
  badges?: string[];
}

/**
 * The catalogue's one repeating unit. A native <button> so it's keyboard-
 * and D-pad-operable for free — M3's focus engine will move `focus()` onto
 * these, it doesn't need to reimplement activation. Windowed rendering
 * (mounting ~60 of these regardless of catalogue size) is M2's job; this
 * component has no opinion on how many of it exist at once.
 */
export function Card({
  title,
  imageUrl,
  imageAlt,
  orientation = "landscape",
  badges = [],
  className,
  ...props
}: CardProps) {
  const orientationClass = orientation === "portrait" ? "card--portrait" : "card--landscape";
  const classes = ["card", orientationClass, className].filter(Boolean).join(" ");
  const visibleBadges = badges.slice(0, 2);

  return (
    <button className={classes} {...props}>
      <img className="card__image" src={imageUrl} alt={imageAlt ?? ""} loading="lazy" />
      {visibleBadges.length > 0 && (
        <span className="card__badges">
          {visibleBadges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </span>
      )}
      <span className="card__title">{title}</span>
    </button>
  );
}
