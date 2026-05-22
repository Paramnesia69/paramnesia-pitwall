'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatDateISR, formatTimeISR } from '@/lib/events';
import { getCircuitImage } from '@/lib/images';
import { getCircuitStats } from '@/lib/circuitStats';
import { useStore } from '@/store';
import Countdown from '@/components/ui/Countdown';
import CircuitStatsPanel from '@/components/ui/CircuitStatsPanel';

interface EventDetailOverlayProps {
  events: NormalizedRaceEvent[];
}

function generateCalendarUrl(event: NormalizedRaceEvent, session: NormalizedRaceEvent['sessions'][0]): string {
  const start = new Date(session.startTime);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = encodeURIComponent(`${event.name} — ${session.name}`);
  const location = encodeURIComponent(`${event.circuit.name}, ${event.circuit.country}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&location=${location}`;
}

export default function EventDetailOverlay({ events }: EventDetailOverlayProps) {
  const { selectedEventId, closeEvent } = useStore();
  const event = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    if (selectedEventId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedEventId]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeEvent();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeEvent]);

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            style={{ zIndex: 'var(--pw-z-overlay)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEvent}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-[520px] overflow-y-auto"
            style={{ zIndex: 'var(--pw-z-modal)', background: 'var(--pw-bg-elevated)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Hero image area */}
            <div className="relative h-48 overflow-hidden">
              {getCircuitImage(event.circuit.name) ? (
                <>
                  <Image
                    src={getCircuitImage(event.circuit.name)!}
                    alt={event.circuit.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--pw-bg-elevated)] to-transparent" />
                </>
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${SERIES_META[event.series].accent}30 0%, var(--pw-bg-elevated) 100%)`,
                  }}
                />
              )}

              {/* Close button */}
              <button
                onClick={closeEvent}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 -mt-6 relative">
              {/* Series badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                  style={{
                    color: SERIES_META[event.series].accent,
                    background: `${SERIES_META[event.series].accent}18`,
                    border: `1px solid ${SERIES_META[event.series].accent}30`,
                  }}
                >
                  {SERIES_META[event.series].logo && (
                    <Image src={SERIES_META[event.series].logo!} alt="" width={16} height={16} />
                  )}
                  {SERIES_META[event.series].name}
                </span>
                {event.state === 'live' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase" style={{ color: '#E10600' }}>
                    <span className="pw-live-dot" style={{ width: 6, height: 6 }} />
                    Live
                  </span>
                )}
                {event.state === 'starting_soon' && (
                  <span className="text-[11px] font-bold uppercase" style={{ color: '#FFB800' }}>Starting Soon</span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight mb-1">{event.name}</h2>
              <p className="text-sm mb-1" style={{ color: 'var(--pw-text-secondary)' }}>
                {event.circuit.name} — {event.circuit.country}
              </p>
              <p className="text-xs font-mono mb-6" style={{ color: 'var(--pw-text-tertiary)' }}>
                {formatDateISR(event.startDate)} – {formatDateISR(event.endDate)} · Israel Time
              </p>

              {/* Countdown to next session */}
              {(() => {
                const next = event.sessions.find((s) => s.state !== 'finished');
                if (!next) return null;
                return (
                  <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                      {event.state === 'live' ? 'Current Session' : `Countdown to ${next.name}`}
                    </p>
                    <Countdown targetDate={next.startTime} />
                  </div>
                );
              })()}

              {/* Sessions list */}
              <div className="mb-6">
                <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
                  Sessions
                </h4>
                <div className="space-y-2">
                  {event.sessions.map((session, i) => (
                    <div
                      key={i}
                      className="pw-glass p-3 flex items-center justify-between"
                      style={{
                        opacity: session.state === 'finished' ? 0.5 : 1,
                        borderColor: session.state === 'live' ? 'rgba(225,6,0,0.4)' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {session.state === 'live' && <span className="pw-live-dot" style={{ width: 6, height: 6 }} />}
                        <span className="text-sm font-medium">{session.name}</span>
                        {session.state === 'finished' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: 'var(--pw-text-tertiary)', background: 'var(--pw-glass-bg)' }}>
                            Done
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono" style={{ color: 'var(--pw-text-secondary)' }}>
                          {formatTimeISR(session.startTime)}
                        </span>
                        {session.state !== 'finished' && (
                          <a
                            href={generateCalendarUrl(event, session)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-white/10"
                            style={{ color: 'var(--pw-text-tertiary)', border: '1px solid var(--pw-glass-border)' }}
                            title="Add to Google Calendar"
                          >
                            +Cal
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watch / stream links */}
              {event.streamLinks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
                    Watch
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.streamLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full transition-all duration-200 hover:scale-[1.03]"
                        style={{
                          background: link.type === 'official'
                            ? `${SERIES_META[event.series].accent}12`
                            : link.type === 'youtube'
                            ? 'rgba(255,0,0,0.08)'
                            : 'var(--pw-glass-bg)',
                          border: `1px solid ${
                            link.type === 'official'
                              ? `${SERIES_META[event.series].accent}30`
                              : link.type === 'youtube'
                              ? 'rgba(255,0,0,0.2)'
                              : 'var(--pw-glass-border)'
                          }`,
                          color: link.type === 'official'
                            ? SERIES_META[event.series].accent
                            : link.type === 'youtube'
                            ? '#FF4444'
                            : 'var(--pw-text-secondary)',
                        }}
                      >
                        {link.type === 'youtube' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                          </svg>
                        )}
                        {link.type === 'official' && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="M10 8l6 4-6 4V8z" />
                          </svg>
                        )}
                        {link.type === 'broadcast' && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                            <polyline points="17 2 12 7 7 2" />
                          </svg>
                        )}
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Circuit info with stats */}
              {(() => {
                const stats = getCircuitStats(event.circuit.name);
                if (stats) {
                  return (
                    <CircuitStatsPanel
                      stats={stats}
                      circuitName={event.circuit.name}
                      accentColor={SERIES_META[event.series].accent}
                    />
                  );
                }
                return (
                  <div className="pw-glass p-4 relative overflow-hidden">
                    <h4 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                      Circuit
                    </h4>
                    <p className="text-sm font-medium">{event.circuit.name}</p>
                    <p className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>
                      {event.circuit.country} · {event.circuit.lat.toFixed(2)}°, {event.circuit.lng.toFixed(2)}°
                    </p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
