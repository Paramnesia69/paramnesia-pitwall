import type { StreamLink, SeriesId } from '@/types';

/**
 * Official watch / stream links per series.
 * Priority: official platform first, then broadcast partners, then YouTube.
 * Links point to the series' main streaming page — NOT to individual race streams
 * (those are ephemeral and would go stale).
 */

const SERIES_STREAM_LINKS: Record<SeriesId, StreamLink[]> = {
  f1: [
    { label: 'F1 TV', url: 'https://f1tv.formula1.com', type: 'official' },
    { label: 'formula1.com', url: 'https://www.formula1.com/en/racing', type: 'official' },
    { label: 'F1 YouTube', url: 'https://www.youtube.com/@Formula1', type: 'youtube' },
  ],
  wec: [
    { label: 'FIA WEC Live', url: 'https://www.fiawec.com/en/live', type: 'official' },
    { label: 'WEC YouTube', url: 'https://www.youtube.com/@FIAWEC', type: 'youtube' },
  ],
  imsa: [
    { label: 'IMSA TV', url: 'https://www.imsa.com/tv-streaming', type: 'official' },
    { label: 'Peacock', url: 'https://www.peacocktv.com', type: 'broadcast' },
    { label: 'IMSA YouTube', url: 'https://www.youtube.com/@ABORNEUSA', type: 'youtube' },
  ],
  motogp: [
    { label: 'MotoGP VideoPass', url: 'https://www.motogp.com/en/videopass', type: 'official' },
    { label: 'motogp.com', url: 'https://www.motogp.com', type: 'official' },
    { label: 'MotoGP YouTube', url: 'https://www.youtube.com/@MotoGP', type: 'youtube' },
  ],
  wrc: [
    { label: 'WRC+ All Live', url: 'https://www.wrc.com/en/wrcplus', type: 'official' },
    { label: 'WRC YouTube', url: 'https://www.youtube.com/@WRC', type: 'youtube' },
  ],
  elms: [
    { label: 'ELMS Live', url: 'https://www.europeanlemansseries.com/en/live', type: 'official' },
    { label: 'ELMS YouTube', url: 'https://www.youtube.com/@EuropeanLeMansSeries', type: 'youtube' },
  ],
  dtm: [
    { label: 'DTM Grid', url: 'https://www.dtm.com/en/dtm-grid', type: 'official' },
    { label: 'DTM YouTube', url: 'https://www.youtube.com/@DTM', type: 'youtube' },
  ],
  gtwce: [
    { label: 'GT World YouTube', url: 'https://www.youtube.com/@GTWorld', type: 'youtube' },
    { label: 'gt-world-challenge-europe.com', url: 'https://www.gt-world-challenge-europe.com', type: 'official' },
  ],
  nurburgring: [
    { label: 'NLS YouTube', url: 'https://www.youtube.com/@nuerburgring', type: 'youtube' },
    { label: 'nuerburgring.de', url: 'https://www.nuerburgring-langstrecken-serie.de', type: 'official' },
  ],
  nordschleife: [
    { label: 'NLS YouTube', url: 'https://www.youtube.com/@nuerburgring', type: 'youtube' },
    { label: 'nuerburgring.de', url: 'https://www.nuerburgring-langstrecken-serie.de', type: 'official' },
  ],
  'porsche-supercup': [
    { label: 'Porsche YouTube', url: 'https://www.youtube.com/@Porsche', type: 'youtube' },
    { label: 'Porsche Motorsport', url: 'https://motorsports.porsche.com/international/en/category/supercup', type: 'official' },
  ],
  'porsche-carrera': [
    { label: 'Porsche YouTube', url: 'https://www.youtube.com/@Porsche', type: 'youtube' },
    { label: 'Porsche Motorsport', url: 'https://motorsports.porsche.com', type: 'official' },
  ],
  lemans: [
    { label: 'FIA WEC Live', url: 'https://www.fiawec.com/en/live', type: 'official' },
    { label: '24h-lemans.com', url: 'https://www.24h-lemans.com', type: 'official' },
    { label: 'WEC YouTube', url: 'https://www.youtube.com/@FIAWEC', type: 'youtube' },
  ],
};

/**
 * Special overrides for specific events that have unique streaming options.
 * Keyed by a substring of the event name (case-insensitive match).
 */
const EVENT_OVERRIDES: { match: string; links: StreamLink[] }[] = [
  {
    match: '24 Hours of Le Mans',
    links: [
      { label: '24h-lemans.com', url: 'https://www.24h-lemans.com', type: 'official' },
      { label: 'FIA WEC Live', url: 'https://www.fiawec.com/en/live', type: 'official' },
      { label: 'Eurosport', url: 'https://www.eurosport.com', type: 'broadcast' },
      { label: 'WEC YouTube', url: 'https://www.youtube.com/@FIAWEC', type: 'youtube' },
    ],
  },
  {
    match: '24 Hours of Spa',
    links: [
      { label: 'GT World YouTube', url: 'https://www.youtube.com/@GTWorld', type: 'youtube' },
      { label: 'SRO Live', url: 'https://www.gt-world-challenge-europe.com', type: 'official' },
      { label: 'Eurosport', url: 'https://www.eurosport.com', type: 'broadcast' },
    ],
  },
  {
    match: 'Rolex 24',
    links: [
      { label: 'IMSA TV', url: 'https://www.imsa.com/tv-streaming', type: 'official' },
      { label: 'Peacock', url: 'https://www.peacocktv.com', type: 'broadcast' },
      { label: 'NBC Sports', url: 'https://www.nbcsports.com', type: 'broadcast' },
      { label: 'IMSA YouTube', url: 'https://www.youtube.com/@ABORNEUSA', type: 'youtube' },
    ],
  },
  {
    match: '24h Nürburgring',
    links: [
      { label: 'ADAC YouTube', url: 'https://www.youtube.com/@nuerburgring', type: 'youtube' },
      { label: '24h-rennen.de', url: 'https://www.24h-rennen.de', type: 'official' },
      { label: 'Nitro (DE)', url: 'https://www.nitro.de', type: 'broadcast' },
    ],
  },
  {
    match: '12 Hours of Sebring',
    links: [
      { label: 'IMSA TV', url: 'https://www.imsa.com/tv-streaming', type: 'official' },
      { label: 'Peacock', url: 'https://www.peacocktv.com', type: 'broadcast' },
      { label: 'IMSA YouTube', url: 'https://www.youtube.com/@ADORNEUSA', type: 'youtube' },
    ],
  },
];

/**
 * Get stream links for a given event.
 * Checks event-specific overrides first, then falls back to series defaults.
 */
export function getStreamLinks(series: SeriesId, eventName?: string): StreamLink[] {
  // Check for event-specific overrides
  if (eventName) {
    const lower = eventName.toLowerCase();
    for (const override of EVENT_OVERRIDES) {
      if (lower.includes(override.match.toLowerCase())) {
        return override.links;
      }
    }
  }

  return SERIES_STREAM_LINKS[series] ?? [];
}
