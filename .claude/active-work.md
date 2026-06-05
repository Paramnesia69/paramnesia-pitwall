# Active Work — PARAMNESIA PITWALL

## Trigger Phrase
**"Renew race weekend results"** → Claude uses WebSearch/WebFetch to find latest results for the manually-maintained series and edits `src/data/results-2026.ts` + `src/data/standings-2026.ts` directly. No scripts, no terminal. F1 **and MotoGP** are excluded (automated via API routes).
Series: WEC, ELMS, IMSA, WRC, DTM.

## Last Commits (2026-06-05)

`dfb7049` — Revert "feat: phase 4 — driver profiles, trajectory chart, teammate H2H"
- Phase 4 reverted because `DriverProfileOverlay.tsx` imported `type { DriverProfile }` from an API route file
- Turbopack resolved `next/server` (server-only) into the client bundle → Chrome "This page couldn't load"
- Fix planned: move `DriverProfile` + `SelectedDriver` interfaces to `src/types/index.ts`; route files import FROM types, never the other way around

`84f063e` — feat: phase 3 — ambient live strip + what's live badge (features 4 & 11)
- `src/components/MiniLeaderboard.tsx` — fixed bottom strip, collapsible, series cards per live session
- `src/components/ui/WhatsLiveBadge.tsx` — floating pill bottom-right, pulsing red, arrow nav
- `src/lib/useLiveSessions.ts` — shared hook deriving live sessions from liveUpcoming events

`0e4c1c5` — feat: live_blocked state in F1 timing panel
- OpenF1 blocks anonymous access during live sessions
- Added `LiveBlockError` class in `src/lib/openf1.ts`; graceful "Timing paused" UI in `F1TimingPanel`

`fce793c` — feat: race diary, watched-state + weekend conflict detector (Phase 1)
- `src/store/index.ts` — `diary: Record<string, DiaryEntry>` (watched, rating, note, updatedAt)
- `src/components/ui/WatchedButton.tsx` — eye toggle on result cards + event detail overlay
- `src/components/ui/StarRating.tsx` — 1–5 star rating in diary overlay
- `src/components/DiaryView.tsx` — chronological watched/rated races list
- `src/lib/conflicts.ts` — `getWeekendConflicts()` → overlapping sessions among favorited series
- `src/components/ThisWeekend.tsx` — conflict warning badge

`7513fcb` — feat: live F1 intelligence — team radio, tyre tracker, flag feed (Phase 2)
- `src/lib/openf1.ts` — extracted openf1 helper, `LiveBlockError`, stints/radio/raceControl fetching
- `src/components/ui/F1TimingPanel.tsx` — Tyre compound dots + stint bars, scrolling radio feed with audio play buttons, flag/race-control status bar + incident log

## 16-Feature Build Status
| Phase | Features | Status |
|---|---|---|
| 1 | Race Diary (5), Conflict Detector (6), Watched State (7) | ✅ shipped |
| 2 | Team Radio (1), Tyre Tracker (2), Flag Feed (3) | ✅ shipped |
| 3 | Mini-Leaderboard (4), What's Live Badge (11) | ✅ shipped |
| 4 | Driver Profile (8), Trajectory Chart (9), H2H (10) | ❌ reverted — needs redo (see below) |
| 5 | Highlights (12), Podcasts (13) | ⏳ not started |
| 6 | Next Alarm (14), Offline Badge (15), Season Ring (16) | ⏳ not started |

## Phase 4 Redo Plan — Critical Rule
**NEVER** import anything (even `type`) from `src/app/api/**` into a client component.
Turbopack pulls the full module graph including server-only modules → runtime crash.

**Fix:** `DriverProfile` and `SelectedDriver` interfaces go in `src/types/index.ts`.
Route files import FROM `@/types`; components import FROM `@/types`. One-way dependency.

Files to create/modify for Phase 4 redo:
- `src/types/index.ts` — add `DriverProfile` + `SelectedDriver` interfaces
- `src/store/index.ts` — re-add `selectedDriver`, `openDriver`, `closeDriver` (transient, not persisted)
- `src/app/api/f1/driver/[driverRef]/route.ts` — import `DriverProfile` FROM `@/types`
- `src/app/api/f1/h2h/route.ts` — `H2HEntry` interface defined locally (not exported to client)
- `src/components/DriverProfileOverlay.tsx` — import `DriverProfile` FROM `@/types` (never from route)
- `src/components/standings/ChampionshipChart.tsx` — imports only from `@/data/standings-2026`
- `src/components/StandingsPanel.tsx` — re-add `H2HSection`, `F1_DRIVER_REFS`, chart wiring
- `src/components/RecentResults.tsx` — re-add F1 driver click buttons
- `src/components/Dashboard.tsx` — re-add lazy `DriverProfileOverlay`
Verify with: `grep -r "from.*api/f1" src/components` must return zero results before committing.

## F1 Automation
F1 results and standings are **fully automated** via live API routes — never update manually:
- `/api/f1/results` — Jolpica (Ergast mirror) + OpenF1 fallback, revalidates 5min
- `/api/f1/standings` — Jolpica, revalidates 1hr
- Static `F1_RESULTS_2026` / `F1_DRIVERS_2026` in data files = last-resort fallback only
- `roundPoints` for sparklines merged from static data into live API response (by name match)

## MotoGP Automation
MotoGP results and standings are **fully automated** via the PulseLive (unofficial) API — never update manually:
- `/api/motogp/results` — podiums per finished round, revalidates 5min
- `/api/motogp/standings` — riders + teams (teams = sum of riders' pts), revalidates 1hr
- `/api/motogp/weekend/[round]` — full race + sprint classifications for RaceWeekendOverlay session tabs; revalidates 5min
- All logic in `src/lib/motogp.ts`; routes are thin proxies
- Base `api.motogp.pulselive.com/motogp/v1`, GET only, no auth; season/category UUIDs hardcoded in lib

## Current Data Coverage

### Results (src/data/results-2026.ts)
- F1: R1–4 static fallback (Australia → Miami); R5+ served live by /api/f1/results
- MotoGP: R1–6 static fallback; all rounds served live by /api/motogp/results
- WEC: R1 Imola, R2 Spa-Francorchamps (Hypercar + LMGT3 for each)
- WRC: R1–7 (Monte Carlo → Rally Japan)
- IMSA GTP: R1–4 (Daytona → Laguna Seca)
- ELMS LMP2/LMP3/LMGT3: R1 Barcelona, R2 Le Castellet
- DTM: R1 Red Bull Ring (Race 1+2), R2 Zandvoort (Race 1+2)
- GTWCE: R1 Paul Ricard, R2 Brands Hatch, R3 Monza
- Nürburgring: NLS2, NLS3, 24h Quali R2, ADAC 24h

### Standings (src/data/standings-2026.ts)
- F1: after R5 Canadian GP (live via /api/f1/standings)
- MotoGP: after R7 Italian GP · Bezzecchi 173 leads (live via /api/motogp/standings)
- WEC Hypercar + LMGT3: after R2 Spa
- ELMS LMP2/LMP3/LMGT3: after R2 Le Castellet
- WRC: after R7 Rally Japan · Evans 151 leads
- IMSA GTP/GTD Pro/GTD: after R4 Laguna Seca
- DTM: after R2 Zandvoort

## Performance (all done ✓)
- Fix 1: `getEventsWithState()` called once per render (`094e1d2`)
- Fix 2: News feed streamed via Suspense (`941c68e`)
- Fix 3: Upstash Redis — `events:all` key verified in Upstash dashboard ✓

## Backlog (next up)
- **Phase 4 redo**: Driver profiles, trajectory chart, teammate H2H — with client→route import fix
- **Phase 5**: Highlights + Podcasts
- **Phase 6**: Next Alarm, Offline Badge, Season Ring
- **WEC results**: R3 Le Mans 24H (June 14–15)
- **ELMS/DTM results**: R3+
- **Nürburgring**: NLS6+ (Eifel Trophy, Jun 20)
- **IMSA standings**: update after Detroit R5
- **Porsche Supercup**: R1 Monaco (June 7)
- **Logo quality**: Aprilia/Yamaha not true-colour
