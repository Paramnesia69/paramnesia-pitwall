# Active Work — PARAMNESIA PITWALL

## Last Commits (session 2026-05-23)
`296d68d` — feat: OpenGraph preview cards per event
- `/api/og?event=<id>` → 1200×630 PNG, series accent color, Inter Bold TTF
- `generateMetadata` in `page.tsx` wires `og:image` + `twitter:card` per `?event=` param
- Inter Bold TTF (326KB) bundled in `public/fonts/inter-bold.ttf` (downloaded from Google Fonts CDN)
- Generic fallback card for no/invalid event

`7cee973` — ci: trigger deployment with refreshed Vercel token (empty commit)

All commits pushed. Vercel deployment in progress.

## Verified This Session
- OG route: returns valid 1200×630 PNG for F1, WEC, and fallback
- Series accent colors work (red for F1, blue for WEC)
- Font: real Inter Bold TTF (not corrupt HTML — previous download was broken)
- `generateMetadata` wired: `?event=f1-2026-05-22-canadian-grand-prix` sets correct og:image URL

## Font Note
`public/fonts/inter-bold.ttf` was initially downloaded as HTML (curl without redirects).
Fixed by fetching from Google Fonts with Android User-Agent to get TTF format, then curl -L to actual gstatic URL.

## IMPORTANT: Launch Directory
**Always launch Claude Code from inside the project folder:**
```
cd /Users/paramnesia/Documents/Claude/paramnesia-pitwall
claude
```

## Backlog (prioritized)
1. ~~**OpenGraph preview cards**~~ ✅ DONE
2. **News feed — live RSS** — hardcoded content aging; hook into Autosport/Motorsport.com RSS
3. **ICS calendar feed** — one-click `.ics` subscribe so races land in Google/Apple Calendar
4. **Nürburgring/Nordschleife split** — both series share `nurburgring.jpg`; Nordschleife may need its own logo
5. **Porsche Carrera Cup** — verify calendar has events (same logo/accent as Supercup)
6. **Live timing (OpenF1)** — free API, no key; real lap data + session info for F1

## Session Bootstrap Reminder
- Dev server: `npm run dev` in this directory (port 3000)
- Preview tool: `.claude/launch.json` — use `preview_start("pitwall-dev")` to register
- Vercel auto-deploys on push to `main` via GitHub Actions
- No `.env.local` needed for basic features; OPENWEATHERMAP_API_KEY optional
