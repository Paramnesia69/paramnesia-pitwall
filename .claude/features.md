# Features — PARAMNESIA PITWALL

## Stable (shipped)
- **Event grid** — 3-col responsive grid (sm:2, lg:3), first 9 events, uniform height via h-full chain
- **Hero card** — Featured/live/next event with animated scan line, series logo watermark, countdown
- **EventDetailOverlay** — Right-panel slide-out (framer spring), Escape key, backdrop click to close, deep-link via `?event=id`
- **Series filter** — Category nav pills synced to `?series=` URL param (no page navigation)
- **Countdown** — Live ticking, compact and full modes
- **Session pills** — In hero card and event cards; strikethrough for finished sessions
- **Reminder system** — Bell button per session, browser notification (N minutes before)
- **Weather badges** — Real OpenWeatherMap data on event cards and detail overlay
- **Circuit stats panel** — In detail overlay: lap record, length, corners, DRS zones, F1 CDN circuit map image
- **This Weekend** — Dedicated section for events happening this Fri–Sun
- **Upcoming timeline** — Events 10–20 shown in a minimal list below the grid
- **Recent results** — Hardcoded 2026 results per series, filterable
- **Championship standings** — Hardcoded 2026 standings, filterable
- **News feed** — Hardcoded 2026 news items, filterable
- **Manual overrides** — `src/data/overrides.json` → note banners, state overrides, stream links, forced hero
- **Faded series logo watermarks** — on HeroCard, EventCard, EventDetailOverlay (see CSS Patterns)
- **Dark/light theme** — Toggle, persisted in localStorage
- **PWA** — Service worker, install prompt, update banner
- **Share button** — Web Share API with fallback
- **Event share button** — Per-event share with deep link (`?event=id`)
- **Favorite series** — Star button per series, persisted
- **Live indicator** — Shows last poll timestamp + spinning refresh button
- **Google Calendar** — "+Cal" link per session in detail overlay
- **Add to calendar** — Reminder flow

## In Progress / Recently Changed
- **Uniform card heights** — Fixed via h-full on StaggerItem + EventCard outer div
- **GTWCE logo replacement** — Downloaded new transparent PNG from vhv.rs (still needs verification + commit)
- **Logo watermark polish** — mask-image radial-gradient for non-transparent PNGs; opacity/filter tuning

## Known Issues / Workarounds
- `gtwce.png`, `wec.png`, `elms.png`, `nurburgring.jpg` have non-transparent backgrounds → use `mixBlendMode: screen` + `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)` + `grayscale(1) contrast(2) brightness(3)` filter
- `images: { unoptimized: true }` required — remote patterns exist for F1 CDN (`media.formula1.com`)
- Weather API calls capped at 15 concurrent (rate limit avoidance)
- TiltCard `overflow-hidden` clips absolute children — logo watermarks must fit within card bounds

## Planned / Backlog
- Live timing integration (OpenF1 or Al Kamel)
- OpenGraph / social preview cards
- Manual override CMS UI (currently JSON file editing)
- Advanced sharing (personalized filter state in URL)
- Push notification subscription (currently browser-only)
- Live race mode (real-time lap data, gap to leader)
- Telemetry placeholders (speed traces, sector times)
- ICS calendar feed export
- Redis caching layer (currently ISR only)
