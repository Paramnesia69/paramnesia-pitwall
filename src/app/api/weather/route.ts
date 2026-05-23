import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather, getSimulatedWeather } from '@/lib/weather';
import { cached } from '@/lib/cache';

/**
 * GET /api/weather?lat=XX&lng=YY
 *
 * Returns current weather for a circuit location.
 * Cached in Redis/memory for 15 minutes.
 * Proxies OpenWeatherMap so the API key stays server-side.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Missing or invalid lat/lng parameters' },
      { status: 400 },
    );
  }

  // Clamp to 2 decimals for cache key normalization
  const latKey = lat.toFixed(2);
  const lngKey = lng.toFixed(2);
  const cacheKey = `weather:${latKey},${lngKey}`;

  const weather = await cached(cacheKey, 900, async () => {
    // 900s = 15 min TTL
    const real = await fetchWeather(lat, lng);
    if (real) return real;
    // Fallback to simulated weather
    return getSimulatedWeather(lat, lng, new Date().toISOString());
  });

  return NextResponse.json(weather, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
