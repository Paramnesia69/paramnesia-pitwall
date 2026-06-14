'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import type { WECTimingData, WECTimingEntry, WECRaceLogItem } from '@/types';

/**
 * Full-screen WEC live-timing board — a broadcast-style timing screen showing
 * every car across every class with the full live telemetry the FIA WEC backend
 * exposes (tyre + age, last lap, S1/S2/S3 sectors, best lap, class gap + interval,
 * hybrid energy, pit stops, running status). Opened from WECTimingPanel; polls 20s.
 */

interface Props {
  accentColor: string;
  onClose: () => void;
  /** Timing API to poll — defaults to WEC. ELMS passes /api/elms/timing. */
  endpoint?: string;
  /** Board heading (e.g. "Le Mans 24H" or the ELMS circuit name). */
  title?: string;
}

const CLASS_COLOR: Record<string, string> = {
  HYPERCAR: '#E10600',
  LMP2: '#1E4B8C',
  'LMP2 Pro/Am': '#2C72C7',
  LMP3: '#4A2090',
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

/** Closing (gap shrinking) = green ▾; pulling away = muted ▴. */
function TrendArrow({ t }: { t: string }) {
  if (t === 'closing') return <span style={{ color: '#36C24A', fontSize: 9 }} title="closing">▾</span>;
  if (t === 'growing') return <span style={{ color: '#9aa0a6', fontSize: 9 }} title="pulling away">▴</span>;
  return null;
}

const BATTLE_COLOR = '#FF8C2B';
const PIT_COLOR = '#F5C518';
const LOG_COLOR: Record<string, string> = {
  Overtake: '#36C24A', FastestLap: '#B14BFF', Battle: '#FF8C2B',
  PitIn: '#F5C518', PitOut: '#F5C518', RCMessage: '#E06A6A',
  SignificantTimeLoss: '#E06A6A', DriverSwap: 'var(--pw-text-tertiary)',
};

/** Plays the official commentary MP3 on tap (no autoplay). */
function PlayPhrase({ url, accent }: { url: string; accent: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  if (!url) {
    return (
      <span className="shrink-0" style={{ color: accent }} aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2M7 8v8M11 5v14M15 9v6M19 7v10" /></svg>
      </span>
    );
  }
  const toggle = () => {
    let a = audioRef.current;
    if (!a) { a = new Audio(url); a.onended = () => setPlaying(false); audioRef.current = a; }
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  };
  return (
    <button onClick={toggle} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full active:scale-90" style={{ background: `${accent}22`, color: accent }} aria-label={playing ? 'Pause commentary' : 'Play commentary'}>
      {playing ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      )}
    </button>
  );
}

function RaceLogDrawer({ items, accent, onClose }: { items: WECRaceLogItem[]; accent: string; onClose: () => void }) {
  return (
    <motion.div
      className="absolute top-0 right-0 bottom-0 z-20 flex flex-col"
      style={{ width: 'min(340px, 86vw)', background: 'var(--pw-bg-elevated)', borderLeft: '1px solid var(--pw-glass-border)', boxShadow: '-24px 0 80px rgba(0,0,0,0.6)' }}
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--pw-glass-border)', paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ ...ORBITRON, color: 'var(--pw-text-primary)' }}>Race Log</h3>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: 'var(--pw-glass-bg)', color: 'var(--pw-text-secondary)' }} aria-label="Close race log">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {items.length === 0 && <p className="p-4 text-[11px]" style={{ color: 'var(--pw-text-tertiary)' }}>No events yet.</p>}
        {items.map((it) => (
          <div key={it.id} className="flex items-start gap-2.5 px-4 py-2" style={{ borderBottom: '1px solid var(--pw-glass-border)' }}>
            <span className="shrink-0 mt-0.5 rounded-full" style={{ width: 6, height: 6, background: LOG_COLOR[it.type] ?? 'var(--pw-text-tertiary)' }} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] leading-snug" style={{ color: 'var(--pw-text-secondary)' }}>{it.text}</p>
            </div>
            {it.lap > 0 && <span className="shrink-0 text-[9px] tabular-nums" style={{ ...ORBITRON, color: 'var(--pw-text-tertiary)' }}>L{it.lap}</span>}
          </div>
        ))}
      </div>
    </motion.div>
  );
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
        boxShadow: e.inBattle && !out ? `inset 3px 0 0 ${BATTLE_COLOR}` : undefined,
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
            {!out && e.inPit && <span className="px-1 rounded-sm font-bold uppercase shrink-0" style={{ background: `${PIT_COLOR}22`, color: PIT_COLOR, fontSize: 8 }}>PIT</span>}
            {!out && e.inBattle && <span className="px-1 rounded-sm font-bold uppercase shrink-0" style={{ background: `${BATTLE_COLOR}22`, color: BATTLE_COLOR, fontSize: 8 }}>BATTLE</span>}
            {!out && !e.inBattle && e.strikeLaps > 0 && (
              <span className="px-1 rounded-sm font-bold shrink-0 tabular-nums" title="laps to catch the car ahead" style={{ background: '#36C24A1e', color: '#36C24A', fontSize: 8 }}>◢{e.strikeLaps.toFixed(1)}L</span>
            )}
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
      <span className="tabular-nums text-right text-[10px] inline-flex items-center justify-end gap-0.5" style={{ ...ORBITRON, color: 'var(--pw-text-tertiary)' }}><TrendArrow t={e.trend} />{e.gapAhead === 'LEADER' ? '—' : e.gapAhead}</span>
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

export default function WECTimingBoard({ accentColor, onClose, endpoint = '/api/wec/timing', title = 'Le Mans 24H' }: Props) {
  const [data, setData] = useState<WECTimingData | null>(null);
  const [logOpen, setLogOpen] = useState(false);

  const fetchTiming = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      if (res.ok) setData(await res.json());
    } catch { /* keep last good */ }
  }, [endpoint]);

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
          <h2 className="text-sm font-bold uppercase tracking-wider truncate" style={{ ...ORBITRON, color: 'var(--pw-text-primary)' }}>Live Timing · {title}</h2>
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
        <div className="flex items-center gap-2 shrink-0">
          {data?.raceLog && data.raceLog.length > 0 && (
            <button
              onClick={() => setLogOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 h-9 rounded-full text-[10px] font-bold uppercase tracking-wide active:scale-95"
              style={{ background: logOpen ? `${accentColor}26` : 'var(--pw-glass-bg)', border: `1px solid ${logOpen ? `${accentColor}70` : 'var(--pw-glass-border)'}`, color: logOpen ? accentColor : 'var(--pw-text-secondary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
              Race Log
            </button>
          )}
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'var(--pw-glass-bg)', color: 'var(--pw-text-secondary)' }} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Live commentary ticker */}
      {data?.commentary && (
        <div className="flex items-center gap-2.5 px-5 py-2 shrink-0" style={{ borderBottom: '1px solid var(--pw-glass-border)', background: `${accentColor}0c` }}>
          <PlayPhrase url={data.commentary.audioUrl} accent={accentColor} />
          <p className="text-[11px] leading-snug truncate" style={{ color: 'var(--pw-text-secondary)' }}>{data.commentary.phrase}</p>
        </div>
      )}

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

      <AnimatePresence>
        {logOpen && data?.raceLog && (
          <RaceLogDrawer items={data.raceLog} accent={accentColor} onClose={() => setLogOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
