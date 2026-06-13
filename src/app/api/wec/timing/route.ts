import { NextResponse } from 'next/server';
import { getWecTiming } from '@/lib/wecTiming';

export const runtime = 'nodejs';

/**
 * GET /api/wec/timing
 * Thin proxy — all logic lives in src/lib/wecTiming.ts. Returns the freshest
 * Al Kamel class-by-class classification for the live Le Mans 24H, or a
 * `pending` snapshot until the first timing is posted.
 */
export async function GET() {
  const data = await getWecTiming();
  const ttl = data.status === 'live' ? 60 : 30;
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${Math.floor(ttl / 2)}`,
    },
  });
}
