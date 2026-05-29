import { CALENDAR_2026 } from '@/data/calendar-2026';
import type { NormalizedRaceEvent, EventState } from '@/types';
import { fetchWeather, getSimulatedWeather } from '@/lib/weather';
import { applyOverrides, getForcedFeaturedId } from '@/lib/overrides';

function computeState(event: { startDate: string; endDate: string; sessions: { startTime: string; endTime?: string }[] }): EventState {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  end.setHours(23, 59, 59, 999);

  if (now > end) return 'finished';

  const lastSession = event.sessions[event.sessions.length - 1];
  if (lastSession) {
    const lastEnd = lastSession.endTime
      ? new Date(lastSession.endTime)
      : new Date(new Date(lastSession.startTime).getTime() + 3 * 60 * 60 * 1000);
    if (now > lastEnd) return 'finished';
  }

  const hoursUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntil <= 0 && now <= end) return 'live';
  if (hoursUntil <= 48 && hoursUntil > 0) return 'starting_soon';
  return 'upcoming';
}

/**
 * Build events with computed state and weather.
 * Async — tries real OpenWeatherMap data for non-finished events,
 * falls back to simulated weather when no API key or fetch fails.
 */
export async function getEventsWithState(): Promise<NormalizedRaceEvent[]> {
  const mapped = CALENDAR_2026.map((evt) => {
    const state = computeState(evt);
    const sessions = evt.sessions.map((s) => {
      const sStart = new Date(s.startTime);
      const sEnd = s.endTime ? new Date(s.endTime) : new Date(sStart.getTime() + 2 * 60 * 60 * 1000);
      const now = new Date();
      let sState: EventState = 'upcoming';
      if (now > sEnd) sState = 'finished';
      else if (now >= sStart && now <= sEnd) sState = 'live';
      else if ((sStart.getTime() - now.getTime()) / (1000 * 60 * 60) <= 2) sState = 'starting_soon';
      return { ...s, state: sState };
    });
    return { evt, state, sessions };
  });

  // Fetch real weather in parallel for non-finished events (max 15 to stay within rate limits)
  const nonFinished = mapped.filter((m) => m.state !== 'finished').slice(0, 15);
  const weatherResults = await Promise.all(
    nonFinished.map((m) => fetchWeather(m.evt.circuit.lat, m.evt.circuit.lng)),
  );
  const weatherMap = new Map<string, NonNullable<Awaited<ReturnType<typeof fetchWeather>>>>();
  nonFinished.forEach((m, i) => {
    if (weatherResults[i]) weatherMap.set(m.evt.id, weatherResults[i]!);
  });

  return mapped.map(({ evt, state, sessions }) => {
    // Use real weather if available, otherwise simulated
    const weather = weatherMap.get(evt.id) ?? getSimulatedWeather(evt.circuit.lat, evt.circuit.lng, evt.startDate);
    return applyOverrides({ ...evt, state, sessions, weather });
  });
}

export function deriveUpcomingEvents(events: NormalizedRaceEvent[], limit?: number): NormalizedRaceEvent[] {
  const sorted = events
    .filter((e) => e.state !== 'finished')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export function deriveFeaturedEvent(events: NormalizedRaceEvent[]): NormalizedRaceEvent | undefined {
  const forcedId = getForcedFeaturedId();
  if (forcedId) {
    const forced = events.find((e) => e.id === forcedId);
    if (forced) return forced;
  }

  const live = events.find((e) => e.state === 'live');
  if (live) return live;
  const startingSoon = events
    .filter((e) => e.state === 'starting_soon')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  if (startingSoon.length > 0) return startingSoon[0];
  const upcoming = events
    .filter((e) => e.state === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return upcoming[0];
}

export async function getUpcomingEvents(limit?: number): Promise<NormalizedRaceEvent[]> {
  return deriveUpcomingEvents(await getEventsWithState(), limit);
}

export async function getFeaturedEvent(): Promise<NormalizedRaceEvent | undefined> {
  return deriveFeaturedEvent(await getEventsWithState());
}

export function formatDateISR(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Jerusalem',
  });
}

export function formatTimeISR(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jerusalem',
  });
}
