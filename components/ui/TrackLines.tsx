/** Abstract oval-track motif — a simple geometric mark, not decorative noise. */
export function TrackLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="300" cy="210" rx="270" ry="120" stroke="var(--border-strong)" strokeWidth="1.5" />
      <ellipse cx="300" cy="210" rx="210" ry="90" stroke="var(--border-strong)" strokeWidth="1.5" />
      <ellipse cx="300" cy="210" rx="150" ry="60" stroke="var(--accent)" strokeWidth="2" opacity="0.9" />
      <ellipse cx="300" cy="210" rx="90" ry="30" stroke="var(--border)" strokeWidth="1.5" />
    </svg>
  );
}
