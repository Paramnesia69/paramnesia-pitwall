# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Last Commits (2026-06-12)
`ae99617` — fix: reminder dropdown clipping + unreadable over countdown
`a404e54` — data: Porsche Supercup R1 Monaco (Oeverhaus wins)

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
