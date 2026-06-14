import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseWecClassification } from '@/lib/wecTiming';
import { parseLatestRaceBase } from '@/lib/elmsTiming';

// Real Al Kamel ELMS race classification CSV (2026 R2 Paul Ricard, Hour 4).
// Same single-field POSITION + DRIVER_1..N schema as the WEC live race, but with
// the ELMS four-class structure (LMP2, LMP2 Pro/Am, LMP3, LMGT3).
const csv = readFileSync(
  fileURLToPath(new URL('./fixtures/elms-race-classification-sample.csv', import.meta.url)),
  'utf8',
);

describe('parseWecClassification — ELMS race schema', () => {
  const data = parseWecClassification(csv, 'hour-4', 4, 'live');

  it('groups the four ELMS classes in canonical order', () => {
    expect(data.classes.map((c) => c.name)).toEqual(['LMP2', 'LMP2 Pro/Am', 'LMP3', 'LMGT3']);
  });

  it('parses all 47 entries across the classes', () => {
    const total = data.classes.reduce((n, c) => n + c.entries.length, 0);
    expect(total).toBe(47);
  });

  it('normalizes the LMP2 leader (United Autosports #22)', () => {
    const top = data.classes.find((c) => c.name === 'LMP2')!.entries[0];
    expect(top.number).toBe('22');
    expect(top.team).toBe('United Autosports');
    expect(top.manufacturer).toBe('Oreca');
    expect(top.classPos).toBe(1);
    expect(top.gapClass).toBe('LEADER');
    expect(top.drivers).toContain('Griffin PEEBLES');
    expect(top.drivers.length).toBe(3);
  });

  it('keeps each class ordered by real position', () => {
    for (const c of data.classes) {
      expect(c.entries.every((e, i) => i === 0 || e.classPos === c.entries[i - 1].classPos + 1)).toBe(true);
    }
  });
});

describe('parseLatestRaceBase — Al Kamel tree-menu discovery', () => {
  // Trimmed homepage HTML with two rounds' race paths — discovery must pick the
  // highest-numbered round (the latest event).
  const html = `
    <a href="Results/21_2026/01_BARCELONA/650_European%20Le%20Mans%20Series/202604121200_Race/Hour%204/03_Classification_Race.CSV">r1</a>
    <a href="Results/21_2026/02_PAUL%20RICARD/650_European%20Le%20Mans%20Series/202605031200_Race/Hour%201/03_Classification_Race.CSV">r2</a>
    <a href="Results/21_2026/02_PAUL%20RICARD/650_European%20Le%20Mans%20Series/202605031200_Race/Hour%204/03_Classification_Race.CSV">r2</a>
  `;

  it('selects the latest round and builds its race base', () => {
    const found = parseLatestRaceBase(html);
    expect(found).not.toBeNull();
    expect(found!.round).toBe(2);
    expect(found!.circuit).toBe('PAUL RICARD');
    expect(found!.base).toBe('Results/21_2026/02_PAUL%20RICARD/650_European%20Le%20Mans%20Series/202605031200_Race');
  });

  it('returns null when no race session is present', () => {
    expect(parseLatestRaceBase('<a href="Results/21_2026/02_PAUL%20RICARD/650/202605021810_Qualifying/90_x.CSV">q</a>')).toBeNull();
  });
});
