# /data-check

Scan the data files and report which series are stale — i.e. have races that have already happened but aren't yet recorded.

## Steps

1. Read `src/data/results-2026.ts` — find the last recorded round and date for each manual series:
   - WEC, ELMS, IMSA, WRC, DTM, GTWCE, Nürburgring

2. Read `src/data/calendar-2026.ts` — find any events for those series with `startDate` before today that are NOT yet in the results file.

3. Also read `src/data/standings-2026.ts` — check whether the standings for each series match the results coverage (i.e. standings are current through the same round as results).

4. Report a clear summary table like:

   ```
   Series          Last Result          Standings Through   Status
   ─────────────── ──────────────────── ─────────────────── ────────
   WEC             R2 Spa (May 10)      R2 Spa              ✅ current
   ELMS            R2 Le Castellet      R2 Le Castellet     ✅ current
   IMSA            R4 Laguna Seca       R4 Laguna Seca      ✅ current
   WRC             R7 Rally Japan       R7 Rally Japan      ✅ current
   DTM             R2 Zandvoort         R2 Zandvoort        ✅ current
   GTWCE           R3 Monza             —                   ✅ current
   Nürburgring     NLS3 / 24h Quali R2  —                   ⚠️  NLS4 Jun 1 missing?
   ```

5. For any stale series, note: the race name, date, and that `/renew-results [series]` will fix it.

## Rules

- F1 and MotoGP are automated — ignore them entirely.
- Base "stale" on whether the race date has already passed relative to today.
- If you're unsure whether a calendar event has a corresponding result, flag it as a question rather than a definitive gap.
- No edits — this command is read-only. To fix stale data, run `/renew-results`.
