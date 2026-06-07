'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { NormalizedNewsItem, SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import SeriesBadge from '@/components/ui/SeriesBadge';

interface NewsFeedProps {
  items: NormalizedNewsItem[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

/** Hydration-safe relative time — renders nothing on server, relative string on client */
function TimeAgo({ date }: { date: string }) {
  const [label, setLabel] = useState<string>('');
  useEffect(() => {
    setLabel(timeAgo(date));
    const interval = setInterval(() => setLabel(timeAgo(date)), 60000);
    return () => clearInterval(interval);
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


function NewsItem({ item, index }: { item: NormalizedNewsItem; index: number }) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block pw-glass p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{ borderColor: 'var(--pw-glass-border)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{
        borderColor: item.series?.[0]
          ? SERIES_META[item.series[0]]?.accent ?? 'var(--pw-accent)'
          : 'var(--pw-accent)',
      }}
    >
      {/* Top row: series badges + time */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {item.series?.map((s) => (
            <SeriesBadge key={s} series={s} />
          ))}
        </div>
        <TimeAgo date={item.publishedAt} />
      </div>

      {/* Title */}
      <h4
        className="text-sm font-semibold leading-snug mb-1.5 transition-colors"
        style={{ color: 'var(--pw-text-primary)' }}
      >
        {item.title}
      </h4>

      {/* Summary */}
      <p
        className="text-xs leading-relaxed line-clamp-2"
        style={{ color: 'var(--pw-text-secondary)' }}
      >
        {item.summary}
      </p>

      {/* Source */}
      <div className="flex items-center gap-2 mt-2.5">
        <div
          className="w-1 h-1 rounded-full"
          style={{
            background: item.series?.[0]
              ? SERIES_META[item.series[0]]?.accent ?? 'var(--pw-accent)'
              : 'var(--pw-accent)',
          }}
        />
        <span
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          {item.source}
        </span>
        {/* External link indicator */}
        <svg
          className="w-2.5 h-2.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          <path d="M4 1h7v7M11 1L1 11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.a>
  );
}

export default function NewsFeed({ items }: NewsFeedProps) {
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
          Latest News
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
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
                  No news for this series yet.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visible.map((item, i) => (
                    <NewsItem key={item.id} item={item} index={i} />
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
