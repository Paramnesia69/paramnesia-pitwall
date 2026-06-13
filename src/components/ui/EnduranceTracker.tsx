'use client';

import { useEffect, useState } from 'react';
import { m as motion } from 'framer-motion';
import {
  getEnduranceSun,
  getRacePhase,
  getNextMilestone,
  getDaylightState,
} from '@/lib/enduranceClock';
import { PhaseIcon, Sun, Moon } from '@/components/ui/RaceIcons';

interface EnduranceTrackerProps {
  /** Race start (ISO 8601) */
  startTime: string;
  /** Official race length in hours, derived from the race name */
  durationHours: number;
  /** Circuit name — used to look up real sunrise/sunset for the day/night band */
  circuitName?: string;
  accent: string;
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Compact countdown for the next-milestone chip (drops leading zero hours). */
function fmtShort(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Replaces the countdown in the hero while an endurance race is running:
 * a day/night cycle band with elapsed / remaining clocks, the current race
 * phase, and a countdown to the next milestone (sunset, sunrise, the flag…).
 */
export default function EnduranceTracker({ startTime, durationHours, circuitName, accent }: EnduranceTrackerProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) return null; // avoid SSR/client clock mismatch

  const start = new Date(startTime).getTime();
  const totalMs = durationHours * 3600_000;
  const elapsed = Math.min(Math.max(now - start, 0), totalMs);
  const remaining = totalMs - elapsed;
  const pct = (elapsed / totalMs) * 100;
  const currentHour = Math.min(Math.floor(elapsed / 3600_000) + 1, durationHours);

  const sun = circuitName ? getEnduranceSun(circuitName) : null;
  const phase = getRacePhase(now, start, durationHours, sun);
  const milestone = getNextMilestone(now, start, durationHours, sun);
  const daylight = sun ? getDaylightState(now, sun) : 'day';

  // Day/night gradient mapped onto the race timeline (only when the race
  // actually crosses sunset → it would be all-daylight otherwise).
  let trackBg = 'var(--pw-glass-bg)';
  let sunsetFrac: number | null = null;
  let sunriseFrac: number | null = null;
  if (sun) {
    sunsetFrac = (new Date(sun.sunsetUtc).getTime() - start) / totalMs;
    sunriseFrac = (new Date(sun.sunriseUtc).getTime() - start) / totalMs;
    const ss = Math.max(0, Math.min(1, sunsetFrac)) * 100;
    const sr = Math.max(0, Math.min(1, sunriseFrac)) * 100;
    const DAY = 'rgba(255,196,110,0.30)';
    const NIGHT = 'rgba(18,24,58,0.78)';
    const DEEP = 'rgba(10,14,40,0.88)';
    const DUSK = 'rgba(196,96,72,0.45)';
    const DAWN = 'rgba(236,140,150,0.42)';
    trackBg = `linear-gradient(90deg,
      ${DAY} 0%,
      ${DAY} ${Math.max(0, ss - 4)}%,
      ${DUSK} ${ss}%,
      ${NIGHT} ${Math.min(100, ss + 4)}%,
      ${DEEP} ${(ss + sr) / 2}%,
      ${NIGHT} ${Math.max(0, sr - 4)}%,
      ${DAWN} ${sr}%,
      ${DAY} ${Math.min(100, sr + 4)}%,
      ${DAY} 100%)`;
  }

  const isNight = daylight === 'night' || daylight === 'dusk';
  // Midpoint of the night, for the moon marker.
  const nightMidFrac =
    sunsetFrac !== null && sunriseFrac !== null ? (sunsetFrac + sunriseFrac) / 2 : null;
  const inRange = (f: number | null): f is number => f !== null && f > 0.01 && f < 0.99;

  return (
    <div className="max-w-[560px]">
      {/* Phase + hour + next milestone */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <p className="text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--pw-text-tertiary)' }}>
          <span className="inline-flex items-center justify-center w-4 h-4 leading-none shrink-0" style={{ color: accent }}>
            <PhaseIcon name={phase.icon} size={16} accent={accent} />
          </span>
          <span style={{ color: accent }}>{phase.label}</span>
          <span className="opacity-60">· Hour {currentHour} of {durationHours}</span>
        </p>
        {milestone && (
          <p className="text-[10px] uppercase tracking-wider tabular-nums shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>
            {milestone.label} in <span style={{ color: accent, fontFamily: 'var(--font-orbitron, monospace)' }}>{fmtShort(milestone.targetMs - now)}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Elapsed */}
        <div className="pw-glass px-3 py-1.5 sm:px-4 sm:py-2 text-center shrink-0">
          <div className="text-lg sm:text-2xl font-bold font-mono tabular-nums">{fmt(elapsed)}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>Elapsed</div>
        </div>

        {/* The lane: a road the hypercar drives along, under a day/night sky.
            Sun rises/sets and the moon rides the night at the real fractions. */}
        <div className="relative flex-1 h-10">
          {/* Celestial marks above the road */}
          {inRange(sunsetFrac) && (
            <span className="absolute top-0 -translate-x-1/2 pointer-events-none" style={{ left: `${sunsetFrac * 100}%` }}><Sun size={15} horizon /></span>
          )}
          {inRange(nightMidFrac) && (
            <span className="absolute top-0 -translate-x-1/2 pointer-events-none" style={{ left: `${nightMidFrac * 100}%` }}><Moon size={14} /></span>
          )}
          {inRange(sunriseFrac) && (
            <span className="absolute top-0 -translate-x-1/2 pointer-events-none" style={{ left: `${sunriseFrac * 100}%` }}><Sun size={15} horizon /></span>
          )}

          {/* Road surface (day/night tinted) */}
          <div className="absolute left-0 right-0 rounded-full overflow-hidden" style={{ bottom: 2, height: 9, background: trackBg, border: '1px solid var(--pw-glass-border)' }}>
            {/* Travelled portion, brightened with accent */}
            <motion.div
              className="absolute left-0 top-0 bottom-0"
              style={{ background: `linear-gradient(90deg, ${accent}38, ${accent}14)` }}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            />
            {/* Dashed centre line */}
            <div
              className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-px pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 5px, transparent 5px 13px)', opacity: 0.35 }}
            />
            {/* Hour posts */}
            {Array.from({ length: durationHours - 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${((i + 1) / durationHours) * 100}%`,
                  background: 'rgba(255,255,255,0.22)',
                  opacity: (i + 1) % 6 === 0 ? 0.85 : 0.28,
                }}
              />
            ))}
          </div>

          {/* The prototype, on the road at the current position */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ bottom: 4 }}
            initial={false}
            animate={{ left: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          >
            <div className="relative" style={{ transform: 'translateX(-50%)' }}>
              {/* Headlight beam (night only) — car faces right */}
              {isNight && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    right: -14,
                    top: '38%',
                    width: 22,
                    height: 12,
                    transform: 'translateY(-50%)',
                    background: 'radial-gradient(ellipse at left center, rgba(255,243,200,0.85), rgba(255,243,200,0) 72%)',
                  }}
                />
              )}
              <img
                src="/endurance-car.png"
                alt=""
                width={50}
                height={16}
                style={{
                  display: 'block',
                  width: 50,
                  height: 'auto',
                  filter: isNight
                    ? 'brightness(0.72) saturate(0.9) drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Remaining */}
        <div className="pw-glass px-3 py-1.5 sm:px-4 sm:py-2 text-center shrink-0">
          <div className="text-lg sm:text-2xl font-bold font-mono tabular-nums">{fmt(remaining)}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>To Flag</div>
        </div>
      </div>
    </div>
  );
}
