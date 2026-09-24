import "./ProgressBar.css";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

/** e.g. watch progress on a "Continue watching" card. The fill width is a computed percentage, not a token — percentages have no density curve to belong to. */
export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
