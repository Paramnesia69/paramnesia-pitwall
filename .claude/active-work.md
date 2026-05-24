# Active Work — PARAMNESIA PITWALL

## Last Commit (2026-05-24)

`d96340b` — feat: full WEC/ELMS standings, class plate badges, fixed logos
- `standings-2026.ts`: WEC Hypercar → full 18-car grid; Manufacturers rebuilt
  from FIA data (BMW 59, Toyota 52, Ferrari 42 — Porsche NOT in 2026 WEC);
  ELMS — 6 new arrays: LMP2/LMP3/LMGT3 drivers + teams (60+ entries)
- `results-2026.ts`: Spa R2 P2 = BMW #15 Magnussen/Marciello/Vanthoor;
  Imola R1 P3 = Ferrari AF Corse #51 Pier Guidi/Giovinazzi/Calado
- `teamLogos.ts`: Genesis → pngwing PNG + brightness filter; AF Corse / Vista
  AF → Ferrari logo; Peugeot → bg stripped, invert(1) filter for dark bg
- `StandingsPanel.tsx`: ELMS tab (LMP2/LMP3/LMGT3 ClassSections); ClassSection
  accepts `badgeSrc` prop; ELMS + WEC LMGT3 wired to class plate SVGs
- `public/logos/class-lmp2/lmp3/lmgt3.svg`: ELMS-colour class plates
  (blue/purple/green matching official race number plate colours)
- `Dashboard.tsx`: series order → F1→WEC→ELMS→IMSA→Nürburgring→MotoGP→
  GTWCE→DTM→WRC→Porsche Supercup

All commits on `main`, Vercel auto-deploys.

## Current Data Coverage

### Results (src/data/results-2026.ts)
- F1: R1–4 (Australia → Miami GP)
- MotoGP: R1–6 (Thailand → Catalunya GP)
- WEC: R1 Imola, R2 Spa-Francorchamps
- WRC: R1–6 (Monte Carlo → Rally Portugal)
- IMSA GTP: R1–4 (Daytona → Laguna Seca)
- ELMS LMP2: R1 Barcelona, R2 Le Castellet

### Standings (src/data/standings-2026.ts)
- F1 Drivers + Constructors: after R4 Miami GP
- MotoGP Riders + Teams: after R6 Catalunya GP
- WEC Hypercar + LMGT3 (drivers + manufacturers): after R2 Spa
- WEC LMGT3 (drivers + manufacturers): after R2 Spa
- ELMS LMP2 / LMP3 / LMGT3 (drivers + teams): after R2 Le Castellet
- WRC Drivers + Manufacturers: after R6 Rally Portugal
- IMSA GTP + GTD Pro + GTD (drivers + teams): after R4 Laguna Seca
- DTM Drivers + Manufacturers: after R1 Red Bull Ring

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
- **F1 results**: add R5 onwards (next race after Miami — Canadian GP R5)
- **MotoGP results**: add R7 onwards (next race after Catalunya)
- **WEC results**: add R3 onwards (Le Mans 24H, June 14–15)
- **ELMS results**: add LMGT3 / LMP3 class winners for R1–2
- **Logo quality**: better Porsche crest (currently dark gold badge); Aprilia/Yamaha not true-colour
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
