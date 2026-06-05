import type { NormalizedNewsItem, SeriesId } from '@/types';
import { NEWS_ITEMS } from '@/data/news-2026';
import { parseRssItems } from '@/lib/rss';

interface FeedConfig {
  url: string;
  source: string;
  series: SeriesId[];
}

const FEEDS: FeedConfig[] = [
  { url: 'https://www.motorsport.com/rss/f1/news/', source: 'Motorsport.com', series: ['f1'] },
  { url: 'https://www.motorsport.com/rss/wec/news/', source: 'Motorsport.com', series: ['wec'] },
  { url: 'https://www.motorsport.com/rss/motogp/news/', source: 'Motorsport.com', series: ['motogp'] },
  { url: 'https://www.motorsport.com/rss/wrc/news/', source: 'Motorsport.com', series: ['wrc'] },
  { url: 'https://www.motorsport.com/rss/imsa/news/', source: 'Motorsport.com', series: ['imsa'] },
  { url: 'https://www.the-race.com/feed/', source: 'The Race', series: ['f1'] },
];

async function fetchFeed(feed: FeedConfig): Promise<NormalizedNewsItem[]> {
  const res = await fetch(feed.url, {
    next: { revalidate: 120 },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PitwallBot/1.0)' },
  });

  if (!res.ok) throw new Error(`${feed.url} → ${res.status}`);

  const xml = await res.text();
  const raw = parseRssItems(xml);

  return raw
    .filter((item) => item.link && item.title)
    .slice(0, 12)
    .map((item) => ({
      id: `rss-${feed.series[0]}-${item.guid || item.link}`,
      title: item.title,
      summary: item.description.slice(0, 220),
      url: item.link,
      imageUrl: item.enclosureUrl || item.mediaContentUrl || undefined,
      source: feed.source,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      series: feed.series,
    }));
}

/**
 * Fetch live motorsport news from RSS feeds.
 * Falls back to the static NEWS_ITEMS if all fetches fail.
 */
export async function getNews(limit = 40): Promise<NormalizedNewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  // Fall back to static data if every feed failed
  if (all.length === 0) return NEWS_ITEMS.slice(0, limit);

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return deduped
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
