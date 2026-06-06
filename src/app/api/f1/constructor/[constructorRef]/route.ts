import { NextRequest, NextResponse } from 'next/server';
import type { TeamProfile } from '@/types';

export const runtime = 'nodejs';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jGet<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ constructorRef: string }> }) {
  const { constructorRef } = await params;
  if (!constructorRef) return NextResponse.json({ error: 'missing constructorRef' }, { status: 400 });

  const [infoData, winsData, seasonsData, standingsData, driversData] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jGet<any>(`/constructors/${constructorRef}.json`),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jGet<any>(`/constructors/${constructorRef}/results/1.json?limit=1`),
    // seasons list — use array length, NOT MRData.total
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jGet<any>(`/constructors/${constructorRef}/seasons.json?limit=100`),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jGet<any>(`/2026/constructors/${constructorRef}/constructorStandings.json`),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jGet<any>(`/2026/constructors/${constructorRef}/drivers.json`),
  ]);

  const c = infoData?.MRData?.ConstructorTable?.Constructors?.[0];
  if (!c) {
    return NextResponse.json({ error: 'constructor not found' }, { status: 404 });
  }

  const wins       = parseInt(winsData?.MRData?.total ?? '0');
  const seasonsList = seasonsData?.MRData?.SeasonTable?.Seasons ?? [];
  const seasons    = seasonsList.length;
  const firstSeason = parseInt(seasonsList[0]?.season ?? '0');

  const standingEntry = standingsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0];
  const season2026 = standingEntry
    ? { points: parseFloat(standingEntry.points), pos: parseInt(standingEntry.position) }
    : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drivers2026 = (driversData?.MRData?.DriverTable?.Drivers ?? []).map((d: any) => ({
    ref: d.driverId,
    givenName: d.givenName,
    familyName: d.familyName,
    number: d.permanentNumber ?? null,
  }));

  const profile: TeamProfile = {
    ref: constructorRef,
    name: c.name,
    nationality: c.nationality,
    wins,
    seasons,
    firstSeason,
    season2026,
    drivers2026,
  };

  return NextResponse.json(profile, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
