'use client';

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { NormalizedRaceEvent, SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import { getThisWeekendEvents } from '@/lib/weekend';
import { getWeekendConflicts } from '@/lib/conflicts';
import HeroCard from '@/components/cards/HeroCard';
import EventCard from '@/components/cards/EventCard';
import ThisWeekend from '@/components/ThisWeekend';
import ShareButton from '@/components/ui/ShareButton';
import { useStore } from '@/store';
import ThemeToggle from '@/components/ui/ThemeToggle';
import FadeIn from '@/components/motion/FadeIn';
import { StaggerGrid, StaggerItem } from '@/components/motion/StaggerGrid';
import { useServiceWorker } from '@/lib/useSW';
import { useLiveData } from '@/lib/useLiveData';
import { useReminderScheduler } from '@/lib/useReminders';
import InstallPrompt from '@/components/ui/InstallPrompt';
import UpdateBanner from '@/components/ui/UpdateBanner';
import LiveIndicator from '@/components/ui/LiveIndicator';
import type { RaceResult } from '@/types';
import { ALL_RESULTS_2026 } from '@/data/results-2026';
import { getLiveSessions } from '@/lib/useLiveSessions';
import WhatsLiveBadge from '@/components/ui/WhatsLiveBadge';
import MiniLeaderboard from '@/components/MiniLeaderboard';
import NextAlarmBadge from '@/components/ui/NextAlarmBadge';
import OfflineBadge from '@/components/ui/OfflineBadge';
import Toaster from '@/components/ui/Toaster';
import SpoilerShieldToggle from '@/components/ui/SpoilerShieldToggle';
import PanelBoundary from '@/components/PanelBoundary';

/* ── Lazy-loaded below-fold components ──────────── */
const StandingsPanel = lazy(() => import('@/components/StandingsPanel'));
const RecentResults = lazy(() => import('@/components/RecentResults'));
const DiaryView = lazy(() => import('@/components/DiaryView'));
const UpcomingTimeline = lazy(() => import('@/components/UpcomingTimeline'));
const EventDetailOverlay = lazy(() => import('@/components/EventDetailOverlay'));
const RaceWeekendOverlay = lazy(() => import('@/components/RaceWeekendOverlay'));
const DriverProfileOverlay = lazy(() => import('@/components/DriverProfileOverlay'));
const TeamProfileOverlay   = lazy(() => import('@/components/TeamProfileOverlay'));
const Footer = lazy(() => import('@/components/Footer'));
const SeasonRing = lazy(() => import('@/components/ui/SeasonRing'));
const CommandPalette = lazy(() => import('@/components/CommandPalette'));

const ALL_SERIES: SeriesId[] = [
  'f1', 'wec', 'elms', 'imsa', 'nurburgring', 'motogp', 'gtwce', 'dtm', 'wrc', 'porsche-supercup',
];

interface DashboardProps {
  featured: NormalizedRaceEvent | null;
  upcoming: NormalizedRaceEvent[];
  seasonStats: Record<string, { total: number; finished: number }>;
  newsFeedSlot?: React.ReactNode;
  highlightsSlot?: React.ReactNode;
  podcastsSlot?: React.ReactNode;
}

export default function Dashboard({ featured, upcoming, seasonStats, newsFeedSlot, highlightsSlot, podcastsSlot }: DashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial filter from URL ?series=f1
  const initialFilter = (() => {
    const param = searchParams.get('series');
    if (param && ALL_SERIES.includes(param as SeriesId)) return param as SeriesId;
    return 'all' as const;
  })();

  const [activeFilter, setActiveFilter] = useState<SeriesId | 'all'>(initialFilter);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { hasUpdate, applyUpdate } = useServiceWorker();

  // Live polling — replaces SSR props with fresh API data every 2 min
  const live = useLiveData(upcoming, featured);

  // Schedule browser notifications for active reminders
  useReminderScheduler();
  const liveUpcoming = live.events;
  const liveFeatured = live.featured;

  // Deep link: auto-open event overlay from ?event= URL param
  const openEvent = useStore((s) => s.openEvent);
  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && liveUpcoming.some((e) => e.id === eventParam)) {
      openEvent(eventParam);
    }
    // Only run once on mount + when events load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveUpcoming.length]);

  // Deep link: auto-open result overlay from ?result= URL param
  const openResult = useStore((s) => s.openResult);
  useEffect(() => {
    const resultParam = searchParams.get('result');
    if (resultParam) {
      const found = ALL_RESULTS_2026.find((r: RaceResult) => r.id === resultParam);
      if (found) openResult(found);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filter → URL (without full navigation)
  const updateFilter = useCallback((filter: SeriesId | 'all') => {
    setActiveFilter(filter);
    const url = new URL(window.location.href);
    if (filter === 'all') {
      url.searchParams.delete('series');
    } else {
      url.searchParams.set('series', filter);
    }
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return liveUpcoming;
    return liveUpcoming.filter((e) => e.series === activeFilter);
  }, [liveUpcoming, activeFilter]);

  const weekendEvents = useMemo(() => {
    const all = getThisWeekendEvents(liveUpcoming);
    if (activeFilter === 'all') return all;
    return all.filter((e) => e.series === activeFilter);
  }, [liveUpcoming, activeFilter]);

  // Schedule conflicts among favorited series this weekend (computed on the full set)
  const favorites = useStore((s) => s.favorites);
  const conflicts = useMemo(
    () => getWeekendConflicts(liveUpcoming, favorites),
    [liveUpcoming, favorites],
  );

  const cardEvents = filtered.slice(0, 9);
  const timelineEvents = filtered.slice(9, 20);

  // Live sessions across all series — consumed by WhatsLiveBadge + MiniLeaderboard
  const liveSessions = useMemo(() => getLiveSessions(liveUpcoming), [liveUpcoming]);

  // Sync active series accent to CSS var so AmbientBackground reacts
  useEffect(() => {
    const accent = activeFilter === 'all' ? '#E10600' : SERIES_META[activeFilter].accent;
    document.documentElement.style.setProperty('--pw-series-accent', accent);
  }, [activeFilter]);

  return (
    <>
    {/* PWA banners */}
    {hasUpdate && <UpdateBanner onUpdate={applyUpdate} />}
    <InstallPrompt />
    <OfflineBadge />

    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      {/* ── Top Bar ──────────────────────────── */}
      <FadeIn delay={0}>
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-8 rounded-full"
              style={{ background: 'var(--pw-accent)' }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h1 className="text-xl sm:text-2xl font-bold tracking-[0.15em] uppercase">
              PARAMNESIA <span style={{ color: 'var(--pw-accent)' }}>PITWALL</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--pw-text-secondary)' }}>
            <LiveIndicator lastUpdated={live.lastUpdated} isRefreshing={live.isRefreshing} onRefresh={live.refresh} />
            <NextAlarmBadge />
            <span className="hidden sm:inline tracking-widest text-xs uppercase">Motorsport Command Center</span>
            <button
              onClick={() => setPaletteOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ background: 'var(--pw-glass-bg)', border: '1px solid var(--pw-glass-border)', color: 'var(--pw-text-tertiary)' }}
              title="Search (⌘K)"
              aria-label="Search events, drivers, teams"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <SpoilerShieldToggle />
            <ThemeToggle />
            <ShareButton />
          </div>
        </header>
      </FadeIn>

      {/* ── Category Selector ────────────────── */}
      <FadeIn delay={0.05}>
        <nav
          className="flex gap-2 overflow-x-auto pb-3 mb-8 sticky z-[100]"
          style={{
            top: 'env(safe-area-inset-top)',
            scrollbarWidth: 'none',
            maskImage: 'linear-gradient(to right, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 88%, transparent 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(6, 6, 11, 0.82)',
            borderBottom: '1px solid var(--pw-glass-border)',
            paddingTop: '10px',
            marginLeft: '-16px',
            marginRight: '-16px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {/* All Series pill — text only */}
          <motion.button
            className="px-4 py-2 min-h-11 sm:min-h-0 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              background: activeFilter === 'all' ? 'var(--pw-accent)' : 'var(--pw-glass-bg)',
              border: `1px solid ${activeFilter === 'all' ? 'var(--pw-accent)' : 'var(--pw-glass-border)'}`,
              color: activeFilter === 'all' ? '#fff' : 'var(--pw-text-secondary)',
            }}
            onClick={() => updateFilter('all')}
            whileTap={{ scale: 0.95 }}
          >
            All Series
          </motion.button>

          {/* Per-series logo buttons */}
          {ALL_SERIES.map((id) => {
            const isActive = activeFilter === id;
            const meta = SERIES_META[id];
            // Porsche + F1 are dark/red-fill SVGs that the grayscale+brightness
            // filter crushes to near-black — invert them to a white silhouette instead
            // Porsche, F1, GT World Challenge are dark/red-fill logos the
            // grayscale+brightness filter crushes to near-black — invert to a
            // white silhouette (like the result-card series emblem) instead
            const invertWhite = meta.logo === '/logos/porsche.svg'
              || meta.logo === '/logos/f1.svg'
              || meta.logo === '/logos/gtwce-v2.png'
              || meta.logo === '/logos/imsa-v2.svg';
            const logoFilter = invertWhite
              ? 'brightness(0) invert(1)'
              : 'grayscale(1) contrast(2) brightness(3)';
            return (
              <motion.button
                key={id}
                className="relative flex-shrink-0 rounded-xl overflow-hidden h-11 sm:h-10"
                style={{
                  width: 72,
                  background: isActive ? `${meta.accent}22` : 'var(--pw-glass-bg)',
                  border: `1px solid ${isActive ? meta.accent : 'var(--pw-glass-border)'}`,
                  boxShadow: isActive ? `0 0 18px ${meta.accent}44` : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                }}
                onClick={() => updateFilter(isActive ? 'all' : id)}
                whileTap={{ scale: 0.95 }}
                title={meta.name}
              >
                {meta.logo ? (
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0.6,
                      maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
                      WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <div className={id === 'nurburgring' || id === 'nordschleife' ? 'absolute inset-0' : 'absolute inset-2'}>
                      <Image
                        src={meta.logo}
                        alt={meta.name}
                        fill
                        className="object-contain"
                        style={{
                          filter: logoFilter,
                          mixBlendMode: 'screen',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: isActive ? meta.accent : 'var(--pw-text-secondary)' }}
                  >
                    {meta.name}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </FadeIn>

      {/* ── Hero Featured Event ──────────────── */}
      {activeFilter === 'all'
        ? liveFeatured && <HeroCard event={liveFeatured} />
        : filtered[0] && <HeroCard event={filtered[0]} />
      }

      {/* ── This Weekend ─────────────────────── */}
      {weekendEvents.length > 0 && (
        <ThisWeekend events={weekendEvents} conflicts={conflicts} />
      )}

      {/* ── Season Progress ──────────────────── */}
      <Suspense>
        <SeasonRing stats={seasonStats} activeFilter={activeFilter} />
      </Suspense>

      {/* ── Championship Standings ─────────────── */}
      {(activeFilter === 'all' || ['f1','wec','elms','imsa','motogp','dtm','wrc'].includes(activeFilter)) && (
        <PanelBoundary label="Championship standings">
          <Suspense>
            <StandingsPanel
              key={activeFilter}
              defaultTab={activeFilter !== 'all' ? activeFilter as 'f1'|'wec'|'elms'|'imsa'|'motogp'|'dtm'|'wrc' : undefined}
            />
          </Suspense>
        </PanelBoundary>
      )}

      {/* ── Recent Results ──────────────────── */}
      <PanelBoundary label="Recent results">
        <Suspense>
          <RecentResults activeFilter={activeFilter} />
        </Suspense>
      </PanelBoundary>

      {/* ── Race Highlights — streamed from server ── */}
      <PanelBoundary label="Race highlights">{highlightsSlot}</PanelBoundary>

      {/* ── Race Diary — your watched/rated races ── */}
      <PanelBoundary label="Race diary">
        <Suspense>
          <DiaryView activeFilter={activeFilter} />
        </Suspense>
      </PanelBoundary>

      {/* ── Latest News — streamed from server ── */}
      <PanelBoundary label="News feed">{newsFeedSlot}</PanelBoundary>

      {/* ── Podcasts — streamed from server ── */}
      <PanelBoundary label="Podcasts">{podcastsSlot}</PanelBoundary>

      {/* ── Event Cards Grid ─────────────────── */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-[var(--pw-accent)]" />
          <h3
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'var(--pw-text-tertiary)' }}
          >
            {activeFilter === 'all' ? 'Upcoming Events' : `${SERIES_META[activeFilter].name} — Upcoming`}
            <span className="ml-2 font-mono">({filtered.length})</span>
          </h3>
          <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        <StaggerGrid
          key={activeFilter}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {cardEvents.map((event) => (
            <StaggerItem key={event.id} className="aspect-square">
              <EventCard event={event} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
            No upcoming events for this series.
          </p>
        </motion.div>
      )}

      {/* ── Upcoming Timeline ────────────────── */}
      {timelineEvents.length > 0 && (
        <Suspense>
          <UpcomingTimeline events={timelineEvents} />
        </Suspense>
      )}

      <Suspense>
        <EventDetailOverlay events={liveUpcoming} />
      </Suspense>
      <Suspense>
        <RaceWeekendOverlay />
      </Suspense>
      <Suspense>
        <DriverProfileOverlay />
      </Suspense>
      <Suspense>
        <TeamProfileOverlay />
      </Suspense>
      <Suspense>
        <CommandPalette
          events={liveUpcoming}
          open={paletteOpen}
          onOpen={() => setPaletteOpen(true)}
          onClose={() => setPaletteOpen(false)}
        />
      </Suspense>

      <Suspense>
        <Footer />
      </Suspense>
    </main>

    {/* ── Ambient live features ─── outside <main> so they sit above all content */}
    <AnimatePresence>
      {liveSessions.length > 0 && <WhatsLiveBadge key="wlb" sessions={liveSessions} />}
    </AnimatePresence>
    <AnimatePresence>
      {liveSessions.length > 0 && <MiniLeaderboard key="mlb" sessions={liveSessions} />}
    </AnimatePresence>
    <Toaster />
    </>
  );
}
