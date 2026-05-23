'use client';

import { useState, useEffect } from 'react';

interface LiveIndicatorProps {
  lastUpdated: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

/**
 * Subtle indicator showing when data was last refreshed.
 * Shows a spinning icon during refresh, and relative time otherwise.
 */
export default function LiveIndicator({ lastUpdated, isRefreshing, onRefresh }: LiveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;

    const update = () => {
      const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (seconds < 10) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    };

    update();
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <button
      onClick={onRefresh}
      className="flex items-center gap-1.5 text-[10px] font-mono transition-opacity hover:opacity-80"
      style={{ color: 'var(--pw-text-tertiary)' }}
      title="Click to refresh"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isRefreshing ? 'animate-spin' : ''}
      >
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
      {isRefreshing ? 'Updating…' : timeAgo || 'Live'}
    </button>
  );
}
