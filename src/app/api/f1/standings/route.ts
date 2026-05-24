import { NextResponse } from 'next/server';
import { F1_DRIVERS_2026, F1_CONSTRUCTORS_2026 } from '@/data/standings-2026';
import type { DriverStanding, ConstructorStanding } from '@/data/standings-2026';

export const revalidate = 3600;
export const runtime = 'nodejs';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

// Normalize Jolpica constructor names → names expected by teamLogos.ts + our static data
const CONSTRUCTOR_NAME_MAP: Record<string, string> = {
  'Red Bull': 'Red Bull Racing',
  'RB F1 Team': 'Racing Bulls',
  'Alpine F1 Team': 'Alpine',
  'Haas F1 Team': 'Haas',
  'Cadillac F1 Team': 'Cadillac',
  VCARB: 'Racing Bulls',
};

function normalizeConstructor(name: string): string {
  return CONSTRUCTOR_NAME_MAP[name] ?? name;
}

const TEAM_COLORS: Record<string, string> = {
  Mercedes: '#27F4D2',
  Ferrari: '#E8002D',
  McLaren: '#FF8000',
  'Red Bull Racing': '#3671C6',
  Alpine: '#0093CC',
  Haas: '#B6BABD',
  'Racing Bulls': '#6692FF',
  Williams: '#1868DB',
  Audi: '#990000',
  'Kick Sauber': '#52E252',
  Sauber: '#52E252',
  Cadillac: '#1E1E1E',
  'Aston Martin': '#358C75',
};

function teamColor(name: string): string {
  return TEAM_COLORS[name] ?? '#666666';
}

function driverInitial(givenName: string, familyName: string): string {
  const last = givenName.split(' ').pop() ?? givenName;
  return `${last.charAt(0)}. ${familyName}`;
}

async function jolpicaGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [driversData, constructorsData] = await Promise.all([
    jolpicaGet<any>('/2026/driverStandings.json'),
    jolpicaGet<any>('/2026/constructorStandings.json'),
  ]);

  const driverList = driversData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
  const constructorList = constructorsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
  const round: string | undefined = driversData?.MRData?.StandingsTable?.StandingsLists?.[0]?.round;

  if (driverList?.length && constructorList?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drivers: DriverStanding[] = driverList.map((d: any) => {
      const team = normalizeConstructor(d.Constructors[0]?.name ?? '');
      return {
        pos: parseInt(d.position),
        name: driverInitial(d.Driver.givenName, d.Driver.familyName),
        team,
        points: parseFloat(d.points),
        teamColor: teamColor(team),
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constructors: ConstructorStanding[] = constructorList.map((c: any) => {
      const name = normalizeConstructor(c.Constructor.name);
      return {
        pos: parseInt(c.position),
        name,
        points: parseFloat(c.points),
        color: teamColor(name),
      };
    });

    return NextResponse.json(
      { drivers, constructors, round: round ? parseInt(round) : null },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' } },
    );
  }

  // Fallback to static
  return NextResponse.json(
    { drivers: F1_DRIVERS_2026, constructors: F1_CONSTRUCTORS_2026, round: null },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' } },
  );
}
