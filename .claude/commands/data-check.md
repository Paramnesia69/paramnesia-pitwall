# /data-check

Read `src/data/results-2026.ts` and `src/data/calendar-2026.ts`. For each manual series (WEC, ELMS, IMSA, WRC, DTM, GTWCE, Nürburgring), find the last recorded round and check if any races have passed since then. Also verify `src/data/standings-2026.ts` is current through the same round as results.

Report a staleness table. Read-only — no edits. To fix stale data run `/renew-results`.
