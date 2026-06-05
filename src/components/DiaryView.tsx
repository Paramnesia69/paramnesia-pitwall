'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import { ALL_RESULTS_2026 } from '@/data/results-2026';
import { useStore } from '@/store';
import SeriesBadge from '@/components/ui/SeriesBadge';
import StarRating from '@/components/ui/StarRating';

interface DiaryViewProps {
  activeFilter?: SeriesId | 'all';
}

/**
 * Race Diary (feature 5) — chronological list of logged races (watched / rated / noted).
 * Reads from the persisted diary store using the denormalized snapshot, so entries
 * survive after their source race scrolls out of the live results feed. Clicking an
 * entry re-opens the result overlay when the race is still in the static result set.
 */
export default function DiaryView({ activeFilter = 'all' }: DiaryViewProps) {
  const diary = useStore((s) => s.diary);
  const openResult = useStore((s) => s.openResult);
  const removeDiaryEntry = useStore((s) => s.removeDiaryEntry);
  const [expanded, setExpanded] = useState(true);

  const entries = useMemo(() => {
    return Object.entries(diary)
      .filter(([, e]) => e.watched || e.rating || (e.note && e.note.trim()))
      .filter(([, e]) => activeFilter === 'all' || e.series === activeFilter)
      .sort((a, b) => new Date(b[1].updatedAt).getTime() - new Date(a[1].updatedAt).getTime());
  }, [diary, activeFilter]);

  if (entries.length === 0) return null;

  const reopen = (id: string) => {
    const result = ALL_RESULTS_2026.find((r) => r.id === id);
    if (result) openResult(result);
  };

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 150, damping: 20 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--pw-text-tertiary)' }}>
          Race Diary
          <span className="ml-2 font-mono">({entries.length})</span>
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {entries.map(([id, e]) => {
                const meta = e.series ? SERIES_META[e.series] : null;
                const accent = meta?.accent ?? 'var(--pw-accent)';
                const inResultSet = ALL_RESULTS_2026.some((r) => r.id === id);
                return (
                  <div
                    key={id}
                    onClick={() => inResultSet && reopen(id)}
                    className="pw-glass p-3 flex items-center gap-3 group"
                    style={{
                      borderLeft: `2px solid ${accent}`,
                      cursor: inResultSet ? 'pointer' : 'default',
                    }}
                  >
                    {e.series && <SeriesBadge series={e.series} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{e.eventName ?? 'Race'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {e.eventDate && (
                          <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
                            {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {e.watched && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Watched
                          </span>
                        )}
                      </div>
                      {e.note && e.note.trim() && (
                        <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--pw-text-secondary)' }}>
                          {e.note}
                        </p>
                      )}
                    </div>
                    {e.rating ? <StarRating value={e.rating} size={12} /> : null}
                    <button
                      onClick={(ev) => { ev.stopPropagation(); removeDiaryEntry(id); }}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                      style={{ color: 'var(--pw-text-tertiary)' }}
                      title="Remove from diary"
                    >
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
