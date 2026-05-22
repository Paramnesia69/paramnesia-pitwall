import { getUpcomingEvents, getFeaturedEvent } from '@/lib/events';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const featured = getFeaturedEvent() ?? null;
  const upcoming = getUpcomingEvents(30);

  return <Dashboard featured={featured} upcoming={upcoming} />;
}
