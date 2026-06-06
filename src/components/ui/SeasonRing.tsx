'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
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

const RING_R = 20;
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
  const filterId = `arc-glow-${series}`;
  const txtId = `txt-shadow-${series}`;

  return (
    <div
      className="flex flex-col items-center gap-1 flex-shrink-0 cursor-default"
      title={`${SERIES_META[series]?.name ?? series}: ${finished} / ${total} rounds`}
    >
      {/* Perspective wrapper for 3-D tilt */}
      <div style={{ perspective: 400 }}>
        <motion.div
          className="relative"
          style={{ width: 44, height: 44, transformStyle: 'preserve-3d' }}
          animate={{ scale: isActive ? 1.1 : 1 }}
          whileHover={{ rotateY: 14, rotateX: -9, scale: isActive ? 1.18 : 1.12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          {/* Tyre photo — fills full circle, no inset */}
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '50%' }}>
            <img
              src={tyreSrc}
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: isActive ? 0.95 : 0.5 }}
            />
          </div>

          {/* SVG: slim glowing edge arc + readable center label */}
          <svg
            width="44" height="44" viewBox="0 0 44 44"
            className="absolute inset-0"
            aria-hidden
          >
            <defs>
              {/* Glow for the progress arc */}
              <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Drop-shadow for center text */}
              <filter id={txtId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor="rgba(0,0,0,0.95)" floodOpacity="1" />
              </filter>
            </defs>

            {/* Dark track ring — shows the full 360° behind the arc */}
            <circle
              cx="22" cy="22" r={RING_R}
              fill="none"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="2"
            />

            {/* Progress arc — slim, glowing */}
            {progress > 0 && (
              <circle
                cx="22" cy="22" r={RING_R}
                fill="none"
                stroke={accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 22 22)"
                filter={`url(#${filterId})`}
                style={{ transition: 'stroke-dashoffset 0.8s ease', opacity: isActive ? 1 : 0.6 }}
              />
            )}

            {/* Center label — accent color + drop-shadow so it reads on any tyre */}
            <text
              x="22" y="26"
              textAnchor="middle"
              fontSize="8"
              fontFamily="ui-monospace, monospace"
              fontWeight="bold"
              fill={finished > 0 ? accent : 'rgba(255,255,255,0.3)'}
              filter={`url(#${txtId})`}
              style={{ opacity: isActive ? 1 : 0.65 }}
            >
              {finished > 0 ? `R${finished}` : '—'}
            </text>
          </svg>
        </motion.div>
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
        className="flex gap-5 overflow-x-auto py-2"
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
