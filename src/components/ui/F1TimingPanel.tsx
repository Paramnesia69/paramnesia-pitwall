'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTeamLogo } from '@/lib/teamLogos';
import { useStore } from '@/store';

interface TyreStint {
  compound: string;
  lapStart: number;
  lapEnd: number;
}

interface TimingResult {
  position: number;
  driverNumber: number;
  acronym: string;
  fullName: string;
  team: string;
  teamColor: string;
  gap: string | null;
  bestLap: string | null;
  compound: string | null;
  stints: TyreStint[];
}

interface RadioClip {
  driverNumber: number;
  acronym: string;
  team: string;
  teamColor: string;
  date: string;
  url: string;
}

interface RaceControlMsg {
  date: string;
  category: string;
  flag: string | null;
  scope: string | null;
  sector: number | null;
  lap: number | null;
  driverNumber: number | null;
  message: string;
}

interface TimingData {
  status: 'ok' | 'no_data' | 'error' | 'live_blocked';
  sessionName?: string;
  isLive?: boolean;
  results?: TimingResult[];
  radio?: RadioClip[];
  raceControl?: RaceControlMsg[];
}

interface Props {
  eventId: string;
  accentColor: string;
  eventState: string;
}

/* ── Tyre compound helpers ─────────────────────────────── */
const COMPOUND_COLOR: Record<string, string> = {
  SOFT: '#E8332E', MEDIUM: '#F2C530', HARD: '#E8E8E8', INTERMEDIATE: '#43B02A', WET: '#1E6FD0',
};
function compoundColor(c: string | null | undefined): string {
  if (!c) return '#666';
  const k = c.toUpperCase();
  if (COMPOUND_COLOR[k]) return COMPOUND_COLOR[k];
  return { S: '#E8332E', M: '#F2C530', H: '#E8E8E8', I: '#43B02A', W: '#1E6FD0' }[k[0]] ?? '#666';
}
function compoundLetter(c: string | null | undefined): string {
  return c ? c.toUpperCase()[0] : '?';
}

/* ── Flag helpers ──────────────────────────────────────── */
function flagColor(msg: RaceControlMsg): string {
  const f = msg.flag?.toUpperCase() ?? '';
  if (f.includes('RED')) return '#E10600';
  if (f.includes('DOUBLE YELLOW')) return '#FF8A00';
  if (f.includes('YELLOW')) return '#FFB800';
  if (f.includes('BLUE')) return '#1E6FD0';
  if (f.includes('GREEN') || f.includes('CLEAR')) return '#43B02A';
  if (f.includes('CHEQUERED')) return '#D0D0D0';
  if (msg.category === 'SafetyCar') return '#FF8A00';
  return 'var(--pw-text-tertiary)';
}
function fmtClock(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' });
  } catch { return ''; }
}

/* ── Tyre badge (current compound dot) ─────────────────── */
function TyreBadge({ compound }: { compound: string | null }) {
  if (!compound) return null;
  const color = compoundColor(compound);
  const dark = compound.toUpperCase().startsWith('H'); // white tyre needs dark text
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-[8px] font-bold shrink-0"
      style={{ width: 14, height: 14, border: `1.5px solid ${color}`, color: dark ? '#111' : color, background: dark ? color : `${color}1A` }}
      title={compound}
    >
      {compoundLetter(compound)}
    </span>
  );
}

/* ── Stint strip (compound history as a thin segmented bar) ─ */
function StintBar({ stints }: { stints: TyreStint[] }) {
  if (!stints.length) return null;
  return (
    <div className="flex items-center gap-px mt-1 h-[3px] rounded-full overflow-hidden">
      {stints.map((s, i) => {
        const laps = Math.max(1, (s.lapEnd || 0) - (s.lapStart || 0) + 1);
        return <div key={i} style={{ flexGrow: laps, background: compoundColor(s.compound), opacity: 0.8 }} title={`${s.compound} · L${s.lapStart}–${s.lapEnd}`} />;
      })}
    </div>
  );
}

/* ── Flag status bar + collapsible incident log ────────── */
function FlagFeed({ raceControl }: { raceControl: RaceControlMsg[] }) {
  const [open, setOpen] = useState(false);
  if (!raceControl.length) return null;
  // Current track status = most recent Flag / SafetyCar message
  const current = raceControl.find((m) => m.category === 'Flag' || m.category === 'SafetyCar');
  if (!current) return null;
  const color = flagColor(current);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left"
        style={{ background: `${color}14`, border: `1px solid ${color}40` }}
      >
        <span className="rounded-sm shrink-0" style={{ width: 10, height: 12, background: color, boxShadow: `0 0 8px ${color}80` }} />
        <span className="text-[11px] font-bold uppercase tracking-wider shrink-0" style={{ color }}>
          {current.flag ?? current.category}
        </span>
        <span className="text-[11px] truncate flex-1" style={{ color: 'var(--pw-text-secondary)' }}>
          {current.message}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className="shrink-0 transition-transform" style={{ color: 'var(--pw-text-tertiary)', transform: open ? 'rotate(180deg)' : 'none' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-1.5 max-h-44 overflow-y-auto pw-glass divide-y" style={{ borderColor: 'var(--pw-glass-border)' }}>
          {raceControl.map((m, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-1.5" style={{ borderColor: 'var(--pw-glass-border)' }}>
              <span className="text-[9px] font-mono shrink-0 mt-0.5 w-10" style={{ color: 'var(--pw-text-tertiary)' }}>
                {m.lap ? `L${m.lap}` : fmtClock(m.date)}
              </span>
              <span className="rounded-full shrink-0 mt-1" style={{ width: 6, height: 6, background: flagColor(m) }} />
              <span className="text-[10px] leading-snug" style={{ color: 'var(--pw-text-secondary)' }}>{m.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Single radio clip with inline play/pause ──────────── */
function RadioItem({ clip }: { clip: RadioClip }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) { el.play().catch(() => {}); } else { el.pause(); }
  }, []);

  return (
    <div className="flex items-center gap-2.5 px-3 py-2" style={{ borderBottom: '1px solid var(--pw-glass-border)' }}>
      <button
        onClick={toggle}
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105"
        style={{ background: `#${clip.teamColor}22`, border: `1px solid #${clip.teamColor}` }}
        aria-label={playing ? 'Pause radio' : 'Play radio'}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill={`#${clip.teamColor}`}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill={`#${clip.teamColor}`}><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <span className="text-xs font-bold tracking-wider shrink-0 w-9" style={{ color: 'var(--pw-text-primary)' }}>{clip.acronym}</span>
      <span className="text-[10px] truncate flex-1" style={{ color: 'var(--pw-text-tertiary)' }}>{clip.team}</span>
      <span className="text-[9px] font-mono shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>{fmtClock(clip.date)}</span>
      <audio
        ref={audioRef}
        src={clip.url}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

const SESSION_LABEL: Record<string, string> = {
  Race: 'Race Result', Qualifying: 'Qualifying', Sprint: 'Sprint Result',
  'Sprint Qualifying': 'Sprint Qualifying', 'Practice 1': 'FP1', 'Practice 2': 'FP2', 'Practice 3': 'FP3',
};

const F1_REFS: Record<string, string> = {
  'MAX VERSTAPPEN': 'max_verstappen', 'LEWIS HAMILTON': 'hamilton', 'CHARLES LECLERC': 'leclerc',
  'LANDO NORRIS': 'norris', 'OSCAR PIASTRI': 'piastri', 'GEORGE RUSSELL': 'russell',
  'ANDREA KIMI ANTONELLI': 'antonelli', 'KIMI ANTONELLI': 'antonelli',
  'FERNANDO ALONSO': 'alonso', 'LANCE STROLL': 'stroll', 'PIERRE GASLY': 'gasly',
  'ESTEBAN OCON': 'ocon', 'OLIVER BEARMAN': 'bearman', 'NICO HULKENBERG': 'hulkenberg',
  'CARLOS SAINZ': 'carlos_sainz', 'FRANCO COLAPINTO': 'colapinto', 'YUKI TSUNODA': 'tsunoda',
  'ISACK HADJAR': 'hadjar', 'GABRIEL BORTOLETO': 'bortoleto', 'JACK DOOHAN': 'doohan',
  'LIAM LAWSON': 'lawson',
};

export default function F1TimingPanel({ eventId, accentColor, eventState }: Props) {
  const [data, setData] = useState<TimingData | null>(null);
  const [loading, setLoading] = useState(true);
  const openDriver = useStore((s) => s.openDriver);

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
    if (eventState === 'live' || eventState === 'starting_soon') {
      const id = setInterval(fetchTiming, 45_000);
      return () => clearInterval(id);
    }
  }, [fetchTiming, eventState]);

  if (loading) {
    return (
      <div className="mb-6">
        <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>Timing</h4>
        <div className="pw-glass p-1 space-y-px">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 rounded animate-pulse" style={{ background: 'var(--pw-glass-bg)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (data?.status === 'live_blocked') {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--pw-text-tertiary)' }}>Timing</h4>
          <a href="https://openf1.org" target="_blank" rel="noopener noreferrer" className="text-[9px] hover:opacity-80 transition-opacity" style={{ color: 'var(--pw-text-tertiary)' }}>
            via OpenF1
          </a>
        </div>
        <div className="pw-glass px-4 py-3 flex items-start gap-3" style={{ borderColor: `${accentColor}25` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 opacity-60">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--pw-text-secondary)' }}>
              Timing paused during live session
            </p>
            <p className="text-[10px] leading-snug" style={{ color: 'var(--pw-text-tertiary)' }}>
              Full data — tyres, radio, flags — unlocks when the session ends.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.status !== 'ok' || !data.results?.length) return null;

  const label = SESSION_LABEL[data.sessionName ?? ''] ?? data.sessionName ?? 'Timing';
  const radio = data.radio ?? [];
  const raceControl = data.raceControl ?? [];

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--pw-text-tertiary)' }}>{label}</h4>
          {data.isLive && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase" style={{ color: '#E10600' }}>
              <span className="rounded-full animate-pulse" style={{ width: 5, height: 5, background: '#E10600', display: 'inline-block' }} />
              Live
            </span>
          )}
        </div>
        <a href="https://openf1.org" target="_blank" rel="noopener noreferrer" className="text-[9px] hover:opacity-80 transition-opacity" style={{ color: 'var(--pw-text-tertiary)' }}>
          via OpenF1
        </a>
      </div>

      {/* Flag / race-control status (feature 3) */}
      <FlagFeed raceControl={raceControl} />

      {/* Results table */}
      <div className="pw-glass overflow-hidden">
        {data.results.map((r, idx) => {
          const isLeader = r.position === 1;
          const gapText = isLeader ? r.bestLap ?? '—' : r.gap ?? r.bestLap ?? '—';
          const logo = getTeamLogo(r.team, true);

          return (
            <div
              key={r.driverNumber}
              className="px-3 py-2 transition-colors"
              style={{
                borderBottom: idx < data.results!.length - 1 ? '1px solid var(--pw-glass-border)' : undefined,
                background: isLeader ? `${accentColor}06` : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-right text-xs font-mono font-bold flex-shrink-0" style={{ color: isLeader ? accentColor : 'var(--pw-text-tertiary)' }}>
                  {r.position}
                </span>

                {logo ? (
                  <div className="w-10 h-6 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={logo.src} alt={r.team} style={{
                      height: logo.white ? 18 : 20, width: 'auto', maxWidth: 40, objectFit: 'contain',
                      ...(logo.white ? { opacity: 0.95 } : logo.cssFilter !== undefined ? { filter: logo.cssFilter, opacity: 0.92 } : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }),
                    }} />
                  </div>
                ) : (
                  <span className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: `#${r.teamColor}` }} />
                )}

                {F1_REFS[r.fullName.toUpperCase()] ? (
                  <button
                    className="w-9 text-xs font-bold tracking-wider flex-shrink-0 text-left hover:opacity-70 transition-opacity"
                    onClick={() => openDriver({ ref: F1_REFS[r.fullName.toUpperCase()], name: r.acronym, team: r.team, teamColor: `#${r.teamColor}`, series: 'f1', points: 0, pos: r.position })}
                    title={r.fullName}
                  >
                    {r.acronym}
                  </button>
                ) : (
                  <span className="w-9 text-xs font-bold tracking-wider flex-shrink-0">{r.acronym}</span>
                )}
                <span className="text-[11px] flex-1 truncate" style={{ color: 'var(--pw-text-tertiary)' }}>{r.team}</span>

                {/* Current tyre compound (feature 2) */}
                <TyreBadge compound={r.compound} />

                <span className="text-[11px] font-mono flex-shrink-0 w-[68px] text-right" style={{
                  color: isLeader && r.bestLap ? accentColor : isLeader ? 'var(--pw-text-tertiary)' : 'var(--pw-text-secondary)',
                  fontWeight: isLeader && r.bestLap ? 700 : undefined,
                }}>
                  {gapText}
                </span>
              </div>

              {/* Stint history strip (feature 2) */}
              <StintBar stints={r.stints} />
            </div>
          );
        })}
      </div>

      {/* Team radio (feature 1) */}
      {radio.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--pw-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
            <h4 className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--pw-text-tertiary)' }}>Team Radio</h4>
          </div>
          <div className="pw-glass overflow-hidden max-h-64 overflow-y-auto">
            {radio.map((clip, i) => <RadioItem key={`${clip.driverNumber}-${i}`} clip={clip} />)}
          </div>
        </div>
      )}
    </div>
  );
}
