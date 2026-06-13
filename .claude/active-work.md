# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Recently shipped (2026-06-13)
- **Endurance Live Layer (Le Mans)** — hero day/night road + hypercar + phase/milestones (`enduranceClock.ts`, `EnduranceTracker`, `RaceIcons`) and WEC live class timing (`/api/wec/timing`, `WECTimingPanel`, Al Kamel CSV). See features.md + decisions.md "WEC Live Timing & Endurance Layer".
- **Visual redesign** — natural-colour logos everywhere (Porsche-only invert), CircuitEmblem/SeriesEmblem, Orbitron titles/times, cleaned circuit SVGs, round favicon. See decisions.md "Logo & Watermark System — FINAL".

## Current Data Coverage

### Results (src/data/results-2026.ts)
- F1: R1–4 static fallback; R5+ live via /api/f1/results
- MotoGP: R1–6 static fallback; all rounds live via /api/motogp/results
- WEC: R1 Imola, R2 Spa (Hypercar + LMGT3)
- WRC: R1–7 (Monte Carlo → Rally Japan)
- IMSA GTP: R1–5 (Daytona → Detroit)
- ELMS: R1 Barcelona, R2 Le Castellet (LMP2/LMP3/LMGT3)
- DTM: R1 Red Bull Ring, R2 Zandvoort (Race 1+2 each)
- GTWCE: R1 Paul Ricard, R2 Brands Hatch, R3 Monza
- Nürburgring: NLS2, NLS3, 24h Quali R2, ADAC 24h

### Standings (src/data/standings-2026.ts)
- F1 + MotoGP: live via API. WEC Hypercar+LMGT3: after R2 Spa. ELMS LMP2/LMP3/LMGT3: after R2 Le Castellet.
- WRC: after R7 Rally Japan (Evans 151 leads). IMSA GTP/GTD Pro/GTD: after R5 Detroit. DTM: after R2 Zandvoort.

## Backlog (next up)
- **Data**: WEC R3 Le Mans 24H result (after Jun 14), GTWCE Misano, Supercup Barcelona; ELMS R3 Imola (Jul 5); DTM R3 Lausitzring (Jun 19–21); Nürburgring NLS6 (Jun 20)
- **WEC timing**: currently Le Mans-2026-only (hardcoded event base) — generalise to other WEC rounds if wanted
- **Minor polish**: "What's Live" badge black-F1-logo bug (one-line fix like MiniLeaderboard); Nürburgring filter-bar logo faint; Aprilia/Yamaha not true-colour; H2H bars don't distinguish same-colour teammates
