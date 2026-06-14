/**
 * ELMS (European Le Mans Series) live timing.
 *
 * Al Kamel only — ELMS has no Griiip live backend (that's WEC-exclusive), so we
 * poll Al Kamel's classification CSV, the same vendor + schema WEC uses for its
 * fallback. The race CSV is the single-field `POSITION` + `DRIVER_1..N` schema
 * already handled by `parseWecClassification`.
 *
 * Unlike the WEC Le Mans path (hardcoded event base), ELMS rounds change through
 * the season, so we auto-discover the latest Race session by parsing the Al Kamel
 * tree-menu homepage (it inlines every session's path). During a live race the
 * hourly snapshot folders (`Hour N/03_Classification_Race.CSV`) are the durable
 * source — there is no continuously-updating live root file.
 *
 * REAL data only — every field comes straight from the upstream CSV.
 */

import { cached } from '@/lib/cache';
import { parseWecClassification } from '@/lib/wecTiming';
import type { WECTimingData } from '@/types';

const ELMS_HOST = 'https://elms.alkamelsystems.com';
const ELMS_SEASON = '21_2026';
// ELMS races run 4 hours — probe hourly snapshots from the top down.
const ELMS_RACE_HOURS = 4;

function emptyTiming(status: WECTimingData['status']): WECTimingData {
  return {
    status, source: 'none', hour: null, updated: new Date().toISOString(),
    leaderLap: null, flag: null, weather: null, commentary: null, raceLog: [], classes: [],
  };
}

/**
 * Parse the Al Kamel tree-menu homepage for the latest Race session base path.
 * Returns the highest-numbered round's `…/{timestamp}_Race` folder. Pure +
 * exported for testing against a saved homepage fixture.
 */
export function parseLatestRaceBase(html: string): { base: string; round: number; circuit: string } | null {
  const re = new RegExp(`Results/${ELMS_SEASON}/(\\d+)_([^/"']+)/([^/"']+)/(\\d{12}_Race)`, 'g');
  let m: RegExpExecArray | null;
  let best: { base: string; round: number; circuit: string } | null = null;
  while ((m = re.exec(html))) {
    const round = parseInt(m[1], 10);
    if (best && round <= best.round) continue;
    best = {
      base: `Results/${ELMS_SEASON}/${m[1]}_${m[2]}/${m[3]}/${m[4]}`,
      round,
      circuit: decodeURIComponent(m[2]).replace(/%20/g, ' ').trim(),
    };
  }
  return best;
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

async function fetchElmsTiming(): Promise<WECTimingData> {
  const home = await fetchText(`${ELMS_HOST}/`);
  const found = home ? parseLatestRaceBase(home) : null;
  if (!found) return emptyTiming('pending');

  // A live root file (if Al Kamel publishes one mid-race), then hourly snapshots.
  const root = await fetchText(`${ELMS_HOST}/${found.base}/03_Classification_Race.CSV`);
  if (root) {
    const d = parseWecClassification(root, 'race', null, 'live');
    if (d.classes.length > 0) return d;
  }
  for (let h = ELMS_RACE_HOURS; h >= 1; h--) {
    const csv = await fetchText(`${ELMS_HOST}/${found.base}/Hour%20${h}/03_Classification_Race.CSV`);
    if (csv) {
      const d = parseWecClassification(csv, `hour-${h}`, h, 'live');
      if (d.classes.length > 0) return d;
    }
  }
  return emptyTiming('pending');
}

/** Cached entry point used by the route (20s TTL — live, light on upstream). */
export async function getElmsTiming(): Promise<WECTimingData> {
  return cached('elms:timing:live', 20, fetchElmsTiming);
}
