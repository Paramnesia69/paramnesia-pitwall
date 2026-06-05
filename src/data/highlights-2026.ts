import type { HighlightItem } from '@/types';

/**
 * Static fallback highlight videos — used only if every YouTube feed fails.
 * REAL videos captured from the official series channels (2026-06-05/06).
 * Thumbnails derive from the videoId, so they never 404.
 */
function thumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export const HIGHLIGHTS_FALLBACK: HighlightItem[] = [
  {
    id: 'yt-f1-QkDLMiOsdhA',
    videoId: 'QkDLMiOsdhA',
    title: 'FP2 Highlights | 2026 Monaco Grand Prix',
    thumbnailUrl: thumb('QkDLMiOsdhA'),
    publishedAt: '2026-06-05T00:00:00Z',
    source: 'FORMULA 1',
    series: ['f1'],
  },
  {
    id: 'yt-motogp-XXpqO5N6yTs',
    videoId: 'XXpqO5N6yTs',
    title: 'What We Learned on Friday | 2026 Hungarian GP',
    thumbnailUrl: thumb('XXpqO5N6yTs'),
    publishedAt: '2026-06-05T19:28:41Z',
    source: 'MotoGP',
    series: ['motogp'],
  },
  {
    id: 'yt-wec-B0pUeoFI-T4',
    videoId: 'B0pUeoFI-T4',
    title: 'Le Mans Delivers DRAMA — 10 Huge Moments | FIA WEC',
    thumbnailUrl: thumb('B0pUeoFI-T4'),
    publishedAt: '2026-06-05T16:00:23Z',
    source: 'FIA WEC',
    series: ['wec'],
  },
  {
    id: 'yt-wrc-2jWo4-rOwGo',
    videoId: '2jWo4-rOwGo',
    title: 'WRC2 Event Highlights | WRC FORUM8 Rally Japan',
    thumbnailUrl: thumb('2jWo4-rOwGo'),
    publishedAt: '2026-06-02T00:00:00Z',
    source: 'FIA WRC',
    series: ['wrc'],
  },
  {
    id: 'yt-gtwce-pc3cSyLIbzw',
    videoId: 'pc3cSyLIbzw',
    title: 'POSTCARD | LIQUI MOLY GT Festival The Bend | 2026',
    thumbnailUrl: thumb('pc3cSyLIbzw'),
    publishedAt: '2026-06-05T10:05:08Z',
    source: 'GT World',
    series: ['gtwce'],
  },
  {
    id: 'yt-elms-NRRwzBkyN3U',
    videoId: 'NRRwzBkyN3U',
    title: 'Exclusive Interview with Doriane Pin | ELMS',
    thumbnailUrl: thumb('NRRwzBkyN3U'),
    publishedAt: '2026-06-04T18:00:16Z',
    source: 'European Le Mans Series',
    series: ['elms'],
  },
];
