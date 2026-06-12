'use client';

import type { ReactNode } from 'react';

interface SpoilerBlurProps {
  /** When true the content is blurred behind a reveal button */
  hidden: boolean;
  onReveal: () => void;
  children: ReactNode;
}

/**
 * Spoiler Shield wrapper — blurs result content until the event is watched
 * or the user explicitly reveals this block.
 */
export default function SpoilerBlur({ hidden, onReveal, children }: SpoilerBlurProps) {
  if (!hidden) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className="pointer-events-none select-none"
        style={{ filter: 'blur(10px)' }}
        aria-hidden
      >
        {children}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReveal();
        }}
        className="absolute inset-0 flex items-center justify-center"
        aria-label="Reveal spoilers"
      >
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: 'rgba(6, 6, 11, 0.85)',
            border: '1px solid var(--pw-glass-border)',
            color: 'var(--pw-text-secondary)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          Tap to reveal
        </span>
      </button>
    </div>
  );
}
