import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getWeekendConflicts, sessionKey } from '@/lib/conflicts';
import type { NormalizedRaceEvent } from '@/types';

// Fixed clock: Friday 2026-06-12 → weekend window Thu 06-11 .. Mon 06-15
const FRIDAY = new Date('2026-06-12T12:00:00Z');

function makeEvent(
  id: string,
  series: NormalizedRaceEvent['series'],
  raceStart: string,
): NormalizedRaceEvent {
  return {
    id,
    series,
    name: `${id} event`,
    circuit: { name: 'Test Circuit', country: 'Testland', countryCode: 'TL', lat: 0, lng: 0 },
    sessions: [
      { type: 'race', name: 'Race', startTime: raceStart, state: 'upcoming' },
    ],
    state: 'upcoming',
    startDate: '2026-06-12',
    endDate: '2026-06-14',
    streamLinks: [],
    source: { provider: 'test', reliability: 'official', lastUpdated: '2026-06-12' },
  };
}

describe('getWeekendConflicts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FRIDAY);
  });
  afterEach(() => vi.useRealTimers());

  it('flags overlapping sessions of two favorited series', () => {
    const a = makeEvent('a', 'f1', '2026-06-13T13:00:00Z');
    const b = makeEvent('b', 'wec', '2026-06-13T14:00:00Z'); // within 2h window of a
    const conflicts = getWeekendConflicts([a, b], ['f1', 'wec']);
    expect(conflicts.count).toBeGreaterThan(0);
    expect(conflicts.byKey.get(sessionKey('a', '2026-06-13T13:00:00Z'))).toBeTruthy();
  });

  it('no conflict when sessions are far apart', () => {
    const a = makeEvent('a', 'f1', '2026-06-13T08:00:00Z');
    const b = makeEvent('b', 'wec', '2026-06-13T18:00:00Z');
    expect(getWeekendConflicts([a, b], ['f1', 'wec']).count).toBe(0);
  });

  it('ignores series not in favorites', () => {
    const a = makeEvent('a', 'f1', '2026-06-13T13:00:00Z');
    const b = makeEvent('b', 'wec', '2026-06-13T13:30:00Z');
    expect(getWeekendConflicts([a, b], ['f1', 'motogp']).count).toBe(0);
  });

  it('fewer than two favorited series → no conflicts', () => {
    const a = makeEvent('a', 'f1', '2026-06-13T13:00:00Z');
    const b = makeEvent('b', 'wec', '2026-06-13T13:30:00Z');
    expect(getWeekendConflicts([a, b], ['f1']).count).toBe(0);
  });
});
