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
type SubTab = 'drivers' | 'teams';

const SERIES_TABS: SeriesTab[] = ['f1', 'wec', 'elms', 'imsa', 'motogp', 'dtm', 'wrc'];
const LOGO_FILTER = 'grayscale(1) contrast(2) brightness(3)';

/* ── Series logo tab button — matches Dashboard filter bar ── */
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

/* ── Sub-toggle: Drivers / Teams ── */
function SubToggle({ sub, setSub, accent }: { sub: SubTab; setSub: (s: SubTab) => void; accent: string }) {
  return (
    <div className="flex gap-1 mb-3 p-0.5 rounded-lg w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
      {(['drivers', 'teams'] as SubTab[]).map((s) => (
        <button
          key={s}
          onClick={() => setSub(s)}
          className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md transition-all duration-150"
          style={{
            background: sub === s ? `${accent}22` : 'transparent',
            color: sub === s ? accent : 'var(--pw-text-tertiary)',
            border: sub === s ? `1px solid ${accent}35` : '1px solid transparent',
          }}
        >
          {s}
        </button>
      ))}
    </div>
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

/* ── Driver row ── */
function DriverRow({ d, maxPts, f1 = false }: { d: DriverStanding; maxPts: number; f1?: boolean }) {
  return (
    <motion.div className="flex items-center gap-2 py-1.5"
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d.pos * 0.03 }}>
      <span className="w-5 text-[11px] font-bold tabular-nums text-right shrink-0"
        style={{ color: d.pos <= 3 ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}>
        {d.pos}
      </span>
      <TeamLogo teamName={d.team} teamColor={d.teamColor} f1={f1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{d.name}</span>
          <span className="text-xs font-bold tabular-nums ml-2 shrink-0">{d.points}</span>
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
  return (
    <motion.div className="flex items-center gap-2 py-1.5"
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: c.pos * 0.03 }}>
      <span className="w-5 text-[11px] font-bold tabular-nums text-right shrink-0"
        style={{ color: c.pos <= 3 ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}>
        {c.pos}
      </span>
      <TeamLogo teamName={c.name} teamColor={c.color} f1={f1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{c.name}</span>
          <span className="text-xs font-bold tabular-nums ml-2 shrink-0">{c.points}</span>
        </div>
        {c.roundPoints
          ? <Sparkline points={c.roundPoints} color={c.color} maxPts={maxPts} />
          : <div style={{ height: 14 }} />
        }
      </div>
    </motion.div>
  );
}

/* ── Multi-class section ── */
function ClassSection({ title, data, note, accent, badgeSrc, f1 = false, isTeams = false }: {
  title: string;
  data: (DriverStanding | ConstructorStanding)[];
  note: string;
  accent: string;
  badgeSrc?: string;
  f1?: boolean;
  isTeams?: boolean;
}) {
  const maxPts = (data[0]?.points ?? 1) as number;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-2 mb-1.5">
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
      <div className="space-y-0">
        {data.map((item, i) =>
          isTeams
            ? <ConstructorRow key={i} c={item as ConstructorStanding} maxPts={maxPts} f1={f1} />
            : <DriverRow key={i} d={{ ...(item as DriverStanding), pos: i + 1 }} maxPts={maxPts} f1={f1} />
        )}
      </div>
      <p className="text-[9px] mt-1.5 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>{note}</p>
    </div>
  );
}

/* ── Note footer ── */
function Note({ children }: { children: string }) {
  return <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>{children}</p>;
}

/* ── Main panel ── */
export default function StandingsPanel({ defaultTab }: { defaultTab?: SeriesTab } = {}) {
  const [activeTab, setActiveTab] = useState<SeriesTab>(defaultTab ?? 'f1');
  const [sub, setSub] = useState<SubTab>('drivers');
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

  const accent = SERIES_META[activeTab]?.accent ?? '#E10600';

  const handleTabChange = (s: SeriesTab) => {
    setActiveTab(s);
    setSub('drivers');
  };

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
                <SeriesTabButton key={s} series={s} isActive={activeTab === s} onClick={() => handleTabChange(s)} />
              ))}
            </div>

            {/* Drivers / Teams sub-toggle — non-F1 only */}
            {activeTab !== 'f1' && <SubToggle sub={sub} setSub={setSub} accent={accent} />}

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab === 'f1' ? 'f1' : `${activeTab}-${sub}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}>

                {/* ── F1 — side-by-side drivers + constructors ── */}
                {activeTab === 'f1' && (
                  <div>
                    <div className="grid grid-cols-2 gap-x-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2"
                          style={{ color: 'var(--pw-text-tertiary)' }}>Drivers</p>
                        <div className="space-y-0">
                          {f1Drivers.map((d) => <DriverRow key={d.pos} d={d} maxPts={f1Drivers[0].points} f1 />)}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2"
                          style={{ color: 'var(--pw-text-tertiary)' }}>Constructors</p>
                        <div className="space-y-0">
                          {f1Constructors.map((c) => <ConstructorRow key={c.pos} c={c} maxPts={f1Constructors[0].points} f1 />)}
                        </div>
                      </div>
                    </div>
                    <Note>{f1Round ? `After Round ${f1Round}` : 'After Round 5 · Canadian GP'}</Note>
                  </div>
                )}

                {/* ── MotoGP ── */}
                {activeTab === 'motogp' && sub === 'drivers' && (
                  <div className="space-y-0">
                    {MOTOGP_RIDERS_2026.map((d) => <DriverRow key={d.pos} d={d} maxPts={MOTOGP_RIDERS_2026[0].points} />)}
                    <Note>After Round 6 · Catalan GP</Note>
                  </div>
                )}
                {activeTab === 'motogp' && sub === 'teams' && (
                  <div className="space-y-0">
                    {MOTOGP_TEAMS_2026.map((c) => <ConstructorRow key={c.pos} c={c} maxPts={MOTOGP_TEAMS_2026[0].points} />)}
                    <Note>After Round 6 · Catalan GP</Note>
                  </div>
                )}

                {/* ── WEC ── */}
                {activeTab === 'wec' && sub === 'drivers' && (
                  <div>
                    <ClassSection title="Hypercar" data={WEC_DRIVERS_2026} note="After R2 · 6H Spa-Francorchamps" accent="#8C1A1A" badgeSrc="/logos/class-hypercar.svg" />
                    <ClassSection title="LMGT3" data={WEC_LMGT3_DRIVERS_2026} note="After R2 · 6H Spa-Francorchamps" accent="#1A6B38" badgeSrc="/logos/class-lmgt3.svg" />
                  </div>
                )}
                {activeTab === 'wec' && sub === 'teams' && (
                  <div>
                    <ClassSection title="Hypercar" data={WEC_MANUFACTURERS_2026} note="After R2 · 6H Spa-Francorchamps" accent="#8C1A1A" badgeSrc="/logos/class-hypercar.svg" isTeams />
                    <ClassSection title="LMGT3" data={WEC_LMGT3_MANUFACTURERS_2026} note="After R2 · 6H Spa-Francorchamps" accent="#1A6B38" badgeSrc="/logos/class-lmgt3.svg" isTeams />
                  </div>
                )}

                {/* ── WRC ── */}
                {activeTab === 'wrc' && sub === 'drivers' && (
                  <div className="space-y-0">
                    {WRC_DRIVERS_2026.map((d) => <DriverRow key={d.pos} d={d} maxPts={WRC_DRIVERS_2026[0].points} />)}
                    <Note>After Round 6 · Rally of Portugal</Note>
                  </div>
                )}
                {activeTab === 'wrc' && sub === 'teams' && (
                  <div className="space-y-0">
                    {WRC_MANUFACTURERS_2026.map((c) => <ConstructorRow key={c.pos} c={c} maxPts={WRC_MANUFACTURERS_2026[0].points} />)}
                    <Note>After Round 6 · Rally of Portugal</Note>
                  </div>
                )}

                {/* ── IMSA ── */}
                {activeTab === 'imsa' && sub === 'drivers' && (
                  <div>
                    <ClassSection title="GTP" data={IMSA_GTP_DRIVERS_2026} note="After R4 · Laguna Seca" accent="#C0A062" />
                    <ClassSection title="GTD Pro" data={IMSA_GTD_PRO_DRIVERS_2026} note="After R4 · Laguna Seca" accent="#FF6B35" />
                    <ClassSection title="GTD" data={IMSA_GTD_DRIVERS_2026} note="After R4 · Laguna Seca" accent="#B8A0D0" />
                  </div>
                )}
                {activeTab === 'imsa' && sub === 'teams' && (
                  <div>
                    <ClassSection title="GTP" data={IMSA_GTP_TEAMS_2026} note="After R4 · Laguna Seca" accent="#C0A062" isTeams />
                    <ClassSection title="GTD Pro" data={IMSA_GTDPRO_TEAMS_2026} note="After R4 · Laguna Seca" accent="#FF6B35" isTeams />
                    <ClassSection title="GTD" data={IMSA_GTD_TEAMS_2026} note="After R4 · Laguna Seca" accent="#B8A0D0" isTeams />
                  </div>
                )}

                {/* ── DTM ── */}
                {activeTab === 'dtm' && sub === 'drivers' && (
                  <div className="space-y-0">
                    {DTM_DRIVERS_2026.map((d, i) => (
                      <DriverRow key={`${d.pos}-${d.name}`} d={{ ...d, pos: i + 1 }} maxPts={DTM_DRIVERS_2026[0].points} />
                    ))}
                    <Note>After Round 1 · Red Bull Ring</Note>
                  </div>
                )}
                {activeTab === 'dtm' && sub === 'teams' && (
                  <div className="space-y-0">
                    {DTM_MANUFACTURERS_2026.map((c) => <ConstructorRow key={c.pos} c={c} maxPts={DTM_MANUFACTURERS_2026[0].points} />)}
                    <Note>After Round 1 · Red Bull Ring</Note>
                  </div>
                )}

                {/* ── ELMS ── */}
                {activeTab === 'elms' && sub === 'drivers' && (
                  <div>
                    <ClassSection title="LMP2" data={ELMS_LMP2_DRIVERS_2026} note="After R2 · 4H Le Castellet" accent="#1E4B8C" badgeSrc="/logos/class-lmp2.svg" />
                    <ClassSection title="LMP3" data={ELMS_LMP3_DRIVERS_2026} note="After R2 · 4H Le Castellet" accent="#4A2090" badgeSrc="/logos/class-lmp3.svg" />
                    <ClassSection title="LMGT3" data={ELMS_LMGT3_DRIVERS_2026} note="After R2 · 4H Le Castellet" accent="#1A6B38" badgeSrc="/logos/class-lmgt3.svg" />
                  </div>
                )}
                {activeTab === 'elms' && sub === 'teams' && (
                  <div>
                    <ClassSection title="LMP2" data={ELMS_LMP2_TEAMS_2026} note="After R2 · 4H Le Castellet" accent="#1E4B8C" badgeSrc="/logos/class-lmp2.svg" isTeams />
                    <ClassSection title="LMP3" data={ELMS_LMP3_TEAMS_2026} note="After R2 · 4H Le Castellet" accent="#4A2090" badgeSrc="/logos/class-lmp3.svg" isTeams />
                    <ClassSection title="LMGT3" data={ELMS_LMGT3_TEAMS_2026} note="After R2 · 4H Le Castellet" accent="#1A6B38" badgeSrc="/logos/class-lmgt3.svg" isTeams />
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
