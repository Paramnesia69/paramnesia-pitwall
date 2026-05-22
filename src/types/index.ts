export type SeriesId =
  | 'f1'
  | 'wec'
  | 'imsa'
  | 'elms'
  | 'motogp'
  | 'wrc'
  | 'gtwce'
  | 'dtm'
  | 'porsche-supercup'
  | 'porsche-carrera'
  | 'nurburgring'
  | 'nordschleife'
  | 'lemans';

export type EventState =
  | 'upcoming'
  | 'starting_soon'
  | 'live'
  | 'finished'
  | 'delayed'
  | 'cancelled';

export type SessionType =
  | 'practice'
  | 'qualifying'
  | 'sprint'
  | 'warmup'
  | 'race';

export interface StreamLink {
  label: string;
  url: string;
  type: 'youtube' | 'official' | 'broadcast' | 'other';
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  rainChance: number;
  windSpeed: number;
}

export interface Circuit {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export interface RaceSession {
  type: SessionType;
  name: string;
  startTime: string;
  endTime?: string;
  state: EventState;
  streamLink?: StreamLink;
}

export interface ManualOverride {
  /** Override or add stream/watch links */
  streamLinks?: StreamLink[];
  /** Override the event hero image */
  imageUrl?: string;
  /** Override the event description */
  description?: string;
  /** Override the event start time (ISO 8601) */
  startTime?: string;
  /** Force this event as the featured hero card */
  featured?: boolean;
  /** Force event state (e.g. 'delayed', 'cancelled') */
  state?: EventState;
  /** Admin notes — displayed as a banner on the event card */
  note?: string;
  /** Override session times: keyed by session name (e.g. "Race", "Qualifying") */
  sessionOverrides?: Record<string, { startTime?: string; endTime?: string; state?: EventState; note?: string }>;
}

export interface DataSource {
  provider: string;
  reliability: 'official' | 'community' | 'scraped';
  lastUpdated: string;
}

export interface NormalizedRaceEvent {
  id: string;
  series: SeriesId;
  name: string;
  circuit: Circuit;
  sessions: RaceSession[];
  state: EventState;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  streamLinks: StreamLink[];
  weather?: WeatherData;
  source: DataSource;
  overrides?: ManualOverride;
}

export interface NormalizedNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  series?: SeriesId[];
}

export const SERIES_META: Record<
  SeriesId,
  { name: string; accent: string; logo?: string }
> = {
  f1: { name: 'Formula 1', accent: '#E10600', logo: '/logos/f1.svg' },
  wec: { name: 'WEC', accent: '#0090D4', logo: '/logos/wec.png' },
  imsa: { name: 'IMSA', accent: '#C4A747', logo: '/logos/imsa.svg' },
  elms: { name: 'ELMS', accent: '#3A7BD5', logo: '/logos/elms.png' },
  motogp: { name: 'MotoGP', accent: '#BE0A14', logo: '/logos/motogp.svg' },
  wrc: { name: 'WRC', accent: '#00A651', logo: '/logos/wrc.svg' },
  gtwce: {
    name: 'GT World Challenge',
    accent: '#FF6B00',
    logo: '/logos/gtwce.png',
  },
  dtm: { name: 'DTM', accent: '#F5C518', logo: '/logos/dtm.svg' },
  'porsche-supercup': { name: 'Porsche Supercup', accent: '#C0A062', logo: '/logos/porsche.svg' },
  'porsche-carrera': { name: 'Porsche Carrera Cup', accent: '#C0A062', logo: '/logos/porsche.svg' },
  nurburgring: {
    name: 'Nürburgring',
    accent: '#4CAF50',
    logo: '/logos/nurburgring.jpg',
  },
  nordschleife: { name: 'Nordschleife', accent: '#4CAF50', logo: '/logos/nurburgring.jpg' },
  lemans: { name: 'Le Mans', accent: '#0D64FF', logo: '/logos/lemans.svg' },
};
