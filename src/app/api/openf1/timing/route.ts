import { NextRequest, NextResponse } from 'next/server';
import { getSessionTiming } from '@/lib/openf1';

export const runtime = 'nodejs';

/**
 * GET /api/openf1/timing?eventId=<id>
 * Thin proxy — all logic lives in src/lib/openf1.ts (getSessionTiming).
 * Returns timing + tyre stints + team radio + race-control for the event's
 * most relevant F1 session.
 */
export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');
  const data = await getSessionTiming(eventId);

  if (data.status !== 'ok') {
    return NextResponse.json(data);
  }

  const ttl = data.ttl ?? 300;
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${Math.floor(ttl / 2)}`,
    },
  });
}
