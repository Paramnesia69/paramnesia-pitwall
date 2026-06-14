# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Recently shipped (2026-06-14)
- **Multi-series live timing — F1 + WEC + ELMS**: the event panel now mounts for ANY live event in a series with a real feed (was WEC/Le-Mans-hardcoded). WEC un-gated from Circuit de la Sarthe (Griiip auto-discovers the session). New **ELMS** path: `lib/elmsTiming.ts` + `/api/elms/timing`, Al Kamel-only, auto-discovers the live round by scraping the tree-menu homepage (`parseLatestRaceBase`), reuses `parseWecClassification`. `WECTimingPanel`/`WECTimingBoard` generalised with `endpoint`/`providerName`/`providerUrl`/`boardTitle` props. Classes extended: LMP2 Pro/Am + LMP3. Tests: `tests/elmsTiming.test.ts` (parse + discovery, real fixture). Verified against live ELMS R2 Paul Ricard CSV. ELMS gets leaderboard/board/weather but NOT the Griiip-only race-intelligence layer (absent from CSV, no-ops).
  - **IMSA next**: `imsa.alkamelsystems.com` confirmed live + same Al Kamel system (richer `DRIVERn_FIRSTNAME/SECONDNAME` schema — already parser-handled). Homepage only listed 2024 data when probed; **need the 2026 season-folder number** (tried `23–30_2026` → all 404). Find the live/latest IMSA event base, then clone the ELMS lib (`imsaTiming.ts` + `/api/imsa/timing` + mount for live IMSA events).
  - **MotoGP**: NO public live-timing REST feed (PulseLive = post-session only; `timing.motogp.com` = closed WebSocket, incompatible with no-socket serverless). Don't re-investigate live timing — only post-session results exist.
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
- **IMSA live timing** (continues the multi-series push): clone the ELMS approach. Blocker = find the 2026 season-folder number on `imsa.alkamelsystems.com` (homepage only showed 2024; `23–30_2026` all 404'd). Once the base is known: `imsaTiming.ts` + `/api/imsa/timing` + mount `WECTimingPanel` for live IMSA events. IMSA classes: GTP / LMP2 / GTD Pro / GTD. Parser already handles the `DRIVERn_FIRSTNAME/SECONDNAME` schema.
- **Post-race panel hide (done via state gate)**: the WEC + ELMS panels now only mount for `live`/`starting_soon` events, so a finished race no longer shows a `pending`/404 panel. (Was a separate backlog item.)
- **Minor polish**: "What's Live" badge black-F1-logo bug (one-line fix like MiniLeaderboard); Nürburgring filter-bar logo faint; Aprilia/Yamaha not true-colour; H2H bars don't distinguish same-colour teammates
