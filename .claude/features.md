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
- **Championship standings** — Real 2026 data; shown on "All Series" and on any filtered page for series with standings data (f1/wec/elms/imsa/motogp/dtm/wrc); pre-selected to the active series tab when filtering; hidden for series without standings (gtwce/nurburgring/porsche); tab switcher (F1, WEC, ELMS, IMSA, MotoGP, DTM, WRC); multi-class sections with class plate badge headers:
  - F1: Drivers + Constructors
  - WEC: Hypercar + LMGT3 (drivers + manufacturers); LMGT3 shows green class plate badge
  - ELMS: LMP2 + LMP3 + LMGT3 (drivers + teams); each class has its official-colour plate badge (blue/purple/green)
  - IMSA: GTP + GTD Pro + GTD (drivers + teams)
  - MotoGP: Riders + Teams (full 23-rider grid)
  - DTM: Drivers + Manufacturers
  - WRC: Drivers + Manufacturers
  - F1 standings rows show SVG sparkline (points trajectory per round) when `roundPoints` data is present; falls back to progress bar otherwise
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

## Known Issues / Workarounds
- `gtwce.png`, `wec.png`, `elms.png`, `nurburgring.jpg` have non-transparent backgrounds → use `mixBlendMode: screen` + `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)` + `grayscale(1) contrast(2) brightness(3)` for series watermarks; never use these raw
- Peugeot logo: background stripped, currently displayed inverted (black shield → white); acceptable on dark bg
- Aprilia/Yamaha logos: tinted from black-fill SVGs — not true brand colour
- Porsche brand PNG: gold badge with gentle filter `brightness(1.1) saturate(1.8) contrast(1.05)` — not true Porsche gold but readable
- `images: { unoptimized: true }` required — remote patterns whitelisted for F1 CDN (`media.formula1.com`)
- Weather API calls capped at 15 concurrent (rate limit avoidance)
- TiltCard `overflow-hidden` clips absolute children — logo watermarks must fit within card bounds

## Planned / Backlog
- **More results**: F1 R5+, MotoGP R7+, WEC R3 (Le Mans), ELMS LMP3/LMGT3 class winners, GTWCE R3+, DTM R3+, Nürburgring NLS6+, Porsche Supercup R1+
- **Logo quality**: true-colour Aprilia/Yamaha sources
- **Stream links**: Porsche Carrera has no links — find correct channel/site
- **Manual override CMS**: currently JSON file editing only
- **Live race mode**: real-time lap data, gap to leader
- **Redis caching**: currently ISR only; add Redis layer for instant updates
