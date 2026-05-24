'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import type { SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import type { RaceResult } from '@/data/results-2026';
import { ALL_RESULTS_2026, F1_RESULTS_2026 } from '@/data/results-2026';
import SeriesBadge from '@/components/ui/SeriesBadge';

interface RecentResultsProps {
  activeFilter?: SeriesId | 'all';
}

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

type ResultClass = 'hypercar' | 'lmgt3' | 'lmp2' | 'lmp3';

function getResultClass(result: RaceResult): ResultClass | null {
  const name = result.name;
  if (name.includes('— LMGT3')) return 'lmgt3';
  if (name.includes('— LMP3')) return 'lmp3';
  if (name.includes('— LMP2')) return 'lmp2';
  if (result.series === 'wec') return 'hypercar';
  if (result.series === 'elms') return 'lmp2';
  return null;
}

function getDisplayName(name: string): string {
  return name.replace(/ — (LMGT3|LMP3|LMP2)$/i, '');
}

function ClassBadge({ cls }: { cls: ResultClass }) {
  if (cls === 'hypercar') {
    return (
      <span
        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{
          background: 'rgba(192,192,192,0.12)',
          color: '#C0C0C0',
          border: '1px solid rgba(192,192,192,0.25)',
        }}
      >
        HYPERCAR
      </span>
    );
  }
  const svgMap: Record<Exclude<ResultClass, 'hypercar'>, string> = {
    lmgt3: '/logos/class-lmgt3.svg',
    lmp2: '/logos/class-lmp2.svg',
    lmp3: '/logos/class-lmp3.svg',
  };
  return (
    <img
      src={svgMap[cls]}
      alt={cls.toUpperCase()}
      style={{ height: 18, width: 'auto' }}
    />
  );
}

function PodiumCard({ result }: { result: RaceResult }) {
  const meta = SERIES_META[result.series];
  const cls = getResultClass(result);

  return (
    <motion.div
      className="pw-glass p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SeriesBadge series={result.series} size="sm" />
          <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
            R{result.round}
          </span>
          {cls && <ClassBadge cls={cls} />}
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
          {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Race name */}
      <h4 className="text-sm font-semibold mb-0.5">{getDisplayName(result.name)}</h4>
      <p className="text-[11px] mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
        {result.circuit} · {result.country}
      </p>

      {/* Podium */}
      <div className="space-y-1.5">
        {result.podium.map((p, i) => {
          const isF1 = result.series === 'f1';
          const logo = getTeamLogo(p.team, isF1);
          return (
            <div key={p.pos} className="flex items-center gap-2">
              {/* Position medal */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  background: `${MEDAL_COLORS[i]}20`,
                  color: MEDAL_COLORS[i],
                  border: `1px solid ${MEDAL_COLORS[i]}40`,
                }}
              >
                {p.pos}
              </div>
              {/* Manufacturer logo */}
              {logo ? (
                <div className="w-8 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={logo.src}
                    alt={p.team}
                    style={{
                      height: logo.white ? 16 : 18,
                      width: 'auto',
                      maxWidth: 32,
                      objectFit: 'contain',
                      ...(logo.white
                        ? { opacity: 0.95 }
                        : logo.cssFilter !== undefined
                        ? { filter: logo.cssFilter, opacity: 0.92 }
                        : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }
                      ),
                    }}
                  />
                </div>
              ) : (
                <div className="w-8 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium truncate block">{p.driver}</span>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>
                {p.team}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fastest lap */}
      {result.fastestLap && (
        <div className="flex items-center gap-1.5 mt-2.5 pt-2" style={{ borderTop: '1px solid var(--pw-glass-border)' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[10px]" style={{ color: '#A855F7' }}>
            FL: {result.fastestLap.driver}
          </span>
        </div>
      )}
    </motion.div>
  );
}

const NON_F1_RESULTS = ALL_RESULTS_2026.filter(r => r.series !== 'f1');

export default function RecentResults({ activeFilter = 'all' }: RecentResultsProps) {
  const [expanded, setExpanded] = useState(true);
  const [f1Results, setF1Results] = useState<RaceResult[]>(F1_RESULTS_2026);

  useEffect(() => {
    fetch('/api/f1/results')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data)) setF1Results(data); })
      .catch(() => {});
  }, []);

  const allResults = useMemo(() =>
    [...f1Results, ...NON_F1_RESULTS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ), [f1Results]);

  const filtered = useMemo(() => {
    const results = activeFilter === 'all'
      ? allResults
      : allResults.filter((r) => r.series === activeFilter);
    return results.slice(0, 6);
  }, [activeFilter, allResults]);

  if (filtered.length === 0) return null;

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 20 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          Recent Results
          <span className="ml-2 font-mono">({filtered.length})</span>
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((result) => (
                <PodiumCard key={result.id} result={result} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
