import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getUpcomingEvents, getFeaturedEvent } from '@/lib/events';
import { getNews } from '@/lib/news';
import { CALENDAR_2026 } from '@/data/calendar-2026';
import { SERIES_META } from '@/types';
import Dashboard from '@/components/Dashboard';

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

export default async function Home() {
  const [featured, upcoming, news] = await Promise.all([
    getFeaturedEvent(),
    getUpcomingEvents(30),
    getNews(40),
  ]);

  return (
    <Suspense>
      <Dashboard featured={featured ?? null} upcoming={upcoming} news={news} />
    </Suspense>
  );
}
