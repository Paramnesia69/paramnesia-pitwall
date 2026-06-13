'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTeamLogo } from '@/lib/teamLogos';
import type { WECTimingData, WECTimingEntry } from '@/types';

interface Props {
  accentColor: string;
  eventState: string;
}

/** Class accent colours — LMP2/LMGT3 follow the official ELMS/ACO race-plate
 * palette; Hypercar uses the WEC blue (this is a WEC/Le Mans context). */
const CLASS_COLOR: Record<string, string> = {
  HYPERCAR: '#0090D4',
  LMP2: '#1E4B8C',
  LMGT3: '#1A6B38',
};

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
      const id = setInterval(fetchTiming, 60_000);
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
          {data.hour && (
            <span className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--pw-text-tertiary)' }}>· Hour {data.hour}</span>
          )}
        </div>
        <a href="https://www.fiawec.com" target="_blank" rel="noopener noreferrer" className="text-[9px] hover:opacity-80 transition-opacity" style={{ color: 'var(--pw-text-tertiary)' }}>
          via Al Kamel
        </a>
      </div>

      {/* Class tabs */}
      <div className="flex gap-1.5 mb-2">
        {data.classes.map((c) => {
          const col = CLASS_COLOR[c.name] ?? accentColor;
          const on = c.name === activeTab;
          return (
            <button
              key={c.name}
              onClick={() => setTab(c.name)}
              className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-colors active:scale-95"
              style={{
                background: on ? `${col}22` : 'var(--pw-glass-bg)',
                border: `1px solid ${on ? `${col}66` : 'var(--pw-glass-border)'}`,
                color: on ? col : 'var(--pw-text-tertiary)',
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
          return (
            <div
              key={e.number}
              className="px-3 py-2"
              style={{
                borderBottom: idx < active.entries.length - 1 ? '1px solid var(--pw-glass-border)' : undefined,
                background: leader ? `${col}0e` : undefined,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 text-right text-xs font-bold flex-shrink-0 tabular-nums" style={{ color: leader ? col : 'var(--pw-text-tertiary)', fontFamily: 'var(--font-orbitron, monospace)' }}>
                  {e.classPos}
                </span>
                <span className="w-7 text-[11px] font-bold flex-shrink-0 tabular-nums" style={{ color: 'var(--pw-text-secondary)' }}>#{e.number}</span>
                <ManufacturerLogo entry={e} fallback={col} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate" style={{ color: 'var(--pw-text-primary)' }}>{e.team}</p>
                  {e.drivers.length > 0 && (
                    <p className="text-[9px] truncate" style={{ color: 'var(--pw-text-tertiary)' }}>{e.drivers.join(' · ')}</p>
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
