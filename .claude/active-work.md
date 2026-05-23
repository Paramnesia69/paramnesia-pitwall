# Active Work — PARAMNESIA PITWALL

## Last Commit
`f51a9d1` — Replace Box Box photos with F1 CDN circuit maps and faded series logos
- Added `src/lib/images.ts` (getCircuitImage → F1 CDN URLs)
- Updated `src/components/ui/CircuitStatsPanel.tsx` to use CDN circuit maps
- Added F1 CDN remote pattern to `next.config.mjs`

## Uncommitted Changes (as of last session)

### `public/logos/gtwce.png` — REPLACED
- Old: SRO Fanatec logo with ugly gray/white non-transparent background (57KB)
- New: Clean "GT WORLD CHALLENGE" transparent PNG downloaded from vhv.rs (27KB)
- Source: `https://www.vhv.rs/dpng/d/439-4390084_gt-world-challenge-logo-hd-png-download.png`
- Status: File replaced, NOT YET committed or verified in browser

### `src/components/cards/EventCard.tsx` — MODIFIED
Changes:
1. Added `h-full` to outer wrapper div (uniform card height)
2. Added faded series logo watermark with mask-image:
   - `w-36 h-36`, `right-4 top-1/2 -translate-y-1/2`, `opacity: 0.10`
   - `filter: grayscale(1) brightness(3)`, `mixBlendMode: screen`
   - `maskImage: radial-gradient(ellipse at center, black 30%, transparent 70%)`

### `src/components/cards/HeroCard.tsx` — MODIFIED
- Logo watermark: `right-4`, 45% width, max 420px, `opacity: 0.06`
- Filter: `grayscale(1) contrast(2) brightness(3)`, `mixBlendMode: screen`

### `src/components/EventDetailOverlay.tsx` — MODIFIED
- Logo watermark filter updated to include `contrast(2)` and `mixBlendMode: screen`

### `src/components/Dashboard.tsx` — MODIFIED
- Added `className="h-full"` to `<StaggerItem>` for uniform card heights

## Immediate Next Steps
1. **Verify** GTWCE logo looks correct in browser (navigate to localhost:3000, find GT World Challenge card)
2. **Commit** all uncommitted changes: logo + card height + watermark improvements
3. **Push** to GitHub so Vercel deploys match local

## Open Questions / Pending Decisions
- Should Porsche Supercup logo opacity be tuned further? (currently 0.10, was 0.06)
- Consider applying `contrast(2)` to EventCard watermarks for consistency with HeroCard (currently EventCard omits it, uses mask instead)
- nurburgring.jpg also has non-transparent background — verify it renders acceptably with current mask approach

## Session Bootstrap Reminder
- Dev server runs on port 3000 (PID varies; `lsof -i :3000` to check)
- `npm run dev` in `/Users/paramnesia/Documents/Claude/paramnesia-pitwall/`
- Vercel auto-deploys from GitHub `main` branch
- No `.env.local` needed for basic features; OPENWEATHERMAP_API_KEY optional
