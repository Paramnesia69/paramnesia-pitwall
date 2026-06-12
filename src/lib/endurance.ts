/**
 * Endurance race duration detection.
 *
 * The calendar has no endTime on sessions; short races fall back to a 2–3h
 * window when computing state. For endurance races ("24 Hours of Le Mans",
 * "12 Hours of Sebring") that fallback marks them finished hours before the
 * chequered flag. Durations here are derived from the official race names —
 * facts, not invented data.
 */

const WORD_HOURS: Record<string, number> = {
  four: 4, six: 6, eight: 8, ten: 10, twelve: 12, 'twenty-four': 24,
};

export function getEnduranceDurationHours(name: string): number | null {
  const n = name.toLowerCase();
  // "24h Quali Race" at the Nürburgring is a short quali race named after
  // the 24h event — never treat it as 24 hours
  if (n.includes('quali')) return null;
  if (/rolex 24|daytona 24/.test(n)) return 24;
  if (/petit le mans/.test(n)) return 10;
  const word = n.match(/\b(four|six|eight|ten|twelve|twenty-four)\s+hours?\b/);
  if (word) return WORD_HOURS[word[1]] ?? null;
  const m = n.match(/\b(\d{1,2})\s*(?:hours?|hrs?|h)\b/);
  if (m) {
    const h = parseInt(m[1], 10);
    return h >= 4 && h <= 25 ? h : null;
  }
  return null;
}
