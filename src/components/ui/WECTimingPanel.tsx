'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getTeamLogo } from '@/lib/teamLogos';
import WECTimingBoard from './WECTimingBoard';
import type { WECTimingData, WECTimingEntry } from '@/types';

interface Props {
  accentColor: string;
  eventState: string;
}

/** Class accent colours — official ELMS/ACO race-plate palette.
 * Drives each class's active tab (banner) + its leaderboard accent. */
const CLASS_COLOR: Record<string, string> = {
  HYPERCAR: '#E10600', // red
  LMP2: '#1E4B8C',     // blue
  LMGT3: '#1A6B38',    // green
};

/** Race-flag accent colours for the live header. */
const FLAG_COLOR: Record<string, string> = {
  Green: '#36C24A',
  Yellow: '#F5C518',
  Red: '#E10600',
  FCY: '#F5C518',
  SC: '#F5C518',
  Checkered: '#E6E6E6',
  Chequered: '#E6E6E6',
};

/** Tyre-compound dot colours (Griiip live). */
const TYRE_COLOR: Record<string, string> = {
  Soft: '#E2143C',
  Medium: '#F5C518',
  Hard: '#E6E6E6',
  Wet: '#2C8FE0',
  Intermediate: '#36C24A',
};

/** A car is "out" when its running status isn't actively running/classified. */
function isOut(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'dnf' || s === 'retired' || s === 'stopped' || s === 'dns' || s === 'dsq';
}

function ManufacturerLogo({ entry, fallback }: { entry: WECTimingEntry; fallback: string }) {
  const logo = getTeamLogo(entry.manufacturer);
  if (!logo) {
    return <span className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: fallback }} />;
  }
  return (
    <div className="w-9 h-6 flex-shrink-0 flex items-center justify-center overflow-hidden">
      <img
        src={logo.src}
        alt={entry.manufacturer}
        style={{
          height: logo.png ? 20 : 16,
          width: 'auto',
          maxWidth: 36,
          objectFit: 'contain',
          ...(logo.white
            ? { opacity: 0.95 }
            : logo.cssFilter !== undefined
              ? { filter: logo.cssFilter, opacity: 0.92 }
              : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }),
        }}
      />
    </div>
  );
}

export default function WECTimingPanel({ accentColor, eventState }: Props) {
  const [data, setData] = useState<WECTimingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);

  const fetchTiming = useCallback(async () => {
    try {
      const res = await fetch('/api/wec/timing');
      if (res.ok) setData(await res.json());
    } catch {
      /* keep last good data */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiming();
    if (eventState === 'live' || eventState === 'starting_soon') {
      const id = setInterval(fetchTiming, 20_000);
      return () => clearInterval(id);
    }
  }, [fetchTiming, eventState]);

  if (loading) {
    return (
      <div className="mb-6">
        <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>Live Classification</h4>
        <div className="pw-glass p-1 space-y-px">
          {[...Array(6)].map((_, i) => <div key={i} className="pw-skeleton h-9 rounded" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Race not yet timed (first minutes) or no longer available.
  if (data.status === 'pending' || data.classes.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>Live Classification</h4>
        <div className="pw-glass px-4 py-3 flex items-start gap-3" style={{ borderColor: `${accentColor}25` }}>
          <span className="rounded-full animate-pulse mt-1 shrink-0" style={{ width: 6, height: 6, background: accentColor }} />
          <p className="text-[11px] leading-snug" style={{ color: 'var(--pw-text-secondary)' }}>
            {data.status === 'pending'
              ? 'Live classification appears shortly after the start is timed.'
              : 'Classification unavailable.'}
          </p>
        </div>
      </div>
    );
  }

  const activeTab = tab ?? data.classes[0].name;
  const active = data.classes.find((c) => c.name === activeTab) ?? data.classes[0];
  const isLive = data.status === 'live';
  const liveSource = data.source === 'live';
  const flagColor = FLAG_COLOR[data.flag ?? ''] ?? null;

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--pw-text-tertiary)' }}>Live Classification</h4>
          {isLive && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase" style={{ color: accentColor }}>
              <span className="rounded-full animate-pulse" style={{ width: 5, height: 5, background: accentColor, display: 'inline-block' }} />
              Live
            </span>
          )}
          {flagColor && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide" style={{ color: flagColor }}>
              <span className="rounded-sm" style={{ width: 7, height: 7, background: flagColor, display: 'inline-block', boxShadow: `0 0 5px ${flagColor}` }} />
              {data.flag}
            </span>
          )}
          {liveSource && data.leaderLap != null && (
            <span className="text-[9px] uppercase tracking-wide tabular-nums" style={{ color: 'var(--pw-text-tertiary)' }}>· Lap {data.leaderLap}</span>
          )}
          {!liveSource && data.hour && (
            <span className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--pw-text-tertiary)' }}>· Hour {data.hour}</span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBoardOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide transition-colors active:scale-95"
            style={{ background: `${accentColor}1a`, border: `1px solid ${accentColor}40`, color: accentColor }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            Full board
          </button>
          <a href="https://www.fiawec.com" target="_blank" rel="noopener noreferrer" className="text-[9px] hover:opacity-80 transition-opacity" style={{ color: 'var(--pw-text-tertiary)' }}>
            {liveSource ? 'via FIA WEC' : 'via Al Kamel'}
          </a>
        </div>
      </div>

      <AnimatePresence>
        {boardOpen && <WECTimingBoard accentColor={accentColor} onClose={() => setBoardOpen(false)} />}
      </AnimatePresence>

      {/* Live conditions strip */}
      {data.weather && (
        <div className="flex items-center gap-3 mb-2 px-3 py-1.5 rounded-md text-[9px] tabular-nums" style={{ background: 'var(--pw-glass-bg)', color: 'var(--pw-text-tertiary)' }}>
          <span>Air <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.airTemp.toFixed(0)}°</span></span>
          <span>Track <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.trackTemp.toFixed(0)}°</span></span>
          <span>Hum <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.humidity}%</span></span>
          {data.weather.windKph > 0 && <span>Wind <span style={{ color: 'var(--pw-text-secondary)' }}>{data.weather.windDir} {data.weather.windKph}</span></span>}
          {data.weather.sky && <span className="capitalize">{data.weather.sky.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}</span>}
        </div>
      )}

      {/* Live commentary */}
      {data.commentary?.phrase && (
        <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded-md" style={{ background: `${accentColor}0e`, border: `1px solid ${accentColor}22` }}>
          <span className="shrink-0 mt-0.5" style={{ color: accentColor }} aria-hidden>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2M7 8v8M11 5v14M15 9v6M19 7v10" /></svg>
          </span>
          <p className="text-[10px] leading-snug" style={{ color: 'var(--pw-text-secondary)' }}>{data.commentary.phrase}</p>
        </div>
      )}

      {/* Class tabs */}
      <div className="flex gap-1.5 mb-2">
        {data.classes.map((c) => {
          const col = CLASS_COLOR[c.name] ?? accentColor;
          const on = c.name === activeTab;
          // Each class always wears its own colour — active is brighter,
          // inactive is the same hue dimmed (never changes colour = no flapping).
          return (
            <button
              key={c.name}
              onClick={() => setTab(c.name)}
              className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-colors active:scale-95"
              style={{
                background: on ? `${col}26` : `${col}0d`,
                border: `1px solid ${on ? `${col}70` : `${col}2e`}`,
                color: on ? col : `${col}b0`,
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Class leaderboard */}
      <div className="pw-glass overflow-hidden max-h-[420px] overflow-y-auto">
        {active.entries.map((e, idx) => {
          const col = CLASS_COLOR[active.name] ?? accentColor;
          const leader = e.classPos === 1;
          const out = isOut(e.status);
          const tyreCol = TYRE_COLOR[e.tyre] ?? null;
          const bestCol = e.bestLapColor === 'Purple' ? '#B14BFF' : e.bestLapColor === 'Green' ? '#36C24A' : 'var(--pw-text-secondary)';
          return (
            <div
              key={e.number}
              className="px-3 py-2"
              style={{
                borderBottom: idx < active.entries.length - 1 ? '1px solid var(--pw-glass-border)' : undefined,
                background: leader && !out ? `${col}0e` : undefined,
                opacity: out ? 0.5 : 1,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 text-right text-xs font-bold flex-shrink-0 tabular-nums" style={{ color: leader ? col : 'var(--pw-text-tertiary)', fontFamily: 'var(--font-orbitron, monospace)' }}>
                  {e.classPos}
                </span>
                <span className="w-7 text-[11px] font-bold flex-shrink-0 tabular-nums" style={{ color: 'var(--pw-text-secondary)' }}>#{e.number}</span>
                <ManufacturerLogo entry={e} fallback={col} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate flex items-center gap-1.5" style={{ color: 'var(--pw-text-primary)' }}>
                    {e.team}
                    {out && (
                      <span className="px-1 rounded-sm font-bold uppercase tracking-wide flex-shrink-0" style={{ background: '#E1060022', color: '#FF6B6B', fontSize: 8 }}>{e.status || 'OUT'}</span>
                    )}
                  </p>
                  {e.drivers.length > 0 && (
                    <p className="text-[9px] truncate" style={{ color: 'var(--pw-text-tertiary)' }}>{e.drivers.join(' · ')}</p>
                  )}
                  {(e.bestLapTime || e.kph || e.tyre || e.pitStops > 0) && (
                    <p className="text-[9px] truncate flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>
                      {e.bestLapTime && (
                        <span className="tabular-nums" style={{ fontFamily: 'var(--font-orbitron, monospace)', color: bestCol }}>{e.bestLapTime}</span>
                      )}
                      {e.kph && <span className="tabular-nums opacity-80">{e.kph} km/h</span>}
                      {e.tyre && (
                        <span className="inline-flex items-center gap-1">
                          {tyreCol && <span className="rounded-full" style={{ width: 6, height: 6, background: tyreCol, display: 'inline-block' }} />}
                          <span className="uppercase tracking-wide" style={{ fontSize: 8, color: 'var(--pw-text-secondary)' }}>{e.tyre}</span>
                        </span>
                      )}
                      {e.pitStops > 0 && (
                        <span className="tabular-nums opacity-80" title="pit stops">{e.pitStops} stop{e.pitStops === 1 ? '' : 's'}</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] font-bold tabular-nums" style={{ color: leader ? col : 'var(--pw-text-secondary)', fontFamily: 'var(--font-orbitron, monospace)' }}>
                    {e.gapClass}
                  </p>
                  <p className="text-[9px] tabular-nums" style={{ color: 'var(--pw-text-tertiary)' }}>{e.laps} laps</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
