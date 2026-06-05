import type { HighlightItem, SeriesId } from '@/types';
import { HIGHLIGHTS_FALLBACK } from '@/data/highlights-2026';
import { parseAtomEntries } from '@/lib/rss';
import { cached } from '@/lib/cache';

interface ChannelConfig {
  channelId: string;
  source: string;
  series: SeriesId[];
}

/** Official series YouTube channels — IDs verified live (2026-06-06). */
const YT_CHANNELS: ChannelConfig[] = [
  { channelId: 'UCB_qr75-ydFVKSF9Dmo6izg', source: 'FORMULA 1', series: ['f1'] },
  { channelId: 'UC8pYaQzbBBXg9GIOHRvTmDQ', source: 'MotoGP', series: ['motogp'] },
  { channelId: 'UCwU7U7PiarcJKLjDJTnANjw', source: 'FIA WEC', series: ['wec'] },
  { channelId: 'UC9D9hRoUT2OatfVtmnOBXzg', source: 'IMSA', series: ['imsa'] },
  { channelId: 'UC5G6kTnHXDz0WIBC2VGBOqg', source: 'FIA WRC', series: ['wrc'] },
  { channelId: 'UCwKq447rYMVI5dAQWMmFnfg', source: 'DTM', series: ['dtm'] },
  { channelId: 'UC-yHapH6mW1ceZ_5PDUf1_g', source: 'GT World', series: ['gtwce'] },
  { channelId: 'UCU8C8RqGhqH4nhk4mlN1Vwg', source: 'European Le Mans Series', series: ['elms'] },
  { channelId: 'UCKgMzHVA7nsDsDEKKMc9bKA', source: '24h Nürburgring', series: ['nurburgring'] },
];

/** Titles that read like actual highlight/recap reels — prioritised over generic uploads */
const HIGHLIGHT_RE =
  /highlight|recap|best (?:moments|bits)|top \d+|race start|extended|final day|huge moments|race \d/i;

function feedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

async function fetchChannel(ch: ChannelConfig): Promise<HighlightItem[]> {
  const res = await fetch(feedUrl(ch.channelId), {
    next: { revalidate: 600 },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PitwallBot/1.0)' },
  });
  if (!res.ok) throw new Error(`${ch.channelId} → ${res.status}`);

  const xml = await res.text();
  const entries = parseAtomEntries(xml)
    .filter((e) => e.videoId && e.title)
    .slice(0, 15)
    .map(
      (e): HighlightItem => ({
        id: `yt-${ch.series[0]}-${e.videoId}`,
        videoId: e.videoId,
        title: e.title,
        thumbnailUrl: `https://i.ytimg.com/vi/${e.videoId}/hqdefault.jpg`,
        publishedAt: e.published
          ? new Date(e.published).toISOString()
          : new Date().toISOString(),
        source: ch.source,
        series: ch.series,
      }),
    );

  // Prefer genuine highlight reels; if a channel has none recent, show its latest uploads.
  const reels = entries.filter((e) => HIGHLIGHT_RE.test(e.title));
  return reels.length > 0 ? reels.slice(0, 6) : entries.slice(0, 3);
}

/**
 * Latest race highlights across all official series channels.
 * Falls back to the static HIGHLIGHTS_FALLBACK if every feed fails.
 */
export async function getHighlights(limit = 24): Promise<HighlightItem[]> {
  return cached('highlights:all', 600, async () => {
    const results = await Promise.allSettled(YT_CHANNELS.map(fetchChannel));
    const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

    if (all.length === 0) return HIGHLIGHTS_FALLBACK.slice(0, limit);

    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      if (seen.has(item.videoId)) return false;
      seen.add(item.videoId);
      return true;
    });

    return deduped
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  });
}
