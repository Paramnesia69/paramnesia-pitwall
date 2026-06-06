import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getEventsWithState, deriveFeaturedEvent, deriveUpcomingEvents } from '@/lib/events';
import { CALENDAR_2026 } from '@/data/calendar-2026';
import { SERIES_META } from '@/types';
import Dashboard from '@/components/Dashboard';
import AsyncNewsFeed from '@/components/AsyncNewsFeed';
import AsyncHighlightsFeed from '@/components/AsyncHighlightsFeed';
import AsyncPodcastsFeed from '@/components/AsyncPodcastsFeed';

// ISR: regenerate the page every 2 minutes so event states stay fresh
export const revalidate = 120;

const SITE_URL = 'https://paramnesia-pitwall.vercel.app';

type Props = {
  searchParams: Promise<{ event?: string; series?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { event: eventId } = await searchParams;

  if (eventId) {
    const event = CALENDAR_2026.find((e) => e.id === eventId);
    if (event) {
      const meta = SERIES_META[event.series];
      const title = `${event.name} — PARAMNESIA PITWALL`;
      const description = `${meta.name} · ${event.circuit.name}, ${event.circuit.country}`;
      const ogImage = `${SITE_URL}/api/og?event=${encodeURIComponent(eventId)}`;

      return {
        title,
        openGraph: {
          title,
          description,
          url: `${SITE_URL}/?event=${encodeURIComponent(eventId)}`,
          images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [ogImage],
        },
      };
    }
  }

  // No event param — fall back to layout.tsx static metadata
  return {};
}

function FeedSkeleton() {
  return (
    <div className="mt-10 mb-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 rounded-full bg-[var(--pw-glass-border)]" />
        <div className="h-3 w-32 rounded bg-[var(--pw-glass-border)]" />
        <div className="flex-1 h-px bg-[var(--pw-glass-border)]" />
      </div>
      <div className="grid gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="pw-glass h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const events = await getEventsWithState();
  const featured = deriveFeaturedEvent(events);
  const upcoming = deriveUpcomingEvents(events);

  const seasonStats = events.reduce<Record<string, { total: number; finished: number }>>((acc, e) => {
    if (!acc[e.series]) acc[e.series] = { total: 0, finished: 0 };
    acc[e.series].total++;
    if (e.state === 'finished') acc[e.series].finished++;
    return acc;
  }, {});

  const newsFeedSlot = (
    <Suspense fallback={<FeedSkeleton />}>
      <AsyncNewsFeed />
    </Suspense>
  );

  const highlightsSlot = (
    <Suspense fallback={<FeedSkeleton />}>
      <AsyncHighlightsFeed />
    </Suspense>
  );

  const podcastsSlot = (
    <Suspense fallback={<FeedSkeleton />}>
      <AsyncPodcastsFeed />
    </Suspense>
  );

  return (
    <Suspense>
      <Dashboard
        featured={featured ?? null}
        upcoming={upcoming}
        seasonStats={seasonStats}
        newsFeedSlot={newsFeedSlot}
        highlightsSlot={highlightsSlot}
        podcastsSlot={podcastsSlot}
      />
    </Suspense>
  );
}
