import { NextRequest, NextResponse } from 'next/server';
import { getEventsWithState } from '@/lib/events';
import { cached } from '@/lib/cache';

/**
 * GET /api/events
 * GET /api/events?series=f1
 * GET /api/events?featured=1
 *
 * Returns events with live-computed states and weather.
 * Cached for 2 minutes — event states change (live/upcoming/finished)
 * so the cache is short-lived.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const series = searchParams.get('series');
  const featured = searchParams.get('featured');

  // Cache all events for 2 min (states change frequently)
  const allEvents = await cached('events:all', 120, async () => {
    return getEventsWithState();
  });

  if (featured === '1') {
    // Return the single featured event
    const live = allEvents.find((e) => e.state === 'live');
    if (live) {
      return NextResponse.json(live, { headers: cacheHeaders(60) });
    }
    const startingSoon = allEvents
      .filter((e) => e.state === 'starting_soon')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    if (startingSoon.length > 0) {
      return NextResponse.json(startingSoon[0], { headers: cacheHeaders(60) });
    }
    const upcoming = allEvents
      .filter((e) => e.state === 'upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return NextResponse.json(upcoming[0] ?? null, { headers: cacheHeaders(60) });
  }

  // Filter by series if specified
  let events = allEvents.filter((e) => e.state !== 'finished');
  if (series) {
    events = events.filter((e) => e.series === series);
  }

  // Sort by start date
  events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return NextResponse.json(events, { headers: cacheHeaders(120) });
}

function cacheHeaders(maxAge: number): Record<string, string> {
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
  };
}
