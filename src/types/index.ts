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

// ─── Race Weekend Detail Types ────────────────────────────────────────────────

export type WeekendSessionType =
  | 'race'
  | 'qualifying'
  | 'sprint'
  | 'sprint_qualifying'
  | 'fp1'
  | 'fp2'
  | 'fp3';

export interface ResultEntry {
  pos: number;
  driver: string;
  team: string;
  time?: string;
  gap?: string;
  /** Qualifying-specific */
  q1Time?: string;
  q2Time?: string;
  q3Time?: string;
  /** Eliminated in Q1/Q2 for qualifying */
  eliminatedInQ?: 1 | 2;
  /** Did not finish */
  dnf?: boolean;
  /** Points scored (race/sprint) */
  points?: number;
}

export interface SessionResults {
  type: WeekendSessionType;
  label?: string; // Override display label e.g. "Race 1", "Sprint Race"
  entries: ResultEntry[];
  fastestLap?: string; // Driver name (for display in session tab)
  fastestLapTime?: string;
}

export interface RaceResult {
  id: string;
  series: SeriesId;
  round: number;
  name: string;
  circuit: string;
  country: string;
  countryCode: string;
  date: string;
  podium: { pos: number; driver: string; team: string; time?: string }[];
  fastestLap?: { driver: string; team: string };
  /** Full weekend session results — optional; populated for F1 via API, others manually */
  sessions?: SessionResults[];
}

// ─── News ─────────────────────────────────────────────────────────────────────

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

// ─── Highlights (YouTube) ─────────────────────────────────────────────────────

export interface HighlightItem {
  id: string;            // `yt-<series>-<videoId>`
  videoId: string;       // YouTube id → embed + thumbnail
  title: string;
  thumbnailUrl: string;  // https://i.ytimg.com/vi/<id>/hqdefault.jpg
  publishedAt: string;   // ISO 8601
  source: string;        // channel name, e.g. "FORMULA 1"
  series?: SeriesId[];
}

// ─── Podcasts ─────────────────────────────────────────────────────────────────

export interface PodcastEpisode {
  id: string;            // `pod-<series>-<guid|audioUrl>`
  title: string;
  audioUrl: string;      // direct .mp3 enclosure
  durationLabel?: string;// from itunes:duration (e.g. "56:15")
  imageUrl?: string;     // episode or show artwork
  publishedAt: string;   // ISO 8601
  source: string;        // show name, e.g. "The Race F1 Podcast"
  series?: SeriesId[];
}

// ─── MotoGP Rider Profile ─────────────────────────────────────────────────────

export interface MotoGPRiderProfile {
  ref: string;
  givenName: string;
  familyName: string;
  nationality: string;   // e.g. "Spanish", "Italian", "French"
  dateOfBirth: string;   // ISO 8601 e.g. "1993-02-17"
  permanentNumber: string;
  raceWins: number;      // MotoGP premier-class feature race wins only
  championships: number; // FIM World Championship titles across all classes
  seasons: number;       // MotoGP seasons competed (including current)
  headshotUrl: string | null;
  season2026: { pos: number; points: number; team: string } | null;
}

// ─── F1 Driver Profile ────────────────────────────────────────────────────────

export interface DriverProfile {
  ref: string;
  givenName: string;
  familyName: string;
  code: string | null;
  permanentNumber: string | null;
  nationality: string;
  dateOfBirth: string | null;
  wins: number;
  seasons: number;
  season2026: { points: number; pos: number; team: string } | null;
  headshotUrl: string | null;
}

export interface SelectedDriver {
  ref: string;
  name: string;
  team: string;
  teamColor: string;
  series: SeriesId;
  points: number;
  pos: number;
}

export interface SelectedTeam {
  ref: string;        // Jolpica constructorId e.g. "mercedes", "red_bull"
  name: string;       // Display name e.g. "Mercedes"
  series: SeriesId;
  points: number;
  pos: number;
  teamColor: string;
  // Non-F1 static data (WEC/ELMS/IMSA car entries, MotoGP teams)
  driverNames?: string;   // e.g. "Frijns / Rast" for endurance car entries
  carNumber?: string;     // e.g. "20" parsed from team name "#20"
  seriesClass?: string;   // e.g. "Hypercar", "LMP2", "GTP"
  manufacturer?: string;  // e.g. "BMW", "Ferrari"
}

export interface TeamProfile {
  ref: string;
  name: string;
  nationality: string;
  wins: number;
  seasons: number;
  firstSeason: number;
  season2026: { points: number; pos: number } | null;
  drivers2026: { ref: string; givenName: string; familyName: string; number: string | null }[];
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
    logo: '/logos/nurburgring.svg',
  },
  nordschleife: { name: 'Nordschleife', accent: '#4CAF50', logo: '/logos/nurburgring.svg' },
  lemans: { name: 'Le Mans', accent: '#0D64FF', logo: '/logos/lemans.svg' },
};
