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
│   ├── Dashboard.tsx         # Client shell: filters, grid, lazy-loaded panels
│   ├── EventDetailOverlay.tsx # Right-panel slide-out (framer spring, Escape key)
│   ├── HeroCard.tsx          # Featured event hero (motion.section)
│   ├── StandingsPanel.tsx    # Championship standings tab switcher (F1/MotoGP/WEC/WRC/IMSA/DTM)
│   ├── RecentResults.tsx     # Podium cards grid; filterable by series
│   ├── NewsPanel.tsx         # RSS news feed with static fallback
│   ├── cards/
│   │   ├── EventCard.tsx     # Grid card (memo, TiltCard wrapper, h-full)
│   │   └── TiltCard.tsx      # 3D tilt on hover (overflow-hidden, h-full)
│   ├── motion/
│   │   ├── FadeIn.tsx        # Simple opacity fade wrapper
│   │   └── StaggerGrid.tsx   # Grid with staggered children (StaggerItem = motion.div)
│   └── ui/                   # Atomic: Countdown, WeatherBadge, ReminderButton, F1TimingPanel, etc.
│       └── F1TimingPanel.tsx # Fetches /api/openf1/timing; polls 45s when live
├── data/
│   ├── calendar-2026.ts      # Static race calendar (REAL data, never invented)
│   ├── news-2026.ts          # Static news fallback items
│   ├── results-2026.ts       # Race results: F1/MotoGP/WEC/WRC/IMSA/ELMS
│   ├── standings-2026.ts     # Standings: F1/MotoGP/WEC/WRC/IMSA/DTM
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
```

## Logo System (src/lib/teamLogos.ts)

```ts
interface TeamLogoInfo {
  src: string;
  white: boolean;      // true = F1 white WebP — opacity only
  cssFilter?: string;  // if set, use directly in img style; overrides default
}

getTeamLogo(teamName: string, f1Context = false): TeamLogoInfo | null
```

Three tiers (resolved in order):
1. **F1 official white WebPs** (f1Context=true) → `white: true` → `opacity: 0.95`
   - Files: `public/logos/constructors/f1-{team}.webp` (11 teams, from media.formula1.com)
2. **Motorcycle SVGs** (SVG_MOTO_MAP) → `cssFilter` per logo:
   - Ducati family → `ducati.svg` (red+white fills, no filter — show naturally)
   - Aprilia/Trackhouse → `aprilia.svg` (black fill → sepia+hue-rotate to red)
   - Yamaha → `yamaha.svg` (black fill → sepia+hue-rotate to blue)
3. **Brand PNGs** (MFR_MAP, car-logos-dataset) → no cssFilter → default filter:
   - `filter: brightness(1.6) saturate(2.5) contrast(1.2)` — vivid colours without washing

Component rendering pattern (StandingsPanel, F1TimingPanel, RecentResults):
```tsx
logo.white           → { opacity: 0.95 }
logo.cssFilter!=null → { filter: logo.cssFilter, opacity: 0.92 }
default              → { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }
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
```

## SERIES_META (src/types/index.ts)
```ts
SERIES_META: Record<SeriesId, { name: string; accent: string; logo?: string }>
```
SeriesIds: `f1 wec imsa elms motogp wrc gtwce dtm porsche-supercup porsche-carrera nurburgring nordschleife lemans`
Series logos in `/public/logos/` — SVGs are transparent; gtwce.png, wec.png, elms.png, nurburgring.jpg are NOT transparent

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
- **Design tokens**: `var(--pw-bg-primary)`, `var(--pw-glass-bg)`, `var(--pw-accent)` etc — all in globals.css
- **Glass cards**: `.pw-glass` utility class
- **Series watermarks** (non-transparent series logos): `filter: grayscale(1) contrast(2) brightness(3)` + `mixBlendMode: screen` + `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)`
- **TiltCard**: has `overflow-hidden` on inner div — clips absolute-positioned children at card boundary
- **Uniform card height**: requires `h-full` chain → `StaggerItem` → `EventCard` outer div → `TiltCard`

## Important: Next.js Version Warning
This is Next.js 16.2.6 — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
