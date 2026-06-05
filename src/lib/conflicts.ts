import type { NormalizedRaceEvent, SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import { getThisWeekendEvents } from '@/lib/weekend';
import { formatTimeISR } from '@/lib/events';

export interface ConflictInfo {
  /** Number of distinct overlapping session pairs this weekend */
  count: number;
  /** sessionKey → human labels of the sessions it clashes with */
  byKey: Map<string, string[]>;
}

/** Stable per-session key used to look up conflicts in the UI */
export function sessionKey(eventId: string, sessionStart: string): string {
  return `${eventId}::${sessionStart}`;
}

const TWO_HOURS = 2 * 60 * 60 * 1000;

/**
 * Schedule Conflict Detector (feature 6).
 * Finds time-overlapping sessions between *different* events of favorited series
 * within the current race weekend (Thu–Mon, reusing getThisWeekendEvents).
 * Returns a per-session lookup so cards can flag the exact clash.
 */
export function getWeekendConflicts(
  events: NormalizedRaceEvent[],
  favorites: SeriesId[],
): ConflictInfo {
  const byKey = new Map<string, string[]>();
  if (favorites.length < 2) return { count: 0, byKey };

  const weekend = getThisWeekendEvents(events).filter((e) => favorites.includes(e.series));

  // Flatten non-finished sessions into time slots
  const slots = weekend.flatMap((e) =>
    e.sessions
      .filter((s) => s.state !== 'finished')
      .map((s) => {
        const start = new Date(s.startTime).getTime();
        const end = s.endTime ? new Date(s.endTime).getTime() : start + TWO_HOURS;
        return {
          key: sessionKey(e.id, s.startTime),
          eventId: e.id,
          start,
          end,
          label: `${SERIES_META[e.series].name} · ${s.name} ${formatTimeISR(s.startTime)}`,
        };
      }),
  );

  const add = (key: string, label: string) => {
    const list = byKey.get(key);
    if (list) list.push(label);
    else byKey.set(key, [label]);
  };

  let count = 0;
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (a.eventId === b.eventId) continue;
      // Half-open overlap test
      if (a.start < b.end && b.start < a.end) {
        count++;
        add(a.key, b.label);
        add(b.key, a.label);
      }
    }
  }

  return { count, byKey };
}
