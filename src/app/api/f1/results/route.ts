import { NextResponse } from 'next/server';
import { F1_RESULTS_2026 } from '@/data/results-2026';
import type { RaceResult } from '@/data/results-2026';

export const revalidate = 300;
export const runtime = 'nodejs';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const OPENF1 = 'https://api.openf1.org/v1';

const COUNTRY_CODES: Record<string, string> = {
  Australia: 'AU', China: 'CN', Japan: 'JP', Bahrain: 'BH',
  'Saudi Arabia': 'SA', 'United States': 'US', USA: 'US',
  Canada: 'CA', Spain: 'ES', Monaco: 'MC', Austria: 'AT',
  'United Kingdom': 'GB', 'Great Britain': 'GB', Hungary: 'HU',
  Belgium: 'BE', Netherlands: 'NL', Italy: 'IT', Azerbaijan: 'AZ',
  Singapore: 'SG', Mexico: 'MX', Brazil: 'BR', 'Abu Dhabi': 'AE',
  Qatar: 'QA', 'Las Vegas': 'US',
};

async function jolpicaGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

async function openf1Get<T>(path: string, ttl = 300): Promise<T | null> {
  try {
    const res = await fetch(`${OPENF1}${path}`, { next: { revalidate: ttl } });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data as T : null;
  } catch { return null; }
}

interface JolpicaResult {
  position: string;
  Driver: { givenName: string; familyName: string };
  Constructor: { name: string };
  Time?: { time: string };
  FastestLap?: { rank: string };
}

interface JolpicaRace {
  round: string;
  raceName: string;
  Circuit: { circuitName: string; Location: { country: string } };
  date: string;
  Results?: JolpicaResult[];
}

// Jolpica uses legal given names; map to racing names where they differ
const DRIVER_DISPLAY: Record<string, string> = {
  'Andrea Kimi Antonelli': 'Kimi Antonelli',
};

function driverName(givenName: string, familyName: string): string {
  const full = `${givenName} ${familyName}`;
  return DRIVER_DISPLAY[full] ?? full;
}

function mapJolpicaRace(race: JolpicaRace): RaceResult | null {
  if (!race.Results?.length) return null;
  const top3 = race.Results.filter(r => parseInt(r.position) <= 3);
  if (!top3.length) return null;

  const fl = race.Results.find(r => r.FastestLap?.rank === '1');

  return {
    id: `f1-r${race.round}`,
    series: 'f1',
    round: parseInt(race.round),
    name: race.raceName,
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    countryCode: COUNTRY_CODES[race.Circuit.Location.country] ?? 'XX',
    date: race.date,
    podium: top3.map(r => ({
      pos: parseInt(r.position),
      driver: driverName(r.Driver.givenName, r.Driver.familyName),
      team: r.Constructor.name,
      time: r.position === '1' ? r.Time?.time : undefined,
    })),
    fastestLap: fl ? {
      driver: driverName(fl.Driver.givenName, fl.Driver.familyName),
      team: fl.Constructor.name,
    } : undefined,
  };
}

export async function GET() {
  try {
  // ── 1. Jolpica: all official 2026 results ──────────────────
  type JolpicaResp = { MRData: { RaceTable: { Races: JolpicaRace[] } } };
  const jolData = await jolpicaGet<JolpicaResp>('/2026/results.json?limit=100');

  const jolResults: RaceResult[] = (jolData?.MRData?.RaceTable?.Races ?? [])
    .map(mapJolpicaRace)
    .filter((r): r is RaceResult => r !== null);

  // ── 2. OpenF1: supplement for races in the last 7 days not yet in Jolpica ──
  // Deduplicate by DATE — round numbers differ between Jolpica (skips cancelled
  // rounds) and OpenF1 (counts all scheduled sessions), causing false duplicates.
  const jolDates = new Set(jolResults.map(r => r.date));
  const now = new Date();
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const openf1Results: RaceResult[] = [];

  const sessions = await openf1Get<Record<string, unknown>[]>('/sessions?year=2026&session_name=Race');
  if (sessions?.length) {
    // Sort all by date to assign round numbers
    const sorted = [...sessions].sort(
      (a, b) => new Date(a.date_start as string).getTime() - new Date(b.date_start as string).getTime()
    );

    const recentFinished = sessions.filter(s => {
      const end = new Date(s.date_end as string);
      return end < now && end > cutoff;
    });

    for (const session of recentFinished) {
      const sessionDate = (session.date_start as string).slice(0, 10);
      if (jolDates.has(sessionDate)) continue; // already covered by Jolpica
      const roundNum = sorted.findIndex(s => s.session_key === session.session_key) + 1;

      const sk = session.session_key as number;
      const [sessionResult, drivers, meetings] = await Promise.all([
        openf1Get<Record<string, unknown>[]>(`/session_result?session_key=${sk}`),
        openf1Get<Record<string, unknown>[]>(`/drivers?session_key=${sk}`, 3600),
        openf1Get<Record<string, unknown>[]>(`/meetings?meeting_key=${session.meeting_key}`, 3600),
      ]);

      if (!sessionResult?.length || !drivers?.length) continue;

      const driverMap = new Map(drivers.map(d => [d.driver_number as number, d]));
      const top3 = [...sessionResult]
        .sort((a, b) => (a.position as number) - (b.position as number))
        .slice(0, 3);

      const meeting = meetings?.[0];
      const countryName = session.country_name as string ?? '';

      openf1Results.push({
        id: `f1-r${roundNum}-live`,
        series: 'f1',
        round: roundNum,
        name: (meeting?.meeting_name as string) ?? `Round ${roundNum}`,
        circuit: (session.circuit_short_name as string) ?? '',
        country: countryName,
        countryCode: COUNTRY_CODES[countryName] ?? 'XX',
        date: (session.date_start as string).slice(0, 10),
        podium: top3.map(r => {
          const d = driverMap.get(r.driver_number as number) ?? {};
          return {
            pos: r.position as number,
            driver: (d.full_name as string) ?? `#${r.driver_number}`,
            team: (d.team_name as string) ?? '',
          };
        }),
      });
    }
  }

  // ── 3. Merge: Jolpica authoritative + OpenF1 for unreleased rounds ──
  const jolDatesSet = new Set(jolResults.map(r => r.date));
  const newFromOpenF1 = openf1Results.filter(r => !jolDatesSet.has(r.date));
  const merged = [...jolResults, ...newFromOpenF1].sort((a, b) => b.round - a.round);

  if (merged.length > 0) {
    return NextResponse.json(merged, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150' },
    });
  }

  // ── 4. Static fallback ─────────────────────────────────────
  return NextResponse.json(F1_RESULTS_2026, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150' },
  });
  } catch {
    return NextResponse.json(F1_RESULTS_2026, { status: 200 });
  }
}
