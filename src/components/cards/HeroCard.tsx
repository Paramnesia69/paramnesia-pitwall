'use client';

import Image from 'next/image';
import { m as motion } from 'framer-motion';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatDateISR, formatTimeISR } from '@/lib/events';
import Countdown from '@/components/ui/Countdown';
import EnduranceTracker from '@/components/ui/EnduranceTracker';
import { WeatherBadgeCompact } from '@/components/ui/WeatherBadge';
import ReminderButton from '@/components/ui/ReminderButton';
import CircuitEmblem from '@/components/ui/CircuitEmblem';
import { getCountryFlag } from '@/lib/countryFlag';
import { getEnduranceDurationHours } from '@/lib/endurance';

interface HeroCardProps {
  event: NormalizedRaceEvent;
}

export default function HeroCard({ event }: HeroCardProps) {
  const meta = SERIES_META[event.series];
  const nextSession = event.sessions.find((s) => s.state !== 'finished');
  const flag = getCountryFlag(event.circuit.countryCode);

  // Endurance mode: while a long race runs, show elapsed/remaining instead of
  // a countdown (which targets the past and renders nothing during a race)
  const raceSession = event.sessions.find((s) => s.type === 'race' && s.state === 'live');
  const enduranceHours = raceSession ? getEnduranceDurationHours(raceSession.name) : null;

  return (
    <motion.section
      className="pw-glass relative overflow-hidden mb-8 p-6 sm:p-8 min-h-[320px] flex flex-col justify-end"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      {/* Large faded series logo — right side (the hero's primary watermark) */}
      {meta.logo && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none" style={{ width: '45%', maxWidth: 420, aspectRatio: '1' }}>
          <div className="relative w-full h-full" style={{
            opacity: 0.18,
            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
          }}>
            <Image
              src={meta.logo}
              alt=""
              fill
              className="object-contain"
              style={meta.logo === '/logos/porsche.svg' ? { filter: 'brightness(0) invert(1)' } : undefined}
              priority
            />
          </div>
        </div>
      )}

      {/* Gradient overlay with series accent — breathes slowly while live */}
      {event.state === 'live' ? (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${meta.accent} 0%, transparent 50%)`,
          }}
          animate={{ opacity: [0.16, 0.3, 0.16] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${meta.accent} 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Subtle corner glow */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${meta.accent}15 0%, transparent 70%)`,
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative">
        {/* Status + Series badge */}
        <motion.div
          className="flex items-center gap-3 mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {event.state === 'live' ? (
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#E10600' }}>
              <span className="pw-live-dot" />
              Live Now
            </span>
          ) : event.state === 'starting_soon' ? (
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#FFB800' }}>
              Starting Soon
            </span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: meta.accent }}>
              Next Up
            </span>
          )}
          <span
            className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ color: meta.accent, background: `${meta.accent}15` }}
          >
            {meta.name}
          </span>
        </motion.div>

        {/* Override note banner */}
        {event.overrides?.note && (
          <motion.div
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded mb-3 w-fit"
            style={{
              background: event.state === 'delayed' ? '#FFB80015' : event.state === 'cancelled' ? '#E1060015' : `${meta.accent}10`,
              border: `1px solid ${event.state === 'delayed' ? '#FFB80030' : event.state === 'cancelled' ? '#E1060030' : `${meta.accent}20`}`,
              color: event.state === 'delayed' ? '#FFB800' : event.state === 'cancelled' ? '#E10600' : meta.accent,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {event.overrides.note}
          </motion.div>
        )}

        {/* Event title — Orbitron (racy/motorsport) with a metallic sheen +
            light emboss. Sized down vs Geist since Orbitron runs wider. */}
        <motion.h2
          className="text-2xl sm:text-[2.5rem] font-extrabold mb-2 tracking-tight leading-[1.05]"
          style={{
            fontFamily: 'var(--font-orbitron), var(--pw-font-display)',
            backgroundImage: 'linear-gradient(180deg, #e7e9ef 0%, #b6bcc8 46%, #787e8b 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.55))',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 20 }}
        >
          {event.name}
        </motion.h2>

        {/* Circuit + dates — small tucked circuit emblem paired with the name */}
        <motion.div
          className="flex items-start gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CircuitEmblem circuitName={event.circuit.name} size={48} opacity={0.62} />
          <div className="min-w-0">
            <p style={{ color: 'var(--pw-text-secondary)' }} className="text-sm sm:text-base mb-1">
              {flag && <span className="mr-1">{flag}</span>}{event.circuit.name} — {event.circuit.country}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
                {formatDateISR(event.startDate)} – {formatDateISR(event.endDate)} · Israel Time
              </p>
              {event.weather && <WeatherBadgeCompact weather={event.weather} />}
            </div>
          </div>
        </motion.div>

        {/* Countdown / endurance tracker */}
        {raceSession && enduranceHours ? (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <EnduranceTracker
              startTime={raceSession.startTime}
              durationHours={enduranceHours}
              circuitName={event.circuit.name}
              accent={meta.accent}
            />
          </motion.div>
        ) : nextSession && event.state !== 'finished' && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--pw-text-tertiary)' }}>
              {event.state === 'live' ? 'Current Session' : `Next: ${nextSession.name}`}
            </p>
            <Countdown targetDate={nextSession.startTime} />
          </motion.div>
        )}

        {/* Sessions — aligned grid filling the hero width; Orbitron times */}
        {event.sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: 8, maxWidth: 680 }}
          >
            {event.sessions.map((s, i) => {
              const live = s.state === 'live';
              const finished = s.state === 'finished';
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg overflow-hidden"
                  style={{
                    background: live ? `${meta.accent}14` : 'var(--pw-glass-bg)',
                    border: `1px solid ${live ? `${meta.accent}40` : 'var(--pw-glass-border)'}`,
                    opacity: finished ? 0.45 : 1,
                  }}
                >
                  <span
                    className="text-xs flex items-center gap-1.5 min-w-0"
                    style={{
                      color: live ? meta.accent : 'var(--pw-text-secondary)',
                      textDecoration: finished ? 'line-through' : 'none',
                    }}
                  >
                    {live && <span className="pw-live-dot" style={{ width: 5, height: 5 }} />}
                    <span className="truncate">{s.name}</span>
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span
                      className="text-[12px] font-bold tabular-nums"
                      style={{
                        fontFamily: 'var(--font-orbitron), var(--pw-font-mono)',
                        textDecoration: finished ? 'line-through' : 'none',
                      }}
                    >
                      {formatTimeISR(s.startTime)}
                    </span>
                    {!finished && !live && (
                      <ReminderButton
                        eventId={event.id}
                        eventName={event.name}
                        sessionName={s.name}
                        sessionStart={s.startTime}
                        accentColor={meta.accent}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Watch Live CTA */}
        {event.streamLinks.length > 0 && (() => {
          const primary = event.streamLinks.find((l) => l.type === 'official') ?? event.streamLinks[0];
          return (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                style={{
                  background: meta.accent,
                  color: '#fff',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                  <path d="M10 8l6 4-6 4V8z" fill="white" />
                </svg>
                Watch Live
                {primary.label && <span className="opacity-75 font-normal normal-case tracking-normal">— {primary.label}</span>}
              </a>
            </motion.div>
          );
        })()}
      </div>
    </motion.section>
  );
}
