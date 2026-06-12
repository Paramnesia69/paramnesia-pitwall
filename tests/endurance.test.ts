import { describe, it, expect } from 'vitest';
import { getEnduranceDurationHours } from '@/lib/endurance';

describe('getEnduranceDurationHours', () => {
  const cases: Array<[string, number | null]> = [
    ['24 Hours of Le Mans', 24],
    ['6 Hours of Imola', 6],
    ['8 Hours of Bahrain', 8],
    ['Rolex 24', 24],
    ['12 Hours of Sebring', 12],
    ['Six Hours of The Glen', 6],
    ['4 Hours of Barcelona', 4],
    ['24 Hours of Spa', 24],
    ['24 Hours of Nürburgring', 24],
    ['Petit Le Mans', 10],
    // NOT endurance races — must never parse a duration:
    ['24h Quali Race 1', null],   // N24 quali race, named after the 24h event
    ['Monaco Grand Prix', null],
    ['Sprint', null],
    ['Hyperpole', null],
  ];

  it.each(cases)('%s → %s', (name, want) => {
    expect(getEnduranceDurationHours(name)).toBe(want);
  });

  it('rejects implausible hour counts', () => {
    expect(getEnduranceDurationHours('2 Hours of Nowhere')).toBe(null);
    expect(getEnduranceDurationHours('99 Hours of Nowhere')).toBe(null);
  });
});
