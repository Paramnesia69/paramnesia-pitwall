import { NextResponse } from 'next/server';
import { jolpicaGetAllRaces } from '@/lib/jolpica';

export const revalidate = 3600;
export const runtime = 'nodejs';

/** Known 2026 teammate pairings: [constructorId, driverRef1, driverRef2] */
const TEAM_PAIRS: [string, string, string][] = [
  ['mercedes',     'russell',        'antonelli'],
  ['ferrari',      'leclerc',        'hamilton'],
  ['mclaren',      'norris',         'piastri'],
  ['red_bull',     'max_verstappen', 'hadjar'],
  ['aston_martin', 'alonso',         'stroll'],
  ['rb',           'lawson',         'arvid_lindblad'],
  ['alpine',       'gasly',          'colapinto'],
  ['haas',         'bearman',        'ocon'],
  ['williams',     'albon',          'sainz'],
  ['audi',         'bortoleto',      'hulkenberg'],
  ['cadillac',     'perez',          'bottas'],
];

const CONSTRUCTOR_COLORS: Record<string, string> = {
  mercedes:     '#27F4D2',
  ferrari:      '#E8002D',
  mclaren:      '#FF6700',
  red_bull:     '#3671C6',
  aston_martin: '#358C75',
  rb:           '#6692FF',
  alpine:       '#0093CC',
  haas:         '#B6BABD',
  williams:     '#1868DB',
  audi:         '#990000',
  cadillac:     '#CC1E4A',
};

interface H2HEntry {
  team: string;
  constructorId: string;
  color: string;
  d1: { ref: string; name: string; wins: number };
  d2: { ref: string; name: string; wins: number };
  rounds: number;
}

function shortName(given: string, family: string): string {
  const initial = given.split(' ').pop()?.charAt(0) ?? given.charAt(0);
  return `${initial}. ${family}`;
}

export async function GET() {
  // Paginated: Jolpica silently clamps limit to 100 ROWS, so the old
  // limit=500 request truncated qualifying data after ~5 rounds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const races = await jolpicaGetAllRaces<any>('/2026/qualifying.json', 'QualifyingResults', 3600);

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
