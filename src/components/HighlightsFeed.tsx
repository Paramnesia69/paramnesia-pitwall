'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { HighlightItem, SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import SeriesBadge from '@/components/ui/SeriesBadge';

interface HighlightsFeedProps {
  items: HighlightItem[];
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

function HighlightCard({
  item,
  index,
  onOpen,
}: {
  item: HighlightItem;
  index: number;
  onOpen: (item: HighlightItem) => void;
}) {
  const accent = item.series?.[0]
    ? SERIES_META[item.series[0]]?.accent ?? 'var(--pw-accent)'
    : 'var(--pw-accent)';

  return (
    <motion.button
      onClick={() => onOpen(item)}
      className="group block w-full text-left pw-glass overflow-hidden transition-all duration-200 hover:scale-[1.01]"
      style={{ borderColor: 'var(--pw-glass-border)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ borderColor: accent }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnailUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Dark gradient for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(6,6,11,0.55) 0%, transparent 45%)',
          }}
        />
        {/* Play glyph */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
            style={{
              width: 48,
              height: 48,
              background: `${accent}E6`,
              boxShadow: `0 4px 20px ${accent}66`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" aria-hidden>
              <path d="M5 3.5v11l9-5.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
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
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1 h-1 rounded-full" style={{ background: accent }} />
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: 'var(--pw-text-tertiary)' }}
          >
            {item.source}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: HighlightItem;
  onClose: () => void;
}) {
  // Lock scroll + Escape-to-close while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const accent = item.series?.[0]
    ? SERIES_META[item.series[0]]?.accent ?? 'var(--pw-accent)'
    : 'var(--pw-accent)';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Player panel */}
      <motion.div
        className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="pointer-events-auto w-full max-w-3xl pw-glass overflow-hidden"
          style={{ borderColor: `${accent}55` }}
          initial={{ scale: 0.94, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-1 h-5 rounded-full" style={{ background: accent }} />
            <div className="min-w-0 flex-1">
              <h4
                className="text-sm font-semibold leading-snug truncate"
                style={{ color: 'var(--pw-text-primary)' }}
              >
                {item.title}
              </h4>
              <span
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--pw-text-tertiary)' }}
              >
                {item.source}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: 'var(--pw-text-secondary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {/* Embed */}
          <div className="relative aspect-video bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function HighlightsFeed({ items }: HighlightsFeedProps) {
  const searchParams = useSearchParams();
  const activeFilter = (searchParams.get('series') ?? 'all') as SeriesId | 'all';

  const [expanded, setExpanded] = useState(true);
  const [showCount, setShowCount] = useState(6);
  const [active, setActive] = useState<HighlightItem | null>(null);

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
      transition={{ delay: 0.25, type: 'spring', stiffness: 150, damping: 20 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          Race Highlights
          <span className="ml-2 font-mono">({filtered.length})</span>
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
            exit={{ overflow: 'hidden', height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {filtered.length === 0 ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
                  No highlights for this series yet.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visible.map((item, i) => (
                    <HighlightCard key={item.id} item={item} index={i} onOpen={setActive} />
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

      <AnimatePresence>
        {active && <Lightbox key={active.id} item={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </motion.section>
  );
}
