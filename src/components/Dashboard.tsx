'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import type { NormalizedRaceEvent, SeriesId } from '@/types';
import { SERIES_META } from '@/types';
import { getThisWeekendEvents } from '@/lib/weekend';
import HeroCard from '@/components/cards/HeroCard';
import EventCard from '@/components/cards/EventCard';
import ThisWeekend from '@/components/ThisWeekend';
import UpcomingTimeline from '@/components/UpcomingTimeline';
import EventDetailOverlay from '@/components/EventDetailOverlay';
import StandingsPanel from '@/components/StandingsPanel';
import NewsFeed from '@/components/NewsFeed';
import RecentResults from '@/components/RecentResults';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ui/ShareButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import FadeIn from '@/components/motion/FadeIn';
import { StaggerGrid, StaggerItem } from '@/components/motion/StaggerGrid';
import { useServiceWorker } from '@/lib/useSW';
import { useLiveData } from '@/lib/useLiveData';
import InstallPrompt from '@/components/ui/InstallPrompt';
import UpdateBanner from '@/components/ui/UpdateBanner';
import LiveIndicator from '@/components/ui/LiveIndicator';
import type { NormalizedNewsItem } from '@/types';

const ALL_SERIES: SeriesId[] = [
  'f1', 'wec', 'imsa', 'motogp', 'wrc', 'gtwce', 'elms', 'dtm', 'nurburgring', 'porsche-supercup',
];

interface DashboardProps {
  featured: NormalizedRaceEvent | null;
  upcoming: NormalizedRaceEvent[];
  news: NormalizedNewsItem[];
}

export default function Dashboard({ featured, upcoming, news }: DashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial filter from URL ?series=f1
  const initialFilter = (() => {
    const param = searchParams.get('series');
    if (param && ALL_SERIES.includes(param as SeriesId)) return param as SeriesId;
    return 'all' as const;
  })();

  const [activeFilter, setActiveFilter] = useState<SeriesId | 'all'>(initialFilter);
  const { hasUpdate, applyUpdate } = useServiceWorker();

  // Live polling — replaces SSR props with fresh API data every 2 min
  const live = useLiveData(upcoming, featured);
  const liveUpcoming = live.events;
  const liveFeatured = live.featured;

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

  const weekendEvents = useMemo(() => getThisWeekendEvents(liveUpcoming), [liveUpcoming]);

  const cardEvents = filtered.slice(0, 9);
  const timelineEvents = filtered.slice(9, 20);

  return (
    <>
    {/* PWA banners */}
    {hasUpdate && <UpdateBanner onUpdate={applyUpdate} />}
    <InstallPrompt />

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
            <span className="hidden sm:inline tracking-widest text-xs uppercase">Motorsport Command Center</span>
            <ThemeToggle />
            <ShareButton />
          </div>
        </header>
      </FadeIn>

      {/* ── Category Selector ────────────────── */}
      <FadeIn delay={0.05}>
        <nav className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <motion.button
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
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
          {ALL_SERIES.map((id) => {
            const isActive = activeFilter === id;
            return (
              <motion.button
                key={id}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: isActive ? `${SERIES_META[id].accent}25` : 'var(--pw-glass-bg)',
                  border: `1px solid ${isActive ? SERIES_META[id].accent : 'var(--pw-glass-border)'}`,
                  color: isActive ? SERIES_META[id].accent : 'var(--pw-text-secondary)',
                }}
                onClick={() => updateFilter(isActive ? 'all' : id)}
                whileTap={{ scale: 0.95 }}
              >
                {SERIES_META[id].name}
              </motion.button>
            );
          })}
        </nav>
      </FadeIn>

      {/* ── Hero Featured Event ──────────────── */}
      {liveFeatured && activeFilter === 'all' && <HeroCard event={liveFeatured} />}

      {/* ── This Weekend ─────────────────────── */}
      {activeFilter === 'all' && weekendEvents.length > 0 && (
        <ThisWeekend events={weekendEvents} />
      )}

      {/* ── Championship Standings ─────────────── */}
      {activeFilter === 'all' && <StandingsPanel />}

      {/* ── Recent Results ──────────────────── */}
      <RecentResults activeFilter={activeFilter} />

      {/* ── Latest News ─────────────────────── */}
      {news.length > 0 && <NewsFeed items={news} activeFilter={activeFilter} />}

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
            <StaggerItem key={event.id}>
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
        <UpcomingTimeline events={timelineEvents} />
      )}

      <EventDetailOverlay events={liveUpcoming} />

      <Footer />
    </main>
    </>
  );
}
