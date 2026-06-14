import { NextResponse } from 'next/server';
import { getElmsTiming } from '@/lib/elmsTiming';

export const runtime = 'nodejs';

/**
 * GET /api/elms/timing
 * Thin proxy — all logic lives in src/lib/elmsTiming.ts. Auto-discovers the
 * latest ELMS Race session from Al Kamel and returns the freshest class-by-class
 * classification, or a `pending` snapshot before the first hour posts.
 */
export async function GET() {
  const data = await getElmsTiming();
  const ttl = data.status === 'live' ? 20 : 30;
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${Math.floor(ttl / 2)}`,
    },
  });
}
