import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { CALENDAR_2026 } from '@/data/calendar-2026';
import { ALL_RESULTS_2026 } from '@/data/results-2026';
import * as standings from '@/data/standings-2026';
import { SERIES_META } from '@/types';

/**
 * Build-time guard for the hand-maintained data files. Wired into `prebuild`
 * so a typo'd date, bad country code, or out-of-order podium fails the
 * Vercel build instead of shipping.
 */

const seriesIds = Object.keys(SERIES_META) as [string, ...string[]];

const isoDate = z.string().refine((s) => !Number.isNaN(new Date(s).getTime()), 'unparseable date');

const sessionSchema = z.object({
  type: z.enum(['practice', 'qualifying', 'sprint', 'warmup', 'race']),
  name: z.string().min(1),
  startTime: isoDate,
  endTime: isoDate.optional(),
});

const eventSchema = z.object({
  id: z.string().min(1),
  series: z.enum(seriesIds),
  name: z.string().min(1),
  circuit: z.object({
    name: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().regex(/^[A-Z]{2}$/, 'countryCode must be 2 uppercase letters'),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  startDate: isoDate,
  endDate: isoDate,
  sessions: z.array(sessionSchema).min(1),
}).loose();

const resultSchema = z.object({
  id: z.string().min(1),
  series: z.enum(seriesIds),
  round: z.number().int().positive(),
  name: z.string().min(1),
  circuit: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
  date: isoDate,
  podium: z.array(z.object({
    pos: z.number().int().positive(),
    driver: z.string().min(1),
    team: z.string().min(1),
  }).loose()).min(1),
}).loose();

describe('calendar-2026', () => {
  it('every event matches the schema', () => {
    for (const e of CALENDAR_2026) {
      const r = eventSchema.safeParse(e);
      expect(r.success, `${e.id}: ${r.success ? '' : r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`).toBe(true);
    }
  });

  it('event ids are unique', () => {
    const ids = CALENDAR_2026.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('endDate is not before startDate', () => {
    for (const e of CALENDAR_2026) {
      expect(
        new Date(e.endDate).getTime() >= new Date(e.startDate).getTime(),
        `${e.id}: endDate ${e.endDate} < startDate ${e.startDate}`,
      ).toBe(true);
    }
  });
});

describe('results-2026', () => {
  it('every result matches the schema', () => {
    for (const r of ALL_RESULTS_2026) {
      const p = resultSchema.safeParse(r);
      expect(p.success, `${r.id}: ${p.success ? '' : p.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`).toBe(true);
    }
  });

  it('result ids are unique', () => {
    const ids = ALL_RESULTS_2026.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('podium positions are sequential from 1', () => {
    for (const r of ALL_RESULTS_2026) {
      r.podium.forEach((p, i) => {
        expect(p.pos, `${r.id} podium[${i}]`).toBe(i + 1);
      });
    }
  });
});

describe('standings-2026', () => {
  const driverArrays = Object.entries(standings).filter(
    ([k, v]) => Array.isArray(v) && k.includes('DRIVERS'),
  ) as Array<[string, Array<{ pos: number; name: string; points: number }>]>;

  const allArrays = Object.entries(standings).filter(([, v]) => Array.isArray(v)) as Array<
    [string, Array<{ pos: number; name: string; points: number }>]
  >;

  it('exports at least the known standings arrays', () => {
    expect(driverArrays.length).toBeGreaterThanOrEqual(5);
  });

  it('positions are sequential and points non-increasing', () => {
    for (const [key, arr] of allArrays) {
      arr.forEach((row, i) => {
        expect(row.pos, `${key}[${i}].pos`).toBe(i + 1);
        if (i > 0) {
          expect(
            arr[i - 1].points >= row.points,
            `${key}: points increase from ${arr[i - 1].points} (pos ${i}) to ${row.points} (pos ${i + 1})`,
          ).toBe(true);
        }
      });
    }
  });

  it('every row has a name and finite points', () => {
    for (const [key, arr] of allArrays) {
      arr.forEach((row, i) => {
        expect(typeof row.name, `${key}[${i}].name`).toBe('string');
        expect(Number.isFinite(row.points), `${key}[${i}].points`).toBe(true);
      });
    }
  });
});
