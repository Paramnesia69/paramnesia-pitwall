# Architecture — PARAMNESIA PITWALL

## Stack
- **Next.js 16.2.6** (Turbopack) — App Router, RSC, ISR (`export const revalidate = 120`)
- **Tailwind v4** — `@import "tailwindcss"` + `@theme inline {}` (NO `tailwind.config.js`)
- **Framer Motion** — animations only; never for layout
- **Zustand** + persist middleware — client state (localStorage key: `pitwall-store`)
- **Deployment**: Vercel + GitHub (auto-deploy on push)
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
│       └── weather/route.ts  # /api/weather — OpenWeatherMap proxy
├── components/
│   ├── Dashboard.tsx         # Client shell: filters, grid, lazy-loaded panels
│   ├── EventDetailOverlay.tsx # Right-panel slide-out (framer spring, Escape key)
│   ├── HeroCard.tsx          # Featured event hero (motion.section)
│   ├── cards/
│   │   ├── EventCard.tsx     # Grid card (memo, TiltCard wrapper, h-full)
│   │   └── TiltCard.tsx      # 3D tilt on hover (overflow-hidden, h-full)
│   ├── motion/
│   │   ├── FadeIn.tsx        # Simple opacity fade wrapper
│   │   └── StaggerGrid.tsx   # Grid with staggered children (StaggerItem = motion.div)
│   └── ui/                   # Atomic UI: Countdown, WeatherBadge, ReminderButton, etc.
├── data/
│   ├── calendar-2026.ts      # Static race calendar (REAL data, never invented)
│   ├── news-2026.ts          # Static news items
│   ├── results-2026.ts       # Recent race results
│   ├── standings-2026.ts     # Championship standings
│   └── overrides.json        # Manual admin overrides (note, state, streamLinks, featured)
├── lib/
│   ├── events.ts             # getEventsWithState, getUpcomingEvents, getFeaturedEvent
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
```

## SERIES_META (src/types/index.ts)
```ts
SERIES_META: Record<SeriesId, { name: string; accent: string; logo?: string }>
```
SeriesIds: `f1 wec imsa elms motogp wrc gtwce dtm porsche-supercup porsche-carrera nurburgring nordschleife lemans`
Logos in `/public/logos/` — SVGs are transparent; gtwce.png, wec.png, elms.png, nurburgring.jpg are NOT transparent

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
- **Non-transparent logos**: use `filter: grayscale(1) contrast(2) brightness(3)` + `mixBlendMode: screen` + CSS `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)`
- **TiltCard**: has `overflow-hidden` on inner div — clips absolute-positioned children at card boundary
- **Uniform card height**: requires `h-full` chain → `StaggerItem` → `EventCard` outer div → `TiltCard` (already h-full)

## Important: Next.js Version Warning
This is Next.js 16.2.6 — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
