'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SERIES_META } from '@/types';
import type { SessionResults, WeekendSessionType, RaceResult } from '@/types';
import { useStore } from '@/store';
import { getTeamLogo } from '@/lib/teamLogos';
import StarRating from '@/components/ui/StarRating';
import { useMobileSheet } from '@/lib/useMobileSheet';
import SheetGrip from '@/components/ui/SheetGrip';
import SpoilerBlur from '@/components/ui/SpoilerBlur';

// ─── Diary editor (feature 5) ───────────────────────────────────────────────────
// Watched + rating + note for a finished race. Persists to the diary store with a
// denormalized snapshot so the DiaryView survives after the race leaves the feed.
function DiaryEditor({ result, accentColor }: { result: RaceResult; accentColor: string }) {
  const entry = useStore((s) => s.diary[result.id]);
  const setDiaryEntry = useStore((s) => s.setDiaryEntry);
  const toggleWatched = useStore((s) => s.toggleWatched);
  const showToast = useStore((s) => s.showToast);
  const meta = { eventName: result.name, series: result.series, eventDate: result.date };
  const watched = entry?.watched ?? false;

  return (
    <div className="relative mt-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--pw-glass-border)' }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--pw-text-tertiary)' }}>
          Your Log
        </span>
        <button
          onClick={() => {
            toggleWatched(result.id, meta);
            showToast(watched ? 'Removed from watched' : 'Marked as watched');
          }}
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full transition-colors"
          style={{
            background: watched ? `${accentColor}20` : 'var(--pw-glass-bg)',
            border: `1px solid ${watched ? accentColor : 'var(--pw-glass-border)'}`,
            color: watched ? accentColor : 'var(--pw-text-tertiary)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {watched ? <polyline points="20 6 9 17 4 12" /> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
          </svg>
          {watched ? 'Watched' : 'Mark watched'}
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2.5">
        <StarRating
          value={entry?.rating ?? 0}
          onChange={(n) => {
            setDiaryEntry(result.id, { rating: n, ...meta });
            showToast(n > 0 ? `Rated ${n}/5` : 'Rating cleared');
          }}
          size={18}
        />
        {entry?.rating ? (
          <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>{entry.rating}/5</span>
        ) : null}
      </div>
      <textarea
        value={entry?.note ?? ''}
        onChange={(e) => setDiaryEntry(result.id, { note: e.target.value, ...meta })}
        placeholder="Add a note — best overtake, last-lap drama, verdict…"
        rows={2}
        className="w-full text-xs rounded-md px-2.5 py-2 resize-none outline-none transition-colors"
        style={{ background: 'var(--pw-bg-primary)', border: '1px solid var(--pw-glass-border)', color: 'var(--pw-text-secondary)' }}
      />
    </div>
  );
}

// ─── Session tab config ────────────────────────────────────────────────────────

const SESSION_ORDER: WeekendSessionType[] = ['race', 'sprint', 'qualifying', 'fp3', 'fp2', 'fp1'];

const SESSION_LABELS: Record<WeekendSessionType, string> = {
  race: 'Race',
  sprint: 'Sprint',
  sprint_qualifying: 'Sprint Quali',
  qualifying: 'Qualifying',
  fp3: 'FP3',
  fp2: 'FP2',
  fp1: 'FP1',
};

// ─── Position badge ────────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: number }) {
  const styles: Record<number, { bg: string; color: string; border: string }> = {
    1: { bg: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', border: 'rgba(255, 215, 0, 0.35)' },
    2: { bg: 'rgba(192, 192, 192, 0.15)', color: '#C0C0C0', border: 'rgba(192, 192, 192, 0.35)' },
    3: { bg: 'rgba(205, 127, 50, 0.15)', color: '#CD7F32', border: 'rgba(205, 127, 50, 0.35)' },
  };
  const s = styles[pos] ?? {
    bg: 'rgba(255,255,255,0.06)',
    color: 'var(--pw-text-secondary)',
    border: 'rgba(255,255,255,0.1)',
  };
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {pos}
    </div>
  );
}

// ─── Team logo ─────────────────────────────────────────────────────────────────

function TeamLogo({ team, isF1 }: { team: string; isF1: boolean }) {
  const logo = getTeamLogo(team, isF1);
  if (!logo) return null;
  const style: React.CSSProperties = logo.white
    ? { opacity: 0.95 }
    : logo.cssFilter
    ? { filter: logo.cssFilter, opacity: 0.92 }
    : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 };

  return (
    <div className="w-8 h-6 shrink-0 flex items-center justify-center overflow-hidden">
      <Image
        src={logo.src}
        alt={team}
        width={32}
        height={logo.png ? 20 : 16}
        className="object-contain"
        style={{ height: logo.png ? 20 : 16, width: 'auto', maxWidth: 32, ...style }}
      />
    </div>
  );
}

// ─── Results table row ─────────────────────────────────────────────────────────

function ResultRow({
  entry,
  isF1,
  showQualColumns,
  accentColor,
}: {
  entry: { pos: number; driver: string; team: string; time?: string; gap?: string; q1Time?: string; q2Time?: string; q3Time?: string; eliminatedInQ?: 1 | 2; dnf?: boolean };
  isF1: boolean;
  showQualColumns: boolean;
  accentColor: string;
}) {
  const isTop3 = entry.pos <= 3;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: entry.pos * 0.018 }}
      className="flex items-center gap-2.5 py-2 px-3 rounded-lg"
      style={{
        background: isTop3 ? `${accentColor}08` : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <PosBadge pos={entry.pos} />
      <TeamLogo team={entry.team} isF1={isF1} />
      <div className="flex-1 min-w-0">
        <span
          className="text-xs font-medium truncate block"
          style={{ opacity: entry.dnf ? 0.45 : 1 }}
        >
          {entry.driver}
          {entry.dnf && (
            <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider opacity-50">DNF</span>
          )}
        </span>
        <span className="text-[10px] truncate block" style={{ color: 'var(--pw-text-tertiary)' }}>
          {entry.team}
        </span>
      </div>

      {showQualColumns ? (
        <div className="flex gap-2 shrink-0">
          {(['q1Time', 'q2Time', 'q3Time'] as const).map((key, i) => {
            const val = entry[key];
            const eliminated = entry.eliminatedInQ === i + 1;
            return (
              <div key={key} className="text-right w-[62px]">
                <span
                  className="text-[10px] font-mono"
                  style={{
                    color: val ? (eliminated ? 'var(--pw-text-tertiary)' : 'var(--pw-text-secondary)') : 'var(--pw-text-tertiary)',
                    opacity: eliminated ? 0.4 : 1,
                  }}
                >
                  {val ?? '—'}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--pw-text-secondary)' }}>
          {entry.pos === 1 ? entry.time : (entry.gap ?? entry.time ?? '—')}
        </span>
      )}
    </motion.div>
  );
}

// ─── Session tab content ───────────────────────────────────────────────────────

function SessionTab({
  session,
  isF1,
  accentColor,
}: {
  session: SessionResults;
  isF1: boolean;
  accentColor: string;
}) {
  const isQual = session.type === 'qualifying' || session.type === 'sprint_qualifying';

  return (
    <div className="space-y-0.5">
      {isQual && (
        <div className="flex items-center gap-2.5 py-1 px-3 mb-1">
          <div className="w-6 shrink-0" />
          <div className="w-8 shrink-0" />
          <div className="flex-1" />
          <div className="flex gap-2 shrink-0">
            {['Q1', 'Q2', 'Q3'].map((q) => (
              <div key={q} className="text-right w-[62px]">
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {session.entries.map((entry) => (
        <ResultRow
          key={entry.pos}
          entry={entry}
          isF1={isF1}
          showQualColumns={isQual}
          accentColor={accentColor}
        />
      ))}
      {(session.fastestLap || session.fastestLapTime) && (
        <div
          className="flex items-center gap-1.5 mt-3 px-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={accentColor} strokeWidth="1.5" />
            <path d="M8 4.5v4l2.5 1.5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>
            FL: <span style={{ color: 'var(--pw-text-secondary)' }}>{session.fastestLap}</span>
            {session.fastestLapTime && (
              <span className="font-mono ml-1.5" style={{ color: accentColor }}>
                {session.fastestLapTime}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── F1 weekend data fetcher ───────────────────────────────────────────────────

interface WeekendApiResponse {
  round: string;
  raceName?: string;
  sessions: SessionResults[];
}

// Fetches /api/{series}/weekend/{round} — works for F1 (Jolpica) and MotoGP
// (PulseLive). Other series have no live weekend endpoint → series is null.
function useWeekendData(series: 'f1' | 'motogp' | null, round: number | null) {
  const [data, setData] = useState<WeekendApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (s: string, r: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${s}/weekend/${r}`);
      if (res.ok) {
        const json = await res.json() as WeekendApiResponse;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setData(null);
    if (series && round !== null) {
      fetchData(series, round);
    }
  }, [series, round, fetchData]);

  return { data, loading };
}

// ─── Main overlay ──────────────────────────────────────────────────────────────

export default function RaceWeekendOverlay() {
  const { selectedResult: result, closeResult } = useStore();

  const isF1 = result?.series === 'f1';
  // F1 + MotoGP have live weekend endpoints; other series fall back to static.
  const liveSeries = result?.series === 'f1' ? 'f1'
    : result?.series === 'motogp' ? 'motogp'
    : null;
  const { data: weekendData, loading: weekendLoading } = useWeekendData(
    liveSeries,
    liveSeries && result ? result.round : null,
  );

  // Sessions: F1/MotoGP use API data; others use static data
  const sessions: SessionResults[] = liveSeries
    ? (weekendData?.sessions ?? [])
    : (result?.sessions ?? []);

  // Sort sessions in display order (race first)
  const sortedSessions = SESSION_ORDER
    .map((type) => sessions.find((s) => s.type === type))
    .filter(Boolean) as SessionResults[];

  const [activeTab, setActiveTab] = useState<WeekendSessionType>('race');

  // Reset to first available tab when result changes
  useEffect(() => {
    if (sortedSessions.length > 0) {
      setActiveTab(sortedSessions[0].type);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.id, weekendData]);

  // Lock body scroll when overlay open
  useEffect(() => {
    if (result) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [result]);

  // Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeResult();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeResult]);

  const meta = result ? SERIES_META[result.series] : null;
  const accentColor = meta?.accent ?? '#ffffff';

  const activeSession = sortedSessions.find((s) => s.type === activeTab);
  const { isMobile, dragControls, sheetMotionProps, sheetStyle } = useMobileSheet(closeResult);

  // Spoiler Shield — blur session results until the race is marked watched
  const spoilerShield = useStore((s) => s.spoilerShield);
  const diaryEntry = useStore((s) => (result ? s.diary[result.id] : undefined));
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setRevealed(false); }, [result?.id]);
  const hideSpoilers = spoilerShield && !(diaryEntry?.watched ?? false) && !revealed;

  return (
    <AnimatePresence>
      {result && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            style={{ zIndex: 'var(--pw-z-overlay)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeResult}
          />

          {/* Panel — flex col, NO overflow on panel itself so header+tabs never scroll away.
              Right slide-out on desktop, bottom sheet on phones. */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-[540px] flex flex-col"
            style={{ zIndex: 'var(--pw-z-modal)', background: 'var(--pw-bg-elevated)', ...(isMobile ? { ...sheetStyle, overflow: 'hidden' } : null) }}
            {...(isMobile
              ? sheetMotionProps
              : {
                  initial: { x: 600 },
                  animate: { x: 0 },
                  exit: { x: 600 },
                  transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
                })}
          >
            {isMobile && <SheetGrip onPointerDown={(e) => dragControls.start(e)} />}
            {/* Accent top border */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />

            {/* Close button — lives at panel level, never clipped */}
            <button
              onClick={closeResult}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', zIndex: 10 }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Header hero area — shrink-0 so it never scrolls away */}
            <div className="shrink-0 relative pt-8 pb-4 px-5 overflow-hidden">
              {/* Background gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}20 0%, var(--pw-bg-elevated) 65%)`,
                }}
              />
              {/* Series watermark logo */}
              {meta?.logo && (() => {
                const isNonTransparent = /\.(png|jpg|jpeg)$/i.test(meta.logo);
                return (
                  <div
                    className="absolute right-4 top-10 pointer-events-none select-none"
                    style={isNonTransparent ? {
                      opacity: 0.55,
                      mixBlendMode: 'screen',
                      maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                    } : {
                      opacity: 0.18,
                    }}
                  >
                    <Image
                      src={meta.logo}
                      alt=""
                      width={96}
                      height={96}
                      className="object-contain"
                      style={{
                        width: 96,
                        height: 96,
                        ...(isNonTransparent && { filter: 'grayscale(1) contrast(2) brightness(3)' }),
                      }}
                    />
                  </div>
                );
              })()}

              <div className="relative">
                {/* Series badge + round — pr-10 clears the close button on the right */}
                <div className="flex items-center gap-2 mb-3 pr-10">
                  <span
                    className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{
                      background: `${accentColor}18`,
                      color: accentColor,
                      border: `1px solid ${accentColor}25`,
                    }}
                  >
                    {meta?.logo && (
                      <Image src={meta.logo} alt="" width={11} height={11} className="object-contain inline-block flex-shrink-0" style={{ opacity: 0.9 }} />
                    )}
                    {meta?.name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
                    R{result.round}
                  </span>
                </div>

                <h2 className="text-xl font-bold leading-tight mb-1">{result.name}</h2>
                <p className="text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
                  {result.circuit} · {result.country}
                </p>
                <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--pw-text-tertiary)' }}>
                  {new Date(result.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>

                {/* Podium quick-glance */}
                <div className="flex gap-3 mt-4">
                  {result.podium.slice(0, 3).map((p) => (
                    <div key={p.pos} className="flex items-center gap-1.5">
                      <PosBadge pos={p.pos} />
                      <div>
                        <p className="text-xs font-medium leading-tight">{p.driver.split(' ').pop()}</p>
                        <p className="text-[9px] leading-tight" style={{ color: 'var(--pw-text-tertiary)' }}>{p.team.split(' ')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal race diary — watched / rating / note */}
                <DiaryEditor result={result} accentColor={accentColor} />
              </div>
            </div>

            {/* Session tabs — shrink-0 so always visible, never scrolls away */}
            <div
              className="shrink-0 px-4 py-2 flex gap-1 overflow-x-auto scrollbar-hide"
              style={{ background: 'var(--pw-bg-elevated)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {sortedSessions.map((s) => {
                const isActive = activeTab === s.type;
                return (
                  <button
                    key={s.type}
                    onClick={() => setActiveTab(s.type)}
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all shrink-0"
                    style={{
                      background: isActive ? `${accentColor}20` : 'transparent',
                      color: isActive ? accentColor : 'var(--pw-text-tertiary)',
                      border: isActive ? `1px solid ${accentColor}35` : '1px solid transparent',
                    }}
                  >
                    {s.label ?? SESSION_LABELS[s.type]}
                  </button>
                );
              })}
              {/* FP tabs as placeholders if no data */}
              {sortedSessions.length > 0 && !sessions.find((s) => s.type === 'fp1') && (
                ['FP1', 'FP2', 'FP3'].map((fp) => (
                  <button
                    key={fp}
                    disabled
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap opacity-30 cursor-not-allowed shrink-0"
                    style={{ color: 'var(--pw-text-tertiary)', border: '1px solid transparent' }}
                  >
                    {fp}
                  </button>
                ))
              )}
            </div>

            {/* Session content — flex-1 + overflow-y-auto: ONLY this section scrolls */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {weekendLoading && liveSeries ? (
                <div className="flex items-center justify-center py-16 gap-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="text-sm">Loading session data…</span>
                </div>
              ) : sortedSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                  <p className="text-sm font-medium" style={{ color: 'var(--pw-text-secondary)' }}>Session data not available</p>
                  <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Check back after the race weekend</p>
                </div>
              ) : activeSession ? (
                <SpoilerBlur hidden={hideSpoilers} onReveal={() => setRevealed(true)}>
                  <SessionTab session={activeSession} isF1={isF1} accentColor={accentColor} />
                </SpoilerBlur>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
