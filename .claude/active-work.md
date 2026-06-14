# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Recently shipped (2026-06-14)
- **WEC genuinely-live timing (Griiip)** — `wecTiming.ts` now polls the official FIA WEC backend (Griiip at `insights.griiip.com`, Firebase anon token) first, Al Kamel CSV as fallback. Real per-poll updates, no websocket. See decisions.md.
- **Full-screen timing board** (`WECTimingBoard`, "Full board" button in `WECTimingPanel`) — every car, all classes, full telemetry columns + real tyre illustrations (`/tyres/wec/*-v3.png`).
- **WEC race-intelligence layer** — live commentator (+MP3 play), battle highlight, gap-trend arrows, striking distance, in-pit badge, Race Log drawer. All from the Griiip bootstrap. See features.md "WEC Race-Intelligence Layer". **Verified NOT available: RPM/gear/speed/GPS-map** (don't re-investigate — documented).
- **Asset fixes** — round transparent tyre illustrations with see-through rim gaps; authentic two-tone Peugeot emblem (`brand-peugeot-v2.png`, black shield + white linework, no filter).

## Shipped 2026-06-13
- **Endurance Live Layer (Le Mans)** — hero day/night road + hypercar + phase/milestones (`enduranceClock.ts`, `EnduranceTracker`, `RaceIcons`) and WEC live class timing (`/api/wec/timing`, `WECTimingPanel`, Al Kamel CSV). See features.md + decisions.md "WEC Live Timing & Endurance Layer".
- **Endurance/WEC visual polish** — road marker is now a real LMP prototype PNG (`/lemans-prototype.png`, bg cut from a dithered source — see decisions.md); clean premium road ribbon (kerb/chequered edges rejected); WEC class colours fixed per class (Hypercar red / LMP2 blue / LMGT3 green, no "flapping"); live session row + YouTube links use the series accent (blue), `pw-live-dot` stays red.
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
- **Data (NEXT — do soon)**: **WEC R3 Le Mans 24H result** (race finished ~Jun 14 16:00 local — add podium + Hypercar/LMGT3 standings); GTWCE Misano, Supercup Barcelona; ELMS R3 Imola (Jul 5); DTM R3 Lausitzring (Jun 19–21); Nürburgring NLS6 (Jun 20). Use `/renew-results`.
- **WEC timing — verify post-race**: the Griiip live source only serves during a live session. After Le Mans ends, `fetchGriiipLive()` returns null and it falls back to Al Kamel CSV (which then 404s) → panel shows `pending`/unavailable. Confirm the Le Mans event overlay degrades gracefully now the race is over; consider hiding the live panel once `state==='finished'`.
- **WEC timing — generalise**: currently Le Mans-2026-only (hardcoded Al Kamel base + event gate in `EventDetailOverlay`). The Griiip path auto-discovers the live session, so it could work for any live WEC round — wire the panel to mount for any live WEC event, not just Circuit de la Sarthe.
- **Minor polish**: "What's Live" badge black-F1-logo bug (one-line fix like MiniLeaderboard); Nürburgring filter-bar logo faint; Aprilia/Yamaha not true-colour; H2H bars don't distinguish same-colour teammates
