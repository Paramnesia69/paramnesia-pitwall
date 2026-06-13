'use client';

import { useId } from 'react';
import type { RacePhaseIcon } from '@/lib/enduranceClock';

/**
 * Premium inline-SVG racing icon set for the endurance tracker — replaces
 * emoji with custom marks that match the cinematic dark aesthetic. Every icon
 * scales from a `size` prop; celestial + car marks carry their own restrained
 * gradients (no heavy glow), accents tint the car/clock.
 */

/* ── Le Mans Hypercar (LMH side profile) ───────────────── */
export function Hypercar({ size = 28, color, night = false }: { size?: number; color: string; night?: boolean }) {
  const id = useId();
  const h = (size * 28) / 64;
  return (
    <svg width={size} height={h} viewBox="0 0 64 28" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.78" />
        </linearGradient>
        {night && (
          <radialGradient id={`${id}-beam`} cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor="#FFF3C8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFF3C8" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {/* Headlight beam (night only) */}
      {night && <path d="M5 18 L-10 13 L-10 22 Z" fill={`url(#${id}-beam)`} />}

      {/* Floor shadow */}
      <ellipse cx="33" cy="26.5" rx="29" ry="1.6" fill="#000" opacity="0.35" />

      {/* Rear shark fin */}
      <path d="M43 9 L46 2.5 L48.5 9.5 Z" fill={color} opacity="0.85" />

      {/* Body */}
      <path
        d="M4 22 L4 19 C6 15 9 13.6 14 13 L21 12.4 C25 12 27 10.4 31 7 C34 4.8 39 5.6 44 8.2 L51 11 L58 12.6 C61 13.2 62 15 62 19 L62 22 Z"
        fill={`url(#${id}-body)`}
        stroke={color}
        strokeWidth="0.5"
      />

      {/* Canopy / windscreen */}
      <path d="M27 12 C30 9.2 34 7.9 38 8.3 L43 10.4 L41 12.2 Z" fill="#0A0C12" opacity="0.55" />

      {/* Front splitter lip */}
      <rect x="2.5" y="21" width="6" height="2.2" rx="1" fill={color} opacity="0.85" />
      {/* Headlight */}
      <ellipse cx="6.5" cy="17.5" rx="1.6" ry="1.1" fill={night ? '#FFF3C8' : '#EAF0FF'} opacity="0.9" />

      {/* Wheels */}
      {[14, 52].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="22" r="5" fill="#0C0C0F" />
          <circle cx={cx} cy="22" r="5" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1" />
          <circle cx={cx} cy="22" r="1.7" fill={color} />
        </g>
      ))}
    </svg>
  );
}

/* ── Start-light gantry (Le Départ) ────────────────────── */
function StartLights({ size = 16 }: { size?: number }) {
  const cols = [5.2, 8.6, 12, 15.4, 18.8];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="3.5" x2="12" y2="8.5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
      <rect x="2" y="8.5" width="20" height="7" rx="2" fill="#15171d" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      {cols.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="12" r="2.6" fill="#E10600" opacity="0.22" />
          <circle cx={cx} cy="12" r="1.7" fill="#FF1E12" />
        </g>
      ))}
    </svg>
  );
}

/* ── Chequered flag ────────────────────────────────────── */
function ChequeredFlag({ size = 16 }: { size?: number }) {
  const squares: { x: number; y: number; on: boolean }[] = [];
  const cols = [6, 9, 12, 15];
  const rows = [3, 6, 9];
  cols.forEach((x, ci) => rows.forEach((y, ri) => squares.push({ x, y, on: (ci + ri) % 2 === 0 })));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="2" x2="5" y2="22" stroke="#D7DCEA" strokeWidth="1.5" strokeLinecap="round" />
      <g transform="skewY(-4)">
        <rect x="6" y="3" width="12" height="9" fill="#0A0C12" />
        {squares.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width="3" height="3" fill={s.on ? '#EBEEF6' : 'transparent'} />
        ))}
        <rect x="6" y="3" width="12" height="9" fill="none" stroke="#EBEEF6" strokeOpacity="0.4" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

/* ── Stopwatch (Final Hour) ────────────────────────────── */
function Stopwatch({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9.5" y="2.5" width="5" height="2.2" rx="1" fill={color} />
      <line x1="12" y1="4.5" x2="12" y2="6.5" stroke={color} strokeWidth="1.4" />
      <circle cx="12" cy="14" r="7.3" fill="none" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="14" r="1" fill={color} />
      <line x1="12" y1="14" x2="12" y2="9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="14" x2="15" y2="14.6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Premium sun (full / on horizon) ───────────────────── */
function Sun({ size = 16, horizon = false }: { size?: number; horizon?: boolean }) {
  const id = useId();
  const rays = [
    [18.9, 12, 21.2, 12], [16.8, 7.2, 18.4, 5.6], [12, 5.1, 12, 2.8], [7.2, 7.2, 5.6, 5.6],
    [5.1, 12, 2.8, 12], [7.2, 16.8, 5.6, 18.4], [12, 18.9, 12, 21.2], [16.8, 16.8, 18.4, 18.4],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id={id} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#FFE9AE" />
          <stop offset="55%" stopColor="#FFC24B" />
          <stop offset="100%" stopColor="#FF982E" />
        </radialGradient>
      </defs>
      {horizon ? (
        <>
          <g stroke="#FFC24B" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
            <line x1="12" y1="6.5" x2="12" y2="4.4" /><line x1="7" y1="8" x2="5.6" y2="6.6" /><line x1="17" y1="8" x2="18.4" y2="6.6" />
          </g>
          <path d="M6.5 16 A5.5 5.5 0 0 1 17.5 16 Z" fill={`url(#${id})`} />
          <line x1="3" y1="16" x2="21" y2="16" stroke="#FFD27A" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="19" x2="19" y2="19" stroke="#FFD27A" strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <g stroke="#FFC24B" strokeWidth="1.6" strokeLinecap="round" opacity="0.92">
            {rays.map((r, i) => <line key={i} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} />)}
          </g>
          <circle cx="12" cy="12" r="5" fill={`url(#${id})`} />
        </>
      )}
    </svg>
  );
}

/* ── Premium crescent moon ─────────────────────────────── */
function Moon({ size = 16 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2F5FF" />
          <stop offset="100%" stopColor="#AFBBE6" />
        </linearGradient>
      </defs>
      <path
        d="M16.6 3.7 A8.6 8.6 0 1 0 16.6 20.3 A6.7 6.7 0 1 1 16.6 3.7 Z"
        fill={`url(#${id})`}
      />
      <g fill="#E9EEFF">
        <path d="M7 6 l0.5 1.4 1.4 0.5 -1.4 0.5 -0.5 1.4 -0.5 -1.4 -1.4 -0.5 1.4 -0.5 Z" opacity="0.85" />
        <circle cx="10.5" cy="3.5" r="0.7" opacity="0.6" />
      </g>
    </svg>
  );
}

export { Sun, Moon };

/* ── Phase icon registry ───────────────────────────────── */
export function PhaseIcon({ name, size = 16, accent }: { name: RacePhaseIcon; size?: number; accent: string }) {
  switch (name) {
    case 'start':
    case 'grid':
      return <StartLights size={size} />;
    case 'flag':
      return <ChequeredFlag size={size} />;
    case 'final':
      return <Stopwatch size={size} color={accent} />;
    case 'night':
    case 'predawn':
      return <Moon size={size} />;
    case 'dusk':
    case 'dawn':
      return <Sun size={size} horizon />;
    case 'day':
    case 'morning':
      return <Sun size={size} />;
    case 'racing':
    default:
      return <Hypercar size={size * 1.7} color={accent} />;
  }
}
