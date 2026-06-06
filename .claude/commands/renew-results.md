@.claude/agents/pitwall-data.md

# /renew-results

Update race results and standings for all manual series (or a specific one if passed as argument).

**Argument (optional):** `$ARGUMENTS` — one or more series IDs to limit the update (e.g. `wec`, `wec elms`). If blank, update ALL manual series.

## Steps

1. **Determine scope** — if `$ARGUMENTS` is provided, only update those series. Otherwise update all: WEC, ELMS, IMSA, WRC, DTM, GTWCE, Nürburgring.

2. **For each series in scope:**
   a. Read the current state of `src/data/results-2026.ts` to find the last recorded round for that series.
   b. Read `src/data/standings-2026.ts` to find the current standings round.
   c. Use WebSearch to find results for any rounds that have occurred since the last recorded one.
   d. Use WebFetch to retrieve the official source page and verify the top 3 finishers + fastest lap.
   e. Append the new result(s) to the correct array in `results-2026.ts`.
   f. Update the standings arrays in `standings-2026.ts` with post-race points, `prevPos`, and `roundPoints` where available.
   g. Update both file header comments to reflect new coverage.

3. **After all series are done — one single commit:**
   ```
   git add src/data/results-2026.ts src/data/standings-2026.ts
   git commit -m "data: update results + standings — [list series and rounds covered]"
   git push origin main
   ```

4. **Report** what was updated (series, rounds, key results) and confirm the push triggered Vercel deploy.

## Rules

- REAL DATA ONLY — never invent results, points, or standings positions.
- If a race hasn't happened yet or results aren't available, skip it and say so.
- F1 and MotoGP are automated — never touch their static data.
- One commit for all changes — not one per series.
- Always push immediately after committing.
