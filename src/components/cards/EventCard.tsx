'use client';

import Image from 'next/image';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatDateISR, formatTimeISR } from '@/lib/events';
import { useStore } from '@/store';
import TiltCard from './TiltCard';
import Countdown from '@/components/ui/Countdown';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface EventCardProps {
  event: NormalizedRaceEvent;
}

function StateBadge({ state }: { state: string }) {
  if (state === 'live') {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#E10600' }}>
        <span className="pw-live-dot" style={{ width: 6, height: 6 }} />
        Live
      </span>
    );
  }
  if (state === 'starting_soon') {
    return (
      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
        Soon
      </span>
    );
  }
  return null;
}

export default function EventCard({ event }: EventCardProps) {
  const meta = SERIES_META[event.series];
  const openEvent = useStore((s) => s.openEvent);
  const nextSession = event.sessions.find((s) => s.state !== 'finished');
  const upcomingSessions = event.sessions.filter((s) => s.state !== 'finished').slice(0, 3);

  return (
    <div onClick={() => openEvent(event.id)}>
      <TiltCard accentColor={meta.accent}>

        {/* Header row */}
        <div className="flex items-center justify-between relative" style={{ transform: 'translateZ(20px)' }}>
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              color: meta.accent,
              background: `${meta.accent}15`,
            }}
          >
            {meta.logo && (
              <Image src={meta.logo} alt="" width={14} height={14} className="inline-block" />
            )}
            {meta.name}
          </span>
          <div className="flex items-center gap-2">
            <StateBadge state={event.state} />
            <span className="text-[11px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
              {formatDateISR(event.startDate)}
            </span>
          </div>
        </div>

        {/* Event name — parallax layer */}
        <div style={{ transform: 'translateZ(30px)' }}>
          <h4 className="text-lg font-semibold tracking-tight leading-tight">{event.name}</h4>
          <p className="text-sm mt-1" style={{ color: 'var(--pw-text-secondary)' }}>
            {event.circuit.name} — {event.circuit.country}
          </p>
        </div>

        {/* Countdown for next session */}
        {nextSession && event.state !== 'live' && (
          <div style={{ transform: 'translateZ(15px)' }}>
            <Countdown targetDate={nextSession.startTime} compact />
          </div>
        )}

        {/* Session times */}
        {upcomingSessions.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono" style={{ color: 'var(--pw-text-tertiary)', transform: 'translateZ(10px)' }}>
            {upcomingSessions.map((s, i) => (
              <span key={i} className="flex items-center gap-1">
                {s.state === 'live' && <span className="pw-live-dot" style={{ width: 5, height: 5 }} />}
                <span style={{ color: s.state === 'live' ? '#E10600' : undefined }}>{s.name}</span>
                <span>{formatTimeISR(s.startTime)}</span>
              </span>
            ))}
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-auto pt-2" style={{ transform: 'translateZ(25px)' }}>
          <button
            className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-white/10"
            style={{
              background: 'var(--pw-glass-bg)',
              border: '1px solid var(--pw-glass-border)',
              color: 'var(--pw-text-secondary)',
            }}
          >
            Details
          </button>
          <div className="flex-1" />
          <FavoriteButton series={event.series} accentColor={meta.accent} />
        </div>
      </TiltCard>
    </div>
  );
}
