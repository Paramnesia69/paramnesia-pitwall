'use client';

import { useEffect, useState } from 'react';
import { m as motion } from 'framer-motion';
import {
  getEnduranceSun,
  getRacePhase,
  getNextMilestone,
  getDaylightState,
} from '@/lib/enduranceClock';

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

  const dayGlyph = daylight === 'night' ? '🌙' : daylight === 'dusk' ? '🌇' : daylight === 'dawn' ? '🌅' : '☀️';

  return (
    <div className="max-w-[560px]">
      {/* Phase + hour + next milestone */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--pw-text-tertiary)' }}>
          <span className="text-sm leading-none">{phase.icon}</span>
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

        {/* Day/night band with elapsed fill, hour ticks & sun/moon markers */}
        <div className="relative flex-1">
          {/* Sun / moon markers above the bar */}
          {sunsetFrac !== null && sunsetFrac > 0 && sunsetFrac < 1 && (
            <span className="absolute -top-4 text-[11px] leading-none -translate-x-1/2 pointer-events-none" style={{ left: `${sunsetFrac * 100}%` }}>🌇</span>
          )}
          {sunriseFrac !== null && sunriseFrac > 0 && sunriseFrac < 1 && (
            <span className="absolute -top-4 text-[11px] leading-none -translate-x-1/2 pointer-events-none" style={{ left: `${sunriseFrac * 100}%` }}>🌅</span>
          )}

          <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: trackBg, border: '1px solid var(--pw-glass-border)' }}>
            {/* Elapsed overlay — brighten the portion already run */}
            <motion.div
              className="absolute left-0 top-0 bottom-0"
              style={{ background: `linear-gradient(90deg, ${accent}40, ${accent}18)` }}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            />
            {/* Hour ticks */}
            {Array.from({ length: durationHours - 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${((i + 1) / durationHours) * 100}%`,
                  background: 'rgba(255,255,255,0.22)',
                  opacity: (i + 1) % 6 === 0 ? 0.9 : 0.3,
                }}
              />
            ))}
            {/* "Now" position marker with day/night glyph */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
              initial={false}
              animate={{ left: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            >
              <span
                className="block w-3.5 h-3.5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 0 2px var(--pw-bg-primary), 0 0 12px ${accent}` }}
              />
            </motion.div>
          </div>
          <div className="mt-1 text-center text-[10px] leading-none">{dayGlyph}</div>
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
