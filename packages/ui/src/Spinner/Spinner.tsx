import "./Spinner.css";

export interface SpinnerProps {
  label?: string;
}

/** role="status" announces the label once when it appears, instead of a screen reader reading a spinning icon literally. */
export function Spinner({ label = "Loading" }: SpinnerProps) {
  return <span className="spinner" role="status" aria-label={label} />;
}
