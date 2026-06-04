import { NextResponse } from 'next/server';
import { ALL_RESULTS_2026 } from '@/data/results-2026';
import { getMotoGpResults } from '@/lib/motogp';

export const revalidate = 300;
export const runtime = 'nodejs';

const STATIC_MOTOGP = ALL_RESULTS_2026.filter((r) => r.series === 'motogp');

export async function GET() {
  const live = await getMotoGpResults().catch(() => null);

  return NextResponse.json(live ?? STATIC_MOTOGP, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150' },
  });
}
