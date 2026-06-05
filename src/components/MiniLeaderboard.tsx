'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useStore } from '@/store';
import { getCountryFlag } from '@/lib/countryFlag';
import type { LiveSessionInfo } from '@/lib/useLiveSessions';

interface Props {
  sessions: LiveSessionInfo[];
}

function logoFilter(logo: string): string {
  return logo.includes('porsche') ? 'brightness(0) invert(1)' : 'grayscale(1) contrast(2) brightness(3)';
}

export default function MiniLeaderboard({ sessions }: Props) {
  const [expanded, setExpanded] = useState(true);
  const openEvent = useStore((s) => s.openEvent);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[190]"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      exit={{ y: 80 }}
      transition={{ type: 'spring', stiffness: 280, damping: 32 }}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(6, 6, 11, 0.94)',
        borderTop: '1px solid var(--pw-glass-border)',
      }}
    >
      {/* ── Collapsed header bar ─────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-11">
        {/* Live dot + label */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E10600' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#E10600' }} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#E10600' }}>
            Live Now
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
            · {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Collapsed: series pills */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              className="flex items-center gap-2 flex-1 overflow-hidden min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {sessions.map((s) => (
                <button
                  key={s.eventId}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md shrink-0 transition-opacity hover:opacity-80"
                  style={{ background: `${s.accent}14`, border: `1px solid ${s.accent}35` }}
                  onClick={() => openEvent(s.eventId)}
                  title={`${s.eventName} — ${s.sessionName}`}
                >
                  {s.logo ? (
                    <div className="relative shrink-0" style={{ width: 20, height: 13 }}>
                      <Image
                        src={s.logo}
                        alt={s.series}
                        fill
                        className="object-contain"
                        style={{ filter: logoFilter(s.logo), mixBlendMode: 'screen' }}
                      />
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold uppercase" style={{ color: s.accent }}>{s.series}</span>
                  )}
                  <span className="text-[10px] font-medium" style={{ color: 'var(--pw-text-secondary)' }}>
                    {s.sessionName}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        {/* Expand / collapse toggle */}
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] hover:opacity-70 transition-opacity shrink-0"
          style={{ color: 'var(--pw-text-tertiary)' }}
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse live panel' : 'Expand live panel'}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.25s', transform: expanded ? 'none' : 'rotate(180deg)' }}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* ── Expanded session cards ───────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <div
              className="flex gap-3 px-4 pt-1 pb-4 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {sessions.map((s) => {
                const flag = getCountryFlag(s.countryCode);
                const isLive = s.state === 'live';

                return (
                  <motion.button
                    key={s.eventId}
                    className="flex-shrink-0 p-3 rounded-xl text-left w-56 relative overflow-hidden cursor-pointer"
                    style={{
                      background: `${s.accent}0c`,
                      border: `1px solid ${s.accent}28`,
                      boxShadow: `0 0 20px ${s.accent}10`,
                    }}
                    whileHover={{ scale: 1.02, boxShadow: `0 0 28px ${s.accent}25` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    onClick={() => openEvent(s.eventId)}
                  >
                    {/* Accent glow */}
                    <div
                      className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl pointer-events-none"
                      style={{ background: s.accent, opacity: 0.18 }}
                    />

                    {/* Header: series logo + live/soon pill */}
                    <div className="flex items-center justify-between mb-2 relative">
                      {s.logo ? (
                        <div className="relative" style={{ width: 36, height: 22 }}>
                          <Image
                            src={s.logo}
                            alt={s.series}
                            fill
                            className="object-contain"
                            style={{ filter: logoFilter(s.logo), mixBlendMode: 'screen', opacity: 0.9 }}
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: s.accent }}>
                          {s.series}
                        </span>
                      )}

                      <span
                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: isLive ? '#E10600' : '#FFB800' }}
                      >
                        <span
                          className="rounded-full shrink-0"
                          style={{ width: 5, height: 5, background: isLive ? '#E10600' : '#FFB800', display: 'inline-block' }}
                        />
                        {isLive ? 'Live' : 'Soon'}
                      </span>
                    </div>

                    {/* Event info */}
                    <p className="text-sm font-semibold leading-snug mb-0.5 relative">
                      {s.eventName}
                    </p>
                    <p className="text-[10px] relative" style={{ color: 'var(--pw-text-tertiary)' }}>
                      {flag && <span className="mr-1">{flag}</span>}
                      {s.circuitName}
                    </p>

                    {/* Session name with accent stripe */}
                    <div
                      className="mt-2.5 pt-2 flex items-center gap-2 relative"
                      style={{ borderTop: `1px solid ${s.accent}20` }}
                    >
                      <span className="w-0.5 h-3.5 rounded-full shrink-0" style={{ background: s.accent }} />
                      <span className="text-xs font-semibold" style={{ color: s.accent }}>
                        {s.sessionName}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
