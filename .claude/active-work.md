# Active Work — PARAMNESIA PITWALL

## Trigger Phrase
**"Renew race weekend results"** → Claude uses WebSearch/WebFetch to find latest results for all non-F1 series and edits `src/data/results-2026.ts` + `src/data/standings-2026.ts` directly. No scripts, no terminal. F1 is excluded (automated via API routes).
Series: MotoGP, WEC, ELMS, IMSA, WRC, DTM.

## Last Commits (2026-05-29)

`a125f2e` — feat: premium column headers + vertical divider in standings grid
- ExpandableGrid columns: 3-col grid (1fr 1px 1fr) with glass-border divider between columns
- Headers: 10px semibold, rgba(255,255,255,0.65), bottom border + left accent bar

`c0dcd31` — feat: side-by-side layout for all series standings, unified expand pattern
- All series (F1, MotoGP, WEC, WRC, IMSA, DTM, ELMS) show drivers + teams/constructors side by side
- ExpandableGrid component: two-column layout, defaultLimit=10 collapses long lists with expand button
- ClassSection rebuilt: accepts driverData + teamData, uses ExpandableGrid internally
- SubToggle and sub state removed entirely

## F1 Automation
F1 results and standings are **fully automated** via live API routes — never update manually:
- `/api/f1/results` — Jolpica (Ergast mirror) + OpenF1 fallback, revalidates 5min
- `/api/f1/standings` — Jolpica, revalidates 1hr
- Static `F1_RESULTS_2026` / `F1_DRIVERS_2026` in data files = last-resort fallback only
- `roundPoints` for sparklines merged from static data into live API response (by name match)

## Current Data Coverage

### Results (src/data/results-2026.ts)
- F1: R1–4 static fallback (Australia → Miami); R5+ served live by /api/f1/results
- MotoGP: R1–6 (Thailand → Catalunya GP)
- WEC: R1 Imola, R2 Spa-Francorchamps (Hypercar + LMGT3 for each)
- WRC: R1–6 (Monte Carlo → Rally Portugal)
- IMSA GTP: R1–4 (Daytona → Laguna Seca)
- ELMS LMP2/LMP3/LMGT3: R1 Barcelona, R2 Le Castellet
- DTM: R1 Red Bull Ring (Race 1+2), R2 Zandvoort (Race 1+2)
- GTWCE: R1 Paul Ricard, R2 Brands Hatch
- Nürburgring: NLS2, NLS3, 24h Quali R2, ADAC 24h

### Standings (src/data/standings-2026.ts)
- F1: after R5 Canadian GP (live via /api/f1/standings)
- MotoGP: after R6 Catalunya GP
- WEC Hypercar + LMGT3: after R2 Spa
- ELMS LMP2/LMP3/LMGT3: after R2 Le Castellet
- WRC: after R6 Rally Portugal
- IMSA GTP/GTD Pro/GTD: after R4 Laguna Seca
- DTM: after R2 Zandvoort

## Performance (all done ✓)
- Fix 1: `getEventsWithState()` called once per render (`094e1d2`)
- Fix 2: News feed streamed via Suspense (`941c68e`)
- Fix 3: Upstash Redis — `events:all` key verified in Upstash dashboard 2026-05-29 ✓

## Backlog (next up)
- **MotoGP results**: R7+ (Italian GP Mugello, May 31)
- **WRC results**: R7+ (Rally Japan, May 31)
- **IMSA results**: R5+ (Detroit, May 30)
- **WEC results**: R3 (Le Mans 24H, June 14–15)
- **DTM/ELMS/GTWCE results**: R3+
- **Nürburgring**: NLS6+ (Eifel Trophy, Jun 20)
- **Porsche Supercup**: season starts Jun 4 (Monaco)
- **Logo quality**: Aprilia/Yamaha not true-colour
