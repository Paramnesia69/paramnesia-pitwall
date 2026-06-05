import type { PodcastEpisode, SeriesId } from '@/types';
import { PODCASTS_FALLBACK } from '@/data/podcasts-2026';
import { parseRssItems, extractChannelImage } from '@/lib/rss';
import { cached } from '@/lib/cache';

interface PodcastConfig {
  url: string;
  source: string;
  series: SeriesId[];
}

/** Official / established motorsport podcast feeds — verified to carry .mp3 enclosures (2026-06-06). */
const PODCAST_FEEDS: PodcastConfig[] = [
  {
    url: 'https://feeds.acast.com/public/shows/the-race-f1-podcast',
    source: 'The Race F1 Podcast',
    series: ['f1'],
  },
  {
    url: 'https://feeds.acast.com/public/shows/the-race-motogp-podcast',
    source: 'The Race MotoGP Podcast',
    series: ['motogp'],
  },
  {
    url: 'https://radiolemans.co/category/midweek-motorsport/feed/',
    source: 'Midweek Motorsport',
    series: ['wec', 'imsa', 'elms'],
  },
  {
    url: 'https://rss.art19.com/spinning-the-line',
    source: 'SPIN, The Rally Pod',
    series: ['wrc'],
  },
];

function isAudio(url: string, type: string): boolean {
  return /^audio\//i.test(type) || /\.mp3(\?|$)/i.test(url);
}

async function fetchFeed(feed: PodcastConfig): Promise<PodcastEpisode[]> {
  const res = await fetch(feed.url, {
    next: { revalidate: 1800 },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PitwallBot/1.0)' },
  });
  if (!res.ok) throw new Error(`${feed.url} → ${res.status}`);

  const xml = await res.text();
  const channelImage = extractChannelImage(xml);

  return parseRssItems(xml)
    .filter((item) => item.title && isAudio(item.enclosureUrl, item.enclosureType))
    .slice(0, 6)
    .map(
      (item): PodcastEpisode => ({
        id: `pod-${feed.series[0]}-${item.guid || item.enclosureUrl}`,
        title: item.title,
        audioUrl: item.enclosureUrl,
        durationLabel: item.duration || undefined,
        imageUrl: item.itunesImage || channelImage || undefined,
        publishedAt: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        source: feed.source,
        series: feed.series,
      }),
    );
}

/**
 * Latest motorsport podcast episodes across all configured shows.
 * Falls back to the static PODCASTS_FALLBACK if every feed fails.
 */
export async function getPodcasts(limit = 20): Promise<PodcastEpisode[]> {
  return cached('podcasts:all', 1800, async () => {
    const results = await Promise.allSettled(PODCAST_FEEDS.map(fetchFeed));
    const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

    if (all.length === 0) return PODCASTS_FALLBACK.slice(0, limit);

    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      if (seen.has(item.audioUrl)) return false;
      seen.add(item.audioUrl);
      return true;
    });

    return deduped
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  });
}
