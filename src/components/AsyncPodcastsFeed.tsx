import { getPodcasts } from '@/lib/podcasts';
import PodcastsFeed from '@/components/PodcastsFeed';

export default async function AsyncPodcastsFeed() {
  const items = await getPodcasts(20);
  if (items.length === 0) return null;
  return <PodcastsFeed items={items} />;
}
