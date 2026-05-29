'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import { SERIES_META } from '@/types';
import {
  F1_DRIVERS_2026,
  F1_CONSTRUCTORS_2026,
  MOTOGP_RIDERS_2026,
  MOTOGP_TEAMS_2026,
  WEC_DRIVERS_2026,
  WEC_LMGT3_DRIVERS_2026,
  WEC_MANUFACTURERS_2026,
  WEC_LMGT3_MANUFACTURERS_2026,
  WRC_DRIVERS_2026,
  WRC_MANUFACTURERS_2026,
  IMSA_GTP_DRIVERS_2026,
  IMSA_GTD_PRO_DRIVERS_2026,
  IMSA_GTD_DRIVERS_2026,
  IMSA_GTP_TEAMS_2026,
  IMSA_GTDPRO_TEAMS_2026,
  IMSA_GTD_TEAMS_2026,
  DTM_DRIVERS_2026,
  DTM_MANUFACTURERS_2026,
  ELMS_LMP2_DRIVERS_2026,
  ELMS_LMP2_TEAMS_2026,
  ELMS_LMP3_DRIVERS_2026,
  ELMS_LMP3_TEAMS_2026,
  ELMS_LMGT3_DRIVERS_2026,
  ELMS_LMGT3_TEAMS_2026,
} from '@/data/standings-2026';
import type { DriverStanding, ConstructorStanding } from '@/data/standings-2026';

type SeriesTab = 'f1' | 'motogp' | 'wec' | 'wrc' | 'imsa' | 'dtm' | 'elms';

const SERIES_TABS: SeriesTab[] = ['f1', 'wec', 'elms', 'imsa', 'motogp', 'dtm', 'wrc'];
const LOGO_FILTER = 'grayscale(1) contrast(2) brightness(3)';

/* ── Series logo tab button ── */
function SeriesTabButton({ series, isActive, onClick }: { series: SeriesTab; isActive: boolean; onClick: () => void }) {
  const meta = SERIES_META[series];
  if (!meta) return null;
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      title={meta.name}
      className="relative flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        width: 64,
        height: 36,
        background: isActive ? `${meta.accent}22` : 'var(--pw-glass-bg)',
        border: `1px solid ${isActive ? meta.accent : 'var(--pw-glass-border)'}`,
        boxShadow: isActive ? `0 0 16px ${meta.accent}44` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
      }}
    >
      {meta.logo ? (
        <div
          className="absolute inset-0"
          style={{
            opacity: isActive ? 0.9 : 0.45,
            maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
            transition: 'opacity 0.2s',
          }}
        >
          <div className="absolute inset-2">
            <Image src={meta.logo} alt={meta.name} fill className="object-contain"
              style={{ filter: LOGO_FILTER, mixBlendMode: 'screen' }} />
          </div>
        </div>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase tracking-wider"
          style={{ color: isActive ? meta.accent : 'var(--pw-text-tertiary)' }}>
          {meta.name}
        </span>
      )}
    </motion.button>
  );
}

/* ── Points trajectory sparkline ── */
function Sparkline({ points, color, maxPts }: { points: number[]; color: string; maxPts: number }) {
  const W = 56, H = 14;
  const n = points.length;
  if (n < 2) return null;
  const xStep = W / (n - 1);
  const norm = (v: number) => H - Math.max(0, (v / maxPts) * H * 0.88);
  const pts = points.map((p, i) => `${(i * xStep).toFixed(1)},${norm(p).toFixed(1)}`).join(' ');
  const lastX = ((n - 1) * xStep).toFixed(1);
  const lastY = norm(points[n - 1]).toFixed(1);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0 overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity={0.65} />
      <circle cx={lastX} cy={lastY} r="2.2" fill={color} opacity={0.9} />
    </svg>
  );
}

/* ── Team constructor logo ── */
function TeamLogo({ teamName, teamColor, f1 = false }: { teamName: string; teamColor: string; f1?: boolean }) {
  const logo = getTeamLogo(teamName, f1);
  if (logo) {
    const isPng = !!logo.png;
    return (
      <div className="shrink-0 flex items-center justify-center overflow-hidden"
        style={{ width: isPng ? 46 : 40, height: isPng ? 30 : 24 }}>
        <img src={logo.src} alt={teamName} style={{
          height: logo.white ? 18 : isPng ? 26 : 20,
          width: 'auto',
          maxWidth: isPng ? 46 : 40,
          objectFit: 'contain',
          ...(logo.white
            ? { opacity: 0.95 }
            : logo.cssFilter !== undefined
            ? { filter: logo.cssFilter, opacity: 0.92 }
            : { filter: 'brightness(1.1) saturate(1.4) contrast(1.0)', opacity: 0.95 }),
        }} />
      </div>
    );
  }
  return <div className="w-1 h-4 rounded-full shrink-0" style={{ background: teamColor }} />;
}

/* ── Delta badge (▲2 / ▼1) ── */
function DeltaBadge({ current, prev }: { current: number; prev: number }) {
  if (prev === current) return null;
  const gained = prev > current;
  const n = Math.abs(prev - current);
  return (
    <span className="shrink-0 text-[9px] font-bold tabular-nums" style={{ color: gained ? '#22c55e' : '#ef4444' }}>
      {gained ? '▲' : '▼'}{n}
    </span>
  );
}

/* ── Driver row ── */
function DriverRow({ d, maxPts, f1 = false }: { d: DriverStanding; maxPts: number; f1?: boolean }) {
  const gap = maxPts - d.points;
  return (
    <motion.div className="flex items-center gap-2 py-1.5"
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d.pos * 0.03 }}>
      <div className="flex items-center gap-1 shrink-0" style={{ minWidth: 28 }}>
        <span className="text-[11px] font-bold tabular-nums"
          style={{ color: d.pos <= 3 ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}>
          {d.pos}
        </span>
        {d.prevPos !== undefined && <DeltaBadge current={d.pos} prev={d.prevPos} />}
      </div>
      <TeamLogo teamName={d.team} teamColor={d.teamColor} f1={f1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{d.name}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {gap > 0 && (
              <span className="text-[9px] tabular-nums" style={{ color: 'var(--pw-text-tertiary)' }}>–{gap}</span>
            )}
            <span className="text-xs font-bold tabular-nums">{d.points}</span>
          </div>
        </div>
        {d.roundPoints
          ? <Sparkline points={d.roundPoints} color={d.teamColor} maxPts={maxPts} />
          : <div style={{ height: 14 }} />
        }
      </div>
    </motion.div>
  );
}

/* ── Constructor / team row ── */
function ConstructorRow({ c, maxPts, f1 = false }: { c: ConstructorStanding; maxPts: number; f1?: boolean }) {
  const gap = maxPts - c.points;
  return (
    <motion.div className="flex items-center gap-2 py-1.5"
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: c.pos * 0.03 }}>
      <div className="flex items-center gap-1 shrink-0" style={{ minWidth: 28 }}>
        <span className="text-[11px] font-bold tabular-nums"
          style={{ color: c.pos <= 3 ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}>
          {c.pos}
        </span>
        {c.prevPos !== undefined && <DeltaBadge current={c.pos} prev={c.prevPos} />}
      </div>
      <TeamLogo teamName={c.name} teamColor={c.color} f1={f1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{c.name}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {gap > 0 && (
              <span className="text-[9px] tabular-nums" style={{ color: 'var(--pw-text-tertiary)' }}>–{gap}</span>
            )}
            <span className="text-xs font-bold tabular-nums">{c.points}</span>
          </div>
        </div>
        {c.roundPoints
          ? <Sparkline points={c.roundPoints} color={c.color} maxPts={maxPts} />
          : <div style={{ height: 14 }} />
        }
      </div>
    </motion.div>
  );
}

/* ── Side-by-side two-column grid with optional expand ── */
function ExpandableGrid({
  leftLabel, leftData, rightLabel, rightData,
  maxLeftPts, maxRightPts, defaultLimit = Infinity, note, f1 = false,
}: {
  leftLabel: string;
  leftData: DriverStanding[];
  rightLabel: string;
  rightData: ConstructorStanding[];
  maxLeftPts: number;
  maxRightPts: number;
  defaultLimit?: number;
  note?: string;
  f1?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsExpand = leftData.length > defaultLimit || rightData.length > defaultLimit;
  const visLeft = expanded ? leftData : leftData.slice(0, defaultLimit);
  const visRight = expanded ? rightData : rightData.slice(0, defaultLimit);
  const totalAll = Math.max(leftData.length, rightData.length);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 0' }}>
        <div className="pr-5">
          <div className="flex items-center gap-2 mb-2 pb-1.5" style={{ borderBottom: '1px solid var(--pw-glass-border)' }}>
            <div className="w-0.5 h-3 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.35)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'rgba(255,255,255,0.65)' }}>{leftLabel}</p>
          </div>
          <div className="space-y-0">
            {visLeft.map((d, i) =>
              <DriverRow key={i} d={{ ...d, pos: i + 1 }} maxPts={maxLeftPts} f1={f1} />
            )}
          </div>
        </div>
        <div style={{ background: 'var(--pw-glass-border)', margin: '0 12px' }} />
        <div className="pl-5">
          <div className="flex items-center gap-2 mb-2 pb-1.5" style={{ borderBottom: '1px solid var(--pw-glass-border)' }}>
            <div className="w-0.5 h-3 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.35)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'rgba(255,255,255,0.65)' }}>{rightLabel}</p>
          </div>
          <div className="space-y-0">
            {visRight.map((c, i) =>
              <ConstructorRow key={i} c={{ ...c, pos: i + 1 }} maxPts={maxRightPts} f1={f1} />
            )}
          </div>
        </div>
      </div>
      {needsExpand && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 py-1.5 text-[10px] uppercase tracking-wider rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)', border: '1px solid var(--pw-glass-border)' }}
        >
          {expanded ? 'Show top 10' : `Show all ${totalAll}`}
        </button>
      )}
      {note && <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>{note}</p>}
    </div>
  );
}

/* ── Multi-class section (badge header + side-by-side grid) ── */
function ClassSection({
  title, driverData, driverLabel = 'Drivers', teamData, teamLabel = 'Teams',
  note, accent, badgeSrc, f1 = false, defaultLimit = Infinity,
}: {
  title: string;
  driverData: DriverStanding[];
  driverLabel?: string;
  teamData: ConstructorStanding[];
  teamLabel?: string;
  note: string;
  accent: string;
  badgeSrc?: string;
  f1?: boolean;
  defaultLimit?: number;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        {badgeSrc ? (
          <img src={badgeSrc} alt={title} style={{ height: 20, width: 'auto', borderRadius: 3, flexShrink: 0 }} />
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
            style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}>
            {title}
          </span>
        )}
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
      </div>
      <ExpandableGrid
        leftLabel={driverLabel} leftData={driverData} maxLeftPts={driverData[0]?.points ?? 1}
        rightLabel={teamLabel} rightData={teamData} maxRightPts={teamData[0]?.points ?? 1}
        note={note} defaultLimit={defaultLimit} f1={f1}
      />
    </div>
  );
}

/* ── Main panel ── */
export default function StandingsPanel({ defaultTab }: { defaultTab?: SeriesTab } = {}) {
  const [activeTab, setActiveTab] = useState<SeriesTab>(defaultTab ?? 'f1');
  const [expanded, setExpanded] = useState(true);
  const [f1Drivers, setF1Drivers] = useState<DriverStanding[]>(F1_DRIVERS_2026);
  const [f1Constructors, setF1Constructors] = useState<ConstructorStanding[]>(F1_CONSTRUCTORS_2026);
  const [f1Round, setF1Round] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/f1/standings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.drivers?.length) {
          setF1Drivers(data.drivers.map((d: DriverStanding) => {
            const s = F1_DRIVERS_2026.find(x => x.name === d.name);
            return s?.roundPoints ? { ...d, roundPoints: s.roundPoints } : d;
          }));
        }
        if (data?.constructors?.length) {
          setF1Constructors(data.constructors.map((c: ConstructorStanding) => {
            const s = F1_CONSTRUCTORS_2026.find(x => x.name === c.name);
            return s?.roundPoints ? { ...c, roundPoints: s.roundPoints } : c;
          }));
        }
        if (data?.round) setF1Round(data.round);
      })
      .catch(() => {});
  }, []);

  return (
    <motion.section className="mb-8"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, type: 'spring', stiffness: 150, damping: 20 }}>

      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--pw-text-tertiary)' }}>
          Championship Standings
        </h3>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <button onClick={() => setExpanded(!expanded)}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors hover:bg-white/5"
          style={{ color: 'var(--pw-text-tertiary)' }}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div className="pw-glass p-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}>

            {/* Logo tab bar */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {SERIES_TABS.map((s) => (
                <SeriesTabButton key={s} series={s} isActive={activeTab === s} onClick={() => setActiveTab(s)} />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}>

                {/* ── F1 ── */}
                {activeTab === 'f1' && (
                  <ExpandableGrid
                    leftLabel="Drivers" leftData={f1Drivers} maxLeftPts={f1Drivers[0]?.points ?? 1}
                    rightLabel="Constructors" rightData={f1Constructors} maxRightPts={f1Constructors[0]?.points ?? 1}
                    defaultLimit={10} f1
                    note={f1Round ? `After Round ${f1Round}` : 'After Round 5 · Canadian GP'}
                  />
                )}

                {/* ── MotoGP ── */}
                {activeTab === 'motogp' && (
                  <ExpandableGrid
                    leftLabel="Riders" leftData={MOTOGP_RIDERS_2026} maxLeftPts={MOTOGP_RIDERS_2026[0].points}
                    rightLabel="Teams" rightData={MOTOGP_TEAMS_2026} maxRightPts={MOTOGP_TEAMS_2026[0].points}
                    defaultLimit={10}
                    note="After Round 6 · Catalan GP"
                  />
                )}

                {/* ── WEC ── */}
                {activeTab === 'wec' && (
                  <div>
                    <ClassSection
                      title="Hypercar" driverLabel="Drivers" teamLabel="Manufacturers"
                      driverData={WEC_DRIVERS_2026} teamData={WEC_MANUFACTURERS_2026}
                      note="After R2 · 6H Spa-Francorchamps" accent="#8C1A1A"
                      badgeSrc="/logos/class-hypercar.svg" defaultLimit={10}
                    />
                    <ClassSection
                      title="LMGT3" driverLabel="Drivers" teamLabel="Manufacturers"
                      driverData={WEC_LMGT3_DRIVERS_2026} teamData={WEC_LMGT3_MANUFACTURERS_2026}
                      note="After R2 · 6H Spa-Francorchamps" accent="#1A6B38"
                      badgeSrc="/logos/class-lmgt3.svg"
                    />
                  </div>
                )}

                {/* ── WRC ── */}
                {activeTab === 'wrc' && (
                  <ExpandableGrid
                    leftLabel="Drivers" leftData={WRC_DRIVERS_2026} maxLeftPts={WRC_DRIVERS_2026[0].points}
                    rightLabel="Manufacturers" rightData={WRC_MANUFACTURERS_2026} maxRightPts={WRC_MANUFACTURERS_2026[0].points}
                    note="After Round 6 · Rally of Portugal"
                  />
                )}

                {/* ── IMSA ── */}
                {activeTab === 'imsa' && (
                  <div>
                    <ClassSection
                      title="GTP"
                      driverData={IMSA_GTP_DRIVERS_2026} teamData={IMSA_GTP_TEAMS_2026}
                      note="After R4 · Laguna Seca" accent="#C0A062"
                    />
                    <ClassSection
                      title="GTD Pro"
                      driverData={IMSA_GTD_PRO_DRIVERS_2026} teamData={IMSA_GTDPRO_TEAMS_2026}
                      note="After R4 · Laguna Seca" accent="#FF6B35"
                    />
                    <ClassSection
                      title="GTD"
                      driverData={IMSA_GTD_DRIVERS_2026} teamData={IMSA_GTD_TEAMS_2026}
                      note="After R4 · Laguna Seca" accent="#B8A0D0"
                    />
                  </div>
                )}

                {/* ── DTM ── */}
                {activeTab === 'dtm' && (
                  <ExpandableGrid
                    leftLabel="Drivers" leftData={DTM_DRIVERS_2026} maxLeftPts={DTM_DRIVERS_2026[0].points}
                    rightLabel="Manufacturers" rightData={DTM_MANUFACTURERS_2026} maxRightPts={DTM_MANUFACTURERS_2026[0].points}
                    note="After Round 2 · Zandvoort"
                  />
                )}

                {/* ── ELMS ── */}
                {activeTab === 'elms' && (
                  <div>
                    <ClassSection
                      title="LMP2"
                      driverData={ELMS_LMP2_DRIVERS_2026} teamData={ELMS_LMP2_TEAMS_2026}
                      note="After R2 · 4H Le Castellet" accent="#1E4B8C"
                      badgeSrc="/logos/class-lmp2.svg" defaultLimit={10}
                    />
                    <ClassSection
                      title="LMP3"
                      driverData={ELMS_LMP3_DRIVERS_2026} teamData={ELMS_LMP3_TEAMS_2026}
                      note="After R2 · 4H Le Castellet" accent="#4A2090"
                      badgeSrc="/logos/class-lmp3.svg"
                    />
                    <ClassSection
                      title="LMGT3"
                      driverData={ELMS_LMGT3_DRIVERS_2026} teamData={ELMS_LMGT3_TEAMS_2026}
                      note="After R2 · 4H Le Castellet" accent="#1A6B38"
                      badgeSrc="/logos/class-lmgt3.svg"
                    />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
