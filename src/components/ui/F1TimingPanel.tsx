'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTeamLogo } from '@/lib/teamLogos';

interface TimingResult {
  position: number;
  driverNumber: number;
  acronym: string;
  fullName: string;
  team: string;
  teamColor: string; // hex without '#'
  gap: string | null;
  bestLap: string | null;
}

interface TimingData {
  status: 'ok' | 'no_data' | 'error';
  sessionName?: string;
  isLive?: boolean;
  results?: TimingResult[];
}

interface Props {
  eventId: string;
  accentColor: string;
  eventState: string;
}

export default function F1TimingPanel({ eventId, accentColor, eventState }: Props) {
  const [data, setData] = useState<TimingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTiming = useCallback(async () => {
    try {
      const res = await fetch(`/api/openf1/timing?eventId=${encodeURIComponent(eventId)}`);
      if (res.ok) setData(await res.json());
      else setData({ status: 'no_data' });
    } catch {
      setData({ status: 'error' });
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchTiming();
    // Poll every 45s during live / starting_soon sessions
    if (eventState === 'live' || eventState === 'starting_soon') {
      const id = setInterval(fetchTiming, 45_000);
      return () => clearInterval(id);
    }
  }, [fetchTiming, eventState]);

  // Skeleton while loading
  if (loading) {
    return (
      <div className="mb-6">
        <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
          Timing
        </h4>
        <div className="pw-glass p-1 space-y-px">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 rounded animate-pulse" style={{ background: 'var(--pw-glass-bg)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.status !== 'ok' || !data.results?.length) return null;

  const SESSION_LABEL: Record<string, string> = {
    Race: 'Race Result',
    Qualifying: 'Qualifying',
    Sprint: 'Sprint Result',
    'Sprint Qualifying': 'Sprint Qualifying',
    'Practice 1': 'FP1',
    'Practice 2': 'FP2',
    'Practice 3': 'FP3',
  };
  const label = SESSION_LABEL[data.sessionName ?? ''] ?? data.sessionName ?? 'Timing';

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--pw-text-tertiary)' }}>
            {label}
          </h4>
          {data.isLive && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase" style={{ color: '#E10600' }}>
              <span
                className="rounded-full animate-pulse"
                style={{ width: 5, height: 5, background: '#E10600', display: 'inline-block' }}
              />
              Live
            </span>
          )}
        </div>
        <a
          href="https://openf1.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] hover:opacity-80 transition-opacity"
          style={{ color: 'var(--pw-text-tertiary)' }}
        >
          via OpenF1
        </a>
      </div>

      {/* Results table */}
      <div className="pw-glass overflow-hidden">
        {data.results.map((r, idx) => {
          const isLeader = r.position === 1;
          const gapText = isLeader
            ? '—'
            : r.gap ?? r.bestLap ?? '—';

          return (
            <div
              key={r.driverNumber}
              className="flex items-center gap-3 px-3 py-2 transition-colors"
              style={{
                borderBottom: idx < data.results!.length - 1 ? '1px solid var(--pw-glass-border)' : undefined,
                background: isLeader ? `${accentColor}06` : undefined,
              }}
            >
              {/* Position */}
              <span
                className="w-5 text-right text-xs font-mono font-bold flex-shrink-0"
                style={{ color: isLeader ? accentColor : 'var(--pw-text-tertiary)' }}
              >
                {r.position}
              </span>

              {/* Team logo / color bar */}
              {(() => {
                const logo = getTeamLogo(r.team, true); // F1 context → official white logos
                return logo ? (
                  <div className="w-7 h-5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={logo.src}
                      alt={r.team}
                      style={{
                        height: 16,
                        width: 'auto',
                        maxWidth: 28,
                        objectFit: 'contain',
                        opacity: logo.white ? 0.9 : 0.92,
                      }}
                    />
                  </div>
                ) : (
                  <span
                    className="w-1 h-4 rounded-full flex-shrink-0"
                    style={{ background: `#${r.teamColor}` }}
                  />
                );
              })()}

              {/* Driver acronym */}
              <span
                className="w-9 text-xs font-bold tracking-wider flex-shrink-0"
                style={{ color: isLeader ? 'var(--pw-text-primary)' : 'var(--pw-text-primary)' }}
              >
                {r.acronym}
              </span>

              {/* Team name */}
              <span className="text-[11px] flex-1 truncate" style={{ color: 'var(--pw-text-tertiary)' }}>
                {r.team}
              </span>

              {/* Gap / lap time */}
              <span
                className="text-[11px] font-mono flex-shrink-0"
                style={{ color: isLeader ? 'var(--pw-text-tertiary)' : 'var(--pw-text-secondary)' }}
              >
                {gapText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
