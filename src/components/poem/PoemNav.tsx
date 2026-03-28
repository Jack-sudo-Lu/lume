"use client";

interface PoemNavProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  dateLabel: string;
}

export function PoemNav({
  onPrev,
  onNext,
  canPrev,
  canNext,
  dateLabel,
}: PoemNavProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-6">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="p-2 text-text-tertiary hover:text-text-primary disabled:text-text-muted disabled:cursor-not-allowed transition-colors duration-150"
        aria-label="Previous day"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12 5L7 10L12 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="text-xs font-mono text-text-tertiary tracking-wider min-w-[160px] text-center">
        {dateLabel}
      </span>

      <button
        onClick={onNext}
        disabled={!canNext}
        className="p-2 text-text-tertiary hover:text-text-primary disabled:text-text-muted disabled:cursor-not-allowed transition-colors duration-150"
        aria-label="Next day"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M8 5L13 10L8 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
