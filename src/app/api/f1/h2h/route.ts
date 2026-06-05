import { NextResponse } from 'next/server';

export const revalidate = 3600;
export const runtime = 'nodejs';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

/** Known 2026 teammate pairings: [constructorId, driverRef1, driverRef2] */
const TEAM_PAIRS: [string, string, string][] = [
  ['mercedes',      'russell',         'antonelli'],
  ['ferrari',       'leclerc',         'hamilton'],
  ['mclaren',       'norris',          'piastri'],
  ['red_bull',      'max_verstappen',  'lawson'],
  ['aston_martin',  'alonso',          'stroll'],
  ['racing_bulls',  'tsunoda',         'hadjar'],
  ['alpine',        'gasly',           'ocon'],
  ['haas',          'bearman',         'hulkenberg'],
  ['williams',      'carlos_sainz',    'colapinto'],
  ['sauber',        'bortoleto',       'magnussen'],
];

const CONSTRUCTOR_COLORS: Record<string, string> = {
  mercedes:     '#27F4D2',
  ferrari:      '#E8002D',
  mclaren:      '#FF8000',
  red_bull:     '#3671C6',
  aston_martin: '#358C75',
  racing_bulls: '#6692FF',
  alpine:       '#0093CC',
  haas:         '#B6BABD',
  williams:     '#1868DB',
  sauber:       '#52E252',
};

interface H2HEntry {
  team: string;
  constructorId: string;
  color: string;
  d1: { ref: string; name: string; wins: number };
  d2: { ref: string; name: string; wins: number };
  rounds: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jolpicaGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

function shortName(given: string, family: string): string {
  const initial = given.split(' ').pop()?.charAt(0) ?? given.charAt(0);
  return `${initial}. ${family}`;
}

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await jolpicaGet<any>('/2026/qualifying.json?limit=500');
  const races = data?.MRData?.RaceTable?.Races;

  if (!races?.length) {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
    });
  }

  const stats = new Map<string, { team: string; d1Name: string; d2Name: string; d1Wins: number; d2Wins: number; rounds: number }>();
  for (const [cId, ref1, ref2] of TEAM_PAIRS) {
    stats.set(cId, { team: cId, d1Name: ref1, d2Name: ref2, d1Wins: 0, d2Wins: 0, rounds: 0 });
  }

  for (const race of races) {
    const posMap = new Map<string, number>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const qr of race.QualifyingResults ?? []) {
      posMap.set(qr.Driver?.driverId, parseInt(qr.position ?? '99'));
    }

    for (const [cId, ref1, ref2] of TEAM_PAIRS) {
      const p1 = posMap.get(ref1);
      const p2 = posMap.get(ref2);
      if (p1 == null || p2 == null) continue;
      const entry = stats.get(cId)!;
      entry.rounds++;
      if (p1 < p2) entry.d1Wins++;
      else if (p2 < p1) entry.d2Wins++;
    }
  }

  const driverNames = new Map<string, string>();
  for (const race of races) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const qr of race.QualifyingResults ?? []) {
      const ref = qr.Driver?.driverId;
      if (ref && !driverNames.has(ref)) {
        driverNames.set(ref, shortName(qr.Driver.givenName, qr.Driver.familyName));
      }
    }
  }

  const result: H2HEntry[] = [];
  for (const [cId, ref1, ref2] of TEAM_PAIRS) {
    const s = stats.get(cId)!;
    if (s.rounds === 0) continue;
    result.push({
      team: cId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      constructorId: cId,
      color: CONSTRUCTOR_COLORS[cId] ?? '#666',
      d1: { ref: ref1, name: driverNames.get(ref1) ?? ref1, wins: s.d1Wins },
      d2: { ref: ref2, name: driverNames.get(ref2) ?? ref2, wins: s.d2Wins },
      rounds: s.rounds,
    });
  }

  result.sort((a, b) => b.rounds - a.rounds);

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
  });
}
