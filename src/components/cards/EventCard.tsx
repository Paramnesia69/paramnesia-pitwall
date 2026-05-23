'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatDateISR, formatTimeISR } from '@/lib/events';
import { useStore } from '@/store';
import TiltCard from './TiltCard';
import Countdown from '@/components/ui/Countdown';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { WeatherBadgeCompact } from '@/components/ui/WeatherBadge';
import ReminderButton from '@/components/ui/ReminderButton';

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

export default memo(function EventCard({ event }: EventCardProps) {
  const meta = SERIES_META[event.series];
  const openEvent = useStore((s) => s.openEvent);
  const nextSession = event.sessions.find((s) => s.state !== 'finished');
  const upcomingSessions = event.sessions.filter((s) => s.state !== 'finished').slice(0, 3);

  return (
    <div className="h-full" onClick={() => openEvent(event.id)}>
      <TiltCard accentColor={meta.accent}>

        {/* Faded series logo — background watermark */}
        {meta.logo && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 w-44 h-44 pointer-events-none select-none"
            style={{
              opacity: 0.18,
              zIndex: 0,
              maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
            }}
          >
            <Image
              src={meta.logo}
              alt=""
              fill
              className="object-contain"
              style={{ filter: 'grayscale(1) contrast(2) brightness(3)', mixBlendMode: 'screen' }}
            />
          </div>
        )}

        {/* Header row */}
        <div className="flex items-center justify-between gap-2 flex-wrap relative" style={{ transform: 'translateZ(20px)' }}>
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap shrink-0"
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
          <div className="flex items-center gap-2 ml-auto">
            <StateBadge state={event.state} />
            {event.weather && <WeatherBadgeCompact weather={event.weather} />}
            <span className="text-[11px] font-mono whitespace-nowrap" style={{ color: 'var(--pw-text-tertiary)' }}>
              {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Jerusalem' })}
            </span>
          </div>
        </div>

        {/* Override note banner */}
        {event.overrides?.note && (
          <div
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded -mx-1"
            style={{
              background: event.state === 'delayed' ? '#FFB80015' : event.state === 'cancelled' ? '#E1060015' : `${meta.accent}10`,
              border: `1px solid ${event.state === 'delayed' ? '#FFB80030' : event.state === 'cancelled' ? '#E1060030' : `${meta.accent}20`}`,
              color: event.state === 'delayed' ? '#FFB800' : event.state === 'cancelled' ? '#E10600' : meta.accent,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {event.overrides.note}
          </div>
        )}

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
                {s.state !== 'live' && (
                  <ReminderButton
                    eventId={event.id}
                    eventName={event.name}
                    sessionName={s.name}
                    sessionStart={s.startTime}
                    accentColor={meta.accent}
                  />
                )}
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
          {event.streamLinks.length > 0 && (() => {
            const primary = event.streamLinks.find((l) => l.type === 'official') ?? event.streamLinks[0];
            return (
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-[1.05]"
                style={{
                  background: `${meta.accent}15`,
                  border: `1px solid ${meta.accent}30`,
                  color: meta.accent,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M10 8l6 4-6 4V8z" />
                </svg>
                Watch
              </a>
            );
          })()}
          <div className="flex-1" />
          <FavoriteButton series={event.series} accentColor={meta.accent} />
        </div>
      </TiltCard>
    </div>
  );
})
