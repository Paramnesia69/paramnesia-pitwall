# /renew-results

Renew race results and standings for manual series.

**Series to update:** $ARGUMENTS (if blank: WEC, ELMS, IMSA, WRC, DTM, GTWCE, Nürburgring). F1 and MotoGP are automated — skip them.

For each series in scope:
1. Find the last recorded round in `src/data/results-2026.ts`
2. Search for any completed races since then
3. Update `results-2026.ts` and `standings-2026.ts`

When done: one commit covering all changes, then `git push origin main`.
