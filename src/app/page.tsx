import { Suspense } from 'react';
import { getUpcomingEvents, getFeaturedEvent } from '@/lib/events';
import { NEWS_ITEMS } from '@/data/news-2026';
import Dashboard from '@/components/Dashboard';

// ISR: regenerate the page every 2 minutes so event states stay fresh
export const revalidate = 120;

export default async function Home() {
  const [featured, upcoming] = await Promise.all([
    getFeaturedEvent(),
    getUpcomingEvents(30),
  ]);

  return (
    <Suspense>
      <Dashboard featured={featured ?? null} upcoming={upcoming} news={NEWS_ITEMS} />
    </Suspense>
  );
}
