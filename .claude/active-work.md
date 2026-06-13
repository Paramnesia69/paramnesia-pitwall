# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Last Commits (2026-06-13 — Visual Redesign, DONE)
`4243928` — circuit emblems on This Weekend + Mini-Leaderboard; standings tabs natural logos
`58bcbe2` — Points Trajectory dashes the lower teammate of each same-colour pair
`426084f` — filter-bar logos render NATURAL brand colours (dropped grayscale+screen+mask)
`01b28ac` — IMSA + series emblems render natural brand colours (not white box)
`c9f8599` — reminder bell clickable (portal dropdown), F1+GT filter-bar logos
`555b620` — series-logo emblem on Recent Results (mirrors circuit emblem)
`a5f2e2c` — Orbitron title type on Recent Results / News / Highlights
`fefe4f1` — premium event-card redesign: Orbitron title+times, 2-col session grid
`aab1d5a` — round favicon via src/app/icon.png
`f6a9893` — unified premium circuit watermarks (cleaned SVGs, thin, uniform)

## Visual Redesign — COMPLETE (2026-06-13)
Whole-app premium pass, all shipped & live. See decisions.md "Logo & Watermark System"
and "Card Design & Typography". Summary:
- **Logos render NATURAL brand colours everywhere** (filter bar, standings tabs,
  mini-leaderboard, series emblems) — only Porsche inverts (dark-fill). The old
  grayscale+contrast+brightness+screen+mask stack was removed; it crushed red logos.
- **CircuitEmblem** (small white track silhouette) sits by the event/circuit name on
  Hero, EventCard, RecentResults, ThisWeekend, MiniLeaderboard.
- **SeriesEmblem** (natural logo) mirrors it on RecentResults, right of the name.
- **Orbitron** titles + times + 2-col/auto-fit session grids across Hero, EventCard,
  RecentResults, News, Highlights, ThisWeekend.
- Circuit SVGs all cleaned (no corner numbers/markers), stroke-capped 1.05% thin,
  Shanghai replaced from Wikimedia, Portimão dots stripped.
- Round favicon (app/icon.png). Reminder dropdown portalled (was clipped). Points
  Trajectory dashes the lower teammate.

## Still open / offered (not done — user didn't pick up)
- "What's Live" floating badge still has the black-F1 logo bug (same one-line fix as MiniLeaderboard)
- Nürburgring filter-bar logo may read faint in natural form
- H2H bars don't yet distinguish same-colour teammates (names flank them, so low priority)

## Phase Plan (user-approved, executing phase by phase)
- **Phase A — done (5861fcb)**: mobile foundation (skipped: reduced-motion support)
- **Phase B — done (1c0bc7c)**: endurance mode, live-hero ambience, toasts, unified skeletons
- **Phase C — done (c08f782 + f3a522b)**: Spoiler Shield, clinch calculator, ⌘K palette, Web Push
- **Phase D — done**: PanelBoundary error boundaries, LazyMotion (m-as-motion + async domMax), zod data validation, Vitest (39 tests, runs in prebuild)
- All four phases complete — plan executed in full

## Web Push runtime notes
- VAPID keys: Vercel env (NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT) + .env.local
- PUSH_CRON_SECRET: Vercel env + GH Actions secret; protects /api/push/dispatch (middleware-exempt)
- Dispatch cadence: GH Actions cron */5 min (.github/workflows/push-dispatch.yml) — Vercel Hobby crons are daily-only

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
- F1: live via /api/f1/standings
- MotoGP: live via /api/motogp/standings
- WEC Hypercar + LMGT3: after R2 Spa
- ELMS LMP2/LMP3/LMGT3: after R2 Le Castellet
- WRC: after R7 Rally Japan · Evans 151 leads
- IMSA GTP/GTD Pro/GTD: after R5 Detroit
- DTM: after R2 Zandvoort

## Backlog (next up)
- **This weekend**: WEC R3 Le Mans 24H (Jun 13–14), GTWCE Misano (Jun 13–14), Supercup Barcelona (Jun 14)
- **ELMS**: R3 Imola (Jul 5) — nothing missed yet
- **DTM**: R3 Lausitzring (Jun 19–21)
- **Nürburgring**: NLS6 Eifel Trophy (Jun 20)
- **Logo quality**: Aprilia/Yamaha not true-colour
