import { NextResponse } from 'next/server';
import { getMotoGpWeekend } from '@/lib/motogp';

export const revalidate = 300;
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ round: string }> },
) {
  const { round } = await params;
  const n = parseInt(round, 10);
  if (!Number.isFinite(n)) {
    return NextResponse.json({ round: 0, sessions: [] }, { status: 400 });
  }

  const data = await getMotoGpWeekend(n).catch(() => null);

  return NextResponse.json(data ?? { round: n, sessions: [] }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150' },
  });
}
