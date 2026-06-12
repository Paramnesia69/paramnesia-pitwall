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

### Live Intelligence & Personal Layer (Phases 1–4+)
Race Diary (watched toggle + star rating + notes), Conflict Detector, Watched State (dim + checkmark), Mini-Leaderboard (fixed bottom strip, z-190), What's Live Badge (floating pill, z-200), Driver Profiles (DriverProfileOverlay, Jolpica + OpenF1 headshot), Points Trajectory chart (ChampionshipChart.tsx, top-6), Teammate H2H (/api/f1/h2h, Jolpica qualifying), Team/Constructor Profiles (TeamProfileOverlay, Jolpica)

**Driver Profile details (DriverProfileOverlay.tsx):** Covers F1 + MotoGP. Badge = series logo icon + `· DRIVER` / `· RIDER` (uses `SERIES_META[series].logo`, opaque-logo filter for WEC/ELMS/GTWCE). Nationality flag sits inline next to driver name (no Nationality InfoRow). Hero: team logo watermark + race number watermark + scan line + headshot. StatCards: F1 → Position/Points (2-col) + Wins/Seasons/Number (3-col); MotoGP → Position/Points (2-col) + Wins/Titles/Number (3-col, Wins = feature race wins, Titles = championships). InfoRow card: Born only (date in Orbitron, no Nationality row). F1 data: Jolpica `Cache-Control: no-store`; MotoGP data: static `src/lib/motogpRiders.ts` via `/api/motogp/rider/[ref]`. Seasons = actual array length (not MRData.total). MotoGP headshots: `null` (motogp.com is JS-rendered).

**Team Profile details (TeamProfileOverlay.tsx):** Covers F1 + MotoGP + WEC/ELMS/IMSA car entries + manufacturers. Badge = series logo icon + `· CONSTRUCTOR` / `· TEAM` / `· ENTRY` / `· MANUFACTURER`. Nationality flag shown under team name (from API for F1; omitted for non-F1). No Nationality InfoRow. Hero: team logo watermark (left) + `#pos` watermark (right) + scan line. Non-F1 series: skip API fetch entirely — render from store data (`driverNames`, `carNumber`, `seriesClass` passed via `openTeam()`). F1: Jolpica 5-parallel fetches, `Cache-Control: no-store`. InfoRow card: F1 shows 2026 Drivers; non-F1 entry shows Drivers + Car # + Class. `CONSTRUCTOR_REFS` map in StandingsPanel → Jolpica constructorId. Car entry click from WEC/ELMS/IMSA driver rows passes `driverNames` parsed from standings string, `carNumber` from regex `/#(\d+)/`.

### Media Layer (Phase 5)
Race Highlights (9 YouTube RSS feeds, inline lightbox player), Podcasts (4 RSS feeds with .mp3 enclosures, inline audio)

### Premium Layer (Phase C, 2026-06-12)
- **Spoiler Shield** — persisted store toggle (`spoilerShield`) + header eye button. Blurs podiums (RecentResults) and session results (RaceWeekendOverlay) behind a "tap to reveal" pill until the event is marked watched; hides standings DeltaBadges. `SpoilerBlur` wrapper component; per-card reveal is session-local state.
- **Clinch calculator** — `src/lib/clinch.ts`: F1 (25 + 8 sprint-weekend) + MotoGP (37/round) only; computes from live standings + remaining calendar races. Gold `ClinchBanner` above F1/MotoGP standings when status is 'champion' or 'next-round'. Strict `>` (ties go to countback). Hidden until mathematically relevant.
- **Command palette** — ⌘K/Ctrl+K or header search button. Fuzzy search (prefix > word-start > substring) across events (live props), F1/MotoGP drivers, F1 constructors, MotoGP teams → opens the matching overlay. `F1_CONSTRUCTOR_REFS` lives in `lib/f1DriverRefs.ts`. Lazy-loaded.
- **Web Push reminders** — fire with the site closed. Flow: ReminderButton → `lib/usePush.ts` subscribes PushManager (NEXT_PUBLIC_VAPID_PUBLIC_KEY) → POST `/api/push/subscribe` → Upstash Redis (`push:queue` zset by remindAt + `push:item:<id>` blobs, id = eventId::session::endpointHash) → GitHub Actions cron (*/5, `.github/workflows/push-dispatch.yml`) POSTs `/api/push/dispatch` with `x-cron-secret` → web-push VAPID send → sw.js existing push handler shows it. Dispatch route is middleware-exempt; secured by PUSH_CRON_SECRET (Vercel env + GH secret). Vercel Hobby crons are daily-only — that's why GH Actions drives it. Local notifications still work without Redis/push.

### Live & Feedback Layer (Phase B, 2026-06-12)
- **Endurance mode** — while an endurance race runs, HeroCard swaps the countdown (which targeted a past start time and rendered nothing) for `EnduranceTracker`: elapsed/remaining clocks + hour-tick progress bar ("Hour 7 of 24"). Duration parsed from official race names via `src/lib/endurance.ts` (`(\d+) hours?`, `24h`, word numbers, Rolex 24/Petit Le Mans special cases; names containing "quali" excluded — the N24 "24h Quali Race" is not 24h).
- **State fix (critical)** — `computeState`/session mapping in `lib/events.ts` now use the parsed endurance duration for race sessions instead of the 2–3h fallback that would have flipped a live Le Mans 24H to "finished" 21 hours early.
- **Live hero ambience** — hero accent gradient breathes (opacity 0.16→0.30, 9s ease-in-out loop) only when `event.state === 'live'`.
- **Toasts** — store slice `toast`/`showToast` (transient) + `Toaster` glass pill (bottom-center, z-290, 2.4s auto-dismiss, safe-area aware). Wired: reminder set/removed, favorite toggled, diary watched/rating.
- **Unified skeletons** — `.pw-skeleton` shimmer class in globals.css replaces all ad-hoc `animate-pulse` placeholders (Driver/Team overlays, StandingsPanel, F1TimingPanel, news FeedSkeleton).

### Mobile Foundation (Phase A, 2026-06-12)
- **Bottom-sheet overlays** — all four overlays (EventDetail, RaceWeekend, DriverProfile, TeamProfile) become full-width bottom sheets below `sm`: 92dvh, rounded top, SheetGrip drag handle, swipe-down dismiss. Desktop right slide-out unchanged. Shared logic: `useMobileSheet()` (drag via `useDragControls` + `dragListener: false` so inner scroll areas don't fight the gesture).
- **Safe-area insets** — `viewportFit: 'cover'` + `env(safe-area-inset-*)`: body L/R padding, fixed status-bar scrim in layout.tsx (height = inset-top, z-toast), sticky filter bar `top: env(...)`, MiniLeaderboard/WhatsLiveBadge/InstallPrompt bottom offsets, sheet bottom padding.
- **Standings mobile stack** — ExpandableGrid collapses `1fr|1px|1fr` to single column below `sm` (drivers above teams, divider hidden).
- **Touch parity** — TiltCard: no 3D tilt on `pointer: coarse` (iOS synthetic mouse events caused tilt jolts), `whileTap` scale instead; `active:` states on standings rows, reminder options, badge arrows.
- **Tap targets + legibility** — filter pills 44px tall on mobile; bell/star/arrow hit areas enlarged; overlay 9px labels render 10px below `sm`.

## Known Issues / Workarounds
- **Driver headshots** — Source is OpenF1 `headshot_url` (~100–130px native). Displayed at `maxHeight: 140`. F1 official CDN high-res path (`content/dam/fom-website/drivers/2026Drivers/`) does NOT exist — do not attempt again without a verified URL.
- `gtwce.png`, `wec.png`, `elms.png` have non-transparent backgrounds — opacity 0.18 + `maskImage: radial-gradient(ellipse at center, black 50%, transparent 85%)` keeps it acceptable. Never use `mixBlendMode: screen` — iOS Safari drops it inside stacking contexts.
- **Series watermarks** — no filter, natural brand colors, opacity 0.12–0.18, radial-gradient maskImage. Porsche SVG only: `brightness(0) invert(1)`.
- **Circuit map watermarks** — self-hosted Wikimedia SVGs, NO filter, opacity 0.22–0.28. 2022 F1 CourseLayout SVGs cleaned: DRS boxes, Speed Trap, and legend (アイコン group) all stripped. Only track + sector colours + corner numbers remain.
- Peugeot logo inverted (black shield → white); Aprilia/Yamaha tinted from black SVGs — not true brand colour; Porsche brand PNG gentle boost — not true gold. All acceptable.
- `images: { unoptimized: true }` required — no remote patterns needed (all circuit maps are self-hosted).
- Weather API calls capped at 15 concurrent (rate limit avoidance).
- TiltCard `overflow-hidden` clips absolute children — watermarks must fit within card bounds.
