'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatTimeISR } from '@/lib/events';
import { useStore } from '@/store';
import Countdown from '@/components/ui/Countdown';
import CircuitOutline from '@/components/ui/CircuitOutline';

interface ThisWeekendProps {
  events: NormalizedRaceEvent[];
}

export default function ThisWeekend({ events }: ThisWeekendProps) {
  const openEvent = useStore((s) => s.openEvent);
  if (events.length === 0) return null;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {events.map((event) => {
          const meta = SERIES_META[event.series];
          const nextSession = event.sessions.find((s) => s.state !== 'finished');

          return (
            <motion.div
              key={event.id}
              className="pw-glass p-4 cursor-pointer group"
              style={{
                '--pw-hover-border': `${meta.accent}40`,
                '--pw-hover-shadow': `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${meta.accent}40, 0 0 30px ${meta.accent}20`,
              } as React.CSSProperties}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => openEvent(event.id)}
            >
              {/* Circuit outline background */}
              <CircuitOutline
                circuitName={event.circuit.name}
                accentColor={meta.accent}
                className="absolute right-2 top-2 w-20 h-20 opacity-30 pointer-events-none"
              />

              {/* Series + state */}
              <div className="flex items-center justify-between mb-2 relative">
                <span
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ color: meta.accent, background: `${meta.accent}12` }}
                >
                  {meta.logo && (
                    <Image src={meta.logo} alt="" width={12} height={12} className="inline-block" />
                  )}
                  {meta.name}
                </span>
                {event.state === 'live' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: '#E10600' }}>
                    <span className="pw-live-dot" style={{ width: 5, height: 5 }} />
                    Live
                  </span>
                )}
              </div>

              {/* Event name */}
              <h4 className="text-sm font-semibold tracking-tight leading-snug mb-1">{event.name}</h4>
              <p className="text-[11px] mb-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                {event.circuit.name}
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
    </motion.section>
  );
}
