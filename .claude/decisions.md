# Key Decisions & Constraints — PARAMNESIA PITWALL

## User Context
- Based in Israel — all times shown in **Israel Time (Asia/Jerusalem)** — this is hardcoded, not configurable
- Motorsport fan who wants a personal premium dashboard, not a generic admin tool

## Data Policy
- **REAL data only** — NEVER invent race events, standings, results, news items, or session times
- Calendar, results, standings, news are manually maintained in `src/data/*.ts`
- Overrides in `src/data/overrides.json` for admin corrections
- Sources for results/standings: formula1.com, motogp.com, fiawec.com, wrc.com, imsa.com, europeanlemansseries.com, Wikipedia

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
| F1 event state | OpenF1 `date_end` overrides time-based guess | `computeState()` uses startTime+3h fallback; OpenF1 posts real end time — checked in `getEventsWithState()` for any live F1 event, revalidate 60s, silent fail |

## Logo System Decisions
| Decision | Choice | Reason |
|---|---|---|
| F1 logos | Official white WebPs from media.formula1.com | Highest quality, pre-rendered white, perfect for dark bg |
| Non-F1 car logos | car-logos-dataset badge PNGs | Transparent bg, badge-only (no text), good for small sizes |
| Motorcycle logos | Wikimedia SVGs + per-brand cssFilter | No car-logos-dataset equivalent for bikes |
| Ducati SVG | No filter, show naturally | SVG already contains red+white fills — correct brand colours |
| Aprilia SVG | `sepia+hue-rotate` → red tint | Black-fill SVG — tint to approximate brand colour |
| Yamaha SVG | `brightness(0) invert(1) opacity(0.85)` → white | Black-fill SVG — inverted to white wordmark, not red |
| Brand PNG default (cards/results/overlay) | `brightness(1.6) saturate(2.5) contrast(1.2)` opacity 1 | Vivid colours for card/results context |
| Brand PNG default (StandingsPanel) | `brightness(1.1) saturate(1.4) contrast(1.0)` opacity 0.95 | Intentionally muted — logos sit in a dense table, not a hero card |
| F1 context flag | `getTeamLogo(name, true)` | F1 teams need white logos in F1 contexts, brand logos in WEC/DTM contexts |
| Mercedes-AMG, McLaren, Audi | `brightness(0) invert(1) opacity(0.85)` | Black-fill badges → white on dark bg |
| Peugeot | `brightness(0) invert(1) opacity(0.9)` | bg-stripped black shield → white; visible on dark bg |
| Genesis | `brightness(1.8) contrast(1.2)` | Chrome emblem — boost but preserve metallic look |
| Porsche brand PNG | `brightness(1.1) saturate(1.8) contrast(1.05)` | Dark gold badge — gentle boost to preserve gold tones without blowing out |
| AF Corse / Vista AF | Mapped to brand-ferrari.png | AF Corse and Vista AF run Ferrari cars |
| `png: true` flag | Set on all brand PNG entries | Components use it to render PNGs larger than SVG moto logos |

## Class Plate Badge Decisions
| Decision | Choice | Reason |
|---|---|---|
| LMP2 colour | Blue (#1E4B8C) | Official ELMS race number plate colour for LMP2 |
| LMP3 colour | Purple (#4A2090) | Official ELMS race number plate colour for LMP3 |
| LMGT3 colour | Green (#1A6B38) | Official ELMS race number plate colour for LMGT3 |
| LMGT3 badge layout | Two-line "LM / GT3" | Matches official ACO/ELMS badge design |
| Hypercar (WEC) | Text badge only | No standard visual plate available |
| WEC LMGT3 | Same badge as ELMS LMGT3 | Class is identical across both series |

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
- **CRITICAL — client→route import ban**: Client components (`'use client'`) must NEVER import anything (even `import type`) from `src/app/api/**`. Turbopack resolves the full module graph and pulls server-only modules (`next/server`) into the client bundle → runtime crash ("This page couldn't load"). **Fix pattern**: shared interfaces live in `src/types/index.ts`; route files import FROM `@/types`; components import FROM `@/types`. Direction is always one-way: types → routes & types → components. Learned from Phase 4 incident (2026-06-05).
- **CRITICAL — Zustand object selector ban**: NEVER write `useStore((s) => ({ a: s.a, b: s.b }))`. Object literal selector returns a new reference on every call; Zustand uses `Object.is` equality → always re-renders → React error #185 in production (infinite loop). Always split into individual calls: `const a = useStore(s => s.a)`. Use `useShallow` from `zustand/react/shallow` only if object grouping is genuinely required. Learned from Phase 4 crash (2026-06-05).

## Logo & Watermark System — FINAL (2026-06-13)
**This supersedes conflicting details in the older Phase B/C and "Logo System Decisions" notes below.** The whole-app visual pass landed here; current truth:
- **All series logos render in NATURAL brand colours** — filter bar (Dashboard), standings series tabs (StandingsPanel SeriesTabButton), Mini-Leaderboard, and `SeriesEmblem`. Only Porsche (`/logos/porsche.svg`, dark-fill) gets `brightness(0) invert(1)`. The old `grayscale(1) contrast(2) brightness(3)` + `mixBlendMode: screen` + radial-mask stack was REMOVED everywhere — it crushed red logos (F1, GT, IMSA) to black. Reference = the event-card series watermark (natural, just opacity). Do NOT reintroduce grayscale/screen on logos.
- **CircuitEmblem** (`ui/CircuitEmblem.tsx`) = small **frameless white track silhouette** (`getCircuitFilter()` now returns a uniform `brightness(0) invert(1)`), placed inline by the circuit/event name on Hero, EventCard, RecentResults, ThisWeekend, MiniLeaderboard. ~28–48px, opacity ~0.5–0.62.
- **SeriesEmblem** (`ui/SeriesEmblem.tsx`) = natural-colour series logo, mirrors CircuitEmblem on RecentResults (right of the name, ~38px). Porsche-only invert.
- **Circuit SVGs are all cleaned** (corner numbers/markers stripped) + stroke-capped at **1.05% of viewBox** (thin/premium; only thins, never fattens — Nordschleife stays delicate). Shanghai replaced from Wikimedia ("Circuit Shanghai.svg"); Portimão (algarve) dots stripped. All 41 render as uniform thin white tracks via the CSS filter.
- **Logo asset fixes**: `gtwce-v2.png` (GT bg stripped → transparent), `dtm-v2.svg` (black bg rect removed), `imsa.svg` kept full (natural). `f1.svg` is red `#EE0000` (needs natural or invert, never grayscale).
- **Event-card series watermark** = bottom-centre faded logo, `bottom-14 w-[145px] h-[73px] opacity-0.15` (bumped from 0.07). Hero keeps its big right-side faded series logo, `top-1/2 -translate-y-1/2` (vertical-centre, unchanged — looks high only on sparse min-height cards).
- **Favicon** = `src/app/icon.png` (Next canonical, content-hashed → defeats the cached square). Round yin-yang, corners transparent. icon-192/512-v3.png (manifest, purpose "any") + favicon-32.png.
- **ReminderButton dropdown is portalled** to `document.body` with fixed positioning (z-400), so card `overflow:hidden` can't clip it (it felt unclickable before). Outside-click ignores the bell + the portal menu.

## Watermark System (Phase B/C, 2026-06-13) — partly superseded by the FINAL note above
Fixed non-uniform, content-covered circuit marks. Key rules:
- **Series logo watermark is the hero/card brand mark — KEEP IT.** Hero = big faded series logo on the right (the primary watermark; user explicitly wants F1 etc. there, it outranks the circuit). EventCard = same faded series logo background-right. Do NOT remove these — a prior attempt to drop them in favour of a circuit watermark was rejected.
- **Circuit = small framed emblem, NOT a background watermark.** The circuit map is a `CircuitEmblem` chip (full colour via `getCircuitFilter`, glass border, ~38–44px) paired with the circuit name on Hero / EventCard / RecentResults. "Small and tucked" — never a large background element competing with the series logo.
- Colored maps are preserved (F1 sector colours etc.) — do NOT normalize circuits to white silhouettes (Phase A normalization was rejected; the colourful maps are wanted).
- Placement helpers `.pw-wm-lane-tr` / `.pw-wm-lane-r` + `--pw-wm-opacity` exist in globals.css for any directional background mark; `getCircuitFilter(img)` in `images.ts` centralizes the dark/vivid/base filter triad.

## Card Design & Typography (2026-06-13)
The premium card language, established on EventCard and being rolled out to the other main cards:
- **Title = Orbitron** (`var(--font-orbitron), var(--pw-font-display)`), the racy display face — matches the hero. Use for short titles (race names); body text (circuit/place) stays Geist sans.
- **Times = Orbitron tabular** (`tabular-nums`, `var(--font-orbitron), var(--pw-font-mono)`).
- **Sessions = 2-column aligned grid** (`grid grid-cols-2 gap-2`), each cell = name (left) + Orbitron time + reminder bell (right); live cell accent-tinted. Replaced the ragged inline flex-wrap. Session-progress dots removed.
- **Series-logo watermark = bottom-centre, faded.** EventCard: `absolute left-1/2 -translate-x-1/2 bottom-14 w-[145px] h-[73px] opacity-0.07` — present but never covers text (was center-right covering the session times). Porsche SVG still inverted.
- **Circuit = frameless CircuitEmblem** beside the name (unified thin white silhouette).
- Highlights cards: user considers them "perfect" — restyle ONLY the bottom title text to the new type, keep the rest identical.

## CSS & Component Patterns
- TiltCard has `overflow-hidden` — all absolute-positioned watermarks must fit inside card
- Card uniform height: `h-full` must chain through StaggerItem → EventCard div → TiltCard
- Logo watermarks: absolute positioned, z-index 0, pointer-events-none, opacity 0.12–0.18
- **Series logo watermarks** show in natural brand colors — NO filter, NO `mixBlendMode`. Just the raw logo at low opacity + `maskImage: radial-gradient(ellipse at center, black 50%, transparent 85%)`. Porsche SVG only exception: `brightness(0) invert(1)` to make dark fill white.
- **Circuit map watermarks** — NO filter, opacity 0.22–0.28, NO `mixBlendMode`. Wikimedia SVGs use gray (#646464) main track + coloured sectors; `brightness(3)` destroys those colours. White-stroke SVGs like Le Mans also look correct at this opacity without a filter.
- Never add `mixBlendMode: screen` to watermarks — iOS Safari drops it inside stacking contexts (backdrop-filter + overflow:hidden + border-radius), causing cross-platform inconsistency.
- ClassSection `badgeSrc` prop: use `<img>` at `height: 20px` — the SVG viewBox handles proportions

## Circuit Maps
- All circuit maps are self-hosted Wikimedia Commons SVGs under `/public/circuits/`
- `getCircuitImage(name)` in `src/lib/images.ts` is a flat lookup table → local paths only
- No external CDN remote patterns needed in `next.config.mjs`

## Framer Motion LazyMotion (Phase D, 2026-06-12)
- All client components import `m as motion` from framer-motion (NOT the full `motion` proxy) — JSX stays `motion.div`.
- `MotionProvider` in layout.tsx wraps the app in `<LazyMotion strict>` with the feature pack loaded **async** (`src/lib/motionFeatures.ts` re-exports `domMax`) so it stays out of the initial bundle.
- `domMax` (not domAnimation) is required — mobile bottom sheets use drag.
- `strict` throws at runtime if a full `motion.*` component is reintroduced — when adding new animated components, always `import { m as motion }`.

## Testing & Data Validation (Phase D, 2026-06-12)
- Vitest (`npm test`). **The CI gate is the "Run tests" step in `.github/workflows/deploy.yml`** — the deploy pipeline is GH Actions → `vercel build` (runs `next build` directly, npm prebuild does NOT fire) → `vercel deploy --prebuilt`. The `prebuild` npm hook only covers local `npm run build`.
- `tests/data-validation.test.ts` zod-validates calendar/results/standings (unique ids, ISO dates, 2-letter country codes, sequential podium/pos, non-increasing points).
- Time-dependent tests (clinch, conflicts) pin the clock with `vi.setSystemTime`.

## Framer Motion v12 Collapse Wrappers
- **NEVER use `transitionEnd: { overflow: 'visible' }`** for `height: 'auto'` collapse animations — it does not reliably fire in FM v12, leaving the wrapper permanently `overflow: hidden` and clipping box-shadows of edge-column cards.
- **Correct pattern**: `useRef<HTMLDivElement>` + `onAnimationStart → hidden` + `onAnimationComplete → visible` + pre-set `hidden` synchronously in the toggle handler before collapse begins. This bypasses FM's value system entirely.
- Also keep `body { overflow-x: hidden }` **removed** — it clipped card shadows at the viewport edge, causing an unnatural hard cut instead of a smooth fade.
