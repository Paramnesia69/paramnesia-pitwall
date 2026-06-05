import type { NormalizedRaceEvent, SeriesId } from '@/types';
import { SERIES_META } from '@/types';

export interface LiveSessionInfo {
  eventId: string;
  eventName: string;
  series: SeriesId;
  circuitName: string;
  countryCode: string;
  sessionName: string;
  /** 'live' = currently running; 'starting_soon' = within the pre-start window */
  state: 'live' | 'starting_soon';
  startTime: string;
  accent: string;
  logo?: string;
}

/**
 * Derives the set of currently-live (or starting-soon) sessions from the
 * event list already maintained by useLiveData. No additional API calls.
 * One entry per live event — the most-relevant active session for that event.
 */
export function getLiveSessions(events: NormalizedRaceEvent[]): LiveSessionInfo[] {
  const result: LiveSessionInfo[] = [];
  for (const event of events) {
    if (event.state !== 'live' && event.state !== 'starting_soon') continue;
    const activeSession = event.sessions.find(
      (s) => s.state === 'live' || s.state === 'starting_soon',
    );
    if (!activeSession) continue;
    const meta = SERIES_META[event.series];
    result.push({
      eventId: event.id,
      eventName: event.name,
      series: event.series,
      circuitName: event.circuit.name,
      countryCode: event.circuit.countryCode,
      sessionName: activeSession.name,
      state: activeSession.state as 'live' | 'starting_soon',
      startTime: activeSession.startTime,
      accent: meta.accent,
      logo: meta.logo,
    });
  }
  return result;
}
