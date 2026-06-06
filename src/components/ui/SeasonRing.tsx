'use client';

import { useMemo } from 'react';
import type { SeriesId } from '@/types';
import { SERIES_META } from '@/types';

interface SeasonRingProps {
  stats: Record<string, { total: number; finished: number }>;
  activeFilter: SeriesId | 'all';
}

const ALL_SERIES: SeriesId[] = [
  'f1', 'wec', 'elms', 'imsa', 'nurburgring', 'motogp', 'gtwce', 'dtm', 'wrc', 'porsche-supercup',
];

const SHORT: Record<string, string> = {
  f1: 'F1',
  wec: 'WEC',
  elms: 'ELMS',
  imsa: 'IMSA',
  nurburgring: 'NLS',
  motogp: 'MOTO',
  gtwce: 'GT',
  dtm: 'DTM',
  wrc: 'WRC',
  'porsche-supercup': 'PSC',
};

// Red = Pirelli Soft (F1/WRC/GTWCE)
// Yellow = Michelin Medium (WEC/ELMS/MotoGP/Porsche)
// White = Pirelli Hard (IMSA/DTM/Nürburgring)
const TYRE_MAP: Partial<Record<string, string>> = {
  f1:                '/tyres/tyre-f1-red.png',
  wec:               '/tyres/tyre-wec-yellow.png',
  elms:              '/tyres/tyre-wec-yellow.png',
  imsa:              '/tyres/tyre-imsa-white.png',
  motogp:            '/tyres/tyre-wec-yellow.png',
  wrc:               '/tyres/tyre-f1-red.png',
  gtwce:             '/tyres/tyre-f1-red.png',
  dtm:               '/tyres/tyre-imsa-white.png',
  nurburgring:       '/tyres/tyre-imsa-white.png',
  'porsche-supercup':'/tyres/tyre-wec-yellow.png',
};

const RING_R = 19;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

function Ring({ series, finished, total, isActive }: {
  series: SeriesId;
  finished: number;
  total: number;
  isActive: boolean;
}) {
  const accent = SERIES_META[series]?.accent ?? '#888';
  const progress = total > 0 ? finished / total : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const label = SHORT[series] ?? series.toUpperCase().slice(0, 4);
  const tyreSrc = TYRE_MAP[series] ?? '/tyres/tyre-imsa-white.png';

  return (
    <div
      className="flex flex-col items-center gap-1 flex-shrink-0 cursor-default"
      style={{ transform: isActive ? 'scale(1.12)' : 'scale(1)', transition: 'transform 0.25s ease' }}
      title={`${SERIES_META[series]?.name ?? series}: ${finished} / ${total} rounds`}
    >
      <div className="relative" style={{ width: 44, height: 44 }}>
        {/* Tyre image — circular clip, sits inside the progress ring */}
        <div
          className="absolute overflow-hidden"
          style={{ inset: 3, borderRadius: '50%' }}
        >
          <img
            src={tyreSrc}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: isActive ? 0.92 : 0.52 }}
          />
        </div>

        {/* Progress arc + center label overlay */}
        <svg width="44" height="44" viewBox="0 0 44 44" className="absolute inset-0" aria-hidden>
          {/* Track (subtle dark ring behind the progress arc) */}
          <circle
            cx="22" cy="22" r={RING_R}
            fill="none"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="2.5"
          />
          {/* Progress arc */}
          <circle
            cx="22" cy="22" r={RING_R}
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 22 22)"
            style={{ transition: 'stroke-dashoffset 0.8s ease', opacity: isActive ? 1 : 0.65 }}
          />
          {/* Dark pill behind text for readability over the tyre rim */}
          <circle cx="22" cy="22" r="7.5" fill="rgba(0,0,0,0.48)" />
          {/* Round label */}
          <text
            x="22" y="25"
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="ui-monospace, monospace"
            fontWeight="bold"
            fill={finished > 0 ? '#fff' : 'rgba(255,255,255,0.45)'}
            style={{ opacity: isActive ? 1 : 0.7 }}
          >
            {finished > 0 ? `R${finished}` : '—'}
          </text>
        </svg>
      </div>

      <span
        className="text-[9px] font-semibold tracking-wider uppercase"
        style={{ color: isActive ? accent : 'var(--pw-text-tertiary)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function SeasonRing({ stats, activeFilter }: SeasonRingProps) {
  const series = useMemo(
    () => ALL_SERIES.filter((s) => (stats[s]?.total ?? 0) > 0),
    [stats],
  );

  if (series.length < 2) return null;

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full" style={{ background: 'var(--pw-accent)' }} />
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--pw-text-secondary)' }}>
          Season Progress
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
      </div>

      <div
        className="flex gap-5 overflow-x-auto py-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {series.map((s) => (
          <Ring
            key={s}
            series={s}
            finished={stats[s]?.finished ?? 0}
            total={stats[s]?.total ?? 0}
            isActive={activeFilter === s || activeFilter === 'all'}
          />
        ))}
      </div>
    </div>
  );
}
