import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const OPENF1  = 'https://api.openf1.org/v1';

export interface DriverProfile {
  ref: string;
  givenName: string;
  familyName: string;
  code: string | null;
  permanentNumber: string | null;
  nationality: string;
  dateOfBirth: string | null;
  /** Career wins total */
  wins: number;
  /** Total F1 seasons */
  seasons: number;
  /** 2026: points, position, team */
  season2026: { points: number; pos: number; team: string } | null;
  /** OpenF1 headshot URL (Cloudinary CDN) — may be null */
  headshotUrl: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jGet<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ driverRef: string }> }) {
  const { driverRef } = await params;
  if (!driverRef) return NextResponse.json({ error: 'missing driverRef' }, { status: 400 });

  const [infoData, winsData, seasonsData, standingsData] = await Promise.all([
    jGet<any>(`/drivers/${driverRef}.json`),
    jGet<any>(`/drivers/${driverRef}/results/1.json?limit=1`),   // position=1 races → total = career wins
    jGet<any>(`/drivers/${driverRef}/seasons.json?limit=1`),
    jGet<any>(`/2026/drivers/${driverRef}/driverStandings.json`),
  ]);

  const d = infoData?.MRData?.DriverTable?.Drivers?.[0];
  if (!d) {
    return NextResponse.json({ error: 'driver not found' }, { status: 404 });
  }

  const wins    = parseInt(winsData?.MRData?.total ?? '0');
  const seasons = parseInt(seasonsData?.MRData?.total ?? '0');

  const standingEntry = standingsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];
  const season2026 = standingEntry
    ? {
        points: parseFloat(standingEntry.points),
        pos: parseInt(standingEntry.position),
        team: standingEntry.Constructors?.[0]?.name ?? '',
      }
    : null;

  // Try headshot from OpenF1 — best-effort, cached 24h
  let headshotUrl: string | null = null;
  if (d.permanentNumber) {
    try {
      const openF1Res = await fetch(
        `${OPENF1}/drivers?driver_number=${d.permanentNumber}&session_key=latest`,
        { next: { revalidate: 86400 } },
      );
      if (openF1Res.ok) {
        const of1 = await openF1Res.json();
        headshotUrl = of1?.[0]?.headshot_url ?? null;
      }
    } catch { /* swallow — headshot is optional */ }
  }

  const profile: DriverProfile = {
    ref: driverRef,
    givenName: d.givenName,
    familyName: d.familyName,
    code: d.code ?? null,
    permanentNumber: d.permanentNumber ?? null,
    nationality: d.nationality,
    dateOfBirth: d.dateOfBirth ?? null,
    wins,
    seasons,
    season2026,
    headshotUrl,
  };

  return NextResponse.json(profile, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
  });
}
