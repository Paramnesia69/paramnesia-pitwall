'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { PodcastEpisode, SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import SeriesBadge from '@/components/ui/SeriesBadge';

interface PodcastsFeedProps {
  items: PodcastEpisode[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

/** Hydration-safe relative time — empty on server, relative string on client */
function TimeAgo({ date }: { date: string }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    setLabel(timeAgo(date));
  }, [date]);
  return (
    <span
      className="text-[10px] font-mono whitespace-nowrap shrink-0"
      style={{ color: 'var(--pw-text-tertiary)' }}
    >
      {label}
    </span>
  );
}

function EpisodeCard({ item, index }: { item: PodcastEpisode; index: number }) {
  const accent = item.series?.[0]
    ? SERIES_META[item.series[0]]?.accent ?? 'var(--pw-accent)'
    : 'var(--pw-accent)';

  return (
    <motion.div
      className="pw-glass p-3 transition-all duration-200"
      style={{ borderColor: 'var(--pw-glass-border)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ borderColor: accent }}
    >
      <div className="flex gap-3">
        {/* Artwork */}
        <div
          className="relative shrink-0 rounded-lg overflow-hidden"
          style={{ width: 64, height: 64, background: 'var(--pw-glass-bg)' }}
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: accent }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4zM6 12a6 6 0 0 0 12 0M12 18v3" stroke="currentColor" strokeWidth="0" />
                <rect x="9" y="2" width="6" height="13" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 18v3M9 21h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              {item.series?.map((s) => (
                <SeriesBadge key={s} series={s} />
              ))}
            </div>
            <TimeAgo date={item.publishedAt} />
          </div>
          <h4
            className="text-sm font-semibold leading-snug line-clamp-2"
            style={{ color: 'var(--pw-text-primary)' }}
          >
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[10px] font-medium uppercase tracking-wider truncate"
              style={{ color: 'var(--pw-text-tertiary)' }}
            >
              {item.source}
            </span>
            {item.durationLabel && (
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                style={{ background: `${accent}1A`, color: accent }}
              >
                {item.durationLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Inline player */}
      <audio
        controls
        preload="none"
        src={item.audioUrl}
        className="w-full mt-3 h-9"
        style={{ colorScheme: 'dark' }}
      />
    </motion.div>
  );
}

export default function PodcastsFeed({ items }: PodcastsFeedProps) {
  const searchParams = useSearchParams();
  const activeFilter = (searchParams.get('series') ?? 'all') as SeriesId | 'all';

  const [expanded, setExpanded] = useState(true);
  const [showCount, setShowCount] = useState(6);
  const collapseRef = useRef<HTMLDivElement>(null);

  // Reset pagination when filter changes
  useEffect(() => {
    setShowCount(6);
  }, [activeFilter]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter((item) => item.series?.includes(activeFilter));
  }, [items, activeFilter]);

  const visible = filtered.slice(0, showCount);
  const hasMore = filtered.length > showCount;

  if (items.length === 0) return null;

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 20 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          Podcasts
          <span className="ml-2 font-mono">({filtered.length})</span>
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <button
          onClick={() => {
            if (expanded && collapseRef.current) collapseRef.current.style.overflow = 'hidden';
            setExpanded(!expanded);
          }}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            ref={collapseRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onAnimationStart={() => { if (collapseRef.current) collapseRef.current.style.overflow = 'hidden'; }}
            onAnimationComplete={() => { if (collapseRef.current) collapseRef.current.style.overflow = 'visible'; }}
          >
            {filtered.length === 0 ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
                  No podcasts for this series yet.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {visible.map((item, i) => (
                    <EpisodeCard key={item.id} item={item} index={i} />
                  ))}
                </div>

                {hasMore && (
                  <motion.div
                    className="flex justify-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={() => setShowCount((c) => c + 6)}
                      className="text-xs font-medium px-5 py-2 rounded-full transition-all duration-200 hover:scale-105"
                      style={{
                        background: 'var(--pw-glass-bg)',
                        border: '1px solid var(--pw-glass-border)',
                        color: 'var(--pw-text-secondary)',
                      }}
                    >
                      Show more ({filtered.length - showCount} remaining)
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
