# Architecture — PARAMNESIA PITWALL

## Stack
- **Next.js 16.2.6** (Turbopack) — App Router, RSC, ISR (`export const revalidate = 120`)
- **Tailwind v4** — `@import "tailwindcss"` + `@theme inline {}` (NO `tailwind.config.js`)
- **Framer Motion** — animations only; never for layout
- **Zustand** + persist middleware — client state (localStorage key: `pitwall-store`)
- **Deployment**: Vercel + GitHub (auto-deploy on push to main)
- `images: { unoptimized: true }` in next.config.mjs (required for Vercel static export compat)

## Auth (whole site is private)
- `middleware.ts` (repo root) gates the ENTIRE app behind a single login. Cookie `pw-auth` must equal `btoa(PITWALL_USER:PITWALL_PASS)` (env vars on Vercel); otherwise 307 → `/login?from=...`.
- Exempt: `/login`, `/api/auth`, and static assets (see matcher). So **every page and API route returns 307→/login when hit without the auth cookie** — intended, not a bug. Don't anonymously curl production to "verify" a deploy; verify data against the upstream API locally instead.

## Folder Structure
```
src/
├── app/
│   ├── page.tsx              # SSR entry: one getEventsWithState() call, ISR 2min; news streamed via Suspense+AsyncNewsFeed
│   ├── layout.tsx            # Root layout: fonts, theme, AmbientBackground
│   ├── globals.css           # Design tokens (--pw-*), Tailwind v4 @theme, .pw-glass
│   └── api/
│       ├── events/route.ts   # /api/events — polled by useLiveData every 2min
│       ├── weather/route.ts  # /api/weather — OpenWeatherMap proxy
│       ├── calendar/route.ts # /api/calendar — ICS feed (254 sessions, ?series= filter)
│       ├── og/route.ts       # /api/og?event=<id> — 1200×630 PNG OpenGraph card
│       ├── openf1/
│       │   └── timing/route.ts # /api/openf1/timing?eventId= — F1 live timing proxy
│       ├── wec/
│       │   └── timing/route.ts # /api/wec/timing — Le Mans live class timing (Al Kamel CSV proxy, thin)
│       ├── f1/
│       │   ├── driver/[driverRef]/route.ts      # /api/f1/driver/:ref — Jolpica driver profile, no-store cache
│       │   └── constructor/[constructorRef]/route.ts # /api/f1/constructor/:ref — Jolpica constructor profile, no-store cache
│       ├── motogp/
│       │   └── rider/[riderRef]/route.ts        # /api/motogp/rider/:ref — MotoGP rider profile from static lib, no-store cache
│       └── push/
│           ├── subscribe/route.ts  # POST/DELETE — queue/remove web-push reminder in Upstash Redis
│           └── dispatch/route.ts   # POST — send due pushes (GH Actions cron */5; middleware-exempt, PUSH_CRON_SECRET)
├── components/
│   ├── Dashboard.tsx         # Client shell: series filter, event grid, lazy-loaded panels; accepts newsFeedSlot ReactNode
│   │                         # Series order: F1→WEC→ELMS→IMSA→Nürburgring→MotoGP→GTWCE→DTM→WRC→Porsche
│   ├── AsyncNewsFeed.tsx     # Async server component — fetches news + renders NewsFeed; used behind Suspense in page.tsx
│   ├── EventDetailOverlay.tsx # Right-panel slide-out (framer spring), Escape key, backdrop click
│   ├── DriverProfileOverlay.tsx # Driver profile sidebar — F1 (Jolpica) + MotoGP (static lib); series logo badge; flag next to name
│   ├── TeamProfileOverlay.tsx   # Team/entry sidebar — F1 (Jolpica) + MotoGP/WEC/ELMS/IMSA (store data only); series logo badge
│   ├── StandingsPanel.tsx    # Championship standings; series logo tab bar (F1/WEC/ELMS/IMSA/MotoGP/DTM/WRC)
│   │                         # All series side-by-side via ExpandableGrid (3-col CSS grid: 1fr 1px 1fr, glass divider)
│   │                         # ExpandableGrid: premium headers (10px semibold + bottom border), defaultLimit=10 + expand button
│   │                         # ClassSection: badge header + ExpandableGrid; takes driverData+teamData (no sub-toggle)
│   │                         # F1: roundPoints merged from static into live API response by name → SVG sparkline per row
│   │                         # CONSTRUCTOR_REFS map: constructor display name → Jolpica constructorId
│   ├── RecentResults.tsx     # Podium cards grid; filterable by series; manufacturer logos
│   ├── NewsFeed.tsx          # RSS news feed; reads activeFilter from useSearchParams(?series=); no longer needs prop
│   ├── HeroCard.tsx          # Featured event hero (motion.section, series watermark, countdown)
│   ├── ThisWeekend.tsx       # Events happening this Fri–Sun
│   ├── UpcomingTimeline.tsx  # Events 10–20 in minimal list
│   ├── Footer.tsx            # ICS subscribe link, credits
│   ├── cards/
│   │   ├── EventCard.tsx     # Grid card (memo, TiltCard wrapper, h-full)
│   │   └── TiltCard.tsx      # 3D tilt on hover (overflow-hidden, h-full)
│   ├── motion/
│   │   ├── FadeIn.tsx        # Simple opacity fade wrapper
│   │   └── StaggerGrid.tsx   # Grid with staggered children (StaggerItem = motion.div)
│   └── ui/                   # Atomic: Countdown, WeatherBadge, ReminderButton, LiveIndicator,
│       │                     # InstallPrompt, UpdateBanner, ShareButton, ThemeToggle
│       ├── SheetGrip.tsx     # Drag handle for mobile bottom-sheet overlays (sticky, -mb-7)
│       ├── CircuitEmblem.tsx # Small frameless white track silhouette by the circuit name (getCircuitFilter → invert white)
│       ├── SeriesEmblem.tsx  # Natural-colour series logo; mirrors CircuitEmblem on RecentResults
│       ├── F1TimingPanel.tsx # Fetches /api/openf1/timing; polls 45s when live
│       ├── WECTimingPanel.tsx # Fetches /api/wec/timing; class tabs (HYPERCAR red / LMP2 blue / LMGT3 green — each ALWAYS its own colour: active brighter, inactive dimmed, never recoloured); CLASS_COLOR drives tab + leaderboard accent; Live dot = series accent (blue); polls 60s when live; pending state pre-timing
│       ├── EnduranceTracker.tsx # Hero endurance clock: day/night-tinted road ribbon + real prototype PNG marker (/lemans-prototype.png) + phase + milestone (see Endurance Live Layer)
│       └── RaceIcons.tsx     # Premium inline-SVG racing icons (Hypercar, start-light gantry, chequered flag, stopwatch, gradient sun/moon) — replaces emoji
│   # NOTE: src/app/icon.png = Next canonical round favicon (see decisions.md Logo & Watermark System — FINAL)
│   # NOTE: all series logos render NATURAL brand colours everywhere (Porsche-only invert); no grayscale/screen/mask
├── data/
│   ├── calendar-2026.ts      # Static race calendar (REAL data, never invented)
│   ├── news-2026.ts          # Static news fallback items
│   ├── results-2026.ts       # Race results: F1/MotoGP/WEC/WRC/IMSA/ELMS
│   ├── standings-2026.ts     # Standings: F1/MotoGP/WEC (Hypercar+LMGT3)/ELMS (3 classes)/IMSA/DTM/WRC
│   └── overrides.json        # Manual admin overrides (note, state, streamLinks, featured)
├── lib/
│   ├── endurance.ts          # getEnduranceDurationHours(name) — race length from official name; powers EnduranceTracker + state fallback
│   ├── enduranceClock.ts     # Endurance race-phase + day/night (real sun facts) + next-milestone math — pure, tested
│   ├── wecTiming.ts          # getWecTiming() — fetch Al Kamel Le Mans classification CSV → per-class leaderboard (60s cache, dual-schema parser)
│   ├── events.ts             # getEventsWithState, getUpcomingEvents, getFeaturedEvent; endurance-aware session-end fallback
│   ├── teamLogos.ts          # Logo resolution — see Logo System below
│   ├── weather.ts            # fetchWeather (OpenWeatherMap), getSimulatedWeather fallback
│   ├── overrides.ts          # applyOverrides, getForcedFeaturedId
│   ├── circuitStats.ts       # getCircuitStats(name) → CircuitStats | null
│   ├── images.ts             # getCircuitImage(name) → local /circuits/ SVG path (flat lookup table)
│   ├── streamLinks.ts        # getStreamLinks(series) → StreamLink[]
│   ├── motogpRiders.ts       # Static 2026 MotoGP grid: MOTOGP_RIDER_DATA (23 riders, Wikipedia-sourced) + MOTOGP_RIDER_REFS map
│   ├── clinch.ts             # getClinchInfo(series, standings) — F1/MotoGP title math from remaining calendar
│   ├── pushQueue.ts          # Server: Redis zset push:queue + push:item blobs (enqueue/remove/popDue)
│   ├── usePush.ts            # Client: PushManager subscribe + queue/remove server push for reminders
│   ├── useLiveData.ts        # Polls /api/events every 2min, tab-visibility aware
│   ├── useMediaQuery.ts      # SSR-safe matchMedia hooks: useIsMobile (<640px), useIsCoarsePointer
│   ├── useMobileSheet.ts     # Bottom-sheet motion props + style for overlays on phones (drag dismiss)
│   ├── useReminders.ts       # Browser notification scheduler (open-tab); usePush covers closed-tab
│   └── useSW.ts              # Service worker registration + update detection
├── store/index.ts            # Zustand store (see Data Models)
└── types/index.ts            # All shared types + SERIES_META

public/
├── lemans-prototype.png  # Endurance road marker — real LMP prototype, bg cut from a 16-colour dithered source (see decisions.md). Versioned filename busts the cache-first SW.
├── logos/
│   ├── f1.svg, wec.png, elms.png, imsa.svg, motogp.svg, wrc.svg,
│   │   gtwce.png, dtm.svg, porsche.svg, nurburgring.svg      # Series logos
│   ├── class-lmp2.svg    # Blue ELMS class plate badge
│   ├── class-lmp3.svg    # Purple ELMS class plate badge
│   ├── class-lmgt3.svg   # Green two-line "LM/GT3" badge
│   └── constructors/
│       ├── f1-{team}.webp        # Official F1 white WebPs (11 teams)
│       ├── brand-{make}.png      # car-logos-dataset badge PNGs (transparent bg)
│       ├── brand-genesis.png     # pngwing high-quality (transparent bg)
│       ├── brand-peugeot.png     # bg stripped via Pillow; black shield
│       ├── ducati.svg, aprilia.svg, yamaha.svg, ktm.svg   # Moto brand SVGs
```

## Endurance Live Layer (Le Mans)

Two cooperating pieces that make a 24H race feel live. See `decisions.md` for the data-source + no-websocket rationale.

### Bucket 1 — Endurance clock (hero, pure time math)
- `lib/enduranceClock.ts`: `getRacePhase` (returns `{ label, icon: RacePhaseIcon }` — a semantic key, NOT emoji), `getNextMilestone`, `getDaylightState`, `getEnduranceSun(circuitName)`. Sun facts are real instants keyed by circuit (`CIRCUIT_SUN`, Le Mans = sunset 19:58Z / sunrise 04:00Z). Pure + tested (`tests/enduranceClock.test.ts`).
- `ui/EnduranceTracker.tsx` (rendered by `HeroCard` while a race session is live + `getEnduranceDurationHours` matches): elapsed/remaining clocks flank a clean **road ribbon** (rounded-full, day/night-tinted gradient mapped to sunset/sunrise fractions, faint dashed centre line, hour posts, inset sheen `inset 0 1px 0 rgba(255,255,255,.14), inset 0 -3px 5px rgba(0,0,0,.4)`). A **real prototype PNG** (`/lemans-prototype.png`) drives the road at the current position (`width 56`, sits at `bottom 12`, faces right; soft headlight-beam glow + dimmed filter at night); a premium **sun** sits at sunset/sunrise and a **moon** rides the night-mid. Phase icon + next-milestone countdown above. NOTE: the old kerb/chequered-edge road was rejected as "ugly" — keep the ribbon clean.
- `ui/RaceIcons.tsx`: all icons are inline SVG (no emoji). `PhaseIcon` maps `RacePhaseIcon` → component; exports `Hypercar` (SVG, only the `racing`-phase fallback still uses it — the road marker is now the PNG), `Sun`, `Moon`. Gradients use `useId()` to avoid id collisions.

### Bucket 2A — WEC live classification (real data)
- `lib/wecTiming.ts` → `/api/wec/timing` (thin proxy, mirrors openf1/timing) → `ui/WECTimingPanel.tsx` (mounted in `EventDetailOverlay` only when `series==='wec' && circuit.name==='Circuit de la Sarthe'`).
- Source = **Al Kamel** classification CSV. **No live root file during the race**; data lives in hourly snapshots at `…/202606131600_Race/${NN}_Hour ${N}/03_Classification_Race_Hour ${N}.CSV` (zero-padded folder prefix). Fetch loop probes the current hour downward; returns `pending` before Hour 1, `live` otherwise.
- **Dual-schema parser** (`parseWecClassification`, pure + tested): practice/quali CSVs use `POS` + split `DRIVERn_FIRSTNAME/SECONDNAME`; the live RACE CSV uses `POSITION` + single-field `DRIVER_1..N`. Each field resolved against both names. Per-class gap = exact lap-down delta to the class leader.
- Types in `@/types`: `WECTimingData / WECTimingClass / WECTimingEntry` (client imports from `@/types` only — never the route).
- **Class colours** = official ACO/ELMS plate palette, fixed per class at all times (active = brighter, inactive = same hue dimmed): `HYPERCAR #E10600` (red), `LMP2 #1E4B8C` (blue), `LMGT3 #1A6B38` (green). Tabs never recolour on selection ("flapping" was rejected). The `· LIVE` indicator + the `EventDetailOverlay` live session row/name use the **series accent** (WEC blue `#0090D4`) with a **red** `pw-live-dot`; YouTube watch links also use the series accent (not YouTube red).

## Logo System (src/lib/teamLogos.ts)

```ts
export interface TeamLogoInfo {
  src: string;
  white: boolean;      // true = F1 white WebP — opacity only, no filter
  cssFilter?: string;  // if set, apply directly; overrides default per-tier filter
  png?: boolean;       // true = brand PNG badge — render at larger size than SVG moto logos
}

getTeamLogo(teamName: string, f1Context = false): TeamLogoInfo | null
```

Three tiers (resolved in order):
1. **F1 official white WebPs** (`f1Context=true`) → `{ src, white: true }` → opacity 0.95
   - Files: `public/logos/constructors/f1-{team}.webp` (11 teams, from media.formula1.com)
2. **Motorcycle SVGs** (`SVG_MOTO_MAP`) → `{ src, white: false, cssFilter? }`:
   - Ducati family → `ducati.svg` — no filter (SVG already has red+white fills)
   - Aprilia/Trackhouse → `aprilia.svg` — sepia+hue-rotate to red tint
   - Yamaha → `yamaha.svg` — `brightness(0) invert(1) opacity(0.85)` → white wordmark
   - KTM → `ktm.svg` — no filter (orange background badge, natural)
3. **Brand PNGs** (`MFR_MAP + partialMfrMatch`) → `{ src, white: false, png: true, cssFilter? }`:
   - Mercedes-AMG, Audi, McLaren: `brightness(0) invert(1) opacity(0.85)` (black badge → white)
   - Peugeot/Citroën: `brightness(0) invert(1) opacity(0.9)` (bg stripped, black shield → white)
   - Genesis: `brightness(1.8) contrast(1.2)` (chrome emblem boost)
   - AF Corse / Vista AF: mapped to `brand-ferrari.png`
   - Default: no cssFilter → component applies `brightness(1.6) saturate(2.5) contrast(1.2)`

Component rendering pattern (all four components share the white + cssFilter branches; default differs):
```tsx
logo.white           → { opacity: 0.95 }
logo.cssFilter!=null → { filter: logo.cssFilter, opacity: 0.92 }

// StandingsPanel (intentionally muted for table context):
default → { filter: 'brightness(1.1) saturate(1.4) contrast(1.0)', opacity: 0.95 }

// F1TimingPanel, RecentResults, RaceWeekendOverlay (vivid for card/results context):
default → { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }
```

## Key Types
```ts
NormalizedRaceEvent {
  id, series: SeriesId, name, circuit: Circuit,
  sessions: RaceSession[], state: EventState,
  startDate, endDate, imageUrl?, streamLinks: StreamLink[],
  weather?: WeatherData, source: DataSource, overrides?: ManualOverride
}

Circuit { name, country, countryCode, lat, lng }
RaceSession { type, name, startTime, endTime?, state, streamLink? }
ManualOverride { streamLinks?, imageUrl?, state?, note?, featured?, sessionOverrides? }

RaceResult { id, series: SeriesId, round, name, circuit, country, countryCode, date,
             podium: { pos, driver, team, time? }[], fastestLap? }

DriverStanding   { pos, name, team, points, teamColor }
ConstructorStanding { pos, name, points, color }

SelectedTeam { ref: string, name: string, teamColor: string, pos: number, points: number, series: SeriesId,
               driverNames?: string, carNumber?: string, seriesClass?: string, manufacturer?: string }
TeamProfile  { ref, name, nationality, wins, seasons, firstSeason,
               season2026: { points, pos } | null,
               drivers2026: { ref, givenName, familyName, number }[] }
MotoGPRiderProfile { ref, givenName, familyName, nationality, dateOfBirth, permanentNumber,
                     raceWins, championships, seasons, headshotUrl: string|null,
                     season2026: { pos, points, team } | null }
```

## SERIES_META (src/types/index.ts)
```ts
SERIES_META: Record<SeriesId, { name: string; accent: string; logo?: string }>
```
SeriesIds: `f1 wec imsa elms motogp wrc gtwce dtm porsche-supercup porsche-carrera nurburgring nordschleife lemans`

Series logos in `/public/logos/` — SVGs are transparent; `gtwce.png`, `wec.png`, `elms.png`, `nurburgring.jpg` are NOT transparent → must use watermark treatment for these.

## Zustand Store Shape (src/store/index.ts)
```ts
{ favorites: SeriesId[], toggleFavorite, isFavorite,
  selectedEventId: string|null, openEvent(id), closeEvent(),
  selectedDriver: SelectedDriver|null, openDriver(info), closeDriver(),
  selectedTeam: SelectedTeam|null, openTeam(team), closeTeam(),
  theme: 'dark'|'light', toggleTheme,
  reminders: Reminder[], addReminder, removeReminder, markFired, getReminder, clearExpiredReminders,
  diary: Record<string, DiaryEntry>, setDiaryEntry, toggleWatched, getDiaryEntry, removeDiaryEntry }

SelectedDriver { ref: string, name: string, team: string, teamColor: string,
                 pos: number, points: number, series: SeriesId }
SelectedTeam   { ref: string, name: string, teamColor: string,
                 pos: number, points: number, series: SeriesId }
```
Persisted: `favorites`, `theme`, `reminders`, `diary`
Transient (not persisted): `selectedEventId`, `selectedDriver`, `selectedTeam`, `selectedResult`

## Data Flow
```
CALENDAR_2026 (static)
  → getEventsWithState() [called ONCE per render, ISR 2min, server]
  → applyOverrides() [overrides.json]
  → fetchWeather() → OpenWeatherMap (parallel, max 15 events)
  → deriveFeaturedEvent() + deriveUpcomingEvents() [sync, from same result]
  → page.tsx renders Dashboard with SSR props
  → AsyncNewsFeed [streamed separately behind Suspense — off critical path]
      → getNews(40) → 6 RSS feeds → NewsFeed (client, reads ?series= from URL)
  → useLiveData polls /api/events every 2min (client, tab-visible only)
  → Dashboard re-renders with live data

Caching:
  → src/lib/cache.ts: get-or-set wrapper; uses Upstash Redis when UPSTASH_REDIS_REST_URL
    + UPSTASH_REDIS_REST_TOKEN env vars are set; falls back to in-memory Map
  → /api/events caches getEventsWithState() result for 2min via cached()
```

## CSS Patterns
- **Design tokens**: `var(--pw-bg-primary)`, `var(--pw-glass-bg)`, `var(--pw-accent)` — all in globals.css
- **Glass cards**: `.pw-glass` utility class
- **Series watermarks** (non-transparent logos): opacity 0.12–0.18 + `maskImage: radial-gradient(ellipse at center, black 50%, transparent 85%)` — NO filter, NO mixBlendMode
- **TiltCard**: has `overflow-hidden` on inner div — clips absolute-positioned children at card boundary
- **Uniform card height**: requires `h-full` chain → `StaggerItem` → `EventCard` outer div → `TiltCard`

## Driver Profile Overlay (DriverProfileOverlay.tsx)

### Trigger & State
- Opened from `StandingsPanel` — F1 and MotoGP driver rows call `openDriver({ ref, name, team, teamColor, pos, points, series })`
- Zustand store: `selectedDriver: DriverSelectedInfo | null`, `openDriver(info)`, `closeDriver()`
- Fetches on `selectedDriver.ref` + `selectedDriver.series` change; series determines API route
- Escape key + backdrop click both call `closeDriver()`

### Series branches
- `series === 'f1'` → fetch `/api/f1/driver/${ref}` → `DriverProfile`
- `series === 'motogp'` → fetch `/api/motogp/rider/${ref}` → `MotoGPRiderProfile` (data from static `src/lib/motogpRiders.ts`)

### Layout: fixed right panel
```
width: min(420px, 92vw)
z-index: 320 (backdrop: 310)
background: var(--pw-bg-elevated)
borderLeft: 1px solid ${accent}25
boxShadow: -24px 0 80px rgba(0,0,0,0.75), inset 1px 0 0 ${accent}15
spring: stiffness 300, damping 32 — slides in from x:'100%'
```

### Hero section (h-56, overflow-hidden, shrink-0)
- Background: `linear-gradient(135deg, ${accent}35 0%, ${accent}08 55%, var(--pw-bg-elevated) 100%)`
- **Team logo watermark** — left side, 160×100, opacity 0.10, radial-gradient mask (40%→80%)
- **Race number watermark** — right side, fontSize 120, opacity 0.07, Orbitron font, accent color
- **Driver headshot** — F1: OpenF1 `headshot_url` (q_auto→q_100), maxHeight 220. MotoGP: `null` (motogp.com JS-rendered, no extractable URL)
- **Scan line** — `motion.div` animating `top: 0%→100%` over 7s, repeat Infinity, accent gradient
- **Bottom fade** — `h-20 bg-gradient-to-t from-[var(--pw-bg-elevated)]`
- **Close button** — top-right, `bg-black/50 backdrop-blur-[10px]`, SVG X icon

### Identity section (px-6 -mt-4)
- **Series badge pill**: series logo icon (13px, from `SERIES_META[series].logo`) + `· DRIVER` / `· RIDER`
  - Opaque logos (wec/elms/gtwce): `filter: 'grayscale(1) contrast(3) brightness(6)', mixBlendMode: 'screen'`
  - Transparent logos: `opacity: 0.9`
  - Pill: `${accent}18` bg, `${accent}30` border, inline-flex items-center gap-1.5
- **Driver name**: `text-3xl font-extrabold tracking-tight` Orbitron, **nationality flag emoji inline** (gap-3, pb-0.5)
- Team logo (small) + team name row, staggered fade-in (delays 0.12→0.20s)

### StatCard component
```tsx
// Centered, accent-tinted glass card with instant hover animation
className: "relative flex flex-col items-center text-center gap-1.5 px-4 pt-4 pb-3 rounded-xl overflow-hidden cursor-default"
background: ${accent}0c  border: 1px solid ${accent}28
whileHover: scale 1.03, boxShadow: `0 0 0 1px ${accent}45, 0 8px 28px ${accent}18`
  transition: { duration: 0.12, ease: 'easeOut' }   ← MUST be inside whileHover to override spring
label: 9px bold uppercase tracking-[0.18em], accent color at opacity 0.7
value: text-2xl font-bold tabular-nums, fontFamily: var(--font-orbitron)
entrance: initial y:10→0 opacity:0→1, spring stiffness:240 damping:24, staggered delay
```
Cards:
- **F1**: 2026 Season (Position, Points — 2-col) · Career (Wins, Seasons, Number — 3-col)
- **MotoGP**: 2026 Season (Position, Points — 2-col) · Career (Wins, Titles, Number — 3-col; Wins = feature race wins only, Titles = championships across all classes)

### InfoRow component (Born card)
```tsx
// flex justify-between, gap-4, px-4 py-3
label: 9px bold uppercase tracking-[0.18em], accent color at opacity 0.6, shrink-0
value: 12px font-semibold truncate, fontFamily: var(--font-orbitron)
card: border 1px solid ${accent}20, bg ${accent}08, overflow-hidden, motion.div entrance delay 0.52s
```
- **Born** only — nationality flag is next to the name, NOT in InfoRow
Date parsing: `profile.dateOfBirth.split('-').map(Number)` → `new Date(y, m-1, day)` (local time, avoids UTC off-by-one)

### DO NOT add static ribbons inside stat cards
Static accent ribbon divs (absolute top-0 h-[2px] gradient) look like UI artifacts — rejected. The whileHover glow is the only accent on hover.

### API Route: /api/f1/driver/[driverRef]/route.ts
```
runtime: nodejs
Cache-Control: no-store

Parallel fetches (Promise.all):
  /drivers/${ref}.json                         → name, nationality, dob, code, number
  /drivers/${ref}/results/1.json?limit=1       → MRData.total = career wins
  /drivers/${ref}/seasons.json?limit=100       → SeasonTable.Seasons.length = seasons count
  /2026/drivers/${ref}/driverStandings.json    → current season pos + points + team

seasons count: use SeasonTable.Seasons.length (actual array) NOT MRData.total
headshot: OpenF1 /drivers?driver_number=N&session_key=latest → headshot_url (silent fail)
```

### API Route: /api/motogp/rider/[riderRef]/route.ts
```
runtime: nodejs
Cache-Control: no-store

Data: MOTOGP_RIDER_DATA[ref] from src/lib/motogpRiders.ts (23 riders, Wikipedia-sourced)
headshotUrl: null — motogp.com is JS-rendered, no URL extractable
```

## Team Profile Overlay (TeamProfileOverlay.tsx)

### Trigger & State
- F1: `StandingsPanel` ConstructorRow click → `openTeam({ ref, name, teamColor, pos, points, series: 'f1' })`
- MotoGP: team row click → `openTeam({ series: 'motogp', ... })`
- WEC/ELMS/IMSA driver row: `openTeam({ driverNames, carNumber, seriesClass, ... })` — car entry overlay
- WEC/ELMS/IMSA constructor row: `openTeam({ seriesClass, ... })` — manufacturer overlay
- `CONSTRUCTOR_REFS` map in StandingsPanel: display name → Jolpica constructorId (F1 only)
- Zustand: `selectedTeam: SelectedTeam | null`, `openTeam(team)`, `closeTeam()` — transient, not persisted
- carNumber parsed in StandingsPanel via regex `/#(\d+)/` on team name string

### Series branches
- `series === 'f1'` → fetch `/api/f1/constructor/${ref}` → `TeamProfile`
- All other series → skip fetch (`setProfile(null); setLoading(false)`); render from store data only

### Hero (h-56)
- Same gradient, scan line, bottom fade, close button as DriverProfileOverlay
- **Left watermark**: team logo, opacity 0.10, radial-gradient mask
- **Right watermark**: `#${team.pos}` at fontSize 120, opacity 0.07, Orbitron
- No headshot — hero is pure gradient

### Series badge
- Series logo icon (13px) + `· CONSTRUCTOR` / `· TEAM` / `· ENTRY` / `· MANUFACTURER`
- Same opaque-logo filter logic as DriverProfileOverlay badge

### StatCards
- **2026 Season** (2-col): Position, Points — always shown for all series
- **Career** (3-col): Wins, Seasons, Since — F1 only (from API)

### InfoRow card
- **F1**: 2026 Drivers (full names joined with ` · `, Orbitron font). Nationality flag shown under team name (from API), NOT in InfoRow.
- **Non-F1 entry** (`t.driverNames` set): Drivers + Car # + Class
- **Non-F1 manufacturer** (no `driverNames`): no InfoRow card

### API Route: /api/f1/constructor/[constructorRef]/route.ts
```
runtime: nodejs
Cache-Control: no-store

Parallel fetches (Promise.all):
  /constructors/${ref}.json                            → name, nationality
  /constructors/${ref}/results/1.json?limit=1          → MRData.total = career wins
  /constructors/${ref}/seasons.json?limit=100          → SeasonTable.Seasons.length = seasons count
  /2026/constructors/${ref}/constructorStandings.json  → current pos + points
  /2026/constructors/${ref}/drivers.json               → 2026 driver list

seasons: use SeasonTable.Seasons.length (same reason as driver — MRData.total overcounts)
firstSeason: SeasonTable.Seasons[0].season
```

## Important: Next.js Version Warning
This is Next.js 16.2.6 — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
