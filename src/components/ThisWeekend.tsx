'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatTimeISR } from '@/lib/events';
import { useStore } from '@/store';
import Countdown from '@/components/ui/Countdown';
import SeriesBadge from '@/components/ui/SeriesBadge';
import { WeatherBadgeCompact } from '@/components/ui/WeatherBadge';
import { getCountryFlag } from '@/lib/countryFlag';

interface ThisWeekendProps {
  events: NormalizedRaceEvent[];
}

function getDayLabel(event: NormalizedRaceEvent): string {
  const nextSession = event.sessions.find((s) => s.state !== 'finished');
  const date = nextSession ? new Date(nextSession.startTime) : new Date(event.startDate);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'Asia/Jerusalem' });
}

export default function ThisWeekend({ events }: ThisWeekendProps) {
  const openEvent = useStore((s) => s.openEvent);
  if (events.length === 0) return null;

  // Group events by their next session's day
  const groups: { label: string; events: NormalizedRaceEvent[] }[] = [];
  const seen = new Map<string, number>();
  for (const event of events) {
    const label = getDayLabel(event);
    if (seen.has(label)) {
      groups[seen.get(label)!].events.push(event);
    } else {
      seen.set(label, groups.length);
      groups.push({ label, events: [event] });
    }
  }

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 150, damping: 20 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--pw-text-tertiary)' }}>
          This Weekend in Motorsport
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
      </div>

      <div className="space-y-5">
        {groups.map(({ label, events: dayEvents }) => (
          <div key={label}>
            {/* Day separator */}
            <div className="flex items-center gap-2 mb-2.5">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: 'var(--pw-text-tertiary)' }}>
                {label}
              </p>
              <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dayEvents.map((event) => {
                const meta = SERIES_META[event.series];
                const nextSession = event.sessions.find((s) => s.state !== 'finished');
                const flag = getCountryFlag(event.circuit.countryCode);

                return (
                  <motion.div
                    key={event.id}
                    className="pw-glass p-4 cursor-pointer group relative overflow-hidden"
                    style={{
                      '--pw-hover-border': `${meta.accent}40`,
                      '--pw-hover-shadow': `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${meta.accent}40, 0 0 30px ${meta.accent}20`,
                      boxShadow: `0 0 20px ${meta.accent}15, 0 0 40px ${meta.accent}08`,
                      borderColor: `${meta.accent}25`,
                    } as React.CSSProperties}
                    whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${meta.accent}30, 0 0 60px ${meta.accent}15, 0 4px 24px rgba(0,0,0,0.4)` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={() => openEvent(event.id)}
                  >
                    {/* Accent glow */}
                    <div
                      className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
                      style={{ background: meta.accent }}
                    />

                    {/* Series + state */}
                    <div className="flex items-center justify-between mb-2 relative">
                      <SeriesBadge series={event.series} size="sm" />
                      <div className="flex items-center gap-2">
                        {event.weather && <WeatherBadgeCompact weather={event.weather} />}
                        {event.state === 'live' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: '#E10600' }}>
                            <span className="pw-live-dot" style={{ width: 5, height: 5 }} />
                            Live
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event name */}
                    <h4 className="text-sm font-semibold tracking-tight leading-snug mb-0.5">{event.name}</h4>
                    <p className="text-[11px] mb-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                      {flag && <span className="mr-1">{flag}</span>}{event.circuit.name}
                    </p>

                    {/* Next session countdown or time */}
                    {nextSession && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
                          {nextSession.name} {formatTimeISR(nextSession.startTime)}
                        </span>
                        <Countdown targetDate={nextSession.startTime} compact />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
