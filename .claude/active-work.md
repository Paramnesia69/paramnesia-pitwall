# Active Work — PARAMNESIA PITWALL

## Trigger Phrase
**"Renew race weekend results"** → Claude uses WebSearch/WebFetch to find latest results for all non-F1 series and edits `src/data/results-2026.ts` + `src/data/standings-2026.ts` directly. No scripts, no terminal. F1 is excluded (automated via API routes).
Series: MotoGP, WEC, ELMS, IMSA, WRC, DTM.

## Last Commits (2026-05-29)

`(pending)` — feat: UI improvements, stream links audit, Porsche logo filter
- **UI**: ThisWeekend respects series filter; Results Show All (9 default, toggle all); UpcomingTimeline series accent left-border; HeroCard Watch Live CTA; EventCard "Details" button removed; F1 standings sparkline (roundPoints per driver/constructor)
- **Stream links**: full audit — fixed IMSA (→@imsaofficial), ELMS (→@EuropeanLeMansSeries), DTM (removed broken grid link), Nürburgring (→@VLNOFFICIAL + nls.racing), Porsche Supercup (→@PorscheSupercup), Le Mans YouTube (→channel URL), Rolex 24 + Sebring event overrides consolidated; removed: formula1.com, motogp.com, Peacock, NBC Sports, Sky Sports F1
- **Logo**: Porsche brand PNG filter toned down — `brightness(1.1) saturate(1.8) contrast(1.05)` (was vivid default)

`979bcbd` — fix: Porsche logo all-white via brightness(0) invert(1) — revert SVG to original
- HeroCard, EventCard, Dashboard filter bar: use `brightness(0) invert(1)` when `meta.logo === '/logos/porsche.svg'`
- SVG reverted to original `fill="#ffffff"` on SUPERCUP path

`a2d17fb` — fix: RaceWeekendOverlay header layout
- X button lifted out of overflow-hidden header to panel level, `absolute top-4 right-4`, zIndex 10
- Series badge row shifted `pr-10` to clear X button
- Date moved below circuit/country subtitle as separate `<p>`
- Password protection: middleware.ts + /api/auth + /app/login/page.tsx added


## F1 Automation
F1 results and standings are **fully automated** via live API routes — never update manually:
- `/api/f1/results` — Jolpica (Ergast mirror) + OpenF1 fallback, revalidates 5min
- `/api/f1/standings` — Jolpica, revalidates 1hr
- Static `F1_RESULTS_2026` / `F1_DRIVERS_2026` in data files = last-resort fallback only

## Current Data Coverage

### Results (src/data/results-2026.ts)
- F1: R1–4 static fallback (Australia → Miami); R5+ served live by /api/f1/results
- MotoGP: R1–6 (Thailand → Catalunya GP)
- WEC: R1 Imola, R2 Spa-Francorchamps (Hypercar + LMGT3 for each)
- WRC: R1–6 (Monte Carlo → Rally Portugal)
- IMSA GTP: R1–4 (Daytona → Laguna Seca)
- ELMS LMP2: R1 Barcelona, R2 Le Castellet
- ELMS LMP3: R1 Barcelona, R2 Le Castellet
- ELMS LMGT3: R1 Barcelona, R2 Le Castellet
- DTM: R1 Red Bull Ring (Race 1 + 2), R2 Zandvoort (Race 1 + 2)
- GTWCE: R1 Paul Ricard (6h endurance), R2 Brands Hatch (Race 1 + 2)
- Nürburgring: NLS2, NLS3, 24h Quali R2, ADAC 24h Nürburgring (NLS1 + 24h Quali R1 cancelled)

### Standings (src/data/standings-2026.ts)
- F1 Drivers + Constructors: after R4 Miami (live data via /api/f1/standings)
- MotoGP Riders + Teams: after R6 Catalunya GP
- WEC Hypercar + LMGT3 (drivers + manufacturers): after R2 Spa
- ELMS LMP2 / LMP3 / LMGT3 (drivers + teams): after R2 Le Castellet
- WRC Drivers + Manufacturers: after R6 Rally Portugal
- IMSA GTP + GTD Pro + GTD (drivers + teams): after R4 Laguna Seca
- DTM Drivers + Manufacturers: after R2 Zandvoort

## Backlog (next up)
- **MotoGP results**: add R7 onwards (Italian GP Mugello, May 31)
- **WRC results**: add R7 onwards (Rally Japan, May 31)
- **IMSA results**: add R5 onwards (Detroit, May 30)
- **WEC results**: add R3 (Le Mans 24H, June 14–15)
- **DTM results**: add R3 onwards
- **ELMS results**: add R3 onwards (Imola, July 5)
- **GTWCE results**: add R3 onwards (3 Hours of Monza, May 31)
- **Nürburgring results**: add NLS6 onwards (Eifel Trophy, Jun 20)
- **Porsche Supercup results**: season starts Jun 4 (Monaco)
- **Logo quality**: better Porsche crest; Aprilia/Yamaha not true-colour
- **Manual override CMS**: currently JSON file editing only
- **Live race mode**: real-time lap data, gap to leader
- **Redis caching**: currently ISR only

