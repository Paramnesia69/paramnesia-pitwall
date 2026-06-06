# Features — PARAMNESIA PITWALL

## Shipped

### Event Display
Event grid, Hero card (series-aware featured/live/next), EventDetailOverlay (slide-out, Escape, deep-link), Series filter (URL-synced pills), Countdown, Session pills (strikethrough finished), This Weekend section, Upcoming timeline, HeroCard Watch Live CTA

### Data Panels
- **Recent results** — all series, filterable, manufacturer logos, Show All toggle
- **Championship standings** — F1/WEC/ELMS/IMSA/MotoGP/DTM/WRC; drivers + teams/constructors side by side; ExpandableGrid (top 10 default, expand button); F1 sparklines from roundPoints; class plate badge headers for WEC/ELMS
- **News feed** — RSS, 6 feeds, filterable by series
- **F1 live timing** — OpenF1, polls 45s; Tyre Tracker, Team Radio, Flag Feed, live_blocked state

### UX & PWA
Reminders, Weather badges, Circuit stats panel, Manufacturer logos (3-tier system), Class plate badges, Series logo watermarks, Dark/light theme, PWA, Share, Favorites, Live indicator, Google Calendar links, ICS calendar feed, OpenGraph cards, Manual overrides (overrides.json)

### Live Intelligence & Personal Layer (Phases 1–4)
Race Diary (watched toggle + star rating + notes), Conflict Detector, Watched State (dim + checkmark), Mini-Leaderboard (fixed bottom strip, z-190), What's Live Badge (floating pill, z-200), Driver Profiles (DriverProfileOverlay, Jolpica + OpenF1 headshot), Points Trajectory chart (ChampionshipChart.tsx, top-6), Teammate H2H (/api/f1/h2h, Jolpica qualifying)

### Media Layer (Phase 5)
Race Highlights (9 YouTube RSS feeds, inline lightbox player), Podcasts (4 RSS feeds with .mp3 enclosures, inline audio)

## Known Issues / Workarounds
- **Driver headshots** — Source is OpenF1 `headshot_url` (~100–130px native). Displayed at `maxHeight: 140`. F1 official CDN high-res path (`content/dam/fom-website/drivers/2026Drivers/`) does NOT exist — do not attempt again without a verified URL.
- `gtwce.png`, `wec.png`, `elms.png` have non-transparent backgrounds — opacity 0.18 + `maskImage: radial-gradient(ellipse at center, black 50%, transparent 85%)` keeps it acceptable. Never use `mixBlendMode: screen` — iOS Safari drops it inside stacking contexts.
- **Series watermarks** — no filter, natural brand colors, opacity 0.12–0.18, radial-gradient maskImage. Porsche SVG only: `brightness(0) invert(1)`.
- **Circuit map watermarks** — self-hosted Wikimedia SVGs, NO filter, opacity 0.22–0.28. 2022 F1 CourseLayout SVGs cleaned: DRS boxes, Speed Trap, and legend (アイコン group) all stripped. Only track + sector colours + corner numbers remain.
- Peugeot logo inverted (black shield → white); Aprilia/Yamaha tinted from black SVGs — not true brand colour; Porsche brand PNG gentle boost — not true gold. All acceptable.
- `images: { unoptimized: true }` required — no remote patterns needed (all circuit maps are self-hosted).
- Weather API calls capped at 15 concurrent (rate limit avoidance).
- TiltCard `overflow-hidden` clips absolute children — watermarks must fit within card bounds.
