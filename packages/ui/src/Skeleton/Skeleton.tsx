import "./Skeleton.css";

export interface SkeletonProps {
  orientation?: "landscape" | "portrait";
}

/** Placeholder for a Card while its data or image hasn't arrived yet (NFR-16: failed/loading rails degrade to this, not a blank space). */
export function Skeleton({ orientation = "landscape" }: SkeletonProps) {
  const orientationClass = orientation === "portrait" ? "skeleton--portrait" : "skeleton--landscape";
  return <div className={`skeleton ${orientationClass}`} role="presentation" />;
}
