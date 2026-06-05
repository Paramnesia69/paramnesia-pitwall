/**
 * OpenF1 live data — proxy logic for the F1 timing panel.
 *
 * Same pattern as src/lib/motogp.ts and the F1 Jolpica routes: the API route is a
 * thin proxy and all logic lives here. Resolves the relevant session for an event,
 * then fetches timing + tyre stints + team radio + race-control (flags) in parallel.
 *
 * Base: https://api.openf1.org/v1 — GET only. Anonymous access is rate-limited and,
 * crucially, *blocked for the duration of a live session* ("Global API access …
 * restricted to authenticated users until the session ends"). Set OPENF1_API_KEY to
 * send a Bearer token so the panel keeps working live; without it the panel simply
 * shows nothing during the live window (graceful, not an error).
 */
import { CALENDAR_2026 } from '@/data/calendar-2026';

const BASE = 'https://api.openf1.org/v1';

// ─── Types returned to the client ────────────────────────────────────────────────

export interface TyreStint {
  compound: string;       // SOFT | MEDIUM | HARD | INTERMEDIATE | WET
  lapStart: number;
  lapEnd: number;
}

export interface TimingResult {
  position: number;
  driverNumber: number;
  acronym: string;
  fullName: string;
  team: string;
  teamColor: string;      // hex without '#'
  gap: string | null;
  bestLap: string | null;
  compound: string | null;   // current (last) stint compound — feature 2
  stints: TyreStint[];       // full stint history — feature 2
}

export interface RadioClip {
  driverNumber: number;
  acronym: string;
  team: string;
  teamColor: string;
  date: string;
  url: string;            // recording_url (mp3)
}

export interface RaceControlMsg {
  date: string;
  category: string;       // Flag | SafetyCar | Drs | CarEvent | Other
  flag: string | null;    // GREEN | YELLOW | DOUBLE YELLOW | RED | BLUE | CLEAR | CHEQUERED
  scope: string | null;   // Track | Sector | Driver
  sector: number | null;
  lap: number | null;
  driverNumber: number | null;
  message: string;
}

export interface SessionTiming {
  status: 'ok' | 'no_data' | 'error' | 'live_blocked';
  sessionName?: string;
  isLive?: boolean;
  /** seconds — used by the route for Cache-Control + the client poll cadence */
  ttl?: number;
  results?: TimingResult[];
  radio?: RadioClip[];
  raceControl?: RaceControlMsg[];
}

// ─── Fetch helper ────────────────────────────────────────────────────────────────

class LiveBlockError extends Error {}

function authHeaders(): Record<string, string> {
  const key = process.env.OPENF1_API_KEY;
  return key ? { Authorization: `Bearer ${key}` } : {};
}

async function openf1<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate },
      headers: authHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (typeof body?.detail === 'string' && body.detail.includes('restricted to authenticated users')) throw new LiveBlockError();
      return null;
    }
    const data = await res.json();
    return Array.isArray(data) ? (data as T) : null;
  } catch (e) {
    if (e instanceof LiveBlockError) throw e;
    return null;
  }
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
}

// ─── Session resolution ──────────────────────────────────────────────────────────

interface ResolvedSession {
  target: Record<string, unknown>;
  isLive: boolean;
}

async function resolveSession(event: { startDate: string; endDate: string }): Promise<ResolvedSession | null> {
  const year = event.startDate.slice(0, 4);
  const sessions = await openf1<Record<string, unknown>[]>(
    `/sessions?year=${year}&date_start>=${event.startDate}&date_start<=${event.endDate}T23:59:59`,
    300,
  );
  if (!sessions?.length) return null;

  const now = new Date();
  const finished = sessions.filter((s) => new Date(s.date_end as string) < now);
  const live = sessions.filter(
    (s) => new Date(s.date_start as string) <= now && new Date(s.date_end as string) >= now,
  );

  // Priority: live → finished Race → Qualifying → Sprint → latest
  const target =
    live[0] ??
    finished.find((s) => s.session_name === 'Race') ??
    finished.find((s) => s.session_name === 'Qualifying') ??
    finished.find((s) => s.session_name === 'Sprint') ??
    finished.at(-1);

  if (!target) return null;
  const isLive = live.some((s) => s.session_key === target.session_key);
  return { target, isLive };
}

// ─── Main entry — everything the timing panel needs in one call ──────────────────

export async function getSessionTiming(eventId: string | null): Promise<SessionTiming> {
  const event = CALENDAR_2026.find((e) => e.id === eventId && e.series === 'f1');
  if (!event) return { status: 'no_data' };

  const resolved = await resolveSession(event).catch((e: unknown) => {
    if (e instanceof LiveBlockError) return 'live_blocked' as const;
    return null;
  });
  if (resolved === 'live_blocked') return { status: 'live_blocked' };
  if (!resolved) return { status: 'no_data' };

  const { target, isLive } = resolved;
  const ttl = isLive ? 30 : 300;
  const sk = target.session_key as number;
  const sessionName = target.session_name as string;
  const isRace = sessionName === 'Race' || sessionName === 'Sprint';
  const isQual = sessionName === 'Qualifying' || sessionName === 'Sprint Qualifying';

  // Fetch everything in parallel
  const [positions, drivers, stintsRaw, radioRaw, raceControlRaw, intervals, laps] = await Promise.all([
    openf1<Record<string, unknown>[]>(`/position?session_key=${sk}`, ttl),
    openf1<Record<string, unknown>[]>(`/drivers?session_key=${sk}`, 3600),
    openf1<Record<string, unknown>[]>(`/stints?session_key=${sk}`, ttl),
    openf1<Record<string, unknown>[]>(`/team_radio?session_key=${sk}`, ttl),
    openf1<Record<string, unknown>[]>(`/race_control?session_key=${sk}`, ttl),
    isRace ? openf1<Record<string, unknown>[]>(`/intervals?session_key=${sk}`, ttl) : Promise.resolve(null),
    isQual ? openf1<Record<string, unknown>[]>(`/laps?session_key=${sk}`, ttl) : Promise.resolve(null),
  ]);

  if (!positions?.length || !drivers?.length) return { status: 'no_data' };

  const driverMap = new Map(drivers.map((d) => [d.driver_number as number, d]));

  // Final position = last recorded position per driver
  const finalPos = new Map<number, number>();
  for (const p of positions) finalPos.set(p.driver_number as number, p.position as number);

  // Gaps (Race / Sprint)
  const gapMap = new Map<number, string>();
  if (intervals?.length) {
    const latest = new Map<number, Record<string, unknown>>();
    for (const i of intervals) latest.set(i.driver_number as number, i);
    for (const [num, d] of latest) {
      const gap = d.gap_to_leader;
      if (gap === 0 || gap === 0.0) gapMap.set(num, 'LEAD');
      else if (typeof gap === 'string') gapMap.set(num, gap);
      else if (typeof gap === 'number') gapMap.set(num, `+${gap.toFixed(3)}s`);
    }
  }

  // Best lap (Qualifying / Sprint Qualifying)
  const lapMap = new Map<number, string>();
  if (laps?.length) {
    const best = new Map<number, number>();
    for (const lap of laps) {
      if (!lap.lap_duration) continue;
      const t = lap.lap_duration as number;
      const num = lap.driver_number as number;
      const cur = best.get(num);
      if (!cur || t < cur) best.set(num, t);
    }
    for (const [num, t] of best) lapMap.set(num, formatLapTime(t));
  }

  // Tyre stints per driver (feature 2)
  const stintMap = new Map<number, TyreStint[]>();
  if (stintsRaw?.length) {
    for (const s of stintsRaw) {
      const num = s.driver_number as number;
      const compound = (s.compound as string) ?? '';
      if (!compound) continue;
      const list = stintMap.get(num) ?? [];
      list.push({
        compound,
        lapStart: (s.lap_start as number) ?? 0,
        lapEnd: (s.lap_end as number) ?? 0,
      });
      stintMap.set(num, list);
    }
    // Order each driver's stints by lap
    for (const list of stintMap.values()) list.sort((a, b) => a.lapStart - b.lapStart);
  }

  const results: TimingResult[] = Array.from(finalPos.entries())
    .map(([num, pos]) => {
      const d = driverMap.get(num) ?? {};
      const stints = stintMap.get(num) ?? [];
      return {
        position: pos,
        driverNumber: num,
        acronym: (d.name_acronym as string) ?? `#${num}`,
        fullName: (d.full_name as string) ?? `Driver #${num}`,
        team: (d.team_name as string) ?? '',
        teamColor: (d.team_colour as string) ?? '666666',
        gap: gapMap.get(num) ?? null,
        bestLap: lapMap.get(num) ?? null,
        compound: stints.length ? stints[stints.length - 1].compound : null,
        stints,
      };
    })
    .sort((a, b) => a.position - b.position)
    .slice(0, 20);

  // Team radio (feature 1) — newest first, capped
  const radio: RadioClip[] = (radioRaw ?? [])
    .filter((r) => r.recording_url)
    .map((r) => {
      const d = driverMap.get(r.driver_number as number) ?? {};
      return {
        driverNumber: r.driver_number as number,
        acronym: (d.name_acronym as string) ?? `#${r.driver_number}`,
        team: (d.team_name as string) ?? '',
        teamColor: (d.team_colour as string) ?? '666666',
        date: r.date as string,
        url: r.recording_url as string,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 16);

  // Race control / flags (feature 3) — newest first, capped
  const raceControl: RaceControlMsg[] = (raceControlRaw ?? [])
    .map((r) => ({
      date: r.date as string,
      category: (r.category as string) ?? 'Other',
      flag: (r.flag as string) ?? null,
      scope: (r.scope as string) ?? null,
      sector: (r.sector as number) ?? null,
      lap: (r.lap_number as number) ?? null,
      driverNumber: (r.driver_number as number) ?? null,
      message: (r.message as string) ?? '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 24);

  return { status: 'ok', sessionName, isLive, ttl, results, radio, raceControl };
}
