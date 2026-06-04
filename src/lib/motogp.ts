/**
 * MotoGP live data — PulseLive (unofficial, reverse-engineered) API proxy logic.
 *
 * Source of truth for the VOLATILE data (positions, points, podiums) so the
 * standings/results no longer need manual edits after each round. The STABLE
 * metadata (short team names → logos, bar colours, rider-name format) lives in
 * the maps below and is set once per season.
 *
 * Same pattern as the F1 Jolpica routes: routes are thin proxies, all logic here.
 * Base: https://api.motogp.pulselive.com/motogp/v1  — GET only, no auth.
 */
import type { DriverStanding, ConstructorStanding } from '@/data/standings-2026';
import type { RaceResult } from '@/data/results-2026';
import type { SessionResults, ResultEntry, WeekendSessionType } from '@/types';

const API = 'https://api.motogp.pulselive.com/motogp/v1';
const SEASON_2026 = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const CATEGORY_MOTOGP = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

// API team name → app short display name. Resolves manufacturer logos in
// teamLogos.ts (SVG_MOTO_MAP) + the colour maps below. Stable for the season.
const TEAM_NAME_MAP: Record<string, string> = {
  'Aprilia Racing': 'Aprilia Racing',
  'Pertamina Enduro VR46 Racing Team': 'Pertamina VR46 Ducati',
  'Red Bull KTM Factory Racing': 'Red Bull KTM',
  'Trackhouse MotoGP Team': 'Trackhouse Aprilia',
  'Ducati Lenovo Team': 'Ducati Lenovo',
  'BK8 Gresini Racing MotoGP': 'BK8 Gresini Ducati',
  'Honda HRC Castrol': 'Honda HRC Castrol',
  'Red Bull KTM Tech3': 'Red Bull KTM Tech3',
  'Monster Energy Yamaha MotoGP Team': 'Monster Yamaha',
  'Castrol Honda LCR': 'LCR Honda',
  'Pro Honda LCR': 'LCR Honda',
  'Yamaha Factory Racing': 'Yamaha Factory Racing',
  'Prima Pramac Yamaha MotoGP': 'Pramac Yamaha',
};
function teamName(api: string): string {
  return TEAM_NAME_MAP[api] ?? api;
}

// Bar colour for rider rows, keyed by normalized team (mirrors prior static data).
const RIDER_COLOR: Record<string, string> = {
  'Aprilia Racing': '#41434C',
  'Trackhouse Aprilia': '#8B4FBF',
  'Pertamina VR46 Ducati': '#FFEB3B',
  'Ducati Lenovo': '#E10600',
  'BK8 Gresini Ducati': '#E10600',
  'Red Bull KTM': '#FF6600',
  'Red Bull KTM Tech3': '#FF6600',
  'Honda HRC Castrol': '#E50000',
  'LCR Honda': '#E50000',
  'Monster Yamaha': '#0059A8',
  'Yamaha Factory Racing': '#0059A8',
  'Pramac Yamaha': '#0059A8',
};
// Team-championship rows use Aprilia red; otherwise identical to rider colours.
const TEAM_COLOR: Record<string, string> = { ...RIDER_COLOR, 'Aprilia Racing': '#C8102E' };
const riderColor = (team: string) => RIDER_COLOR[team] ?? '#666666';
const teamColor = (team: string) => TEAM_COLOR[team] ?? '#666666';

// "Marco Bezzecchi" → "M. Bezzecchi"; "Fabio Di Giannantonio" → "F. Di Giannantonio"
function shortName(full: string): string {
  const p = full.trim().split(/\s+/);
  return p.length < 2 ? full : `${p[0][0]}. ${p.slice(1).join(' ')}`;
}

const COUNTRY_NAME_FIX: Record<string, string> = {
  'United States of America': 'United States',
};

// API event names are ALL-CAPS ("GRAND PRIX OF ITALY") — match the title-case
// used by the other series ("Grand Prix of Italy").
const LOWERCASE_WORDS = new Set(['of', 'the', 'de', 'du', 'di', 'da', 'and', 'des']);
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && LOWERCASE_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

async function get<T>(path: string, ttl: number): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: ttl } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ── Events (calendar) ── */
interface ApiEvent {
  id: string;
  name: string;
  test: boolean;
  date_start: string;
  date_end: string;
  circuit: { name: string; place?: string; nation?: string };
  country: { name: string; iso: string };
}

// Real (non-test) GP rounds that have already ended, in calendar order, with a
// derived round number (the API leaves `sequence` null).
async function getFinishedRounds(): Promise<(ApiEvent & { round: number })[]> {
  const data = await get<ApiEvent[] | { events: ApiEvent[] }>(
    `/results/events?seasonUuid=${SEASON_2026}&isFinished=true`,
    3600,
  );
  const events = Array.isArray(data) ? data : data?.events;
  if (!events?.length) return [];

  const now = Date.now();
  return events
    .filter((e) => !e.test)
    .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
    .map((e, i) => ({ ...e, round: i + 1 }))
    // isFinished=true wrongly includes the in-progress weekend; gate on end date.
    .filter((e) => new Date(e.date_end).getTime() < now);
}

/* ── Standings ── */
interface ApiStandingsEntry {
  position: number;
  rider: { full_name: string; number: number };
  team: { name: string };
  points: number;
}

export interface MotoGpStandings {
  riders: DriverStanding[];
  teams: ConstructorStanding[];
  round: number | null;
}

export async function getMotoGpStandings(): Promise<MotoGpStandings | null> {
  const [data, rounds] = await Promise.all([
    get<{ classification: ApiStandingsEntry[] }>(
      `/results/standings?seasonUuid=${SEASON_2026}&categoryUuid=${CATEGORY_MOTOGP}`,
      3600,
    ),
    getFinishedRounds(),
  ]);
  if (!data?.classification?.length) return null;

  const riders: DriverStanding[] = data.classification.map((c) => {
    const team = teamName(c.team.name);
    return { pos: c.position, name: shortName(c.rider.full_name), team, points: c.points, teamColor: riderColor(team) };
  });

  // Teams = sum of riders' points grouped by team (official MotoGP method).
  const totals = new Map<string, number>();
  for (const c of data.classification) {
    const t = teamName(c.team.name);
    totals.set(t, (totals.get(t) ?? 0) + c.points);
  }
  const teams: ConstructorStanding[] = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, points], i) => ({ pos: i + 1, name, points, color: teamColor(name) }));

  return { riders, teams, round: rounds.length || null };
}

/* ── Results (podiums) ── */
interface ApiSession {
  id: string;
  type: string; // 'RAC' = the Grand Prix race
}
interface ApiClassEntry {
  position: number;
  rider: { full_name: string };
  team: { name: string };
  time?: string;
}

async function getRacePodium(event: ApiEvent & { round: number }): Promise<RaceResult | null> {
  const sessions = await get<ApiSession[] | { sessions: ApiSession[] }>(
    `/results/sessions?eventUuid=${event.id}&categoryUuid=${CATEGORY_MOTOGP}`,
    3600,
  );
  const list = Array.isArray(sessions) ? sessions : sessions?.sessions;
  const race = list?.find((s) => s.type === 'RAC');
  if (!race) return null;

  const cls = await get<{ classification: ApiClassEntry[] }>(
    `/results/session/${race.id}/classification?seasonYear=2026`,
    300,
  );
  const top3 = cls?.classification?.filter((c) => c.position >= 1 && c.position <= 3);
  if (!top3?.length) return null;

  return {
    id: `motogp-r${event.round}`,
    series: 'motogp',
    round: event.round,
    name: titleCase(event.name),
    circuit: event.circuit.name,
    country: COUNTRY_NAME_FIX[event.country.name] ?? event.country.name,
    countryCode: event.country.iso,
    date: event.date_end,
    podium: top3
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        pos: c.position,
        driver: c.rider.full_name,
        team: teamName(c.team.name),
        time: c.position === 1 ? c.time : undefined,
      })),
  };
}

export async function getMotoGpResults(): Promise<RaceResult[] | null> {
  const rounds = await getFinishedRounds();
  if (!rounds.length) return null;

  const results = (await Promise.all(rounds.map(getRacePodium))).filter(
    (r): r is RaceResult => r !== null,
  );
  if (!results.length) return null;

  return results.sort((a, b) => b.round - a.round);
}

/* ── Weekend session results (race + sprint full classifications) ── */
interface ApiWeekendEntry {
  position: number | null;
  rider: { full_name: string };
  team: { name: string };
  time?: string;
  gap?: { first?: string; lap?: string };
  status?: string; // INSTND = classified, OUTSTND = DNF
}

function formatGap(gap?: { first?: string; lap?: string }): string | undefined {
  if (!gap) return undefined;
  const lap = parseInt(gap.lap ?? '0', 10);
  if (lap > 0) return `+${lap} lap${lap > 1 ? 's' : ''}`;
  return gap.first && gap.first !== '0.000' ? `+${gap.first}` : undefined;
}

// Map a race/sprint classification to ResultEntry[]. DNFs (position null) are
// listed after finishers and flagged.
function mapClassification(cls: ApiWeekendEntry[]): ResultEntry[] {
  const maxPos = cls.reduce((m, c) => Math.max(m, c.position ?? 0), 0);
  let dnfPos = maxPos;
  return cls.map((c) => {
    const finished = c.status === 'INSTND' && c.position != null;
    const pos = c.position ?? ++dnfPos;
    return {
      pos,
      driver: c.rider.full_name,
      team: teamName(c.team.name),
      time: finished && pos === 1 ? c.time : undefined,
      gap: finished && pos > 1 ? formatGap(c.gap) : undefined,
      dnf: !finished,
    };
  });
}

export async function getMotoGpWeekend(
  round: number,
): Promise<{ round: number; sessions: SessionResults[] } | null> {
  const rounds = await getFinishedRounds();
  const event = rounds.find((e) => e.round === round);
  if (!event) return null;

  const sessionsList = await get<ApiSession[] | { sessions: ApiSession[] }>(
    `/results/sessions?eventUuid=${event.id}&categoryUuid=${CATEGORY_MOTOGP}`,
    3600,
  );
  const list = Array.isArray(sessionsList) ? sessionsList : sessionsList?.sessions;
  if (!list?.length) return null;

  const wanted: { api: string; type: WeekendSessionType }[] = [
    { api: 'RAC', type: 'race' },
    { api: 'SPR', type: 'sprint' },
  ];

  const sessions: SessionResults[] = [];
  for (const w of wanted) {
    const sess = list.find((s) => s.type === w.api);
    if (!sess) continue;
    const cls = await get<{ classification: ApiWeekendEntry[] }>(
      `/results/session/${sess.id}/classification?seasonYear=2026`,
      300,
    );
    if (!cls?.classification?.length) continue;
    sessions.push({ type: w.type, entries: mapClassification(cls.classification) });
  }

  return sessions.length ? { round, sessions } : null;
}
