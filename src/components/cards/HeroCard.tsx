'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { formatDateISR, formatTimeISR } from '@/lib/events';
import Countdown from '@/components/ui/Countdown';
import { WeatherBadgeCompact } from '@/components/ui/WeatherBadge';
import ReminderButton from '@/components/ui/ReminderButton';
import { getCircuitImage } from '@/lib/images';
import { getCountryFlag } from '@/lib/countryFlag';

interface HeroCardProps {
  event: NormalizedRaceEvent;
}

export default function HeroCard({ event }: HeroCardProps) {
  const meta = SERIES_META[event.series];
  const nextSession = event.sessions.find((s) => s.state !== 'finished');
  const circuitImg = getCircuitImage(event.circuit.name);
  const flag = getCountryFlag(event.circuit.countryCode);

  return (
    <motion.section
      className="pw-glass relative overflow-hidden mb-8 p-6 sm:p-8 min-h-[320px] flex flex-col justify-end"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      {circuitImg && (() => {
        const darkF = 'brightness(0) invert(1) sepia(1) hue-rotate(175deg) saturate(6) brightness(1.1)';
        const vividF = 'brightness(1.2) contrast(1.25) saturate(1.6)';
        const baseF = 'brightness(1.05) contrast(1.1) saturate(1.2)';
        const f = circuitImg.dark ? darkF : circuitImg.vivid ? vividF : baseF;
        return (
          <div
            className="absolute pointer-events-none select-none"
            style={{ top: 0, left: '36%', right: '39%', bottom: '32%', zIndex: 0 }}
          >
            <Image src={circuitImg.src} alt="" fill className="object-contain"
              style={{ filter: `${f} blur(6px)`, opacity: circuitImg.glowOpacity }} />
            <Image src={circuitImg.src} alt="" fill className="object-contain"
              style={{ filter: f, opacity: circuitImg.sharpOpacity }} />
          </div>
        );
      })()}
      )}

      {/* Large faded series logo — right side */}
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

      {/* Gradient overlay with series accent */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${meta.accent} 0%, transparent 50%)`,
        }}
      />

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

        {/* Circuit + dates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ color: 'var(--pw-text-secondary)' }} className="text-sm sm:text-base mb-1">
            {flag && <span className="mr-1">{flag}</span>}{event.circuit.name} — {event.circuit.country}
          </p>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
              {formatDateISR(event.startDate)} – {formatDateISR(event.endDate)} · Israel Time
            </p>
            {event.weather && <WeatherBadgeCompact weather={event.weather} />}
          </div>
        </motion.div>

        {/* Countdown */}
        {nextSession && event.state !== 'finished' && (
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

        {/* Session pills */}
        {event.sessions.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {event.sessions.map((s, i) => (
              <div
                key={i}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200${s.state === 'live' ? ' pw-live-pill' : ''}`}
                style={{
                  ...(s.state !== 'live' && { background: 'var(--pw-glass-bg)' }),
                  border: `1px solid ${s.state === 'live' ? 'rgba(225,6,0,0.4)' : 'var(--pw-glass-border)'}`,
                  color: s.state === 'finished' ? 'var(--pw-text-tertiary)' : 'var(--pw-text-secondary)',
                  textDecoration: s.state === 'finished' ? 'line-through' : 'none',
                  opacity: s.state === 'finished' ? 0.5 : 1,
                }}
              >
                {s.state === 'live' && <span className="pw-live-dot" style={{ width: 5, height: 5 }} />}
                <span>{s.name}</span>
                <span className="font-mono">{formatTimeISR(s.startTime)}</span>
                {s.state !== 'finished' && s.state !== 'live' && (
                  <ReminderButton
                    eventId={event.id}
                    eventName={event.name}
                    sessionName={s.name}
                    sessionStart={s.startTime}
                    accentColor={meta.accent}
                  />
                )}
              </div>
            ))}
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
