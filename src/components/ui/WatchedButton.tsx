'use client';

import { motion } from 'framer-motion';
import type { SeriesId } from '@/types';
import { useStore } from '@/store';

interface WatchedButtonProps {
  /** Diary key — the RaceResult id */
  id: string;
  name: string;
  series: SeriesId;
  date: string;
  accentColor: string;
  /** Smaller variant for dense card headers */
  size?: 'sm' | 'md';
}

/**
 * Per-race "watched" toggle (feature 7). Eye icon → checkmark when watched.
 * Persists into the diary store with a denormalized snapshot so the DiaryView
 * survives after the source race scrolls out of the results feed.
 */
export default function WatchedButton({ id, name, series, date, accentColor, size = 'md' }: WatchedButtonProps) {
  const watched = useStore((s) => s.diary[id]?.watched ?? false);
  const toggleWatched = useStore((s) => s.toggleWatched);
  const dim = size === 'sm' ? 24 : 28;
  const icon = size === 'sm' ? 11 : 12;

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleWatched(id, { eventName: name, series, eventDate: date });
      }}
      className="rounded-full flex items-center justify-center transition-colors shrink-0"
      style={{
        width: dim,
        height: dim,
        background: watched ? `${accentColor}20` : 'var(--pw-glass-bg)',
        border: `1px solid ${watched ? accentColor : 'var(--pw-glass-border)'}`,
      }}
      whileTap={{ scale: 0.85 }}
      title={watched ? 'Watched — click to unmark' : 'Mark as watched'}
    >
      {watched ? (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="var(--pw-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </motion.button>
  );
}
