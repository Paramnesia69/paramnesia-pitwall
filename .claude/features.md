# Features — PARAMNESIA PITWALL

## Stable (shipped)
- **Event grid** — 3-col responsive grid (sm:2, lg:3), first 9 events, uniform height via h-full chain
- **Hero card** — Featured/live/next event with animated scan line, series logo watermark, countdown
- **EventDetailOverlay** — Right-panel slide-out (framer spring), Escape key, backdrop click, deep-link `?event=id`
- **Series filter** — Category nav pills synced to `?series=` URL param (no page navigation)
- **Countdown** — Live ticking, compact and full modes
- **Session pills** — In hero card and event cards; strikethrough for finished sessions
- **Reminder system** — Bell button per session, browser notification (N minutes before)
- **Weather badges** — Real OpenWeatherMap data on event cards and detail overlay
- **Circuit stats panel** — In detail overlay: lap record, length, corners, DRS zones, F1 CDN circuit map image
- **This Weekend** — Dedicated section for events happening this Fri–Sun
- **Upcoming timeline** — Events 10–20 shown in a minimal list below the grid
- **Recent results** — Real 2026 results for F1, MotoGP, WEC, WRC, IMSA, ELMS; filterable by series
- **Championship standings** — Real 2026 standings for F1 (drivers+constructors), MotoGP, WEC, WRC, IMSA, DTM; tab switcher
- **News feed** — RSS-backed (6 feeds); static fallback; filterable
- **ICS calendar feed** — `/api/calendar` (254 sessions, `?series=` filter); Footer "Subscribe" link
- **OpenGraph cards** — `/api/og?event=<id>` → 1200×630 PNG with series accent; wired via `generateMetadata`
- **Manual overrides** — `src/data/overrides.json` → note banners, state overrides, stream links, forced hero
- **Manufacturer logos** — In standings, results, and F1 timing; 3-tier system (F1 white, SVG moto tinted, brand PNG)
- **F1 live timing** — Via OpenF1 API; polls 45s during live/starting_soon; shown in event detail overlay
- **Faded series logo watermarks** — on HeroCard, EventCard, EventDetailOverlay
- **Dark/light theme** — Toggle, persisted in localStorage
- **PWA** — Service worker, install prompt, update banner
- **Share / event share** — Web Share API + fallback; deep-link per event
- **Favorite series** — Star button per series, persisted
- **Live indicator** — Last poll timestamp + spinning refresh button
- **Google Calendar** — "+Cal" link per session in detail overlay

## Known Issues / Workarounds
- `gtwce.png`, `wec.png`, `elms.png`, `nurburgring.jpg` have non-transparent backgrounds → use `mixBlendMode: screen` + `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)` + `grayscale(1) contrast(2) brightness(3)` for series watermarks
- Manufacturer logo quality: Porsche crest is mostly dark gold; Aprilia/Yamaha logos tinted from black SVGs (not true-color)
- `images: { unoptimized: true }` required — remote patterns exist for F1 CDN (`media.formula1.com`)
- Weather API calls capped at 15 concurrent (rate limit avoidance)
- TiltCard `overflow-hidden` clips absolute children — logo watermarks must fit within card bounds

## Planned / Backlog
- DTM recent results (standings exist, no race results yet)
- Logo quality improvements (better Porsche/Aprilia/Yamaha sources)
- Nürburgring/Nordschleife split — both share `nurburgring.jpg`
- Manual override CMS UI (currently JSON file editing)
- Live race mode (real-time lap data, gap to leader)
- Redis caching layer (currently ISR only)
