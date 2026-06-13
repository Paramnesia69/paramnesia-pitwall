/**
 * WEC / Le Mans live timing.
 *
 * PRIMARY (live): the official WEC live-timing backend — a Griiip system at
 * `insights.griiip.com`, the same one `livetiming.fiawec.com` consumes. It is
 * reachable as an anonymous public client: a Firebase anonymous ID token unlocks
 * `/meta/sessions-schedule-live` (current live session) + the public bootstrap
 * `/api/v2/public/live/session/{sid}/bootstrap` (full classification, gaps, best
 * laps, tyres, pit stops, running status, weather, clock). We poll it on a short
 * TTL — genuinely live, updating every poll, no websocket/relay required.
 *
 * FALLBACK: Al Kamel's hourly classification CSV (only refreshes once per race
 * hour) — kept for resilience and for rounds the live backend isn't serving.
 *
 * REAL data only — every field comes straight from the upstream feed.
 *
 * NOTE: this data is owned by its providers. This is a private, single-user
 * dashboard (whole site behind auth) consuming it for personal use.
 */

import { cached } from '@/lib/cache';
import type { WECTimingData, WECTimingEntry, WECTimingClass, WECWeather, WECSector } from '@/types';

// ── Al Kamel CSV fallback (Le Mans 2026) ──────────────────────────────────
const LE_MANS_2026_RACE =
  'https://fiawec.alkamelsystems.com/Results/15_2026/03_LE%20MANS/657_FIA%20WEC/202606131600_Race';
const LE_MANS_2026_START = Date.parse('2026-06-13T14:00:00Z');
const LE_MANS_2026_DURATION_H = 24;

// ── Griiip live backend ───────────────────────────────────────────────────
const GRIIIP_API = 'https://insights.griiip.com';
const GRIIIP_FIREBASE_KEY = 'AIzaSyDCkJK0R557QCPLoJ4_At_5s0dvW_71_V4'; // public web API key (client-embedded)
const GRIIIP_ORIGIN = 'https://livetiming.fiawec.com';

const CLASS_ORDER = ['HYPERCAR', 'LMP2', 'LMGT3'];
const MULTIWORD_BRANDS = ['Aston Martin'];

function manufacturerOf(vehicle: string): string {
  const v = vehicle.trim();
  for (const b of MULTIWORD_BRANDS) if (v.startsWith(b)) return b;
  return v.split(/\s+/)[0] ?? v;
}

/** Format milliseconds as a lap time "m:ss.mmm". */
function fmtLapMs(ms: number): string {
  if (!ms || ms <= 0) return '';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mil = ms % 1000;
  return `${m}:${String(s).padStart(2, '0')}.${String(mil).padStart(3, '0')}`;
}

/** Format a gap given milliseconds + whole-lap delta. */
function fmtGap(ms: number, laps: number): string {
  if (laps && laps > 0) return `+${laps} lap${laps === 1 ? '' : 's'}`;
  if (ms && ms > 0) return `+${(ms / 1000).toFixed(3)}`;
  return '';
}

/** Format a sector/short time in ms → "ss.mmm" (or "m:ss.mmm" past a minute). */
function fmtSectorMs(ms: number): string {
  if (!ms || ms <= 0) return '';
  if (ms < 60000) return (ms / 1000).toFixed(3);
  return fmtLapMs(ms);
}

/** Normalize Griiip lap/sector colour to our palette key. */
function lapColor(c?: string): string {
  return c === 'Purple' || c === 'Green' ? c : '';
}

// ── Griiip bootstrap normalization (pure + tested) ─────────────────────────

interface GriiipRef { pid: number; carNumber: string; classId: string }
type GriiipBootstrap = {
  sessionInfo?: { trackName?: string; trackConfigName?: string };
  sessionClock?: { startTime?: string; elapsedTimeMillis?: number };
  weather?: { temperature?: number; trackTemperature?: number; humidity?: number; sky?: string; windSpeedKph?: number; windDirectionCode?: string };
  participants?: (GriiipRef & { teamName?: string; manufacturer?: string; drivers?: { displayName?: string }[] })[];
  ranks?: (GriiipRef & { overallPosition?: number; position?: number; isDeleted?: boolean })[];
  gaps?: (GriiipRef & { gapToFirstMillis?: number; gapToFirstLaps?: number; gapToAheadMillis?: number; gapToAheadLaps?: number })[];
  bestLaps?: (GriiipRef & { lapTimeMillis?: number; lapNumber?: number; color?: string })[];
  runningStatuses?: (GriiipRef & { status?: string })[];
  tires?: (GriiipRef & { tires?: { compound?: string; ageInLaps?: number }[] })[];
  laps?: (GriiipRef & { lapNumber?: number; lapTimeMillis?: number; color?: string })[];
  sectors?: (GriiipRef & { sectorNumber?: number; lapNumber?: number; sectorTimeMillis?: number; color?: string })[];
  carsEnergyTanks?: { items?: { pid: number; e?: number }[] };
  pitIns?: GriiipRef[];
};

/** Build a per-pid lookup from an array of records keyed on `pid`. */
function byPid<T extends { pid: number }>(arr: T[] | undefined): Map<number, T> {
  const m = new Map<number, T>();
  for (const r of arr ?? []) m.set(r.pid, r);
  return m;
}

/**
 * Normalize a Griiip live bootstrap into per-class leaderboards.
 * Pure + exported for testing against a saved fixture.
 */
export function normalizeGriiipBootstrap(
  boot: GriiipBootstrap,
  status: WECTimingData['status'],
  leaderLap: number | null,
  flag: string | null,
): WECTimingData {
  const ranks = byPid(boot.ranks);
  const gaps = byPid(boot.gaps);
  const best = byPid(boot.bestLaps);
  const run = byPid(boot.runningStatuses);
  const tire = byPid(boot.tires);

  // Last completed lap per car = highest-lapNumber entry in the recent buffer.
  const lastLap = new Map<number, { lapNumber: number; lapTimeMillis: number; color?: string }>();
  for (const l of boot.laps ?? []) {
    const cur = lastLap.get(l.pid);
    if (!cur || (l.lapNumber ?? 0) > cur.lapNumber) lastLap.set(l.pid, { lapNumber: l.lapNumber ?? 0, lapTimeMillis: l.lapTimeMillis ?? 0, color: l.color });
  }
  // Sectors of each car's last completed lap (the lap with all three sectors).
  const sectorsByPidLap = new Map<string, Map<number, { time: string; color: string }>>();
  for (const s of boot.sectors ?? []) {
    if (!s.sectorNumber || !s.lapNumber) continue;
    const key = `${s.pid}:${s.lapNumber}`;
    if (!sectorsByPidLap.has(key)) sectorsByPidLap.set(key, new Map());
    sectorsByPidLap.get(key)!.set(s.sectorNumber, { time: fmtSectorMs(s.sectorTimeMillis ?? 0), color: lapColor(s.color) });
  }
  const lastSectors = new Map<number, WECSector[]>();
  for (const [key, secs] of sectorsByPidLap) {
    const [pidStr, lapStr] = key.split(':');
    const pid = Number(pidStr);
    const lap = Number(lapStr);
    if (secs.size < 3) continue; // only fully-timed laps
    const best = lastLap.get(pid);
    // Prefer the car's last completed lap; otherwise take the highest lap we have.
    const existing = lastSectors.get(pid);
    const existingLap = (existing as (WECSector[] & { _lap?: number }) | undefined)?._lap ?? -1;
    if (lap >= existingLap || lap === best?.lapNumber) {
      const arr = [1, 2, 3].map((n) => secs.get(n) ?? { time: '', color: '' }) as WECSector[] & { _lap?: number };
      arr._lap = lap;
      lastSectors.set(pid, arr);
    }
  }
  // Tyre age per car (laps on the current set).
  const tyreAge = new Map<number, number>();
  for (const t of boot.tires ?? []) {
    const age = t.tires?.[0]?.ageInLaps;
    if (typeof age === 'number') tyreAge.set(t.pid, age);
  }
  // Hybrid energy % per car.
  const energy = new Map<number, number>();
  for (const it of boot.carsEnergyTanks?.items ?? []) if (typeof it.e === 'number') energy.set(it.pid, it.e);
  // Current lap per car (for the laps count) + pit-stop count.
  const lapMax = new Map<number, number>();
  for (const l of boot.laps ?? []) {
    if (l.lapNumber && l.lapNumber > (lapMax.get(l.pid) ?? 0)) lapMax.set(l.pid, l.lapNumber);
  }
  const pitCount = new Map<number, number>();
  for (const p of boot.pitIns ?? []) pitCount.set(p.pid, (pitCount.get(p.pid) ?? 0) + 1);

  const entries: (WECTimingEntry & { _firstMs: number; _firstLaps: number })[] = [];
  for (const p of boot.participants ?? []) {
    const r = ranks.get(p.pid);
    if (r?.isDeleted) continue;
    const g = gaps.get(p.pid);
    const b = best.get(p.pid);
    const vehicle = (p.manufacturer ?? '').trim();
    const compound = tire.get(p.pid)?.tires?.[0]?.compound ?? '';
    const last = lastLap.get(p.pid);
    entries.push({
      pos: r?.overallPosition ?? 0,
      classPos: r?.position ?? 0,
      number: (p.carNumber ?? '').trim(),
      team: (p.teamName ?? '').trim(),
      carClass: (p.classId ?? r?.classId ?? '').trim(),
      vehicle,
      manufacturer: manufacturerOf(vehicle),
      laps: lapMax.get(p.pid) ?? 0,
      gapFirst: fmtGap(g?.gapToFirstMillis ?? 0, g?.gapToFirstLaps ?? 0) || (r?.overallPosition === 1 ? 'LEADER' : ''),
      gapPrev: fmtGap(g?.gapToAheadMillis ?? 0, g?.gapToAheadLaps ?? 0),
      gapAhead: '',
      gapClass: '',
      bestLapTime: fmtLapMs(b?.lapTimeMillis ?? 0),
      bestLapNum: b?.lapNumber ? String(b.lapNumber) : '',
      bestLapColor: lapColor(b?.color),
      lastLapTime: fmtLapMs(last?.lapTimeMillis ?? 0),
      lastLapColor: lapColor(last?.color),
      sectors: (lastSectors.get(p.pid) ?? []).map(({ time, color }) => ({ time, color })),
      kph: '',
      tyre: compound ? compound[0] + compound.slice(1).toLowerCase() : '', // SOFT → Soft
      tyreAge: tyreAge.has(p.pid) ? tyreAge.get(p.pid)! : -1,
      energyPct: energy.has(p.pid) ? energy.get(p.pid)! : -1,
      status: run.get(p.pid)?.status ?? '',
      pitStops: pitCount.get(p.pid) ?? 0,
      drivers: (p.drivers ?? []).map((d) => (d.displayName ?? '').trim()).filter(Boolean),
      _firstMs: g?.gapToFirstMillis ?? 0,
      _firstLaps: g?.gapToFirstLaps ?? 0,
    });
  }

  // Group into classes (canonical order), assign class gaps relative to the
  // class leader (their own gap-to-overall-leader is the common reference).
  const byClass = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!e.carClass) continue;
    if (!byClass.has(e.carClass)) byClass.set(e.carClass, []);
    byClass.get(e.carClass)!.push(e);
  }
  const names = [...byClass.keys()].sort(
    (a, b) => (CLASS_ORDER.indexOf(a) + 1 || 99) - (CLASS_ORDER.indexOf(b) + 1 || 99),
  );
  const classes: WECTimingClass[] = [];
  for (const name of names) {
    const list = byClass.get(name)!.sort((a, b) => a.classPos - b.classPos);
    const leader = list[0];
    list.forEach((e, i) => {
      if (i === 0) {
        e.gapClass = 'LEADER';
      } else {
        const lapsDiff = e._firstLaps - (leader?._firstLaps ?? 0);
        const msDiff = e._firstMs - (leader?._firstMs ?? 0);
        e.gapClass = fmtGap(msDiff, lapsDiff) || '—';
      }
      // Interval to the car ahead in class.
      if (i === 0) {
        e.gapAhead = 'LEADER';
      } else {
        const prev = list[i - 1];
        const lapsDiff = e._firstLaps - prev._firstLaps;
        const msDiff = e._firstMs - prev._firstMs;
        e.gapAhead = fmtGap(msDiff, lapsDiff) || '—';
      }
    });
    classes.push({ name, entries: list.map(({ _firstMs, _firstLaps, ...e }) => { void _firstMs; void _firstLaps; return e; }) });
  }

  const w = boot.weather;
  const weather: WECWeather | null = w
    ? {
        airTemp: w.temperature ?? 0,
        trackTemp: w.trackTemperature ?? 0,
        humidity: w.humidity ?? 0,
        sky: w.sky ?? '',
        windKph: w.windSpeedKph ?? 0,
        windDir: w.windDirectionCode ?? '',
      }
    : null;

  return { status, source: 'live', hour: null, updated: new Date().toISOString(), leaderLap, flag, weather, classes };
}

// ── Griiip fetch path ──────────────────────────────────────────────────────

let tokenCache: { token: string; exp: number } | null = null;

/** Mint (and cache ~50 min) a Firebase anonymous ID token. */
async function getAnonToken(): Promise<string | null> {
  if (tokenCache && tokenCache.exp > Date.now()) return tokenCache.token;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${GRIIIP_FIREBASE_KEY}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"returnSecureToken":true}', cache: 'no-store' },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { idToken?: string };
    if (!j.idToken) return null;
    tokenCache = { token: j.idToken, exp: Date.now() + 50 * 60_000 };
    return j.idToken;
  } catch {
    return null;
  }
}

function griiipHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, Origin: GRIIIP_ORIGIN, Referer: `${GRIIIP_ORIGIN}/`, Accept: 'application/json' };
}

interface LiveScheduleEntry {
  sid: number;
  leaderLap?: number;
  isStarted?: boolean;
  currentFlag?: string;
}

/** Try the live Griiip backend. Returns null if anything is unavailable. */
async function fetchGriiipLive(): Promise<WECTimingData | null> {
  const token = await getAnonToken();
  if (!token) return null;
  const h = griiipHeaders(token);
  try {
    const sres = await fetch(`${GRIIIP_API}/meta/sessions-schedule-live`, { headers: h, cache: 'no-store' });
    if (!sres.ok) return null;
    const live = (await sres.json()) as LiveScheduleEntry[];
    const session = (live ?? []).find((s) => s.isStarted) ?? live?.[0];
    if (!session?.sid) return null;

    const bres = await fetch(`${GRIIIP_API}/api/v2/public/live/session/${session.sid}/bootstrap`, { headers: h, cache: 'no-store' });
    if (!bres.ok) return null;
    const boot = (await bres.json()) as GriiipBootstrap;
    if (!boot?.participants?.length) return null;

    return normalizeGriiipBootstrap(boot, 'live', session.leaderLap ?? null, session.currentFlag ?? null);
  } catch {
    return null;
  }
}

// ── Al Kamel CSV fallback parser (dual-schema, pure + tested) ──────────────

function splitRow(line: string): string[] {
  return line.split(';');
}
const TYRE_LABELS: Record<string, string> = { M: 'Michelin', G: 'Goodyear', P: 'Pirelli', H: 'Hankook', D: 'Dunlop' };
function tyreLabel(code: string): string {
  const c = code.trim().toUpperCase();
  return TYRE_LABELS[c] ?? (c || '');
}
function normalizeLap(t: string): string {
  return t.trim().replace("'", ':');
}

export function parseWecClassification(
  csv: string,
  source: string,
  hour: number | null,
  status: WECTimingData['status'],
): WECTimingData {
  const lines = csv.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim().length > 0);
  const empty: WECTimingData = { status: 'unavailable', source, hour, updated: new Date().toISOString(), leaderLap: null, flag: null, weather: null, classes: [] };
  if (lines.length < 2) return empty;

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
    time: col('FL_TIME', 'TIME'),
    flLapNum: col('FL_LAPNUM'),
    gapFirst: col('GAP_FIRST'),
    gapPrev: col('GAP_PREVIOUS'),
    kph: col('FL_KPH', 'KPH'),
    laps: col('LAPS'),
    team: col('TEAM'),
    cls: col('CLASS'),
    vehicle: col('VEHICLE'),
    tyres: col('TYRES'),
    status: col('STATUS'),
  };

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
      const full = `${(r[dc.first] ?? '').trim()} ${(r[dc.second] ?? '').trim()}`.trim();
      if (full) drivers.push(full);
    }
    for (const dc of singleDriverCols) {
      const full = (r[dc] ?? '').trim();
      if (full) drivers.push(full);
    }

    const vehicle = (r[idx.vehicle] ?? '').trim();
    entries.push({
      pos: parseInt(r[idx.pos], 10) || 0,
      classPos: 0,
      number: (r[idx.number] ?? '').trim(),
      team: (r[idx.team] ?? '').trim(),
      carClass: cls,
      vehicle,
      manufacturer: manufacturerOf(vehicle),
      laps: parseInt(r[idx.laps], 10) || 0,
      gapFirst: (r[idx.gapFirst] ?? '').trim(),
      gapPrev: (r[idx.gapPrev] ?? '').trim(),
      gapAhead: '',
      gapClass: '',
      bestLapTime: normalizeLap(r[idx.time] ?? ''),
      bestLapNum: (r[idx.flLapNum] ?? '').trim(),
      bestLapColor: '',
      lastLapTime: '',
      lastLapColor: '',
      sectors: [],
      kph: (r[idx.kph] ?? '').trim(),
      tyre: tyreLabel(r[idx.tyres] ?? ''),
      tyreAge: -1,
      energyPct: -1,
      status: (r[idx.status] ?? '').trim(),
      pitStops: 0,
      drivers,
    });
  }

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
      e.gapAhead = i === 0 ? 'LEADER' : '';
      if (i === 0) e.gapClass = 'LEADER';
      else if (leaderLaps - e.laps > 0) {
        const d = leaderLaps - e.laps;
        e.gapClass = `+${d} lap${d === 1 ? '' : 's'}`;
      } else e.gapClass = e.gapFirst && e.gapFirst !== '-' ? e.gapFirst : '—';
    });
    classes.push({ name, entries: list });
  }

  return { status, source, hour, updated: new Date().toISOString(), leaderLap: null, flag: null, weather: null, classes };
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Al Kamel hourly-CSV fallback (Le Mans 2026). */
async function fetchAlKamelCsv(): Promise<WECTimingData> {
  const now = Date.now();
  const elapsedMs = now - LE_MANS_2026_START;
  const finished = elapsedMs > (LE_MANS_2026_DURATION_H + 1) * 3600_000;
  const currentHour = Math.floor(elapsedMs / 3600_000);

  const liveCsv = await fetchText(`${LE_MANS_2026_RACE}/03_Classification_Race.CSV`);
  if (liveCsv) {
    return parseWecClassification(liveCsv, 'race', currentHour >= 1 ? Math.min(currentHour, LE_MANS_2026_DURATION_H) : null, finished ? 'finished' : 'live');
  }
  for (let h = Math.min(currentHour, LE_MANS_2026_DURATION_H); h >= 1; h--) {
    const hh = String(h).padStart(2, '0');
    const url = `${LE_MANS_2026_RACE}/${hh}_Hour%20${h}/03_Classification_Race_Hour%20${h}.CSV`;
    const csv = await fetchText(url);
    if (csv) return parseWecClassification(csv, `hour-${h}`, h, finished ? 'finished' : 'live');
  }
  return { status: finished ? 'unavailable' : 'pending', source: 'none', hour: currentHour >= 1 ? currentHour : null, updated: new Date().toISOString(), leaderLap: null, flag: null, weather: null, classes: [] };
}

/** Live Griiip backend first; Al Kamel hourly CSV as fallback. */
async function fetchWecTiming(): Promise<WECTimingData> {
  const live = await fetchGriiipLive();
  if (live && live.classes.length > 0) return live;
  return fetchAlKamelCsv();
}

/** Cached entry point used by the route (20s TTL — live, light on upstream). */
export async function getWecTiming(): Promise<WECTimingData> {
  return cached('wec:timing:lemans2026', 20, fetchWecTiming);
}
