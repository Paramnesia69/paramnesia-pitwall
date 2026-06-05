# Features — PARAMNESIA PITWALL

## Stable (shipped)

### Event Display
- **Event grid** — 3-col responsive grid (sm:2, lg:3), first 9 events, uniform height via h-full chain
- **Hero card** — On "All Series": shows global featured/live/next event. On series filter: shows next event for that specific series. Animated scan line, series logo watermark, countdown
- **EventDetailOverlay** — Right-panel slide-out (framer spring), Escape key, backdrop click, deep-link `?event=id`
- **Series filter** — Category nav pills synced to `?series=` URL param (no page navigation); order: F1→WEC→ELMS→IMSA→Nürburgring→MotoGP→GTWCE→DTM→WRC→Porsche
- **Countdown** — Live ticking, compact and full modes
- **Session pills** — In hero card and event cards; strikethrough for finished sessions
- **This Weekend** — Dedicated section for events happening this Fri–Sun; respects active series filter
- **Upcoming timeline** — Events 10–20 shown in a minimal list below the grid; series accent left-border per row
- **HeroCard Watch Live CTA** — Solid accent-coloured button below session pills; only renders when streamLinks present

### Data Panels
- **Recent results** — Real 2026 results for F1, MotoGP, WEC, WRC, IMSA, ELMS, DTM, GTWCE, Nürburgring; filterable by series; manufacturer logos on podium; default 9 shown, "Show All" toggle when more exist (resets on filter change)
- **Championship standings** — Real 2026 data; shown on "All Series" and on any filtered page for series with standings data (f1/wec/elms/imsa/motogp/dtm/wrc); pre-selected to the active series tab when filtering; hidden for series without standings (gtwce/nurburgring/porsche); series logo tab bar (F1, WEC, ELMS, IMSA, MotoGP, DTM, WRC); all series show **drivers + teams/constructors side by side** (no Drivers/Teams sub-toggle); `ExpandableGrid` component: 3-col CSS grid (1fr 1px 1fr) with glass-border vertical divider, premium column headers (10px semibold + bottom border), collapses to top 10 by default with "Show all N" expand button:
  - F1: Drivers + Constructors; `roundPoints` from static data merged into live API response by name → SVG sparkline per row; rows without roundPoints get a fixed-height spacer (no progress bar)
  - WEC: Hypercar (top 10 default, 18 drivers) + LMGT3; each class has badge header + side-by-side drivers/manufacturers
  - ELMS: LMP2 (top 10 default, 11 entries) + LMP3 + LMGT3; class plate badge headers (blue/purple/green)
  - IMSA: GTP + GTD Pro + GTD; side-by-side drivers/teams per class
  - MotoGP: Riders + Teams; top 10 default (23 riders total)
  - DTM: Drivers + Manufacturers
  - WRC: Drivers + Manufacturers
- **News feed** — RSS-backed (6 feeds); static fallback; filterable by series
- **F1 live timing** — Via OpenF1 API; polls every 45s during live/starting_soon; shown in event detail overlay; manufacturer logos

### UX & PWA
- **Reminder system** — Bell button per session, browser notification (N minutes before)
- **Weather badges** — Real OpenWeatherMap data on event cards and detail overlay
- **Circuit stats panel** — In detail overlay: lap record, length, corners, DRS zones, F1 CDN circuit map image; Nordschleife uses 3D render
- **Manufacturer logos** — 3-tier system: F1 official white WebPs, motorcycle SVGs with per-brand colour treatment, car badge PNGs; shown in standings, results, F1 timing
- **Class plate badges** — SVG badges matching official ELMS race number plate colours; embedded in ELMS and WEC LMGT3 section headers
- **Series logo watermarks** — Faded watermarks on HeroCard, EventCard, EventDetailOverlay
- **Dark/light theme** — Toggle, persisted in localStorage
- **PWA** — Service worker, install prompt, update banner
- **Share / event share** — Web Share API + fallback; deep-link per event (`?event=<id>`)
- **Favorite series** — Star button per series, persisted in localStorage
- **Live indicator** — Last poll timestamp + spinning manual refresh button
- **Google Calendar** — "+Cal" link per session in detail overlay
- **ICS calendar feed** — `/api/calendar` (254 sessions, `?series=` filter); Footer "Subscribe" link
- **OpenGraph cards** — `/api/og?event=<id>` → 1200×630 PNG with series accent; wired via `generateMetadata`
- **Manual overrides** — `src/data/overrides.json` → note banners, state overrides, stream links, forced hero

### Live Intelligence & Personal Layer (Phases 1–4, shipped 2026-06-05)
- **Race Diary** — "Watched" toggle on result cards + event detail overlay; star rating (1–5) + free-text note; `DiaryView` component shows chronological watched/rated races; persisted in Zustand `diary` map
- **Conflict Detector** — `getWeekendConflicts()` in `src/lib/conflicts.ts` detects overlapping sessions among favorited series; warning badge in `ThisWeekend.tsx` header
- **Watched State** — `WatchedButton` on podium cards dims watched results (opacity 0.5); checkmark overlay; `StarRating` sub-component for diary ratings
- **F1 live timing: Tyre Tracker** — Compound dot per driver row (S=red, M=yellow, H=white, I=green, W=blue) + mini stint bar; from OpenF1 `/stints`; works on historical sessions too
- **F1 live timing: Team Radio** — Scrolling feed below timing table; inline `<audio>` play button per clip; from OpenF1 `/team_radio`; only populated during/just-after live sessions
- **F1 live timing: Flag Feed** — Status bar showing latest flag (e.g. 🟡 YELLOW Sector 2) + scrollable incident log with timestamps; from OpenF1 `/race_control`
- **F1 timing: live_blocked state** — OpenF1 blocks anonymous access during live sessions; shows friendly "Timing paused" message with premium glass card instead of crashing
- **Mini-Leaderboard** — Fixed bottom strip (`z-[190]`); Framer spring slide-up; collapsed = thin 44px bar with live session pills; expanded = glass cards per live session with series logo + event + circuit flag; collapse toggle; auto-hides when nothing live
- **What's Live Badge** — Floating pill bottom-right (`z-[200]`); pulsing red dot + series logo + Live/Starting Soon + session name; arrow nav for multiple live sessions; click → `openEvent`; auto-hides when nothing live
- **Driver Profiles** (Phase 4) — Click any F1 driver name in standings or results → right-panel slide-in (`DriverProfileOverlay`); career wins, seasons, nationality, DOB, headshot, 2026 pos/points; data from Jolpica + OpenF1 headshot (`q_100` quality boost); `SelectedDriver` state in Zustand (transient, not persisted); hover on driver name = 2px team-color bar slides in left + text → white (no underline)
- **Points Trajectory chart** (Phase 4) — Expandable SVG multi-line chart below F1 standings in `StandingsPanel`; top-6 drivers; rounds as X-axis labels; built from `roundPoints` static data via `ChampionshipChart.tsx`
- **Teammate H2H** (Phase 4) — Expandable qualifying battle bars per team pair below the points chart; lazy-loads `/api/f1/h2h` on first open; 10 hardcoded 2026 team pairings; Jolpica qualifying data

### Media Layer (Phase 5, shipped 2026-06-06)
- **Race Highlights** — Thumbnail grid below Recent Results; sourced from 9 official series YouTube channel RSS feeds (Atom) via `src/lib/highlights.ts`; titles prioritise highlight/recap reels, fall back to latest uploads per channel; click a card → **inline lightbox** with embedded YouTube player (`HighlightsFeed` local state; Escape + backdrop close); series-filterable via `?series=`; `Show more` pagination resets on filter change
- **Podcasts** — Episode grid below News; 4 real show RSS feeds with `.mp3` enclosures via `src/lib/podcasts.ts` (The Race F1, The Race MotoGP, Midweek Motorsport → wec/imsa/elms, SPIN The Rally Pod → wrc); inline `<audio>` player + show artwork + duration badge per episode; series-filterable; both streamed via Suspense as Dashboard slots (no API routes; shared parsers in `src/lib/rss.ts`)

## Known Issues / Workarounds
- **Driver headshots** — Source is OpenF1 `headshot_url` (small F1 CDN thumbnails, ~100–130px native). Displayed at `maxHeight: 140` to avoid upscale blur. Quality ceiling is set by the source. F1 official CDN high-res path (`content/dam/fom-website/drivers/2026Drivers/`) was tried and does NOT exist — do not attempt again without a verified URL from the F1 website source.
- `gtwce.png`, `wec.png`, `elms.png`, `nurburgring.jpg` have non-transparent backgrounds → use `mixBlendMode: screen` + `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)` + `grayscale(1) contrast(2) brightness(3)` for series watermarks; never use these raw
- Peugeot logo: background stripped, currently displayed inverted (black shield → white); acceptable on dark bg
- Aprilia/Yamaha logos: tinted from black-fill SVGs — not true brand colour
- Porsche brand PNG: gold badge with gentle filter `brightness(1.1) saturate(1.8) contrast(1.05)` — not true Porsche gold but readable
- `images: { unoptimized: true }` required — remote patterns whitelisted for F1 CDN (`media.formula1.com`)
- Weather API calls capped at 15 concurrent (rate limit avoidance)
- TiltCard `overflow-hidden` clips absolute children — logo watermarks must fit within card bounds

## Planned / Backlog
- **More results**: MotoGP R7+, WEC R3 (Le Mans), ELMS R3+, GTWCE R3+, DTM R3+, Nürburgring NLS6+, Porsche Supercup R1+
- **roundPoints data**: only top 10 F1 drivers/constructors have per-round sparkline data; remaining rows show blank spacer
- **Logo quality**: true-colour Aprilia/Yamaha sources
- **Stream links**: Porsche Carrera has no links — find correct channel/site
- **Manual override CMS**: currently JSON file editing only
- **Live race mode**: real-time lap data, gap to leader
