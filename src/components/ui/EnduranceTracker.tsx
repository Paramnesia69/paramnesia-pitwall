'use client';

import { useEffect, useState } from 'react';
import { m as motion } from 'framer-motion';

interface EnduranceTrackerProps {
  /** Race start (ISO 8601) */
  startTime: string;
  /** Official race length in hours, derived from the race name */
  durationHours: number;
  accent: string;
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Replaces the countdown in the hero while an endurance race is running:
 * elapsed / remaining clocks around an hour-marked progress bar.
 */
export default function EnduranceTracker({ startTime, durationHours, accent }: EnduranceTrackerProps) {
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

  return (
    <div className="max-w-[560px]">
      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--pw-text-tertiary)' }}>
        Race in progress · <span style={{ color: accent }}>Hour {currentHour} of {durationHours}</span>
      </p>

      <div className="flex items-center gap-3">
        {/* Elapsed */}
        <div className="pw-glass px-3 py-1.5 sm:px-4 sm:py-2 text-center shrink-0">
          <div className="text-lg sm:text-2xl font-bold font-mono tabular-nums">{fmt(elapsed)}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>Elapsed</div>
        </div>

        {/* Progress bar with hour ticks */}
        <div className="relative flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pw-glass-bg)', border: '1px solid var(--pw-glass-border)' }}>
          <motion.div
            className="absolute left-0 top-0 bottom-0 rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent}90, ${accent})` }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />
          {Array.from({ length: durationHours - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${((i + 1) / durationHours) * 100}%`,
                background: 'rgba(255,255,255,0.22)',
                opacity: (i + 1) % 6 === 0 ? 1 : 0.45,
              }}
            />
          ))}
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
