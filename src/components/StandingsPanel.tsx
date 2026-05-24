'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import {
  F1_DRIVERS_2026,
  F1_CONSTRUCTORS_2026,
  MOTOGP_RIDERS_2026,
  WEC_DRIVERS_2026,
  WEC_LMGT3_DRIVERS_2026,
  WRC_DRIVERS_2026,
  IMSA_GTP_DRIVERS_2026,
  IMSA_GTD_PRO_DRIVERS_2026,
  IMSA_GTD_DRIVERS_2026,
  DTM_DRIVERS_2026,
} from '@/data/standings-2026';
import type { DriverStanding, ConstructorStanding } from '@/data/standings-2026';

type StandingsTab = 'f1-drivers' | 'f1-constructors' | 'motogp' | 'wec' | 'wrc' | 'imsa' | 'dtm';

const TABS: { id: StandingsTab; label: string; accent: string }[] = [
  { id: 'f1-drivers', label: 'F1 Drivers', accent: '#E10600' },
  { id: 'f1-constructors', label: 'F1 Teams', accent: '#E10600' },
  { id: 'motogp', label: 'MotoGP', accent: '#BE0A14' },
  { id: 'wec', label: 'WEC', accent: '#0090D4' },
  { id: 'wrc', label: 'WRC', accent: '#003082' },
  { id: 'imsa', label: 'IMSA', accent: '#C0A062' },
  { id: 'dtm', label: 'DTM', accent: '#1E88E5' },
];

function TeamLogo({ teamName, teamColor, f1 = false }: { teamName: string; teamColor: string; f1?: boolean }) {
  const logo = getTeamLogo(teamName, f1);
  if (logo) {
    const isPng = !!logo.png;
    return (
      <div
        className="shrink-0 flex items-center justify-center overflow-hidden"
        style={{ width: isPng ? 46 : 40, height: isPng ? 30 : 24 }}
      >
        <img
          src={logo.src}
          alt={teamName}
          style={{
            height: logo.white ? 18 : isPng ? 26 : 20,
            width: 'auto',
            maxWidth: isPng ? 46 : 40,
            objectFit: 'contain',
            ...(logo.white
              ? { opacity: 0.95 }
              : logo.cssFilter !== undefined
              ? { filter: logo.cssFilter, opacity: 0.92 }
              : { filter: 'brightness(1.1) saturate(1.4) contrast(1.0)', opacity: 0.95 }
            ),
          }}
        />
      </div>
    );
  }
  return <div className="w-1 h-4 rounded-full shrink-0" style={{ background: teamColor }} />;
}

function DriverRow({ d, maxPts, f1 = false }: { d: DriverStanding; maxPts: number; f1?: boolean }) {
  const barWidth = maxPts > 0 ? (d.points / maxPts) * 100 : 0;
  return (
    <motion.div
      className="flex items-center gap-2 py-1.5 group"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: d.pos * 0.03 }}
    >
      <span
        className="w-5 text-[11px] font-bold tabular-nums text-right shrink-0"
        style={{ color: d.pos <= 3 ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
      >
        {d.pos}
      </span>
      <TeamLogo teamName={d.team} teamColor={d.teamColor} f1={f1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{d.name}</span>
          <span className="text-xs font-bold tabular-nums ml-2 shrink-0">{d.points}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--pw-glass-bg)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: d.teamColor }}
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.6, delay: d.pos * 0.05, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ConstructorRow({ c, maxPts }: { c: ConstructorStanding; maxPts: number }) {
  const barWidth = maxPts > 0 ? (c.points / maxPts) * 100 : 0;
  return (
    <motion.div
      className="flex items-center gap-2 py-1.5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: c.pos * 0.03 }}
    >
      <span
        className="w-5 text-[11px] font-bold tabular-nums text-right shrink-0"
        style={{ color: c.pos <= 3 ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
      >
        {c.pos}
      </span>
      <TeamLogo teamName={c.name} teamColor={c.color} f1={true} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{c.name}</span>
          <span className="text-xs font-bold tabular-nums ml-2 shrink-0">{c.points}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--pw-glass-bg)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: c.color }}
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.6, delay: c.pos * 0.05, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ClassSection({
  title,
  data,
  note,
  accent,
  f1 = false,
}: {
  title: string;
  data: DriverStanding[];
  note: string;
  accent: string;
  f1?: boolean;
}) {
  const maxPts = data[0]?.points ?? 1;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
          style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          {title}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
      </div>
      <div className="space-y-0">
        {data.map((d, i) => (
          <DriverRow key={`${title}-${i}`} d={{ ...d, pos: i + 1 }} maxPts={maxPts} f1={f1} />
        ))}
      </div>
      <p className="text-[9px] mt-1.5 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
        {note}
      </p>
    </div>
  );
}

export default function StandingsPanel() {
  const [activeTab, setActiveTab] = useState<StandingsTab>('f1-drivers');
  const [expanded, setExpanded] = useState(true);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, type: 'spring', stiffness: 150, damping: 20 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
        <h3
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          Championship Standings
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
            className="pw-glass p-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* Tab selector */}
            <div className="flex gap-1 mb-4 p-1 rounded-lg overflow-x-auto" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="text-[11px] font-medium py-1.5 px-3 rounded-md transition-all duration-200 whitespace-nowrap shrink-0"
                  style={{
                    background: activeTab === tab.id ? `${tab.accent}20` : 'transparent',
                    color: activeTab === tab.id ? tab.accent : 'var(--pw-text-tertiary)',
                    border: activeTab === tab.id ? `1px solid ${tab.accent}30` : '1px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'f1-drivers' && (
                  <div className="space-y-0">
                    {F1_DRIVERS_2026.map((d) => (
                      <DriverRow key={d.pos} d={d} maxPts={F1_DRIVERS_2026[0].points} f1 />
                    ))}
                    <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
                      After Round 4 · Miami GP
                    </p>
                  </div>
                )}
                {activeTab === 'f1-constructors' && (
                  <div className="space-y-0">
                    {F1_CONSTRUCTORS_2026.map((c) => (
                      <ConstructorRow key={c.pos} c={c} maxPts={F1_CONSTRUCTORS_2026[0].points} />
                    ))}
                    <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
                      After Round 4 · Miami GP
                    </p>
                  </div>
                )}
                {activeTab === 'motogp' && (
                  <div className="space-y-0">
                    {MOTOGP_RIDERS_2026.map((d) => (
                      <DriverRow key={d.pos} d={d} maxPts={MOTOGP_RIDERS_2026[0].points} />
                    ))}
                    <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
                      After Round 6 · Catalan GP
                    </p>
                  </div>
                )}
                {activeTab === 'wec' && (
                  <div>
                    <ClassSection
                      title="Hypercar"
                      data={WEC_DRIVERS_2026}
                      note="After R2 · 6H Spa-Francorchamps"
                      accent="#0090D4"
                    />
                    <ClassSection
                      title="LMGT3"
                      data={WEC_LMGT3_DRIVERS_2026}
                      note="After R2 · 6H Spa-Francorchamps"
                      accent="#00B86E"
                    />
                  </div>
                )}
                {activeTab === 'wrc' && (
                  <div className="space-y-0">
                    {WRC_DRIVERS_2026.map((d) => (
                      <DriverRow key={d.pos} d={d} maxPts={WRC_DRIVERS_2026[0].points} />
                    ))}
                    <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
                      After Round 6 · Rally of Portugal
                    </p>
                  </div>
                )}
                {activeTab === 'imsa' && (
                  <div>
                    <ClassSection
                      title="GTP"
                      data={IMSA_GTP_DRIVERS_2026}
                      note="After R4 · Laguna Seca"
                      accent="#C0A062"
                    />
                    <ClassSection
                      title="GTD Pro"
                      data={IMSA_GTD_PRO_DRIVERS_2026}
                      note="After R4 · Laguna Seca"
                      accent="#FF6B35"
                    />
                    <ClassSection
                      title="GTD"
                      data={IMSA_GTD_DRIVERS_2026}
                      note="After R4 · Laguna Seca"
                      accent="#B8A0D0"
                    />
                  </div>
                )}
                {activeTab === 'dtm' && (
                  <div className="space-y-0">
                    {DTM_DRIVERS_2026.map((d, i) => (
                      <DriverRow key={`${d.pos}-${d.name}`} d={{ ...d, pos: i + 1 }} maxPts={DTM_DRIVERS_2026[0].points} />
                    ))}
                    <p className="text-[9px] mt-3 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
                      After Round 1 · Red Bull Ring
                    </p>
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
