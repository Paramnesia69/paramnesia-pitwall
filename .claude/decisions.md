# Key Decisions & Constraints — PARAMNESIA PITWALL

## User Context
- Based in Israel — all times shown in **Israel Time (Asia/Jerusalem)** — this is hardcoded, not configurable
- Motorsport fan who wants a personal premium dashboard, not a generic admin tool

## Data Policy
- **REAL data only** — NEVER invent race events, standings, results, news items, or session times
- Calendar, results, standings, news are manually maintained in `src/data/*.ts`
- Overrides in `src/data/overrides.json` for admin corrections
- Sources for results: formula1.com, motogp.com, fiawec.com, wrc.com, imsa.com, europeanlemansseries.com, Wikipedia

## Architecture Decisions
| Decision | Choice | Reason |
|---|---|---|
| Rendering | ISR (2min revalidate) | Fresh data without SSR cold-start cost; Vercel free tier compatible |
| Client data | useLiveData polls /api/events | Keeps page live without full reload; tab-visible only saves battery |
| State | Zustand + persist | Overlay (selectedEventId) must be accessible across component tree; URL alone insufficient |
| Timezone | Asia/Jerusalem hardcoded | User is Israeli; localization adds complexity for no benefit |
| Images | `unoptimized: true` | Vercel image optimization has quota limits; logos/circuits are already small |
| CSS | Tailwind v4 (`@import "tailwindcss"` + `@theme inline`) | No tailwind.config.js — breaking change from v3 |
| Weather | OpenWeatherMap with simulated fallback | Real data preferred; simulated (lat/lng based) when no key or rate limited |

## Logo System Decisions
| Decision | Choice | Reason |
|---|---|---|
| F1 logos | Official white WebPs from media.formula1.com | Highest quality, pre-rendered white, perfect for dark bg |
| Non-F1 car logos | car-logos-dataset badge PNGs | Transparent bg, badge-only (no text), good for small sizes |
| Motorcycle logos | Wikimedia SVGs + per-brand cssFilter | No car-logos-dataset equivalent for bikes |
| Ducati SVG | No filter, show naturally | SVG already contains red+white fills — correct brand colours |
| Aprilia/Yamaha SVGs | sepia+hue-rotate tint | Black-fill SVGs — tint to approximate brand colour |
| Brand PNG filter | `brightness(1.6) saturate(2.5) contrast(1.2)` | Preserves vivid colours without blowing out (brightness(4) did) |
| F1 context flag | `getTeamLogo(name, true)` | F1 teams need white logos in F1 contexts, brand logos in WEC/DTM contexts |

## UI Philosophy (NON-NEGOTIABLE)
- **Cinematic, premium, immersive, restrained** — NOT generic admin dashboard
- Dark-first design with glassmorphism (`.pw-glass` utility)
- Series accent colors drive every card's personality — never generic gray
- Animations: reinforce hierarchy, improve immersion, subtle at idle, intentional
- NO excessive glow, NO visual clutter, NO fake futuristic aesthetics
- Motion: Framer Motion springs only — `stiffness: 150–300, damping: 20–30`

## Architecture Protection Rules
- Frontend NEVER directly fetches from external providers (F1 timing, etc.)
- Normalization layer (`getEventsWithState`) must remain server-side
- No duplicate state management — one Zustand store, one truth
- No websockets — polling is sufficient and simpler
- Business logic stays in `src/lib/`, never in components
- Components are pure presentation + local interaction only

## CSS & Component Patterns
- TiltCard has `overflow-hidden` — all absolute-positioned watermarks must fit inside card
- Card uniform height: `h-full` must chain through StaggerItem → EventCard div → TiltCard
- Logo watermarks: absolute positioned, z-index 0, pointer-events-none, opacity 0.06–0.10
- Non-transparent series logos: always apply `filter: grayscale(1) contrast(2) brightness(3)`, `mixBlendMode: screen`, and `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)`

## External CDN
- F1 circuit maps: `https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/{Name}_Circuit.png`
- Remote pattern whitelisted in `next.config.mjs`
- Helper: `getCircuitImage(name)` in `src/lib/images.ts`
