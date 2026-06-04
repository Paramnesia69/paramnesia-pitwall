import { NextResponse } from 'next/server';
import { MOTOGP_RIDERS_2026, MOTOGP_TEAMS_2026 } from '@/data/standings-2026';
import { getMotoGpStandings } from '@/lib/motogp';

export const revalidate = 3600;
export const runtime = 'nodejs';

export async function GET() {
  const live = await getMotoGpStandings().catch(() => null);

  const body = live ?? {
    riders: MOTOGP_RIDERS_2026,
    teams: MOTOGP_TEAMS_2026,
    round: null,
  };

  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
  });
}
