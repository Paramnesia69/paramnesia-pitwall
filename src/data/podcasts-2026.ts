import type { PodcastEpisode } from '@/types';

/**
 * Static fallback podcast episodes — used only if every podcast feed fails.
 * REAL episodes captured from the official show feeds (2026-06).
 */
export const PODCASTS_FALLBACK: PodcastEpisode[] = [
  {
    id: 'pod-f1-therace-monaco-day1',
    title: 'In-Car Insights: Jon and Scott debrief the first day of action in Monaco',
    audioUrl:
      'https://sphinx.acast.com/p/open/s/6819ae2bf30c20bff775e8a1/e/6a233cabebd8b0fa734b4322/media.mp3',
    durationLabel: '22:17',
    imageUrl:
      'https://assets.pippa.io/shows/6819ae2bf30c20bff775e8a1/1780693000506-ce09f9ef-b1cc-462e-a2.jpeg',
    publishedAt: '2026-06-05T21:30:00Z',
    source: 'The Race F1 Podcast',
    series: ['f1'],
  },
  {
    id: 'pod-motogp-therace-aprilia',
    title: 'Aprilia shows Ducati what it’s missing',
    audioUrl:
      'https://sphinx.acast.com/p/open/s/681ccb6c5acb8b715f1f1a1c/e/6a1d69025e7c8b237817122b/media.mp3',
    durationLabel: '56:15',
    imageUrl:
      'https://assets.pippa.io/shows/681ccb6c5acb8b715f1f1a1c/1780312133938-82c20340-d7cc-45d5-b8.jpeg',
    publishedAt: '2026-06-01T11:12:02Z',
    source: 'The Race MotoGP Podcast',
    series: ['motogp'],
  },
  {
    id: 'pod-sportscar-mwm-s21e21',
    title: 'Midweek Motorsport s21 e21',
    audioUrl:
      'https://media.blubrry.com/3563126/media.blubrry.com/midweekmotorsport/ins.blubrry.com/midweekmotorsport/mwm21-21.mp3',
    durationLabel: '2:06:56',
    imageUrl: 'https://www.radiolemans.co/wp-content/uploads/powerpress/RS3_MWM.jpg',
    publishedAt: '2026-06-03T21:41:59Z',
    source: 'Midweek Motorsport',
    series: ['wec', 'imsa', 'elms'],
  },
  {
    id: 'pod-wrc-spin-rallyjapan',
    title: 'Rally Japan 2026: Evans wins as Solberg makes another mistake',
    audioUrl:
      'https://rss.art19.com/episodes/18512167-8ac2-4078-96d1-37cb7f1b52d5.mp3',
    durationLabel: '01:02:08',
    imageUrl:
      'https://content.production.cdn.art19.com/images/bb/4e/32/3a/bb4e323a-ff0e-45f5-95b8-6cf86c.jpeg',
    publishedAt: '2026-06-02T23:00:00Z',
    source: 'SPIN, The Rally Pod',
    series: ['wrc'],
  },
];
