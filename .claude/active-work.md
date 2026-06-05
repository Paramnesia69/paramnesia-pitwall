# Active Work — PARAMNESIA PITWALL

## Trigger Phrase
**"Renew race weekend results"** → Claude uses WebSearch/WebFetch to find latest results for the manually-maintained series and edits `src/data/results-2026.ts` + `src/data/standings-2026.ts` directly. No scripts, no terminal. F1 **and MotoGP** are excluded (automated via API routes).
Series: WEC, ELMS, IMSA, WRC, DTM.

## Last Commits (2026-06-06)

`5dd4d25` — fix: headshot maxHeight instead of fixed height — no upscaling blur
- `maxHeight: 140` so image never renders larger than its natural size (prevents upscale blur)

`7cd54eb` — fix: revert to OpenF1 headshots — guessed F1 CDN paths were wrong, photos gone
- F1 CDN `content/dam/fom-website/drivers/2026Drivers/` path does NOT exist — don't try it again
- Back to OpenF1 `headshot_url` with `q_100` quality boost on Cloudinary URL

`e3f79af` — fix: driver name hover — vertical team-color bar slides in left, text → white
- `DriverRow` in `StandingsPanel` uses `useState(nameHover)` + onMouseEnter/Leave
- 2px vertical accent bar in `d.teamColor` animates width 0→2px from left of name
- Text transitions to white; no underline, no glow, no letter-spacing

`cec472e` — fix: split object selector in DriverProfileOverlay — fixes React #185 infinite re-render

`4c8154f` — feat: phase 4 redo — driver profiles, trajectory chart, teammate H2H (features 8, 9, 10)
- `src/types/index.ts` — added `DriverProfile` + `SelectedDriver` interfaces (shared between route + client)
- `src/store/index.ts` — added `selectedDriver/openDriver/closeDriver` (transient, not persisted)
- `src/app/api/f1/driver/[driverRef]/route.ts` + `src/app/api/f1/h2h/route.ts` — NEW routes
- `src/components/standings/ChampionshipChart.tsx` — SVG points trajectory, top-6 drivers
- `src/components/DriverProfileOverlay.tsx` — right-panel slide-in, fetches /api/f1/driver at runtime
- `src/lib/f1DriverRefs.ts` — single source of truth for name→driverRef mappings + `F1_CDN_SLUGS` map (unused currently)
- `StandingsPanel`, `RecentResults`, `Dashboard` — wired up click handlers + lazy overlay

## 16-Feature Build Status
| Phase | Features | Status |
|---|---|---|
| 1 | Race Diary (5), Conflict Detector (6), Watched State (7) | ✅ shipped |
| 2 | Team Radio (1), Tyre Tracker (2), Flag Feed (3) | ✅ shipped |
| 3 | Mini-Leaderboard (4), What's Live Badge (11) | ✅ shipped |
| 4 | Driver Profile (8), Trajectory Chart (9), H2H (10) | ✅ shipped |
| 5 | Highlights (12), Podcasts (13) | ⏳ not started |
| 6 | Next Alarm (14), Offline Badge (15), Season Ring (16) | ⏳ not started |

## Critical Rules (learned from Phase 4)
- **NEVER** import anything (even `type`) from `src/app/api/**` into a client component — Turbopack pulls server-only modules into client bundle → crash
- **NEVER** use object selectors in Zustand: `useStore((s) => ({ a, b }))` → infinite re-renders → React #185. Always split into separate calls.
- Shared interfaces belong in `src/types/index.ts` — one-way: types → routes AND types → components

## F1 Automation
- `/api/f1/results` — Jolpica + OpenF1 fallback, revalidates 5min
- `/api/f1/standings` — Jolpica, revalidates 1hr
- `roundPoints` for sparklines merged from static data into live API response (by name match)

## MotoGP Automation
- `/api/motogp/results` — PulseLive, revalidates 5min
- `/api/motogp/standings` — riders + teams, revalidates 1hr
- `/api/motogp/weekend/[round]` — full classifications for RaceWeekendOverlay; revalidates 5min

## Current Data Coverage

### Results (src/data/results-2026.ts)
- F1: R1–4 static fallback; R5+ live via /api/f1/results
- MotoGP: R1–6 static fallback; all rounds live via /api/motogp/results
- WEC: R1 Imola, R2 Spa (Hypercar + LMGT3)
- WRC: R1–7 (Monte Carlo → Rally Japan)
- IMSA GTP: R1–4 (Daytona → Laguna Seca)
- ELMS: R1 Barcelona, R2 Le Castellet (LMP2/LMP3/LMGT3)
- DTM: R1 Red Bull Ring, R2 Zandvoort (Race 1+2 each)
- GTWCE: R1 Paul Ricard, R2 Brands Hatch, R3 Monza
- Nürburgring: NLS2, NLS3, 24h Quali R2, ADAC 24h

### Standings (src/data/standings-2026.ts)
- F1: live via /api/f1/standings
- MotoGP: live via /api/motogp/standings
- WEC Hypercar + LMGT3: after R2 Spa
- ELMS LMP2/LMP3/LMGT3: after R2 Le Castellet
- WRC: after R7 Rally Japan · Evans 151 leads
- IMSA GTP/GTD Pro/GTD: after R4 Laguna Seca
- DTM: after R2 Zandvoort

## Backlog (next up)
- **Phase 5**: Highlights (12) + Podcasts (13)
- **Phase 6**: Next Alarm (14), Offline Badge (15), Season Ring (16)
- **WEC results**: R3 Le Mans 24H (June 14–15)
- **ELMS/DTM results**: R3+
- **Nürburgring**: NLS6+ (Eifel Trophy, Jun 20)
- **IMSA standings**: update after Detroit R5
- **Porsche Supercup**: R1 Monaco (June 7)
- **Logo quality**: Aprilia/Yamaha not true-colour
