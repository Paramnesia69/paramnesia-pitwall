/**
 * Jolpica (Ergast-compatible) fetch helpers.
 *
 * Jolpica hard-caps `limit` at 100 — it silently clamps larger values and
 * paginates by result ROWS, not races. A season has 400+ rows, so a single
 * request returns only the first ~5 races and can even split one race across
 * a page boundary. This fetcher walks every page and re-merges races by
 * round. (Root cause of the missing Monaco GP, 2026-06-12.)
 */

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const PAGE_SIZE = 100;          // Jolpica's hard cap
const MAX_PAGES = 12;           // safety: 1200 rows ≫ any season

type RowsKey = 'Results' | 'QualifyingResults' | 'SprintResults';

interface ErgastPage {
  MRData: {
    total: string;
    RaceTable?: { Races?: Array<Record<string, unknown> & { round: string }> };
  };
}

export async function jolpicaGetAllRaces<T extends { round: string }>(
  path: string,            // e.g. '/2026/results.json'
  rowsKey: RowsKey,
  revalidateSeconds = 300,
): Promise<T[]> {
  const byRound = new Map<string, Record<string, unknown> & { round: string }>();

  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * PAGE_SIZE;
    let json: ErgastPage | null = null;
    try {
      const res = await fetch(`${JOLPICA}${path}?limit=${PAGE_SIZE}&offset=${offset}`, {
        next: { revalidate: revalidateSeconds },
      });
      if (!res.ok) break;
      json = (await res.json()) as ErgastPage;
    } catch {
      break; // partial data is still better than none
    }

    const races = json?.MRData?.RaceTable?.Races ?? [];
    for (const race of races) {
      const rows = (race[rowsKey] as unknown[] | undefined) ?? [];
      const existing = byRound.get(race.round);
      if (existing) {
        // Same race continued on the next page — append its rows
        existing[rowsKey] = [...((existing[rowsKey] as unknown[]) ?? []), ...rows];
      } else {
        byRound.set(race.round, { ...race, [rowsKey]: [...rows] });
      }
    }

    const total = parseInt(json?.MRData?.total ?? '0', 10);
    if (!total || offset + PAGE_SIZE >= total) break;
  }

  return [...byRound.values()] as T[];
}
