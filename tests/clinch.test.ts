import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getClinchInfo } from '@/lib/clinch';
import { CALENDAR_2026 } from '@/data/calendar-2026';

function lastRaceTime(series: 'f1' | 'motogp'): number {
  const times = CALENDAR_2026
    .filter((e) => e.series === series)
    .flatMap((e) => e.sessions.filter((s) => s.type === 'race').map((s) => new Date(s.startTime).getTime()));
  return Math.max(...times);
}

describe('getClinchInfo', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('season over + any lead → champion', () => {
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'));
    const info = getClinchInfo('f1', [
      { name: 'Leader', points: 300 },
      { name: 'Rival', points: 299 },
    ]);
    expect(info?.status).toBe('champion');
    expect(info?.leader).toBe('Leader');
  });

  it('season over + tie → null (tie-breakers decide, not points math)', () => {
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'));
    expect(getClinchInfo('f1', [
      { name: 'A', points: 300 },
      { name: 'B', points: 300 },
    ])).toBe(null);
  });

  it('mid-season small lead → null', () => {
    vi.setSystemTime(new Date('2026-06-12T00:00:00Z'));
    expect(getClinchInfo('f1', [
      { name: 'Leader', points: 150 },
      { name: 'Rival', points: 130 },
    ])).toBe(null);
  });

  it('one round left → clinchable at the final round', () => {
    vi.setSystemTime(new Date(lastRaceTime('f1') - 24 * 3600_000));
    const info = getClinchInfo('f1', [
      { name: 'Leader', points: 400 },
      { name: 'Rival', points: 395 },
    ]);
    expect(info?.status).toBe('next-round');
    expect(info?.roundsLeft).toBe(1);
  });

  it('motogp: lead bigger than 37/round max remaining → champion', () => {
    vi.setSystemTime(new Date(lastRaceTime('motogp') - 24 * 3600_000));
    const info = getClinchInfo('motogp', [
      { name: 'Leader', points: 400 },
      { name: 'Rival', points: 362 }, // lead 38 > 37 max at the final round
    ]);
    expect(info?.status).toBe('champion');
  });

  it('fewer than two entries → null', () => {
    vi.setSystemTime(new Date('2026-06-12T00:00:00Z'));
    expect(getClinchInfo('f1', [{ name: 'Solo', points: 10 }])).toBe(null);
  });
});
