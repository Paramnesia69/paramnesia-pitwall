'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import type { SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import { F1_DRIVER_REFS_FULL } from '@/lib/f1DriverRefs';
import type { RaceResult } from '@/data/results-2026';
import { ALL_RESULTS_2026, F1_RESULTS_2026 } from '@/data/results-2026';
import SeriesBadge from '@/components/ui/SeriesBadge';
import WatchedButton from '@/components/ui/WatchedButton';
import StarRating from '@/components/ui/StarRating';
import { useStore } from '@/store';
import { getCircuitImage } from '@/lib/images';

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
  const svgMap: Record<ResultClass, string> = {
    hypercar: '/logos/class-hypercar.svg',
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
  const openResult = useStore((s) => s.openResult);
  const openDriver = useStore((s) => s.openDriver);
  const entry = useStore((s) => s.diary[result.id]);
  const watched = entry?.watched ?? false;
  const rating = entry?.rating ?? 0;
  const handleClick = useCallback(() => openResult(result), [openResult, result]);
  const circuitImg = getCircuitImage(result.circuit);

  return (
    <motion.div
      className="pw-glass p-4 relative cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: watched ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.015, opacity: 1, boxShadow: `0 0 0 1px ${meta.accent}30, 0 8px 32px ${meta.accent}10` }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-label={`View full results for ${result.name}`}
    >
      {/* Clipped layer: accent line + circuit watermark */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }}
        />
        {circuitImg && (() => {
          const darkF = 'brightness(0) invert(1) sepia(1) hue-rotate(175deg) saturate(6) brightness(1.1)';
          const vividF = 'brightness(1.05) contrast(1.12) saturate(1.3)';
          const baseF = 'brightness(1.05) contrast(1.1) saturate(1.2)';
          const f = circuitImg.filterOverride ?? (circuitImg.dark ? darkF : circuitImg.vivid ? vividF : baseF);
          return (
            <div className="absolute pointer-events-none select-none" style={{ width: 72, height: 72, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <img src={circuitImg.src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: `${f} blur(8px)`, opacity: circuitImg.glowOpacity * 0.4 }} />
              <img src={circuitImg.src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: f, opacity: circuitImg.sharpOpacity * 0.7 }} />
            </div>
          );
        })()}
      </div>

      {/* Card content — above watermark */}
      <div className="relative" style={{ zIndex: 1 }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SeriesBadge series={result.series} size="sm" />
          <span
            className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
            style={{
              background: `${meta.accent}18`,
              color: meta.accent,
              border: `1px solid ${meta.accent}30`,
            }}
          >
            R{result.round}
          </span>
          {cls && <ClassBadge cls={cls} />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
            {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <WatchedButton
            id={result.id}
            name={result.name}
            series={result.series}
            date={result.date}
            accentColor={meta.accent}
            size="sm"
          />
        </div>
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
                {result.series === 'f1' && F1_DRIVER_REFS_FULL[p.driver] ? (
                  <button
                    className="text-xs font-medium truncate block text-left hover:underline hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDriver({ ref: F1_DRIVER_REFS_FULL[p.driver], name: p.driver, team: p.team, teamColor: meta.accent, series: 'f1', points: 0, pos: p.pos });
                    }}
                  >
                    {p.driver}
                  </button>
                ) : (
                  <span className="text-xs font-medium truncate block">{p.driver}</span>
                )}
              </div>
              <span className="text-[10px] shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>
                {p.team}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fastest lap + rating + view details */}
      <div className="flex items-center gap-1.5 mt-2.5 pt-2" style={{ borderTop: '1px solid var(--pw-glass-border)' }}>
        {rating > 0 ? (
          <StarRating value={rating} size={11} />
        ) : result.fastestLap ? (
          <>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[10px]" style={{ color: '#A855F7' }}>
              FL: {result.fastestLap.driver}
            </span>
          </>
        ) : <span className="flex-1" />}
        <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider flex items-center gap-0.5" style={{ color: meta.accent, opacity: 0.7 }}>
          Full results
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4h5M4.5 1.5L7 4l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      </div>{/* end content wrapper */}
    </motion.div>
  );
}

// F1 + MotoGP come from live API routes; everything else is static.
const STATIC_RESULTS = ALL_RESULTS_2026.filter(r => r.series !== 'f1' && r.series !== 'motogp');
const STATIC_MOTOGP = ALL_RESULTS_2026.filter(r => r.series === 'motogp');

export default function RecentResults({ activeFilter = 'all' }: RecentResultsProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  const [f1Results, setF1Results] = useState<RaceResult[]>(F1_RESULTS_2026);
  const [motoResults, setMotoResults] = useState<RaceResult[]>(STATIC_MOTOGP);

  useEffect(() => { setShowAll(false); }, [activeFilter]);

  useEffect(() => {
    fetch('/api/f1/results')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data)) setF1Results(data); })
      .catch(() => {});

    fetch('/api/motogp/results')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length) setMotoResults(data); })
      .catch(() => {});
  }, []);

  const allResults = useMemo(() =>
    [...f1Results, ...motoResults, ...STATIC_RESULTS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ), [f1Results, motoResults]);

  const { filtered, total } = useMemo(() => {
    const results = activeFilter === 'all'
      ? allResults
      : allResults.filter((r) => r.series === activeFilter);
    return { filtered: showAll ? results : results.slice(0, 9), total: results.length };
  }, [activeFilter, allResults, showAll]);

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
          <span className="ml-2 font-mono">({total})</span>
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <button
          onClick={() => {
            if (expanded && collapseRef.current) collapseRef.current.style.overflow = 'hidden';
            setExpanded(!expanded);
          }}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            ref={collapseRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onAnimationStart={() => { if (collapseRef.current) collapseRef.current.style.overflow = 'hidden'; }}
            onAnimationComplete={() => { if (collapseRef.current) collapseRef.current.style.overflow = 'visible'; }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-1 py-1 -mx-1"
              style={{ paddingBottom: '8px' }}>
              {filtered.map((result) => (
                <PodiumCard key={result.id} result={result} />
              ))}
            </div>
            {total > 9 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="mt-3 w-full py-2 rounded-lg text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-white/5"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--pw-glass-border)',
                  color: 'var(--pw-text-tertiary)',
                }}
              >
                {showAll ? '↑ Show Less' : `↓ Show All ${total} Results`}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
