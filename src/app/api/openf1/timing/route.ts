import { NextRequest, NextResponse } from 'next/server';
import { CALENDAR_2026 } from '@/data/calendar-2026';

const BASE = 'https://api.openf1.org/v1';

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
}

async function openf1<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data as T : null;
  } catch {
    return null;
  }
}

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');

  // Only serve F1 events for now
  const event = CALENDAR_2026.find((e) => e.id === eventId && e.series === 'f1');
  if (!event) return NextResponse.json({ status: 'no_data' });

  const year = event.startDate.slice(0, 4);

  // Find all OpenF1 sessions within the event date range
  const sessions = await openf1<Record<string, unknown>[]>(
    `/sessions?year=${year}&date_start>=${event.startDate}&date_start<=${event.endDate}T23:59:59`,
    300,
  );
  if (!sessions?.length) return NextResponse.json({ status: 'no_data' });

  const now = new Date();
  const finished = sessions.filter((s) => new Date(s.date_end as string) < now);
  const live = sessions.filter(
    (s) => new Date(s.date_start as string) <= now && new Date(s.date_end as string) >= now,
  );

  // Session priority: live → finished Race → Qualifying → Sprint → latest
  const target =
    live[0] ??
    finished.find((s) => s.session_name === 'Race') ??
    finished.find((s) => s.session_name === 'Qualifying') ??
    finished.find((s) => s.session_name === 'Sprint') ??
    finished.at(-1);

  if (!target) return NextResponse.json({ status: 'no_data' });

  const isLive = live.some((s) => s.session_key === target.session_key);
  const ttl = isLive ? 30 : 300;
  const sk = target.session_key as number;

  // Fetch positions and drivers in parallel
  const [positions, drivers] = await Promise.all([
    openf1<Record<string, unknown>[]>(`/position?session_key=${sk}`, ttl),
    openf1<Record<string, unknown>[]>(`/drivers?session_key=${sk}`, 3600),
  ]);

  if (!positions?.length || !drivers?.length) return NextResponse.json({ status: 'no_data' });

  const driverMap = new Map(drivers.map((d) => [d.driver_number as number, d]));

  // Final position = last recorded position per driver
  const finalPos = new Map<number, number>();
  for (const p of positions) {
    finalPos.set(p.driver_number as number, p.position as number);
  }

  // Gaps (Race / Sprint)
  const gapMap = new Map<number, string>();
  if (target.session_name === 'Race' || target.session_name === 'Sprint') {
    const intervals = await openf1<Record<string, unknown>[]>(`/intervals?session_key=${sk}`, ttl);
    if (intervals?.length) {
      // Use latest interval entry per driver
      const latest = new Map<number, Record<string, unknown>>();
      for (const i of intervals) latest.set(i.driver_number as number, i);
      for (const [num, d] of latest) {
        const gap = d.gap_to_leader;
        if (gap === 0 || gap === 0.0) gapMap.set(num, 'LEAD');
        else if (typeof gap === 'string') gapMap.set(num, gap);
        else if (typeof gap === 'number') gapMap.set(num, `+${gap.toFixed(3)}s`);
      }
    }
  }

  // Best lap time (Qualifying / Sprint Qualifying)
  const lapMap = new Map<number, string>();
  if (target.session_name === 'Qualifying' || target.session_name === 'Sprint Qualifying') {
    const laps = await openf1<Record<string, unknown>[]>(`/laps?session_key=${sk}`, ttl);
    if (laps?.length) {
      const best = new Map<number, number>();
      for (const lap of laps) {
        if (!lap.lap_duration) continue;
        const t = lap.lap_duration as number;
        const num = lap.driver_number as number;
        const cur = best.get(num);
        if (!cur || t < cur) best.set(num, t);
      }
      for (const [num, t] of best) lapMap.set(num, formatLapTime(t));
    }
  }

  // Build sorted results
  const results = Array.from(finalPos.entries())
    .map(([num, pos]) => {
      const d = driverMap.get(num) ?? {};
      return {
        position: pos,
        driverNumber: num,
        acronym: (d.name_acronym as string) ?? `#${num}`,
        fullName: (d.full_name as string) ?? `Driver #${num}`,
        team: (d.team_name as string) ?? '',
        teamColor: (d.team_colour as string) ?? '666666',
        gap: gapMap.get(num) ?? null,
        bestLap: lapMap.get(num) ?? null,
      };
    })
    .sort((a, b) => a.position - b.position)
    .slice(0, 20);

  return NextResponse.json(
    { status: 'ok', sessionName: target.session_name as string, isLive, results },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${Math.floor(ttl / 2)}`,
      },
    },
  );
}
