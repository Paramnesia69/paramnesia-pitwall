'use client';

interface StarRatingProps {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  color?: string;
}

/**
 * 5-star rating. Read-only when no `onChange` is passed (card display),
 * interactive otherwise (diary editor in the result overlay).
 */
export default function StarRating({ value, onChange, size = 12, color = '#FFB800' }: StarRatingProps) {
  const interactive = typeof onChange === 'function';
  return (
    <div className="flex items-center gap-0.5" style={{ pointerEvents: interactive ? 'auto' : 'none' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={(e) => {
              e.stopPropagation();
              // Clicking the current rating again clears it
              onChange?.(value === n ? 0 : n);
            }}
            className={interactive ? 'p-1 -m-0.5 transition-transform hover:scale-110 active:scale-95' : ''}
            style={{ lineHeight: 0, cursor: interactive ? 'pointer' : 'default' }}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <svg width={size} height={size} viewBox="0 0 24 24"
              fill={filled ? color : 'none'}
              stroke={filled ? color : 'var(--pw-text-tertiary)'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
