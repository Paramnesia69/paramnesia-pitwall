import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CALENDAR_2026 } from '@/data/calendar-2026';
import { SERIES_META } from '@/types';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('event');

  const fontData = await readFile(join(process.cwd(), 'public/fonts/inter-bold.ttf'));

  const event = eventId ? CALENDAR_2026.find((e) => e.id === eventId) : null;
  const meta = event ? SERIES_META[event.series] : null;
  const accent = meta?.accent ?? '#E10600';

  // Generic fallback card
  if (!event || !meta) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: '#06060B',
            color: 'white',
            fontFamily: 'Inter',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '60px',
          }}
        >
          {/* Accent gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '400px',
              height: '400px',
              background: `radial-gradient(circle at top left, ${accent}33, transparent 70%)`,
              display: 'flex',
            }}
          />
          {/* Left accent bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '10%',
              width: '4px',
              height: '80%',
              background: accent,
              display: 'flex',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: 22, color: '#888', letterSpacing: '0.15em', display: 'flex' }}>
              MOTORSPORT CALENDAR
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, display: 'flex' }}>
              PARAMNESIA PITWALL
            </div>
            <div style={{ fontSize: 22, color: '#666', display: 'flex' }}>
              Your premium racing dashboard
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Inter', data: fontData, weight: 700 }],
      }
    );
  }

  // Per-event card
  const circuitLine = `${event.circuit.name} · ${event.circuit.country}`;
  const startDate = new Date(event.startDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jerusalem',
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#06060B',
          color: 'white',
          fontFamily: 'Inter',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 60px 50px 70px',
        }}
      >
        {/* Accent gradient top-left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle at top left, ${accent}40, transparent 65%)`,
            display: 'flex',
          }}
        />
        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '10%',
            width: '5px',
            height: '80%',
            background: accent,
            display: 'flex',
          }}
        />

        {/* Top: series badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              background: accent + '22',
              border: `1px solid ${accent}55`,
              borderRadius: '100px',
              padding: '8px 22px',
              fontSize: 18,
              color: accent,
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}
          >
            {meta.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 18, color: '#555', display: 'flex' }}>{startDate}</div>
        </div>

        {/* Middle: event name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: event.name.length > 28 ? 58 : 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              display: 'flex',
              maxWidth: '900px',
            }}
          >
            {event.name}
          </div>
          <div style={{ fontSize: 24, color: '#999', display: 'flex', letterSpacing: '0.04em' }}>
            {circuitLine}
          </div>
        </div>

        {/* Bottom: branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: 20, color: '#444', letterSpacing: '0.12em', display: 'flex' }}>
            PARAMNESIA PITWALL
          </div>
          <div
            style={{
              display: 'flex',
              width: '40px',
              height: '4px',
              background: accent,
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 700 }],
    }
  );
}
