# Active Work — PARAMNESIA PITWALL

## Trigger Phrase
**"Renew race weekend results"** → Claude uses WebSearch/WebFetch to find latest results for all non-F1 series and edits `src/data/results-2026.ts` + `src/data/standings-2026.ts` directly. No scripts, no terminal. F1 is excluded (automated via API routes).
Series: MotoGP, WEC, ELMS, IMSA, WRC, DTM.

## Last Commits (2026-05-29)

`9644c9e` — fix: overlay close button left-aligned, series badge shifted right (pl-10) to clear it

`f238d98` — fix: race weekend overlay layout — header and tabs always visible
- Panel no longer has overflow-y-auto; header (shrink-0) + tabs (shrink-0) always visible
- Only results content section (flex-1 overflow-y-auto) scrolls
- Animation: x:600 fixed pixel instead of x:'100%'

`9ba8edd` — feat: race weekend detail overlay — click any result card for full session breakdown
- RaceWeekendOverlay: framer spring slide-out, session tabs (race/qualifying/sprint/FP disabled),
  full results table with team logos, position badges, Q1/Q2/Q3 columns, fastest lap
- F1: /api/f1/weekend/[round] fetches Jolpica live — full 20-driver grid, all sessions
- Other series: sessions[] added to results-2026.ts (MotoGP R6, WEC Spa, WRC Portugal, DTM Zandvoort R2, GTWCE Brands Hatch R1+2)
- PodiumCard clickable with hover glow + "Full results →" hint; ?result= deep-link
- RaceResult type moved to shared types/index.ts with SessionResults/ResultEntry schema
- Fixed WEC Spa LMGT3 podium order (Vista AF Corse P1, was wrong)

Previous: `[pending]` — data: GTWCE + Nürburgring 2026 results
- `results-2026.ts`: Added GTWCE_RESULTS_2026 (R1 Paul Ricard 6h, R2 Brands Hatch
  Race 1+2) and NURBURGRING_RESULTS_2026 (NLS2, NLS3, 24h Quali R2, ADAC 24h);
  both included in ALL_RESULTS_2026. NLS1 + 24h Quali R1 were cancelled.
  Sources: gt-world-challenge-europe.com (official HTML), nuerburgring-langstrecken-serie.de (official articles)

Previous commit: `1d649c3` (2026-05-28) — feat: per-series hero card and standings
on filtered pages (Dashboard + StandingsPanel)

All commits on `main`, Vercel auto-deploys.

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

## Upcoming Races (next to add after completion)
- **MotoGP R7**: Italian GP Mugello — May 29–31 2026
- **WRC R7**: Rally Japan — May 28–31 2026
- **IMSA R5**: Detroit Street Circuit — May 30 2026
- **WEC R3**: 24 Hours of Le Mans — June 14–15 2026
- **DTM R3**: unknown venue/date
- **ELMS R3**: 4 Hours of Imola — July 5 2026

## Logo System (src/lib/teamLogos.ts)

Three tiers — `getTeamLogo(name, f1Context=false)`:

1. **F1 official white WebPs** (`f1Context=true`) → `{ src, white: true }` → opacity 0.95 only
   - Files: `public/logos/constructors/f1-{team}.webp` (11 teams)
2. **Motorcycle SVGs** (`SVG_MOTO_MAP`) → `{ src, white: false, cssFilter?: string }`:
   - Ducati family: natural red+white, no filter
   - Aprilia/Trackhouse: `sepia+hue-rotate` → red tint
   - Yamaha: `brightness(0) invert(1)` → white wordmark
   - KTM: no filter (orange badge, natural)
3. **Brand PNGs** (`MFR_MAP + partialMfrMatch`) → `{ src, white: false, png: true, cssFilter? }`:
   - Mercedes-AMG, Audi, McLaren: `brightness(0) invert(1) opacity(0.85)` (black badge → white)
   - Peugeot/Citroën: `brightness(0) invert(1) opacity(0.9)` (black shield → white)
   - Genesis: `brightness(1.8) contrast(1.2)` (chrome emblem boost)
   - AF Corse / Vista AF: mapped to brand-ferrari.png
   - Default: `brightness(1.6) saturate(2.5) contrast(1.2)` (vivid colours)

Component rendering pattern (same in StandingsPanel, F1TimingPanel, RecentResults):
```tsx
logo.white           → { opacity: 0.95 }
logo.cssFilter!=null → { filter: logo.cssFilter, opacity: 0.92 }
default (png)        → { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }
```

Logo files in `public/logos/constructors/`:
- `f1-{team}.webp` — official F1 white WebPs (11 teams)
- `brand-{make}.png` — car-logos-dataset badge PNGs (transparent bg)
- `brand-genesis.png` — pngwing high-quality PNG (transparent bg)
- `brand-peugeot.png` — white bg stripped via Pillow; black shield
- `ducati.svg`, `aprilia.svg`, `yamaha.svg`, `ktm.svg` — moto SVGs

Class plate badges in `public/logos/`:
- `class-lmp2.svg` — blue (#1E4B8C) ELMS class plate
- `class-lmp3.svg` — purple (#4A2090) ELMS class plate
- `class-lmgt3.svg` — green (#1A6B38) two-line "LM/GT3" badge

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

## Session Bootstrap Reminder
```
cd /Users/paramnesia/Documents/Claude/paramnesia-pitwall
claude          # always launch from inside the project
npm run dev     # dev server on port 3000
```
- Vercel auto-deploys on push to `main`
- No `.env.local` needed for basic features; `OPENWEATHERMAP_API_KEY` optional
