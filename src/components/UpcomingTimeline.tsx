'use client';

import { motion } from 'framer-motion';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatDateISR } from '@/lib/events';
import { useStore } from '@/store';
import Countdown from '@/components/ui/Countdown';
import SeriesBadge from '@/components/ui/SeriesBadge';
import { getCountryFlag } from '@/lib/countryFlag';

interface UpcomingTimelineProps {
  events: NormalizedRaceEvent[];
}

export default function UpcomingTimeline({ events }: UpcomingTimelineProps) {
  const openEvent = useStore((s) => s.openEvent);
  if (events.length === 0) return null;

  let lastDate = '';

  return (
    <motion.section
      className="mt-10 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--pw-text-tertiary)' }}>
          Coming Up — Next 2 Weeks
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
      </div>

      <div className="relative pl-6 border-l border-[var(--pw-glass-border)]">
        {events.map((event, i) => {
          const meta = SERIES_META[event.series];
          const dateStr = formatDateISR(event.startDate);
          const showDate = dateStr !== lastDate;
          lastDate = dateStr;
          const nextSession = event.sessions.find((s) => s.state !== 'finished');

          return (
            <motion.div
              key={event.id}
              className="relative mb-4 last:mb-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, type: 'spring', stiffness: 200, damping: 22 }}
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: event.state === 'live' ? '#E10600' : meta.accent,
                  background: event.state === 'live' ? '#E10600' : 'var(--pw-bg-primary)',
                  boxShadow: event.state === 'live' ? '0 0 8px rgba(225,6,0,0.5)' : 'none',
                }}
              />

              {/* Date label */}
              {showDate && (
                <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--pw-text-tertiary)' }}>
                  {dateStr}
                </div>
              )}

              {/* Event row */}
              <motion.div
                className="pw-glass p-3 flex items-center gap-3 cursor-pointer group transition-all"
                style={{
                  borderLeft: `3px solid ${meta.accent}55`,
                  '--pw-hover-border': `${meta.accent}40`,
                  '--pw-hover-shadow': `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${meta.accent}40, 0 0 20px ${meta.accent}15`,
                } as React.CSSProperties}
                onClick={() => openEvent(event.id)}
              >
                <SeriesBadge series={event.series} size="sm" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{event.name}</h4>
                  <p className="text-[11px] truncate" style={{ color: 'var(--pw-text-tertiary)' }}>
                    {getCountryFlag(event.circuit.countryCode) && <span className="mr-1">{getCountryFlag(event.circuit.countryCode)}</span>}{event.circuit.name} — {event.circuit.country}
                  </p>
                </div>
                <div className="shrink-0">
                  {event.state === 'live' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: '#E10600' }}>
                      <span className="pw-live-dot" style={{ width: 5, height: 5 }} />
                      Live
                    </span>
                  ) : nextSession ? (
                    <Countdown targetDate={nextSession.startTime} compact />
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
