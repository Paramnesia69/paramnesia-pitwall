/**
 * Shared RSS / Atom parsing helpers.
 *
 * Used by news.ts (RSS), podcasts.ts (RSS + enclosures) and highlights.ts
 * (YouTube Atom). Kept dependency-free (regex-based) to match the existing
 * lightweight approach — no XML library, works at the edge.
 */

/** Strip HTML tags and decode basic HTML entities */
export function stripHtml(html: string): string {
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
export function extractTag(xml: string, tag: string): string {
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

/** Extract an attribute value from a self-closing or open tag */
export function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

// ─── RSS 2.0 <item> ──────────────────────────────────────────────────────────

export interface RawRssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  enclosureUrl: string;
  enclosureType: string;
  mediaContentUrl: string;
  itunesImage: string;
  duration: string;
}

export function parseRssItems(xml: string): RawRssItem[] {
  const items: RawRssItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];

    // <link> in RSS is often bare text between tags (not an attribute)
    const linkMatch =
      block.match(/<link>([^<]+)<\/link>/) || block.match(/<link\s+href="([^"]+)"/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    items.push({
      title: stripHtml(extractTag(block, 'title')),
      link,
      description: stripHtml(extractTag(block, 'description')),
      pubDate: extractTag(block, 'pubDate'),
      guid: extractTag(block, 'guid'),
      enclosureUrl: extractAttr(block, 'enclosure', 'url'),
      enclosureType: extractAttr(block, 'enclosure', 'type'),
      mediaContentUrl: extractAttr(block, 'media:content', 'url'),
      itunesImage: extractAttr(block, 'itunes:image', 'href'),
      duration: extractTag(block, 'itunes:duration'),
    });
  }

  return items;
}

/** Channel-level artwork — first <itunes:image href> or <image><url> before the items */
export function extractChannelImage(xml: string): string {
  const head = xml.split('<item')[0];
  const itunes = head.match(/<itunes:image[^>]*\shref="([^"]+)"/i);
  if (itunes) return itunes[1];
  const img = head.match(/<image>[\s\S]*?<url>([^<]+)<\/url>/i);
  return img ? img[1].trim() : '';
}

// ─── Atom <entry> (YouTube) ──────────────────────────────────────────────────

export interface RawAtomEntry {
  videoId: string;
  title: string;
  published: string;
  description: string;
}

export function parseAtomEntries(xml: string): RawAtomEntry[] {
  const entries: RawAtomEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRe.exec(xml)) !== null) {
    const block = match[1];
    entries.push({
      videoId: extractTag(block, 'yt:videoId'),
      title: stripHtml(extractTag(block, 'title')),
      published: extractTag(block, 'published'),
      description: stripHtml(extractTag(block, 'media:description')),
    });
  }

  return entries;
}
