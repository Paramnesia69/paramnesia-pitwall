'use client';

import { useStore } from '@/store';

/**
 * Header toggle for Spoiler Shield. When on, podiums and session results are
 * blurred until the event is marked watched (or revealed per-card).
 */
export default function SpoilerShieldToggle() {
  const shield = useStore((s) => s.spoilerShield);
  const toggleSpoilerShield = useStore((s) => s.toggleSpoilerShield);
  const showToast = useStore((s) => s.showToast);

  return (
    <button
      onClick={() => {
        toggleSpoilerShield();
        showToast(shield ? 'Spoiler Shield off' : 'Spoiler Shield on — results hidden until watched');
      }}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: shield ? 'rgba(34,197,94,0.12)' : 'var(--pw-glass-bg)',
        border: `1px solid ${shield ? 'rgba(34,197,94,0.45)' : 'var(--pw-glass-border)'}`,
        color: shield ? '#22c55e' : 'var(--pw-text-tertiary)',
      }}
      title={shield ? 'Spoiler Shield on — click to show results' : 'Spoiler Shield off — click to hide results until watched'}
      aria-label="Toggle Spoiler Shield"
    >
      {shield ? (
        /* Eye-off — results hidden */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        /* Eye — results visible */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}
