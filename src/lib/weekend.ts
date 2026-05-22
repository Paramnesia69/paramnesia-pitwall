import type { NormalizedRaceEvent } from '@/types';

export function getThisWeekendEvents(events: NormalizedRaceEvent[]): NormalizedRaceEvent[] {
  const now = new Date();
  const day = now.getDay();
  const diffToThursday = day >= 4 ? day - 4 : day + 3;
  const thursday = new Date(now);
  thursday.setDate(now.getDate() - diffToThursday);
  thursday.setHours(0, 0, 0, 0);

  const monday = new Date(thursday);
  monday.setDate(thursday.getDate() + 4);
  monday.setHours(23, 59, 59, 999);

  return events.filter((e) => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    return start <= monday && end >= thursday;
  });
}
