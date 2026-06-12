'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useStore } from '@/store';
import type { LiveSessionInfo } from '@/lib/useLiveSessions';

interface Props {
  sessions: LiveSessionInfo[];
}

function logoFilter(logo: string): string {
  return logo.includes('porsche') ? 'brightness(0) invert(1)' : 'grayscale(1) contrast(2) brightness(3)';
}

export default function WhatsLiveBadge({ sessions }: Props) {
  const [idx, setIdx] = useState(0);
  const openEvent = useStore((s) => s.openEvent);

  if (sessions.length === 0) return null;

  const current = sessions[Math.min(idx, sessions.length - 1)];
  const isStartingSoon = current.state === 'starting_soon';
  const dotColor = isStartingSoon ? '#FFB800' : '#E10600';
  const hasMultiple = sessions.length > 1;

  return (
    <motion.div
      className="fixed z-[200] flex flex-col items-end gap-1.5"
      style={{
        bottom: 'calc(64px + env(safe-area-inset-bottom))',
        right: 'calc(16px + env(safe-area-inset-right))',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Multi-session nav */}
      {hasMultiple && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono select-none"
          style={{ background: 'var(--pw-glass-bg)', border: '1px solid var(--pw-glass-border)', color: 'var(--pw-text-tertiary)' }}
        >
          <button
            className="hover:opacity-70 active:opacity-60 transition-opacity px-2 py-1.5 -my-1.5"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + sessions.length) % sessions.length); }}
            aria-label="Previous live session"
          >‹</button>
          <span>{idx + 1} / {sessions.length}</span>
          <button
            className="hover:opacity-70 active:opacity-60 transition-opacity px-2 py-1.5 -my-1.5"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % sessions.length); }}
            aria-label="Next live session"
          >›</button>
        </div>
      )}

      {/* Badge */}
      <motion.button
        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl cursor-pointer"
        style={{
          background: `${current.accent}12`,
          border: `1px solid ${current.accent}40`,
          boxShadow: `0 0 24px ${current.accent}18, 0 4px 20px rgba(0,0,0,0.55)`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        onClick={() => openEvent(current.eventId)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        title={`${current.eventName} — ${current.sessionName}`}
      >
        {/* Pulse dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {!isStartingSoon && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: dotColor }}
            />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: dotColor }} />
        </span>

        {/* Series logo */}
        {current.logo && (
          <div className="relative shrink-0" style={{ width: 28, height: 18 }}>
            <Image
              src={current.logo}
              alt={current.series}
              fill
              className="object-contain"
              style={{ filter: logoFilter(current.logo), mixBlendMode: 'screen' }}
            />
          </div>
        )}

        {/* Text */}
        <div className="text-left leading-none">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.14em] mb-[3px]"
            style={{ color: dotColor }}
          >
            {isStartingSoon ? 'Starting Soon' : 'Live'}
          </p>
          <p className="text-[11px] font-semibold" style={{ color: 'var(--pw-text-primary)' }}>
            {current.sessionName}
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
}
