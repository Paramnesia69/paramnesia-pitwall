import { Suspense } from 'react';
import { getUpcomingEvents, getFeaturedEvent } from '@/lib/events';
import { NEWS_ITEMS } from '@/data/news-2026';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const featured = getFeaturedEvent() ?? null;
  const upcoming = getUpcomingEvents(30);

  return (
    <Suspense>
      <Dashboard featured={featured} upcoming={upcoming} news={NEWS_ITEMS} />
    </Suspense>
  );
}
