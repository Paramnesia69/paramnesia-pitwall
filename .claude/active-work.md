# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Last Commits (2026-06-13 — Visual Redesign)
`fefe4f1` — premium event-card redesign: Orbitron title+times, 2-col session grid, bottom-centre faded watermark (145px/0.07)
`aab1d5a` — canonical round favicon via src/app/icon.png (defeats cached square)
`f6a9893` — unified premium circuit watermarks (cleaned SVGs, thin cap 1.05%, uniform white) + round icon PNGs v3
`8a05065` — restore series-logo watermark on hero + event cards; circuit = small emblem
`dd6481b` — watermark rework B+C (lanes + circuit emblems)
`8b8b547` — fix: Jolpica pagination — Monaco GP results were missing

## In progress (2026-06-13)
Rolling the new card design + Orbitron type onto the other main cards:
- Recent Results (PodiumCard), News cards — apply new design/fonts
- Highlights — restyle ONLY the bottom title text, rest stays identical (user: highlights card is "perfect")

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
