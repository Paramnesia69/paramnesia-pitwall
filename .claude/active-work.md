# Active Work — PARAMNESIA PITWALL

## Session 2026-05-24 (continued)

### Logo + standings overhaul (uncommitted)
- `teamLogos.ts`: KTM now uses `ktm.svg` (orange badge, natural colors) via SVG_MOTO_MAP
- `teamLogos.ts`: Added Pramac Yamaha, Monster Yamaha, Yamaha Factory Racing, all KTM variants to SVG_MOTO_MAP
- `teamLogos.ts`: KTM partial moto match added
- `standings-2026.ts`: MotoGP extended to full 23-rider grid (Yamaha P13/19/21/22/23, Honda P11/16/17/18, KTM P12/14/20)
- `standings-2026.ts`: WEC Hypercar → combined driver names per car
- `standings-2026.ts`: Added WEC LMGT3 top 8 (pitdebrief.com confirmed)
- `standings-2026.ts`: IMSA GTP → combined names + van der Zande P5 added
- `standings-2026.ts`: Added IMSA GTD Pro top 4 (approximate pts, confirmed gaps)
- `standings-2026.ts`: Added IMSA GTD top 4 (approximate pts, confirmed gaps)
- `StandingsPanel.tsx`: Added ClassSection component with class badge headers
- `StandingsPanel.tsx`: WEC tab = Hypercar + LMGT3 sections
- `StandingsPanel.tsx`: IMSA tab = GTP + GTD Pro + GTD sections

## Last Commits (session 2026-05-24)

`54d8ab7` — fix: proper logo colours for all series + add WRC/IMSA/ELMS results
- teamLogos.ts: replaced `screen: boolean` with `cssFilter?: string` per logo entry
- Ducati SVG contains real red+white fills → no filter, show naturally
- Aprilia/Yamaha black-fill SVGs → tint to brand colour via sepia+hue-rotate
- Brand PNG default: `brightness(1.6) saturate(2.5) contrast(1.2)` — vivid without washing
- All 3 components (StandingsPanel, F1TimingPanel, RecentResults) updated to use cssFilter
- results-2026.ts: added WRC R1–6, IMSA GTP R1–4, ELMS R1–2 (12 real races)

`187e4c2` — feat: manufacturer logos across all panels with improved contrast
- StandingsPanel: TeamLogo component, three-way rendering, w-10 h-6 containers
- F1TimingPanel: logos at 18/20px with correct filters
- RecentResults: podium logos 16/18px with correct filters
- teamLogos.ts: added SVG_MFR_MAP for motorcycle brands

`a10222d` — feat: F1 timing panel via OpenF1 API
- `/api/openf1/timing?eventId=` → fetches latest session results
- Polls every 45s during live/starting_soon state

`296d68d` — feat: OpenGraph preview cards per event

All commits pushed. Vercel auto-deploys on push.

## Current Logo System (src/lib/teamLogos.ts)

Three tiers — getTeamLogo(name, f1Context=false):
1. **F1 official white WebPs** (f1Context=true) → `{ white: true }` → opacity 0.95 only
2. **Motorcycle SVGs** (SVG_MOTO_MAP) → `{ cssFilter: '...' }`:
   - Ducati family: natural red+white, no filter
   - Aprilia/Trackhouse: sepia+hue-rotate → red tint
   - Yamaha: sepia+hue-rotate → blue tint
3. **Brand PNGs** (MFR_MAP, car-logos-dataset) → `{}` → default `brightness(1.6) saturate(2.5) contrast(1.2)`

Component rendering pattern (same in all 3 components):
```tsx
logo.white           → { opacity: 0.95 }
logo.cssFilter!=null → { filter: logo.cssFilter, opacity: 0.92 }
default              → { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }
```

Logo files live in `public/logos/constructors/`:
- `f1-{team}.webp` — official F1 white WebPs (11 teams)
- `brand-{make}.png` — car-logos-dataset badge PNGs
- `ducati.svg`, `aprilia.svg`, `yamaha.svg` — Wikimedia SVGs

## Results Data Coverage (src/data/results-2026.ts)
- F1: R1–4 (Australia → Miami)
- MotoGP: R1–6 (Thailand → Catalunya)
- WEC: R1–2 (Imola, Spa)
- WRC: R1–6 (Monte Carlo → Portugal) ← NEW
- IMSA GTP: R1–4 (Daytona → Laguna Seca) ← NEW
- ELMS LMP2: R1–2 (Barcelona, Le Castellet) ← NEW

## Standings Data Coverage (src/data/standings-2026.ts)
- F1 Drivers + Constructors: after R4 Miami GP
- MotoGP Riders: after R6 Catalunya
- WEC Hypercar: after R2 Spa
- WRC Drivers: after R6 Portugal
- IMSA GTP: after R4 Laguna Seca
- DTM: after R1 Red Bull Ring

## IMPORTANT: Launch Directory
**Always launch Claude Code from inside the project folder:**
```
cd /Users/paramnesia/Documents/Claude/paramnesia-pitwall
claude
```

## Backlog (prioritized)
1. ~~**OpenGraph preview cards**~~ ✅ DONE
2. ~~**News feed — live RSS**~~ ✅ DONE
3. ~~**ICS calendar feed**~~ ✅ DONE
4. ~~**Manufacturer logos everywhere**~~ ✅ DONE
5. ~~**WRC/IMSA/ELMS recent results**~~ ✅ DONE
6. ~~**Porsche logo quality**~~ ✅ DONE — custom cssFilter, gold now vivid
7. ~~**KTM logo quality**~~ ✅ DONE — ktm.svg (natural orange badge), SVG_MOTO_MAP
8. ~~**Multi-class standings**~~ ✅ DONE — WEC (Hypercar + LMGT3), IMSA (GTP + GTD Pro + GTD)
9. ~~**Full MotoGP grid**~~ ✅ DONE — extended to 23 riders; Yamaha/Honda/KTM all visible
10. ~~**Yamaha logo quality**~~ ✅ DONE — switched to `brightness(0) invert(1) opacity(0.85)` (white wordmark, same as AMG/Audi/McLaren)
11. ~~**DTM recent results**~~ ✅ DONE — Race 1 (Preining/Auer/Engel) + Race 2 (Engel/Wittmann/Auer) at Red Bull Ring
12. ~~**Nürburgring/Nordschleife split**~~ ✅ DONE — 3D Nordschleife PNG (gamegrid.gg), bg stripped, CircuitStatsPanel uses stats.image3d first
13. ~~**Live timing (OpenF1)**~~ ✅ VERIFIED — Qualifying data live during Canadian GP: RUS P1, ANT P2, NOR P3. Logos, gaps, polling all correct.

## Session Bootstrap Reminder
- Dev server: `npm run dev` in this directory (port 3000)
- Vercel auto-deploys on push to `main` via GitHub Actions
- No `.env.local` needed for basic features; OPENWEATHERMAP_API_KEY optional
