import type { WeatherData } from '@/types';

// Server-only key — never exposed to client bundle.
// Falls back to NEXT_PUBLIC_ for backward compat.
const API_KEY = process.env.OPENWEATHER_KEY ?? process.env.NEXT_PUBLIC_OPENWEATHER_KEY ?? '';
const CACHE = new Map<string, { data: WeatherData; ts: number }>();
const TTL = 30 * 60 * 1000; // 30 min cache

/**
 * Fetch current weather for a lat/lng from OpenWeatherMap.
 * Falls back gracefully when no API key is configured.
 */
export async function fetchWeather(
  lat: number,
  lng: number,
): Promise<WeatherData | null> {
  if (!API_KEY) return null;

  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`,
      { next: { revalidate: 1800 } }, // ISR: revalidate every 30 min
    );
    if (!res.ok) return null;

    const json = await res.json();
    const data: WeatherData = {
      temp: Math.round(json.main.temp),
      condition: json.weather[0].main,
      icon: mapIcon(json.weather[0].icon),
      rainChance: json.rain?.['1h'] ? Math.min(100, Math.round(json.rain['1h'] * 10)) : 0,
      windSpeed: Math.round(json.wind.speed * 3.6), // m/s → km/h
    };

    CACHE.set(key, { data, ts: Date.now() });
    return data;
  } catch {
    return null;
  }
}

/** Map OWM icon code to a weather emoji / symbol */
function mapIcon(owmIcon: string): string {
  const map: Record<string, string> = {
    '01d': 'sun', '01n': 'moon',
    '02d': 'cloud-sun', '02n': 'cloud-moon',
    '03d': 'cloud', '03n': 'cloud',
    '04d': 'clouds', '04n': 'clouds',
    '09d': 'rain', '09n': 'rain',
    '10d': 'rain-sun', '10n': 'rain-moon',
    '11d': 'storm', '11n': 'storm',
    '13d': 'snow', '13n': 'snow',
    '50d': 'mist', '50n': 'mist',
  };
  return map[owmIcon] ?? 'cloud';
}

/**
 * Generate simulated weather based on location + date for demo purposes.
 * Used when no OpenWeatherMap API key is configured.
 */
export function getSimulatedWeather(
  lat: number,
  _lng: number,
  dateStr: string,
): WeatherData {
  // Seed from lat + date for deterministic but varied results
  const date = new Date(dateStr);
  const seed = Math.abs(Math.round(lat * 100) + date.getMonth() * 31 + date.getDate());

  // Base temp from latitude — tropics hot, poles cold
  const absLat = Math.abs(lat);
  let baseTemp: number;
  if (absLat < 15) baseTemp = 30;      // tropical
  else if (absLat < 30) baseTemp = 26;  // subtropical
  else if (absLat < 45) baseTemp = 20;  // temperate
  else if (absLat < 55) baseTemp = 15;  // cool temperate
  else baseTemp = 10;                   // northern

  // Seasonal adjustment (northern hemisphere: summer = warm)
  const month = date.getMonth(); // 0-11
  const isNorth = lat >= 0;
  const summerMonth = isNorth ? 6 : 0; // July vs January
  const monthDiff = Math.abs(month - summerMonth);
  const seasonalShift = (3 - Math.min(monthDiff, 12 - monthDiff)) * 3;
  baseTemp += seasonalShift;

  // Small pseudo-random variation
  const variation = ((seed * 7 + 13) % 9) - 4;
  const temp = Math.round(baseTemp + variation);

  // Weather conditions from seed
  const conditions: { condition: string; icon: string; rainChance: number }[] = [
    { condition: 'Clear', icon: 'sun', rainChance: 0 },
    { condition: 'Clear', icon: 'sun', rainChance: 5 },
    { condition: 'Clouds', icon: 'cloud-sun', rainChance: 10 },
    { condition: 'Clouds', icon: 'cloud', rainChance: 20 },
    { condition: 'Clouds', icon: 'clouds', rainChance: 25 },
    { condition: 'Rain', icon: 'rain-sun', rainChance: 60 },
    { condition: 'Rain', icon: 'rain', rainChance: 80 },
    { condition: 'Drizzle', icon: 'rain', rainChance: 45 },
  ];
  const condIdx = Math.abs((seed * 3 + 7) % conditions.length);
  const cond = conditions[condIdx];

  // Wind 5–30 km/h
  const windSpeed = 5 + ((seed * 11 + 3) % 26);

  return {
    temp,
    condition: cond.condition,
    icon: cond.icon,
    rainChance: cond.rainChance,
    windSpeed,
  };
}
