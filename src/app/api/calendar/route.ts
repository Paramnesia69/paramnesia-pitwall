import { NextRequest, NextResponse } from 'next/server';
import { CALENDAR_2026 } from '@/data/calendar-2026';
import { SERIES_META } from '@/types';
import type { SeriesId, SessionType } from '@/types';

const SITE_URL = 'https://paramnesia-pitwall.vercel.app';

// Default session durations in minutes, used when endTime is absent
const SESSION_DURATION: Record<SessionType, number> = {
  practice: 60,
  qualifying: 60,
  sprint: 30,
  warmup: 20,
  race: 120,
};

/** Convert ISO 8601 UTC string to ICS stamp: 20260601T140000Z */
function toIcsStamp(iso: string): string {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '').replace(/Z$/, '') + 'Z';
}

/** Escape ICS text values (RFC 5545 §3.3.11) */
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Fold long ICS lines at 75 octets (RFC 5545 §3.1).
 * Continuation lines start with a single SPACE.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let pos = 0;
  while (pos < line.length) {
    if (pos === 0) {
      chunks.push(line.slice(0, 75));
      pos = 75;
    } else {
      chunks.push(' ' + line.slice(pos, pos + 74));
      pos += 74;
    }
  }
  return chunks.join('\r\n');
}

export const runtime = 'nodejs';
// Cache 2 hours on CDN, stale-while-revalidate 1 hour
export const revalidate = 7200;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seriesParam = searchParams.get('series');

  // Support ?series=f1 or ?series=f1,wec
  const seriesFilter = seriesParam
    ? (seriesParam.split(',').map((s) => s.trim()) as SeriesId[])
    : null;

  const events = seriesFilter
    ? CALENDAR_2026.filter((e) => seriesFilter.includes(e.series))
    : CALENDAR_2026;

  const calName = seriesFilter
    ? seriesFilter.map((s) => SERIES_META[s]?.name ?? s).join(' + ') + ' — Pitwall'
    : 'Motorsport 2026 — Paramnesia Pitwall';

  // DTSTAMP: current UTC moment (creation timestamp per RFC 5545)
  const dtstamp = toIcsStamp(new Date().toISOString());

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PARAMNESIA PITWALL//Motorsport Calendar 2026//EN',
    `X-WR-CALNAME:${calName}`,
    `X-WR-CALDESC:Motorsport 2026 race calendar · ${SITE_URL}`,
    'X-WR-TIMEZONE:Asia/Jerusalem',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    // Ask calendar clients to refresh every 2 hours
    'REFRESH-INTERVAL;VALUE=DURATION:PT2H',
    `SOURCE;VALUE=URI:${req.url}`,
  ];

  for (const event of events) {
    const meta = SERIES_META[event.series];
    const eventUrl = `${SITE_URL}/?event=${encodeURIComponent(event.id)}`;

    for (const session of event.sessions) {
      const startDt = new Date(session.startTime);
      const durationMin = SESSION_DURATION[session.type] ?? 60;
      const endDt = session.endTime
        ? new Date(session.endTime)
        : new Date(startDt.getTime() + durationMin * 60 * 1000);

      // Stable UID: event id + session name slug
      const sessionSlug = session.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const uid = `${event.id}-${sessionSlug}@paramnesia-pitwall.vercel.app`;

      const summary = `${meta.name} · ${event.name} — ${session.name}`;
      const location = `${event.circuit.name}, ${event.circuit.country}`;
      const description = [
        meta.name,
        `${event.circuit.name} · ${event.circuit.country}`,
        '',
        eventUrl,
      ].join('\\n');

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`DTSTART:${toIcsStamp(startDt.toISOString())}`);
      lines.push(`DTEND:${toIcsStamp(endDt.toISOString())}`);
      lines.push(`SUMMARY:${esc(summary)}`);
      lines.push(`LOCATION:${esc(location)}`);
      lines.push(`DESCRIPTION:${esc(description)}`);
      lines.push(`URL:${eventUrl}`);
      lines.push('END:VEVENT');
    }
  }

  lines.push('END:VCALENDAR');

  const body = lines.map(fold).join('\r\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${seriesParam ? seriesParam + '-' : ''}motorsport-2026.ics"`,
      'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=3600',
    },
  });
}
