# Active Work — PARAMNESIA PITWALL

## Slash Commands (use these instead of trigger phrases)
- `/renew-results` — update all manual series results + standings + deploy (or `/renew-results wec` for one series)
- `/data-check` — scan for stale data vs. calendar
- `/deploy` — push uncommitted changes live
- `/pitwall-agent <task>` — spawn dedicated data agent (use when main conversation is long/bloated)

## Last Commits (2026-06-07)

`fc67422` — fix: replace transitionEnd overflow with imperative DOM ref on all collapse wrappers

`06cb3da` — fix: remove body overflow-x:hidden to stop clipping card hover shadows

`f7bc49e` — feat: use series logo in driver/team overlay badges instead of text prefix

## 16-Feature Build Status
| Phase | Features | Status |
|---|---|---|
| 1 | Race Diary (5), Conflict Detector (6), Watched State (7) | ✅ shipped |
| 2 | Team Radio (1), Tyre Tracker (2), Flag Feed (3) | ✅ shipped |
| 3 | Mini-Leaderboard (4), What's Live Badge (11) | ✅ shipped |
| 4 | Driver Profile (8), Trajectory Chart (9), H2H (10) | ✅ shipped |
| 4+ | Team Profile (constructor overlay) | ✅ shipped 2026-06-06 |
| 5 | Highlights (12), Podcasts (13) | ✅ shipped 2026-06-06 |
| 6 | Next Alarm (14), Offline Badge (15), Season Ring (16) | ✅ shipped |

## Critical Rules (learned from Phase 4)
- **NEVER** import anything (even `type`) from `src/app/api/**` into a client component — Turbopack pulls server-only modules into client bundle → crash
- **NEVER** use object selectors in Zustand: `useStore((s) => ({ a, b }))` → infinite re-renders → React #185. Always split into separate calls.
- Shared interfaces belong in `src/types/index.ts` — one-way: types → routes AND types → components

## F1 Automation
- `/api/f1/results` — Jolpica + OpenF1 fallback, revalidates 5min
- `/api/f1/standings` — Jolpica, revalidates 1hr
- `roundPoints` for sparklines merged from static data into live API response (by name match)

## MotoGP Automation
- `/api/motogp/results` — PulseLive, revalidates 5min
- `/api/motogp/standings` — riders + teams, revalidates 1hr
- `/api/motogp/weekend/[round]` — full classifications for RaceWeekendOverlay; revalidates 5min

## Phase 5 Media Layer (Highlights + Podcasts)
- **No API routes** — async server components (`AsyncHighlightsFeed`/`AsyncPodcastsFeed`) call `src/lib/{highlights,podcasts}.ts`, streamed via Suspense into Dashboard as slots (mirrors News). Client feeds (`HighlightsFeed`/`PodcastsFeed`) read `?series=`.
- Shared RSS/Atom parsers live in `src/lib/rss.ts` (news.ts now imports from it too).
- `cached()` memoizes the parsed result (`highlights:all` 600s, `podcasts:all` 1800s). The Acast F1 feed is ~4MB so Next's fetch cache skips it (benign warning) — the parsed-result cache covers it.
- Highlights playback = inline lightbox YouTube iframe (`HighlightsFeed` local `useState`, Escape/backdrop close). Podcasts = inline `<audio>`.
- **Highlights — verified YouTube channel_ids** (in `src/lib/highlights.ts`):
  f1 `UCB_qr75-ydFVKSF9Dmo6izg` · motogp `UC8pYaQzbBBXg9GIOHRvTmDQ` · wec `UCwU7U7PiarcJKLjDJTnANjw` · imsa `UC9D9hRoUT2OatfVtmnOBXzg` · wrc `UC5G6kTnHXDz0WIBC2VGBOqg` · dtm `UCwKq447rYMVI5dAQWMmFnfg` · gtwce `UC-yHapH6mW1ceZ_5PDUf1_g` · elms `UCU8C8RqGhqH4nhk4mlN1Vwg` · nurburgring `UCKgMzHVA7nsDsDEKKMc9bKA`
- **Podcasts — verified feeds** (in `src/lib/podcasts.ts`):
  f1 = The Race F1 (acast) · motogp = The Race MotoGP (acast) · wec/imsa/elms = Midweek Motorsport (radiolemans/blubrry) · wrc = SPIN The Rally Pod (`rss.art19.com/spinning-the-line`)
- Static fallbacks (`src/data/{highlights,podcasts}-2026.ts`) hold REAL seed items — only used if every feed fails.
- Backlog: DTM/GTWCE/Nürburgring lack a dedicated podcast feed; add if a real one surfaces.

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
- **WEC results**: R3 Le Mans 24H (June 14–15)
- **ELMS/DTM results**: R3+
- **Nürburgring**: NLS6+ (Eifel Trophy, Jun 20)
- **Porsche Supercup**: R1 Monaco (June 7)
- **Logo quality**: Aprilia/Yamaha not true-colour
