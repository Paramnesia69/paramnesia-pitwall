# Architecture — PARAMNESIA PITWALL

## Stack
- **Next.js 16.2.6** (Turbopack) — App Router, RSC, ISR (`export const revalidate = 120`)
- **Tailwind v4** — `@import "tailwindcss"` + `@theme inline {}` (NO `tailwind.config.js`)
- **Framer Motion** — animations only; never for layout
- **Zustand** + persist middleware — client state (localStorage key: `pitwall-store`)
- **Deployment**: Vercel + GitHub (auto-deploy on push to main)
- `images: { unoptimized: true }` in next.config.mjs (required for Vercel static export compat)

## Folder Structure
```
src/
├── app/
│   ├── page.tsx              # SSR entry: fetches featured + upcoming events, ISR 2min
│   ├── layout.tsx            # Root layout: fonts, theme, AmbientBackground
│   ├── globals.css           # Design tokens (--pw-*), Tailwind v4 @theme, .pw-glass
│   └── api/
│       ├── events/route.ts   # /api/events — polled by useLiveData every 2min
│       ├── weather/route.ts  # /api/weather — OpenWeatherMap proxy
│       ├── calendar/route.ts # /api/calendar — ICS feed (254 sessions, ?series= filter)
│       ├── og/route.ts       # /api/og?event=<id> — 1200×630 PNG OpenGraph card
│       └── openf1/
│           └── timing/route.ts # /api/openf1/timing?eventId= — F1 live timing proxy
├── components/
│   ├── Dashboard.tsx         # Client shell: series filter, event grid, lazy-loaded panels
│   │                         # Series order: F1→WEC→ELMS→IMSA→Nürburgring→MotoGP→GTWCE→DTM→WRC→Porsche
│   ├── EventDetailOverlay.tsx # Right-panel slide-out (framer spring), Escape key, backdrop click
│   ├── StandingsPanel.tsx    # Championship standings; tabs: F1/WEC/ELMS/IMSA/MotoGP/DTM/WRC
│   │                         # Multi-class sections via ClassSection (badgeSrc prop for plate SVGs)
│   ├── RecentResults.tsx     # Podium cards grid; filterable by series; manufacturer logos
│   ├── NewsFeed.tsx          # RSS news feed with static fallback; filterable
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
│       └── F1TimingPanel.tsx # Fetches /api/openf1/timing; polls 45s when live
├── data/
│   ├── calendar-2026.ts      # Static race calendar (REAL data, never invented)
│   ├── news-2026.ts          # Static news fallback items
│   ├── results-2026.ts       # Race results: F1/MotoGP/WEC/WRC/IMSA/ELMS
│   ├── standings-2026.ts     # Standings: F1/MotoGP/WEC (Hypercar+LMGT3)/ELMS (3 classes)/IMSA/DTM/WRC
│   └── overrides.json        # Manual admin overrides (note, state, streamLinks, featured)
├── lib/
│   ├── events.ts             # getEventsWithState, getUpcomingEvents, getFeaturedEvent
│   ├── teamLogos.ts          # Logo resolution — see Logo System below
│   ├── weather.ts            # fetchWeather (OpenWeatherMap), getSimulatedWeather fallback
│   ├── overrides.ts          # applyOverrides, getForcedFeaturedId
│   ├── circuitStats.ts       # getCircuitStats(name) → CircuitStats | null
│   ├── images.ts             # getCircuitImage(name) → F1 CDN URL
│   ├── streamLinks.ts        # getStreamLinks(series) → StreamLink[]
│   ├── useLiveData.ts        # Polls /api/events every 2min, tab-visibility aware
│   ├── useReminders.ts       # Browser notification scheduler
│   └── useSW.ts              # Service worker registration + update detection
├── store/index.ts            # Zustand store (see Data Models)
└── types/index.ts            # All shared types + SERIES_META

public/
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
  theme: 'dark'|'light', toggleTheme,
  reminders: Reminder[], addReminder, removeReminder, markFired, getReminder, clearExpiredReminders }
```
Persisted: `favorites`, `theme`, `reminders`

## Data Flow
```
CALENDAR_2026 (static)
  → getEventsWithState() [ISR 2min, server]
  → applyOverrides() [overrides.json]
  → fetchWeather() → OpenWeatherMap (parallel, max 15 events)
  → page.tsx renders Dashboard with SSR props
  → useLiveData polls /api/events every 2min (client, tab-visible only)
  → Dashboard re-renders with live data
```

## CSS Patterns
- **Design tokens**: `var(--pw-bg-primary)`, `var(--pw-glass-bg)`, `var(--pw-accent)` — all in globals.css
- **Glass cards**: `.pw-glass` utility class
- **Series watermarks** (non-transparent logos): `filter: grayscale(1) contrast(2) brightness(3)` + `mixBlendMode: screen` + `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)`
- **TiltCard**: has `overflow-hidden` on inner div — clips absolute-positioned children at card boundary
- **Uniform card height**: requires `h-full` chain → `StaggerItem` → `EventCard` outer div → `TiltCard`

## Important: Next.js Version Warning
This is Next.js 16.2.6 — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
