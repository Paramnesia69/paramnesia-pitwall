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
  f1: 'F1', wec: 'WEC', elms: 'ELMS', imsa: 'IMSA', nurburgring: 'NLS',
  motogp: 'MOTO', gtwce: 'GT', dtm: 'DTM', wrc: 'WRC', 'porsche-supercup': 'PSC',
};

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

function Ring({ series, finished, total, isActive }: {
  series: SeriesId; finished: number; total: number; isActive: boolean;
}) {
  const accent = SERIES_META[series]?.accent ?? '#888';
  const tyreSrc = TYRE_MAP[series] ?? '/tyres/tyre-imsa-white.png';
  const label = SHORT[series] ?? series.toUpperCase().slice(0, 4);

  return (
    <div
      className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-default"
      style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.25s ease' }}
      title={`${SERIES_META[series]?.name ?? series}: ${finished} / ${total} rounds`}
    >
      <div
        className="overflow-hidden"
        style={{ width: 52, height: 52, borderRadius: '50%', opacity: isActive ? 1 : 0.45 }}
      >
        <img src={tyreSrc} alt="" className="w-full h-full object-cover" />
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
      <div className="flex gap-5 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
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
