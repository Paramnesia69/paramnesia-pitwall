/**
 * WEC / Le Mans live timing — Al Kamel classification CSV.
 *
 * Al Kamel publishes a semicolon-delimited classification CSV per session at
 * deterministic URLs (the same files the official timing site reads). During
 * the race the live order appears at the race-root classification file, with
 * hourly snapshots in `Hour N/` folders. This module fetches the freshest
 * available file and normalizes it into a per-class leaderboard.
 *
 * REAL data only — every field comes straight from Al Kamel; gaps to the class
 * leader are computed from their own lap counts (exact, not estimated).
 *
 * NOTE: data on Al Kamel's pages is owned by Al Kamel Systems. This is a private,
 * single-user dashboard (whole site behind auth) consuming it for personal use,
 * not redistribution.
 */

import { cached } from '@/lib/cache';
import type { WECTimingData, WECTimingEntry, WECTimingClass } from '@/types';

// Le Mans 2026 race session base (season 15_2026 · round 03 · event 657 · race 16:00).
const LE_MANS_2026_RACE =
  'https://fiawec.alkamelsystems.com/Results/15_2026/03_LE%20MANS/657_FIA%20WEC/202606131600_Race';
const LE_MANS_2026_START = Date.parse('2026-06-13T14:00:00Z');
const LE_MANS_2026_DURATION_H = 24;

const CLASS_ORDER = ['HYPERCAR', 'LMP2', 'LMGT3'];
const MULTIWORD_BRANDS = ['Aston Martin'];

/** Split a single Al Kamel CSV line, trimming the trailing empty cell. */
function splitRow(line: string): string[] {
  return line.split(';');
}

function manufacturerOf(vehicle: string): string {
  const v = vehicle.trim();
  for (const b of MULTIWORD_BRANDS) if (v.startsWith(b)) return b;
  return v.split(/\s+/)[0] ?? v;
}

/**
 * Parse an Al Kamel classification CSV into normalized per-class leaderboards.
 * Pure + exported for testing against a saved fixture.
 */
export function parseWecClassification(
  csv: string,
  source: string,
  hour: number | null,
  status: WECTimingData['status'],
): WECTimingData {
  // Strip BOM, split lines, drop blanks.
  const lines = csv.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { status: 'unavailable', source, hour, updated: new Date().toISOString(), classes: [] };
  }

  // Header → column index (names trimmed; e.g. " LAPS" → "LAPS").
  // Al Kamel uses two schemas: practice/quali ("POS", split DRIVERn_FIRST/SECOND)
  // and the live RACE classification ("POSITION", single-field DRIVER_1..N).
  // Resolve each field against both names so one parser covers both.
  const header = splitRow(lines[0]).map((h) => h.trim());
  const col = (...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };
  const idx = {
    pos: col('POS', 'POSITION'),
    number: col('NUMBER'),
    time: col('TIME'),
    gapFirst: col('GAP_FIRST'),
    kph: col('KPH'),
    laps: col('LAPS'),
    team: col('TEAM'),
    cls: col('CLASS'),
    vehicle: col('VEHICLE'),
  };

  // Driver columns — either split first/second (DRIVERn_FIRSTNAME/SECONDNAME)
  // or a single full-name field (DRIVER_1..DRIVER_N, used in the race file).
  const driverCols: { first: number; second: number }[] = [];
  for (let n = 1; n <= 6; n++) {
    const f = col(`DRIVER${n}_FIRSTNAME`);
    const s = col(`DRIVER${n}_SECONDNAME`);
    if (f >= 0 && s >= 0) driverCols.push({ first: f, second: s });
  }
  const singleDriverCols: number[] = [];
  if (driverCols.length === 0) {
    for (let n = 1; n <= 6; n++) {
      const c = col(`DRIVER_${n}`);
      if (c >= 0) singleDriverCols.push(c);
    }
  }

  const entries: WECTimingEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const r = splitRow(lines[i]);
    const cls = (r[idx.cls] ?? '').trim();
    if (!cls) continue;

    const drivers: string[] = [];
    for (const dc of driverCols) {
      const first = (r[dc.first] ?? '').trim();
      const second = (r[dc.second] ?? '').trim();
      const full = `${first} ${second}`.trim();
      if (full) drivers.push(full);
    }
    for (const dc of singleDriverCols) {
      const full = (r[dc] ?? '').trim();
      if (full) drivers.push(full);
    }

    const vehicle = (r[idx.vehicle] ?? '').trim();
    entries.push({
      pos: parseInt(r[idx.pos], 10) || 0,
      classPos: 0, // assigned below
      number: (r[idx.number] ?? '').trim(),
      team: (r[idx.team] ?? '').trim(),
      carClass: cls,
      vehicle,
      manufacturer: manufacturerOf(vehicle),
      laps: parseInt(r[idx.laps], 10) || 0,
      gapFirst: (r[idx.gapFirst] ?? '').trim(),
      gapClass: '',
      bestLapTime: (r[idx.time] ?? '').trim(),
      kph: (r[idx.kph] ?? '').trim(),
      drivers,
    });
  }

  // Group into classes (in canonical order), assign class position + class gap.
  const byClass = new Map<string, WECTimingEntry[]>();
  for (const e of entries) {
    if (!byClass.has(e.carClass)) byClass.set(e.carClass, []);
    byClass.get(e.carClass)!.push(e);
  }

  const classes: WECTimingClass[] = [];
  const names = [...byClass.keys()].sort(
    (a, b) => (CLASS_ORDER.indexOf(a) + 1 || 99) - (CLASS_ORDER.indexOf(b) + 1 || 99),
  );
  for (const name of names) {
    const list = byClass.get(name)!.sort((a, b) => a.pos - b.pos);
    const leaderLaps = list[0]?.laps ?? 0;
    list.forEach((e, i) => {
      e.classPos = i + 1;
      if (i === 0) {
        e.gapClass = 'LEADER';
      } else if (leaderLaps - e.laps > 0) {
        const d = leaderLaps - e.laps;
        e.gapClass = `+${d} lap${d === 1 ? '' : 's'}`;
      } else {
        // Same lap as class leader — fall back to Al Kamel's gap-to-first.
        e.gapClass = e.gapFirst && e.gapFirst !== '-' ? e.gapFirst : '—';
      }
    });
    classes.push({ name, entries: list });
  }

  return { status, source, hour, updated: new Date().toISOString(), classes };
}

/** Fetch a URL as text; returns null on any non-200 / network error. */
async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Resolve the freshest available Le Mans classification file and parse it.
 * Tries the live race-root file first, then hourly snapshots from the current
 * race hour downward. Returns a `pending` snapshot when nothing is posted yet
 * (the first minutes after the start) and `unavailable` once the race is over.
 */
async function fetchWecTiming(): Promise<WECTimingData> {
  const now = Date.now();
  const elapsedMs = now - LE_MANS_2026_START;
  const finished = elapsedMs > (LE_MANS_2026_DURATION_H + 1) * 3600_000;
  const currentHour = Math.floor(elapsedMs / 3600_000);

  // 1) Live race-root classification (overwritten live during the race).
  const liveCsv = await fetchText(`${LE_MANS_2026_RACE}/03_Classification_Race.CSV`);
  if (liveCsv) {
    return parseWecClassification(
      liveCsv,
      'race',
      currentHour >= 1 ? Math.min(currentHour, LE_MANS_2026_DURATION_H) : null,
      finished ? 'finished' : 'live',
    );
  }

  // 2) Hourly classification snapshots, newest first. Folders are zero-padded
  //    and prefixed: `01_Hour 1`, `02_Hour 2`, … with the CSV inside.
  for (let h = Math.min(currentHour, LE_MANS_2026_DURATION_H); h >= 1; h--) {
    const hh = String(h).padStart(2, '0');
    const url = `${LE_MANS_2026_RACE}/${hh}_Hour%20${h}/03_Classification_Race_Hour%20${h}.CSV`;
    const csv = await fetchText(url);
    if (csv) {
      return parseWecClassification(csv, `hour-${h}`, h, finished ? 'finished' : 'live');
    }
  }

  // 3) Nothing posted yet.
  return {
    status: finished ? 'unavailable' : 'pending',
    source: 'none',
    hour: currentHour >= 1 ? currentHour : null,
    updated: new Date().toISOString(),
    classes: [],
  };
}

/** Cached entry point used by the route (60s TTL — live but light on Al Kamel). */
export async function getWecTiming(): Promise<WECTimingData> {
  return cached('wec:timing:lemans2026', 60, fetchWecTiming);
}
