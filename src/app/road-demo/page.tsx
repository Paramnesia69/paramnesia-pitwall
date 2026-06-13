'use client';

/**
 * THROWAWAY demo — three candidate road treatments for the endurance hero,
 * so the real prototype PNG can be compared on the live dark theme.
 * Scrub the slider to move the car afternoon → dusk → night → dawn.
 * Delete this route (and its folder) once a treatment is chosen.
 */

import { useState } from 'react';
import { Sun, Moon } from '@/components/ui/RaceIcons';

const ACCENT = '#0090D4'; // WEC blue
const DURATION = 24;

// Le Mans 2026 sun fractions across the 24h race (sunset 19:58Z, sunrise 04:00Z;
// start 14:00Z) → ~0.247 and ~0.583 of the timeline.
const SUNSET = 0.247;
const SUNRISE = 0.583;
const NIGHT_MID = (SUNSET + SUNRISE) / 2;

function dayNightBg(): string {
  const ss = SUNSET * 100;
  const sr = SUNRISE * 100;
  const DAY = 'rgba(255,196,110,0.30)';
  const NIGHT = 'rgba(18,24,58,0.78)';
  const DEEP = 'rgba(10,14,40,0.88)';
  const DUSK = 'rgba(196,96,72,0.45)';
  const DAWN = 'rgba(236,140,150,0.42)';
  return `linear-gradient(90deg,
    ${DAY} 0%, ${DAY} ${ss - 4}%, ${DUSK} ${ss}%, ${NIGHT} ${ss + 4}%,
    ${DEEP} ${(ss + sr) / 2}%, ${NIGHT} ${sr - 4}%, ${DAWN} ${sr}%,
    ${DAY} ${sr + 4}%, ${DAY} 100%)`;
}

// Softer, lower-opacity version of the same gradient for a "sky wash".
function skyWashBg(): string {
  const ss = SUNSET * 100;
  const sr = SUNRISE * 100;
  const DAY = 'rgba(255,196,110,0.16)';
  const NIGHT = 'rgba(30,40,90,0.42)';
  const DEEP = 'rgba(14,20,55,0.52)';
  const DUSK = 'rgba(196,96,72,0.26)';
  const DAWN = 'rgba(236,140,150,0.24)';
  return `linear-gradient(90deg,
    ${DAY} 0%, ${DAY} ${ss - 6}%, ${DUSK} ${ss}%, ${NIGHT} ${ss + 6}%,
    ${DEEP} ${(ss + sr) / 2}%, ${NIGHT} ${sr - 6}%, ${DAWN} ${sr}%,
    ${DAY} ${sr + 6}%, ${DAY} 100%)`;
}

function Car({ pct, isNight }: { pct: number; isNight: boolean }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ bottom: 12, left: `${pct}%` }}
    >
      <div className="relative" style={{ transform: 'translateX(-50%)' }}>
        {isNight && (
          <div
            className="absolute pointer-events-none"
            style={{
              right: -16,
              bottom: 1,
              width: 24,
              height: 12,
              background:
                'radial-gradient(ellipse at left center, rgba(255,243,200,0.85), rgba(255,243,200,0) 72%)',
            }}
          />
        )}
        <img
          src="/lemans-prototype.png"
          alt=""
          width={56}
          style={{
            display: 'block',
            width: 56,
            height: 'auto',
            filter: isNight
              ? 'brightness(0.72) saturate(0.9) drop-shadow(0 2px 3px rgba(0,0,0,0.55))'
              : 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))',
          }}
        />
      </div>
    </div>
  );
}

function Celestials() {
  return (
    <>
      <span className="absolute top-0 -translate-x-1/2" style={{ left: `${SUNSET * 100}%` }}>
        <Sun size={15} horizon />
      </span>
      <span className="absolute top-0 -translate-x-1/2" style={{ left: `${NIGHT_MID * 100}%` }}>
        <Moon size={14} />
      </span>
      <span className="absolute top-0 -translate-x-1/2" style={{ left: `${SUNRISE * 100}%` }}>
        <Sun size={15} horizon />
      </span>
    </>
  );
}

function HourNotches({ below }: { below?: boolean }) {
  return (
    <>
      {Array.from({ length: DURATION - 1 }, (_, i) => {
        const major = (i + 1) % 6 === 0;
        return (
          <div
            key={i}
            className="absolute w-px"
            style={{
              left: `${((i + 1) / DURATION) * 100}%`,
              bottom: below ? -5 : 0,
              top: below ? undefined : 0,
              height: below ? (major ? 5 : 3) : '100%',
              background: 'rgba(255,255,255,0.5)',
              opacity: major ? 0.7 : 0.28,
            }}
          />
        );
      })}
    </>
  );
}

/* ---- Variant A: Broadcast hairline ---- */
function VariantA({ pct, isNight }: { pct: number; isNight: boolean }) {
  return (
    <div className="relative h-16">
      <Celestials />
      {/* faint sky wash above the line */}
      <div
        className="absolute left-0 right-0 rounded-sm"
        style={{ top: 16, height: 14, background: skyWashBg(), opacity: 0.9, maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      />
      {/* the single baseline */}
      <div className="absolute left-0 right-0" style={{ bottom: 10, height: 1, background: 'rgba(255,255,255,0.28)' }} />
      {/* travelled accent underline */}
      <div className="absolute left-0" style={{ bottom: 10, height: 1.5, width: `${pct}%`, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}66` }} />
      {/* hour notches below */}
      <div className="absolute left-0 right-0" style={{ bottom: 10 }}><HourNotches below /></div>
      <Car pct={pct} isNight={isNight} />
    </div>
  );
}

/* ---- Variant B: Engraved channel ---- */
function VariantB({ pct, isNight }: { pct: number; isNight: boolean }) {
  return (
    <div className="relative h-16">
      <Celestials />
      <div
        className="absolute left-0 right-0 rounded-md overflow-hidden"
        style={{
          bottom: 6,
          height: 13,
          background: dayNightBg(),
          // debossed: dark top inner shadow + faint bottom catch-light, no border glow
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* travelled — subtle tint only, no bloom */}
        <div className="absolute left-0 top-0 bottom-0" style={{ width: `${pct}%`, background: `${ACCENT}1f` }} />
        <HourNotches />
        <div
          className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-px"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 5px, transparent 5px 13px)', opacity: 0.3 }}
        />
      </div>
      <Car pct={pct} isNight={isNight} />
    </div>
  );
}

/* ---- Variant C: Sky band + thin road ---- */
function VariantC({ pct, isNight }: { pct: number; isNight: boolean }) {
  return (
    <div className="relative h-[78px]">
      <Celestials />
      {/* sky band */}
      <div
        className="absolute left-0 right-0 rounded-sm overflow-hidden"
        style={{ top: 16, height: 18, background: dayNightBg(), maskImage: 'linear-gradient(to bottom, black 60%, transparent)' }}
      />
      {/* thin road below */}
      <div className="absolute left-0 right-0" style={{ bottom: 12, height: 1, background: 'rgba(255,255,255,0.3)' }} />
      <div className="absolute left-0" style={{ bottom: 12, height: 1.5, width: `${pct}%`, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}66` }} />
      <div className="absolute left-0 right-0" style={{ bottom: 12 }}><HourNotches below /></div>
      <Car pct={pct} isNight={isNight} />
    </div>
  );
}

/* ---- Reference: current production tube ---- */
function Current({ pct, isNight }: { pct: number; isNight: boolean }) {
  return (
    <div className="relative h-12">
      <Celestials />
      <div
        className="absolute left-0 right-0 rounded-full overflow-hidden"
        style={{
          bottom: 2,
          height: 10,
          background: dayNightBg(),
          border: '1px solid var(--pw-glass-border)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -3px 5px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute left-0 top-0 bottom-0" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT}3a, ${ACCENT}12)` }} />
        <HourNotches />
        <div
          className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-px"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 5px, transparent 5px 13px)', opacity: 0.35 }}
        />
      </div>
      <Car pct={pct} isNight={isNight} />
    </div>
  );
}

export default function RoadDemoPage() {
  const [pct, setPct] = useState(42); // mid-night by default
  const frac = pct / 100;
  const isNight = frac > SUNSET && frac < SUNRISE;

  const variants: { name: string; note: string; render: () => React.ReactNode }[] = [
    { name: 'A · Broadcast hairline', note: 'single baseline + faint sky wash above + accent underline', render: () => <VariantA pct={pct} isNight={isNight} /> },
    { name: 'B · Engraved channel', note: 'debossed groove, no border glow, subtle accent tint', render: () => <VariantB pct={pct} isNight={isNight} /> },
    { name: 'C · Sky band + thin road', note: 'separate day/night sky band over a hairline road', render: () => <VariantC pct={pct} isNight={isNight} /> },
    { name: '— Current (for reference)', note: 'the glowy tube we are replacing', render: () => <Current pct={pct} isNight={isNight} /> },
  ];

  return (
    <main className="min-h-dvh px-6 py-10 max-w-[680px] mx-auto" style={{ color: 'var(--pw-text-primary)' }}>
      <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-orbitron, monospace)' }}>Endurance road — treatment demo</h1>
      <p className="text-[12px] mb-6" style={{ color: 'var(--pw-text-tertiary)' }}>
        Drag to move the prototype through afternoon → dusk → night → dawn. Car is identical in all four.
      </p>

      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        className="w-full mb-8"
        style={{ accentColor: ACCENT }}
      />

      <div className="space-y-8">
        {variants.map((v) => (
          <div key={v.name} className="pw-glass p-5">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-orbitron, monospace)' }}>{v.name}</span>
              <span className="text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>{v.note}</span>
            </div>
            {v.render()}
          </div>
        ))}
      </div>
    </main>
  );
}
