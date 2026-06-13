import { describe, it, expect } from 'vitest';
import {
  getEnduranceSun,
  getDaylightState,
  getRacePhase,
  getNextMilestone,
} from '@/lib/enduranceClock';

// Le Mans 2026: start 14:00Z Sat → 14:00Z Sun, 24h.
const START = new Date('2026-06-13T14:00:00Z').getTime();
const DUR = 24;
const sun = getEnduranceSun('Circuit de la Sarthe')!;
const at = (iso: string) => new Date(iso).getTime();

describe('getEnduranceSun', () => {
  it('returns the Le Mans sun window', () => {
    expect(sun).toEqual({ sunsetUtc: '2026-06-13T19:58:00Z', sunriseUtc: '2026-06-14T04:00:00Z' });
  });
  it('returns null for circuits with no overnight running', () => {
    expect(getEnduranceSun('Imola')).toBeNull();
  });
});

describe('getDaylightState', () => {
  it('is day in the afternoon, night after sunset, day after sunrise', () => {
    expect(getDaylightState(at('2026-06-13T17:00:00Z'), sun)).toBe('day');
    expect(getDaylightState(at('2026-06-13T23:00:00Z'), sun)).toBe('night');
    expect(getDaylightState(at('2026-06-14T08:00:00Z'), sun)).toBe('day');
  });
  it('flags dusk/dawn within the twilight band', () => {
    expect(getDaylightState(at('2026-06-13T19:58:00Z'), sun)).toBe('dusk');
    expect(getDaylightState(at('2026-06-14T04:00:00Z'), sun)).toBe('dawn');
  });
});

describe('getRacePhase', () => {
  it('opens with Le Départ then runs the afternoon', () => {
    expect(getRacePhase(at('2026-06-13T14:20:00Z'), START, DUR, sun).label).toBe('Le Départ');
    expect(getRacePhase(at('2026-06-13T17:00:00Z'), START, DUR, sun).label).toBe('Afternoon Run');
  });
  it('narrates the night and the morning', () => {
    expect(getRacePhase(at('2026-06-13T23:00:00Z'), START, DUR, sun).label).toBe('Into the Night');
    expect(getRacePhase(at('2026-06-14T08:00:00Z'), START, DUR, sun).label).toBe('Morning Charge');
  });
  it('prioritises the final hour over daylight', () => {
    expect(getRacePhase(at('2026-06-14T13:30:00Z'), START, DUR, sun).label).toBe('Final Hour');
    expect(getRacePhase(at('2026-06-14T13:50:00Z'), START, DUR, sun).label).toBe('Run to the Flag');
  });
});

describe('getNextMilestone', () => {
  it('counts down to the next hour mark first', () => {
    const m = getNextMilestone(at('2026-06-13T14:30:00Z'), START, DUR, sun)!;
    expect(m.label).toBe('Hour 1');
    expect(m.targetMs).toBe(at('2026-06-13T15:00:00Z'));
  });
  it('surfaces sunset when it is the nearest event', () => {
    const m = getNextMilestone(at('2026-06-13T19:30:00Z'), START, DUR, sun)!;
    expect(m.label).toBe('Sunset');
  });
  it('ends on the chequered flag', () => {
    const m = getNextMilestone(at('2026-06-14T13:50:00Z'), START, DUR, sun)!;
    expect(m.label).toBe('Chequered Flag');
  });
});
