import type { NormalizedNewsItem, SeriesId } from '@/types';
import { NEWS_ITEMS } from '@/data/news-2026';

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

/** Strip HTML tags and decode basic HTML entities */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Extract text content of an XML tag, handling CDATA */
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

/** Extract an attribute value from a self-closing or open tag */
function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

interface RawItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  imageUrl: string;
}

function parseItems(xml: string): RawItem[] {
  const items: RawItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];

    // <link> in RSS is often bare text between tags (not an attribute)
    const linkMatch = block.match(/<link>([^<]+)<\/link>/) ||
      block.match(/<link\s+href="([^"]+)"/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    items.push({
      title: stripHtml(extractTag(block, 'title')),
      link,
      description: stripHtml(extractTag(block, 'description')),
      pubDate: extractTag(block, 'pubDate'),
      guid: extractTag(block, 'guid'),
      imageUrl:
        extractAttr(block, 'enclosure', 'url') ||
        extractAttr(block, 'media:content', 'url') ||
        '',
    });
  }

  return items;
}

async function fetchFeed(feed: FeedConfig): Promise<NormalizedNewsItem[]> {
  const res = await fetch(feed.url, {
    next: { revalidate: 120 },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PitwallBot/1.0)' },
  });

  if (!res.ok) throw new Error(`${feed.url} → ${res.status}`);

  const xml = await res.text();
  const raw = parseItems(xml);

  return raw
    .filter((item) => item.link && item.title)
    .slice(0, 12)
    .map((item) => ({
      id: `rss-${feed.series[0]}-${item.guid || item.link}`,
      title: item.title,
      summary: item.description.slice(0, 220),
      url: item.link,
      imageUrl: item.imageUrl || undefined,
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
