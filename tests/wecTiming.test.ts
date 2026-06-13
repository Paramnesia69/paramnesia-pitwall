import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseWecClassification, normalizeGriiipBootstrap } from '@/lib/wecTiming';

// Real Al Kamel classification CSV saved from the 2026 Le Mans Warm Up — the
// exact format the live race classification uses.
const csv = readFileSync(
  fileURLToPath(new URL('./fixtures/wec-classification-sample.csv', import.meta.url)),
  'utf8',
);

describe('parseWecClassification', () => {
  const data = parseWecClassification(csv, 'race', 3, 'live');

  it('carries through status / source / hour', () => {
    expect(data.status).toBe('live');
    expect(data.source).toBe('race');
    expect(data.hour).toBe(3);
  });

  it('groups all three Le Mans classes in canonical order', () => {
    expect(data.classes.map((c) => c.name)).toEqual(['HYPERCAR', 'LMP2', 'LMGT3']);
  });

  it('parses 62 entries across the classes', () => {
    const total = data.classes.reduce((n, c) => n + c.entries.length, 0);
    expect(total).toBe(62);
  });

  it('normalizes the Hypercar leader (Ferrari #51)', () => {
    const top = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[0];
    expect(top.number).toBe('51');
    expect(top.team).toBe('Ferrari AF Corse');
    expect(top.manufacturer).toBe('Ferrari');
    expect(top.vehicle).toBe('Ferrari 499P');
    expect(top.classPos).toBe(1);
    expect(top.gapClass).toBe('LEADER');
    expect(top.drivers).toContain('Alessandro PIER GUIDI');
    expect(top.drivers.length).toBe(3);
  });

  it('computes class position + gap for the runner-up', () => {
    const second = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[1];
    expect(second.classPos).toBe(2);
    expect(second.number).toBe('50');
    // #50 completed one fewer lap than #51 in the sample → exact lap-down gap.
    expect(second.gapClass).toBe('+1 lap');
  });

  it('handles empty / short input gracefully', () => {
    expect(parseWecClassification('', 'x', null, 'live').status).toBe('unavailable');
  });
});

// The live RACE classification uses a different schema (POSITION, single-field
// DRIVER_1..N) than practice/quali — the parser must handle both.
describe('parseWecClassification — live race schema', () => {
  const raceCsv = readFileSync(
    fileURLToPath(new URL('./fixtures/wec-race-classification-sample.csv', import.meta.url)),
    'utf8',
  );
  const data = parseWecClassification(raceCsv, 'hour-2', 2, 'live');

  it('groups the three classes and 62 entries', () => {
    expect(data.classes.map((c) => c.name)).toEqual(['HYPERCAR', 'LMP2', 'LMGT3']);
    expect(data.classes.reduce((n, c) => n + c.entries.length, 0)).toBe(62);
  });

  it('reads POSITION + single-field driver names (Toyota #8 leads Hypercar)', () => {
    const top = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[0];
    expect(top.pos).toBe(1);
    expect(top.classPos).toBe(1);
    expect(top.number).toBe('8');
    expect(top.team).toBe('Toyota Racing');
    expect(top.manufacturer).toBe('Toyota');
    expect(top.gapClass).toBe('LEADER');
    expect(top.drivers).toContain('Sébastien BUEMI');
    expect(top.drivers.length).toBe(3);
  });

  it('orders the class by real position', () => {
    const hc = data.classes.find((c) => c.name === 'HYPERCAR')!.entries;
    expect(hc[1].classPos).toBe(2);
    expect(hc.every((e, i) => i === 0 || e.pos >= hc[i - 1].pos)).toBe(true);
  });

  it('reads FL_TIME / FL_KPH / TYRES from the race schema (not the absent TIME/KPH cols)', () => {
    const top = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[0];
    expect(top.bestLapTime).toBe('3:26.580'); // FL_TIME, apostrophe normalized
    expect(top.bestLapNum).toBe('20');
    expect(top.kph).toBe('237.5');            // FL_KPH
    expect(top.tyre).toBe('Michelin');        // TYRES "M"
  });
});

// The live (Griiip) backend ships a rich JSON bootstrap. normalizeGriiipBootstrap
// folds participants + ranks + gaps + bestLaps + tyres + status into the same
// per-class shape the panel renders.
describe('normalizeGriiipBootstrap — live JSON backend', () => {
  const boot = JSON.parse(
    readFileSync(fileURLToPath(new URL('./fixtures/wec-griiip-bootstrap-sample.json', import.meta.url)), 'utf8'),
  );
  const data = normalizeGriiipBootstrap(boot, 'live', 96, 'Green');

  it('marks the snapshot live with leader lap + flag + weather', () => {
    expect(data.status).toBe('live');
    expect(data.source).toBe('live');
    expect(data.leaderLap).toBe(96);
    expect(data.flag).toBe('Green');
    expect(data.weather?.trackTemp).toBeGreaterThan(0);
  });

  it('orders classes HYPERCAR → LMP2 → LMGT3', () => {
    expect(data.classes.map((c) => c.name)).toEqual(['HYPERCAR', 'LMP2', 'LMGT3']);
  });

  it('maps the Hypercar class leader with team, drivers, tyre, best lap', () => {
    const top = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[0];
    expect(top.classPos).toBe(1);
    expect(top.number).toBe('38');
    expect(top.team).toBe('CADILLAC HERTZ TEAM JOTA');
    expect(top.manufacturer).toBe('Cadillac');
    expect(top.gapClass).toBe('LEADER');
    expect(top.bestLapTime).toBe('3:26.605'); // 206605ms
    expect(top.bestLapColor).toBe('Green');
    expect(top.tyre).toBe('Medium');          // MEDIUM → Medium
    expect(top.status).toBe('Running');
    expect(top.drivers).toContain('Sébastien BOURDAIS');
  });

  it('maps last-lap sectors + hybrid energy for the leader', () => {
    const top = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[0];
    expect(top.energyPct).toBe(37);
    expect(top.sectors).toHaveLength(3);
    expect(top.sectors[0].time).toBe('33.385'); // S1 33385ms
    expect(top.sectors[1].time).toBe('1:19.441'); // S2 over a minute
    expect(top.lastLapTime).not.toBe('');
  });

  it('computes a class gap for the second car', () => {
    const second = data.classes.find((c) => c.name === 'HYPERCAR')!.entries[1];
    expect(second.classPos).toBe(2);
    expect(second.gapClass).not.toBe('LEADER');
  });
});
