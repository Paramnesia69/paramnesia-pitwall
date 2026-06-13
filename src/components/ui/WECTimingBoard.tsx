'use client';

import { useState, useEffect, useCallback } from 'react';
import { m as motion } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import type { WECTimingData, WECTimingEntry } from '@/types';

/**
 * Full-screen WEC live-timing board — a broadcast-style timing screen showing
 * every car across every class with the full live telemetry the FIA WEC backend
 * exposes (tyre + age, last lap, S1/S2/S3 sectors, best lap, class gap + interval,
 * hybrid energy, pit stops, running status). Opened from WECTimingPanel; polls 20s.
 */

interface Props {
  accentColor: string;
  onClose: () => void;
}

const CLASS_COLOR: Record<string, string> = {
  HYPERCAR: '#E10600',
  LMP2: '#1E4B8C',
  LMGT3: '#1A6B38',
};
const FLAG_COLOR: Record<string, string> = {
  Green: '#36C24A', Yellow: '#F5C518', Red: '#E10600', FCY: '#F5C518', SC: '#F5C518',
  Checkered: '#E6E6E6', Chequered: '#E6E6E6',
};
const TYRE_IMG: Record<string, string> = {
  Soft: '/tyres/wec/soft-v3.png', Medium: '/tyres/wec/medium-v3.png',
  Hard: '/tyres/wec/hard-v3.png', Wet: '/tyres/wec/wet-v3.png',
};

function lapColor(c: string): string {
  return c === 'Purple' ? '#B14BFF' : c === 'Green' ? '#36C24A' : 'var(--pw-text-secondary)';
}
function isOut(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'dnf' || s === 'retired' || s === 'stopped' || s === 'dns' || s === 'dsq';
}

// Wide table: a fixed grid so the header and every row align.
const GRID = '30px 38px minmax(150px,1fr) 50px 70px 58px 58px 58px 70px 66px 60px 68px 34px';

function TyreCell({ e }: { e: WECTimingEntry }) {
  const img = TYRE_IMG[e.tyre];
  return (
    <div className="flex items-center gap-1.5">
      {img ? (
        <img src={img} alt={e.tyre} width={22} height={19} style={{ width: 22, height: 'auto' }} />
      ) : (
        <span className="text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>{e.tyre || '—'}</span>
      )}
      {e.tyreAge >= 0 && <span className="text-[9px] tabular-nums" style={{ color: 'var(--pw-text-tertiary)' }}>{e.tyreAge}L</span>}
    </div>
  );
}

function EnergyCell({ pct, col }: { pct: number; col: string }) {
  if (pct < 0) return <span className="text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>—</span>;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pw-glass-border)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: col }} />
      </div>
      <span className="text-[9px] tabular-nums w-6 text-right" style={{ color: 'var(--pw-text-secondary)' }}>{pct}</span>
    </div>
  );
}

const ORBITRON = { fontFamily: 'var(--font-orbitron, monospace)' };

function Row({ e, idx, total, col }: { e: WECTimingEntry; idx: number; total: number; col: string }) {
  const leader = e.classPos === 1;
  const out = isOut(e.status);
  const logo = getTeamLogo(e.manufacturer);
  return (
    <div
      className="grid items-center px-3 py-1.5 text-[11px]"
      style={{
        gridTemplateColumns: GRID,
        columnGap: 8,
        borderBottom: idx < total - 1 ? '1px solid var(--pw-glass-border)' : undefined,
        background: leader && !out ? `${col}10` : undefined,
        opacity: out ? 0.45 : 1,
      }}
    >
      <span className="text-right font-bold tabular-nums" style={{ ...ORBITRON, color: leader ? col : 'var(--pw-text-tertiary)' }}>{e.classPos}</span>
      <span className="font-bold tabular-nums" style={{ color: 'var(--pw-text-secondary)' }}>#{e.number}</span>
      <div className="min-w-0 flex items-center gap-2">
        {logo && (
          <img src={logo.src} alt="" style={{ height: logo.png ? 17 : 14, width: 'auto', maxWidth: 26, objectFit: 'contain',
            ...(logo.white ? { opacity: 0.95 } : logo.cssFilter != null ? { filter: logo.cssFilter, opacity: 0.92 } : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)' }) }} />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold flex items-center gap-1.5" style={{ color: 'var(--pw-text-primary)' }}>
            {e.team}
            {out && <span className="px-1 rounded-sm font-bold uppercase shrink-0" style={{ background: '#E1060022', color: '#FF6B6B', fontSize: 8 }}>{e.status || 'OUT'}</span>}
          </p>
          {e.drivers.length > 0 && <p className="truncate text-[9px]" style={{ color: 'var(--pw-text-tertiary)' }}>{e.drivers.join(' · ')}</p>}
        </div>
      </div>
      <TyreCell e={e} />
      <span className="tabular-nums text-right" style={{ ...ORBITRON, color: lapColor(e.lastLapColor) }}>{e.lastLapTime || '—'}</span>
      {[0, 1, 2].map((i) => (
        <span key={i} className="tabular-nums text-right text-[10px]" style={{ ...ORBITRON, color: e.sectors[i] ? lapColor(e.sectors[i].color) : 'var(--pw-text-tertiary)' }}>
          {e.sectors[i]?.time || '—'}
        </span>
      ))}
      <span className="tabular-nums text-right" style={{ ...ORBITRON, color: lapColor(e.bestLapColor) }}>{e.bestLapTime || '—'}</span>
      <span className="tabular-nums text-right font-bold" style={{ ...ORBITRON, color: leader ? col : 'var(--pw-text-secondary)' }}>{e.gapClass}</span>
      <span className="tabular-nums text-right text-[10px]" style={{ ...ORBITRON, color: 'var(--pw-text-tertiary)' }}>{e.gapAhead === 'LEADER' ? '—' : e.gapAhead}</span>
      <EnergyCell pct={e.energyPct} col={col} />
      <span className="tabular-nums text-right text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>{e.pitStops || '—'}</span>
    </div>
  );
}

function HeaderRow() {
  const cells = ['POS', '#', 'TEAM', 'TYRE', 'LAST', 'S1', 'S2', 'S3', 'BEST', 'GAP', 'INT', 'ENERGY', 'PIT'];
  const aligns = ['right', 'left', 'left', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left', 'right'];
  return (
    <div className="grid items-center px-3 py-1.5 sticky top-0 z-10" style={{ gridTemplateColumns: GRID, columnGap: 8, background: 'var(--pw-bg-elevated)', borderBottom: '1px solid var(--pw-glass-border)' }}>
      {cells.map((c, i) => (
        <span key={c} className="text-[8.5px] font-bold uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)', textAlign: aligns[i] as 'left' | 'right' }}>{c}</span>
      ))}
    </div>
  );
}

export default function WECTimingBoard({ accentColor, onClose }: Props) {
  const [data, setData] = useState<WECTimingData | null>(null);

  const fetchTiming = useCallback(async () => {
    try {
      const res = await fetch('/api/wec/timing');
      if (res.ok) setData(await res.json());
    } catch { /* keep last good */ }
  }, []);

  useEffect(() => {
    fetchTiming();
    const id = setInterval(fetchTiming, 20_000);
    return () => clearInterval(id);
  }, [fetchTiming]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const flagColor = data?.flag ? FLAG_COLOR[data.flag] ?? null : null;

  return (
    <motion.div
      className="fixed inset-0 z-[460] flex flex-col"
      style={{ background: 'color-mix(in srgb, var(--pw-bg-primary) 96%, transparent)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--pw-glass-border)', paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-sm font-bold uppercase tracking-wider truncate" style={{ ...ORBITRON, color: 'var(--pw-text-primary)' }}>Live Timing · Le Mans 24H</h2>
          {data?.status === 'live' && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: accentColor }}>
              <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: accentColor }} />Live
            </span>
          )}
          {flagColor && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: flagColor }}>
              <span className="rounded-sm" style={{ width: 8, height: 8, background: flagColor, boxShadow: `0 0 6px ${flagColor}` }} />{data!.flag}
            </span>
          )}
          {data?.leaderLap != null && <span className="text-[10px] uppercase tracking-wide tabular-nums" style={{ color: 'var(--pw-text-tertiary)' }}>Lap {data.leaderLap}</span>}
        </div>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: 'var(--pw-glass-bg)', color: 'var(--pw-text-secondary)' }} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Conditions strip */}
      {data?.weather && (
        <div className="flex items-center gap-4 px-5 py-1.5 text-[10px] tabular-nums shrink-0" style={{ borderBottom: '1px solid var(--pw-glass-border)', color: 'var(--pw-text-tertiary)' }}>
          <span>Air <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.airTemp.toFixed(0)}°</span></span>
          <span>Track <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.trackTemp.toFixed(0)}°</span></span>
          <span>Humidity <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.humidity}%</span></span>
          {data.weather.windKph > 0 && <span>Wind <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.windDir} {data.weather.windKph}kph</span></span>}
          {data.weather.sky && <span className="capitalize">{data.weather.sky.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}</span>}
        </div>
      )}

      {/* Scrollable board */}
      <div className="flex-1 overflow-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ minWidth: 760 }}>
          {!data && <div className="p-6 space-y-2">{[...Array(10)].map((_, i) => <div key={i} className="pw-skeleton h-8 rounded" />)}</div>}
          {data?.classes.map((c) => {
            const col = CLASS_COLOR[c.name] ?? accentColor;
            return (
              <div key={c.name}>
                <div className="px-5 py-2 flex items-center gap-2 sticky top-0 z-20" style={{ background: `${col}1c`, borderTop: `1px solid ${col}40`, borderBottom: `1px solid ${col}30` }}>
                  <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: col }}>{c.name}</span>
                  <span className="text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>{c.entries.length} cars</span>
                </div>
                <HeaderRow />
                {c.entries.map((e, i) => <Row key={e.number} e={e} idx={i} total={c.entries.length} col={col} />)}
              </div>
            );
          })}
          {data && data.classes.length === 0 && (
            <p className="p-6 text-[12px]" style={{ color: 'var(--pw-text-secondary)' }}>Live classification appears shortly after the start is timed.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
