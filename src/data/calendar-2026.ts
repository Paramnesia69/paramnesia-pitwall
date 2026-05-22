import type { NormalizedRaceEvent, SeriesId } from '@/types';

type CalendarEntry = Omit<NormalizedRaceEvent, 'weather'>;

function evt(
  series: SeriesId,
  name: string,
  circuit: { name: string; country: string; countryCode: string; lat: number; lng: number },
  startDate: string,
  endDate: string,
  sessions: NormalizedRaceEvent['sessions'] = [],
): CalendarEntry {
  const id = `${series}-${startDate}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return {
    id,
    series,
    name,
    circuit,
    startDate,
    endDate,
    sessions,
    state: 'upcoming',
    streamLinks: [],
    source: { provider: 'static-calendar', reliability: 'community', lastUpdated: '2026-05-22' },
  };
}

// ─── FORMULA 1 2026 ──────────────────────────────────────
const f1: CalendarEntry[] = [
  evt('f1', 'Australian Grand Prix', { name: 'Albert Park Circuit', country: 'Australia', countryCode: 'AU', lat: -37.8497, lng: 144.968 }, '2026-03-06', '2026-03-08', [
    { type: 'practice', name: 'FP1', startTime: '2026-03-06T01:30:00Z', state: 'finished' },
    { type: 'practice', name: 'FP2', startTime: '2026-03-06T05:00:00Z', state: 'finished' },
    { type: 'practice', name: 'FP3', startTime: '2026-03-07T01:30:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-03-07T05:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-03-08T04:00:00Z', state: 'finished' },
  ]),
  evt('f1', 'Chinese Grand Prix', { name: 'Shanghai International Circuit', country: 'China', countryCode: 'CN', lat: 31.3389, lng: 121.2197 }, '2026-03-13', '2026-03-15', [
    { type: 'practice', name: 'FP1', startTime: '2026-03-13T03:30:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Sprint Qualifying', startTime: '2026-03-13T07:30:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-03-14T03:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-03-14T07:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-03-15T07:00:00Z', state: 'finished' },
  ]),
  evt('f1', 'Japanese Grand Prix', { name: 'Suzuka Circuit', country: 'Japan', countryCode: 'JP', lat: 34.8431, lng: 136.5407 }, '2026-03-27', '2026-03-29', [
    { type: 'practice', name: 'FP1', startTime: '2026-03-27T02:30:00Z', state: 'finished' },
    { type: 'practice', name: 'FP2', startTime: '2026-03-27T06:00:00Z', state: 'finished' },
    { type: 'practice', name: 'FP3', startTime: '2026-03-28T02:30:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-03-28T06:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-03-29T05:00:00Z', state: 'finished' },
  ]),
  evt('f1', 'Miami Grand Prix', { name: 'Miami International Autodrome', country: 'United States', countryCode: 'US', lat: 25.9581, lng: -80.2389 }, '2026-05-01', '2026-05-03', [
    { type: 'practice', name: 'FP1', startTime: '2026-05-01T18:30:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Sprint Qualifying', startTime: '2026-05-01T22:30:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-05-02T18:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-05-02T22:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-05-03T20:00:00Z', state: 'finished' },
  ]),
  evt('f1', 'Canadian Grand Prix', { name: 'Circuit Gilles Villeneuve', country: 'Canada', countryCode: 'CA', lat: 45.5017, lng: -73.5228 }, '2026-05-22', '2026-05-24', [
    { type: 'practice', name: 'FP1', startTime: '2026-05-22T17:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Sprint Qualifying', startTime: '2026-05-22T21:30:00Z', state: 'upcoming' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-05-23T17:00:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-05-23T21:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-05-24T18:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Monaco Grand Prix', { name: 'Circuit de Monaco', country: 'Monaco', countryCode: 'MC', lat: 43.7347, lng: 7.4206 }, '2026-06-05', '2026-06-07', [
    { type: 'practice', name: 'FP1', startTime: '2026-06-05T11:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-06-05T15:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-06-06T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-06-06T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-06-07T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Barcelona-Catalunya Grand Prix', { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', lat: 41.57, lng: 2.2611 }, '2026-06-12', '2026-06-14', [
    { type: 'practice', name: 'FP1', startTime: '2026-06-12T11:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-06-12T15:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-06-13T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-06-13T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-06-14T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Austrian Grand Prix', { name: 'Red Bull Ring', country: 'Austria', countryCode: 'AT', lat: 47.2197, lng: 14.7647 }, '2026-06-26', '2026-06-28', [
    { type: 'practice', name: 'FP1', startTime: '2026-06-26T11:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-06-26T15:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-06-27T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-06-27T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-06-28T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'British Grand Prix', { name: 'Silverstone Circuit', country: 'United Kingdom', countryCode: 'GB', lat: 52.0786, lng: -1.0169 }, '2026-07-03', '2026-07-05', [
    { type: 'practice', name: 'FP1', startTime: '2026-07-03T11:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Sprint Qualifying', startTime: '2026-07-03T15:30:00Z', state: 'upcoming' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-07-04T11:00:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-07-04T15:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-07-05T14:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Belgian Grand Prix', { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE', lat: 50.4372, lng: 5.9714 }, '2026-07-17', '2026-07-19', [
    { type: 'practice', name: 'FP1', startTime: '2026-07-17T11:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-07-17T15:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-07-18T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-07-18T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-07-19T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Hungarian Grand Prix', { name: 'Hungaroring', country: 'Hungary', countryCode: 'HU', lat: 47.5789, lng: 19.2486 }, '2026-07-24', '2026-07-26', [
    { type: 'practice', name: 'FP1', startTime: '2026-07-24T11:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-07-24T15:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-07-25T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-07-25T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-07-26T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Dutch Grand Prix', { name: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL', lat: 52.3888, lng: 4.5409 }, '2026-08-21', '2026-08-23', [
    { type: 'practice', name: 'FP1', startTime: '2026-08-21T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Sprint Qualifying', startTime: '2026-08-21T14:30:00Z', state: 'upcoming' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-08-22T10:00:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-08-22T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-08-23T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Italian Grand Prix', { name: 'Monza Circuit', country: 'Italy', countryCode: 'IT', lat: 45.6156, lng: 9.2811 }, '2026-09-04', '2026-09-06', [
    { type: 'practice', name: 'FP1', startTime: '2026-09-04T11:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-09-04T15:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-09-05T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-09-05T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-09-06T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Spanish Grand Prix', { name: 'Madring Street Circuit', country: 'Spain', countryCode: 'ES', lat: 40.4168, lng: -3.7038 }, '2026-09-11', '2026-09-13', [
    { type: 'practice', name: 'FP1', startTime: '2026-09-11T12:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-09-11T16:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-09-12T11:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-09-12T15:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-09-13T13:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Azerbaijan Grand Prix', { name: 'Baku City Circuit', country: 'Azerbaijan', countryCode: 'AZ', lat: 40.3725, lng: 49.8533 }, '2026-09-24', '2026-09-26', [
    { type: 'practice', name: 'FP1', startTime: '2026-09-24T09:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-09-24T13:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-09-25T08:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-09-25T12:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-09-26T11:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Singapore Grand Prix', { name: 'Marina Bay Street Circuit', country: 'Singapore', countryCode: 'SG', lat: 1.2914, lng: 103.8644 }, '2026-10-09', '2026-10-11', [
    { type: 'practice', name: 'FP1', startTime: '2026-10-09T09:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Sprint Qualifying', startTime: '2026-10-09T13:30:00Z', state: 'upcoming' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-10-10T09:00:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-10-10T13:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-10-11T12:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'United States Grand Prix', { name: 'Circuit of the Americas', country: 'United States', countryCode: 'US', lat: 30.1328, lng: -97.6411 }, '2026-10-23', '2026-10-25', [
    { type: 'practice', name: 'FP1', startTime: '2026-10-23T17:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-10-23T21:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-10-24T18:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-10-24T22:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-10-25T19:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Mexico City Grand Prix', { name: 'Autódromo Hermanos Rodríguez', country: 'Mexico', countryCode: 'MX', lat: 19.4042, lng: -99.0907 }, '2026-10-30', '2026-11-01', [
    { type: 'practice', name: 'FP1', startTime: '2026-10-30T18:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-10-30T22:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-10-31T17:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-10-31T21:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-11-01T20:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'São Paulo Grand Prix', { name: 'Interlagos Circuit', country: 'Brazil', countryCode: 'BR', lat: -23.7036, lng: -46.6997 }, '2026-11-06', '2026-11-08', [
    { type: 'practice', name: 'FP1', startTime: '2026-11-06T14:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-11-06T18:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-11-07T13:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-11-07T17:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-11-08T17:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Las Vegas Grand Prix', { name: 'Las Vegas Strip Circuit', country: 'United States', countryCode: 'US', lat: 36.1147, lng: -115.1728 }, '2026-11-19', '2026-11-21', [
    { type: 'practice', name: 'FP1', startTime: '2026-11-20T02:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-11-20T06:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-11-21T02:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-11-21T06:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-11-22T06:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Qatar Grand Prix', { name: 'Lusail International Circuit', country: 'Qatar', countryCode: 'QA', lat: 25.49, lng: 51.4542 }, '2026-11-27', '2026-11-29', [
    { type: 'practice', name: 'FP1', startTime: '2026-11-27T13:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-11-27T17:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-11-28T14:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-11-28T18:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-11-29T17:00:00Z', state: 'upcoming' },
  ]),
  evt('f1', 'Abu Dhabi Grand Prix', { name: 'Yas Marina Circuit', country: 'United Arab Emirates', countryCode: 'AE', lat: 24.4672, lng: 54.6031 }, '2026-12-04', '2026-12-06', [
    { type: 'practice', name: 'FP1', startTime: '2026-12-04T09:30:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP2', startTime: '2026-12-04T13:00:00Z', state: 'upcoming' },
    { type: 'practice', name: 'FP3', startTime: '2026-12-05T10:30:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-12-05T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-12-06T13:00:00Z', state: 'upcoming' },
  ]),
];

// ─── WEC 2026 ────────────────────────────────────────────
const wec: CalendarEntry[] = [
  evt('wec', '6 Hours of Imola', { name: 'Imola Circuit', country: 'Italy', countryCode: 'IT', lat: 44.3439, lng: 11.7167 }, '2026-04-19', '2026-04-19', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-04-19T08:00:00Z', state: 'upcoming' },
    { type: 'race', name: '6 Hours of Imola', startTime: '2026-04-19T11:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', '6 Hours of Spa-Francorchamps', { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE', lat: 50.4372, lng: 5.9714 }, '2026-05-09', '2026-05-09', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-05-09T08:30:00Z', state: 'upcoming' },
    { type: 'race', name: '6 Hours of Spa', startTime: '2026-05-09T11:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', '24 Hours of Le Mans', { name: 'Circuit de la Sarthe', country: 'France', countryCode: 'FR', lat: 47.956, lng: 0.2075 }, '2026-06-13', '2026-06-14', [
    { type: 'qualifying', name: 'Hyperpole', startTime: '2026-06-12T18:00:00Z', state: 'upcoming' },
    { type: 'warmup', name: 'Warmup', startTime: '2026-06-13T09:00:00Z', state: 'upcoming' },
    { type: 'race', name: '24 Hours of Le Mans', startTime: '2026-06-13T14:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', '6 Hours of São Paulo', { name: 'Interlagos Circuit', country: 'Brazil', countryCode: 'BR', lat: -23.7036, lng: -46.6997 }, '2026-07-12', '2026-07-12', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-07-12T12:00:00Z', state: 'upcoming' },
    { type: 'race', name: '6 Hours of São Paulo', startTime: '2026-07-12T15:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', 'Lone Star Le Mans', { name: 'Circuit of the Americas', country: 'United States', countryCode: 'US', lat: 30.1328, lng: -97.6411 }, '2026-09-06', '2026-09-06', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-09-06T14:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Lone Star Le Mans', startTime: '2026-09-06T17:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', '6 Hours of Fuji', { name: 'Fuji Speedway', country: 'Japan', countryCode: 'JP', lat: 35.3725, lng: 138.9275 }, '2026-09-27', '2026-09-27', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-09-27T01:00:00Z', state: 'upcoming' },
    { type: 'race', name: '6 Hours of Fuji', startTime: '2026-09-27T03:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', 'Qatar 1812 km', { name: 'Lusail International Circuit', country: 'Qatar', countryCode: 'QA', lat: 25.49, lng: 51.4542 }, '2026-10-24', '2026-10-24', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-10-24T12:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Qatar 1812 km', startTime: '2026-10-24T14:00:00Z', state: 'upcoming' },
  ]),
  evt('wec', '8 Hours of Bahrain', { name: 'Bahrain International Circuit', country: 'Bahrain', countryCode: 'BH', lat: 26.0325, lng: 50.5106 }, '2026-11-07', '2026-11-07', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-11-07T08:00:00Z', state: 'upcoming' },
    { type: 'race', name: '8 Hours of Bahrain', startTime: '2026-11-07T10:00:00Z', state: 'upcoming' },
  ]),
];

// ─── IMSA 2026 ───────────────────────────────────────────
const imsa: CalendarEntry[] = [
  evt('imsa', 'Rolex 24 at Daytona', { name: 'Daytona International Speedway', country: 'United States', countryCode: 'US', lat: 29.1872, lng: -81.0712 }, '2026-01-21', '2026-01-25', [
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-01-22T20:00:00Z', state: 'finished' },
    { type: 'race', name: 'Rolex 24', startTime: '2026-01-24T18:40:00Z', state: 'finished' },
  ]),
  evt('imsa', '12 Hours of Sebring', { name: 'Sebring International Raceway', country: 'United States', countryCode: 'US', lat: 27.4545, lng: -81.3486 }, '2026-03-18', '2026-03-18', [
    { type: 'race', name: '12 Hours of Sebring', startTime: '2026-03-18T14:40:00Z', state: 'finished' },
  ]),
  evt('imsa', 'Grand Prix of Long Beach', { name: 'Long Beach Street Circuit', country: 'United States', countryCode: 'US', lat: 33.7652, lng: -118.1893 }, '2026-04-17', '2026-04-17', [
    { type: 'race', name: 'Grand Prix of Long Beach', startTime: '2026-04-17T21:00:00Z', state: 'finished' },
  ]),
  evt('imsa', 'Monterey SportsCar Championship', { name: 'WeatherTech Raceway Laguna Seca', country: 'United States', countryCode: 'US', lat: 36.5841, lng: -121.7534 }, '2026-05-01', '2026-05-01', [
    { type: 'race', name: 'Monterey SportsCar Championship', startTime: '2026-05-01T20:00:00Z', state: 'finished' },
  ]),
  evt('imsa', 'Detroit Grand Prix', { name: 'Detroit Street Circuit', country: 'United States', countryCode: 'US', lat: 42.3314, lng: -83.0458 }, '2026-05-29', '2026-05-29', [
    { type: 'race', name: 'Detroit Grand Prix', startTime: '2026-05-29T18:00:00Z', state: 'upcoming' },
  ]),
  evt('imsa', 'Six Hours of The Glen', { name: 'Watkins Glen International', country: 'United States', countryCode: 'US', lat: 42.3369, lng: -76.9272 }, '2026-06-25', '2026-06-25', [
    { type: 'race', name: 'Six Hours of The Glen', startTime: '2026-06-25T14:45:00Z', state: 'upcoming' },
  ]),
  evt('imsa', 'Chevrolet Grand Prix', { name: 'Canadian Tire Motorsport Park', country: 'Canada', countryCode: 'CA', lat: 44.0511, lng: -79.3558 }, '2026-07-10', '2026-07-10', [
    { type: 'race', name: 'Chevrolet Grand Prix', startTime: '2026-07-10T16:00:00Z', state: 'upcoming' },
  ]),
  evt('imsa', 'SportsCar Weekend', { name: 'Road America', country: 'United States', countryCode: 'US', lat: 43.7972, lng: -87.9908 }, '2026-07-30', '2026-07-30', [
    { type: 'race', name: '6 Hours of Road America', startTime: '2026-07-30T16:00:00Z', state: 'upcoming' },
  ]),
  evt('imsa', 'Michelin GT Challenge at VIR', { name: 'VIRginia International Raceway', country: 'United States', countryCode: 'US', lat: 36.5672, lng: -79.2067 }, '2026-08-20', '2026-08-20', [
    { type: 'race', name: 'Michelin GT Challenge', startTime: '2026-08-20T17:00:00Z', state: 'upcoming' },
  ]),
  evt('imsa', 'Battle on the Bricks', { name: 'Indianapolis Motor Speedway', country: 'United States', countryCode: 'US', lat: 39.7955, lng: -86.2347 }, '2026-09-18', '2026-09-18', [
    { type: 'race', name: 'Battle on the Bricks', startTime: '2026-09-18T16:00:00Z', state: 'upcoming' },
  ]),
];

// ─── MotoGP 2026 ─────────────────────────────────────────
const motogp: CalendarEntry[] = [
  evt('motogp', 'Thai Grand Prix', { name: 'Chang International Circuit', country: 'Thailand', countryCode: 'TH', lat: 14.9531, lng: 103.0858 }, '2026-02-27', '2026-03-01', [
    { type: 'practice', name: 'Practice', startTime: '2026-02-27T04:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-02-28T04:00:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-02-28T07:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-03-01T07:00:00Z', state: 'finished' },
  ]),
  evt('motogp', 'Brazilian Grand Prix', { name: 'Autódromo Ayrton Senna', country: 'Brazil', countryCode: 'BR', lat: -16.685, lng: -49.2648 }, '2026-03-20', '2026-03-22', [
    { type: 'practice', name: 'Practice', startTime: '2026-03-20T14:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-03-21T14:00:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-03-21T17:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-03-22T17:00:00Z', state: 'finished' },
  ]),
  evt('motogp', 'Americas Grand Prix', { name: 'Circuit of the Americas', country: 'United States', countryCode: 'US', lat: 30.1328, lng: -97.6411 }, '2026-03-27', '2026-03-29', [
    { type: 'practice', name: 'Practice', startTime: '2026-03-27T17:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-03-28T17:00:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-03-28T20:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-03-29T19:00:00Z', state: 'finished' },
  ]),
  evt('motogp', 'Spanish Grand Prix', { name: 'Circuito de Jerez', country: 'Spain', countryCode: 'ES', lat: 36.7089, lng: -6.0347 }, '2026-04-24', '2026-04-26', [
    { type: 'practice', name: 'Practice', startTime: '2026-04-24T08:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-04-25T08:00:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-04-25T11:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-04-26T12:00:00Z', state: 'finished' },
  ]),
  evt('motogp', 'French Grand Prix', { name: 'Bugatti Circuit', country: 'France', countryCode: 'FR', lat: 47.9567, lng: 0.2075 }, '2026-05-08', '2026-05-10', [
    { type: 'practice', name: 'Practice', startTime: '2026-05-08T08:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-05-09T08:00:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-05-09T11:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-05-10T12:00:00Z', state: 'finished' },
  ]),
  evt('motogp', 'Catalan Grand Prix', { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', lat: 41.57, lng: 2.2611 }, '2026-05-15', '2026-05-17', [
    { type: 'practice', name: 'Practice', startTime: '2026-05-15T08:00:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-05-16T08:00:00Z', state: 'finished' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-05-16T11:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race', startTime: '2026-05-17T12:00:00Z', state: 'finished' },
  ]),
  evt('motogp', 'Italian Grand Prix', { name: 'Mugello', country: 'Italy', countryCode: 'IT', lat: 43.9975, lng: 11.3719 }, '2026-05-29', '2026-05-31', [
    { type: 'practice', name: 'Practice', startTime: '2026-05-29T08:00:00Z', state: 'upcoming' },
    { type: 'qualifying', name: 'Qualifying', startTime: '2026-05-30T08:00:00Z', state: 'upcoming' },
    { type: 'sprint', name: 'Sprint', startTime: '2026-05-30T11:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race', startTime: '2026-05-31T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Hungarian Grand Prix', { name: 'Balaton Park Circuit', country: 'Hungary', countryCode: 'HU', lat: 47.0561, lng: 17.9358 }, '2026-06-05', '2026-06-07', [
    { type: 'race', name: 'Race', startTime: '2026-06-07T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Czech Republic Grand Prix', { name: 'Brno Circuit', country: 'Czech Republic', countryCode: 'CZ', lat: 49.2, lng: 16.5833 }, '2026-06-19', '2026-06-21', [
    { type: 'race', name: 'Race', startTime: '2026-06-21T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Dutch Grand Prix', { name: 'TT Circuit Assen', country: 'Netherlands', countryCode: 'NL', lat: 52.962, lng: 6.5225 }, '2026-06-26', '2026-06-28', [
    { type: 'race', name: 'Race', startTime: '2026-06-28T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'German Grand Prix', { name: 'Sachsenring', country: 'Germany', countryCode: 'DE', lat: 50.7919, lng: 12.6869 }, '2026-07-10', '2026-07-12', [
    { type: 'race', name: 'Race', startTime: '2026-07-12T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'British Grand Prix', { name: 'Silverstone Circuit', country: 'United Kingdom', countryCode: 'GB', lat: 52.0786, lng: -1.0169 }, '2026-08-07', '2026-08-09', [
    { type: 'race', name: 'Race', startTime: '2026-08-09T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Aragon Grand Prix', { name: 'MotorLand Aragón', country: 'Spain', countryCode: 'ES', lat: 40.9919, lng: -0.3333 }, '2026-08-28', '2026-08-30', [
    { type: 'race', name: 'Race', startTime: '2026-08-30T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'San Marino Grand Prix', { name: 'Misano World Circuit', country: 'San Marino', countryCode: 'SM', lat: 43.9628, lng: 12.6847 }, '2026-09-11', '2026-09-13', [
    { type: 'race', name: 'Race', startTime: '2026-09-13T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Austrian Grand Prix', { name: 'Red Bull Ring', country: 'Austria', countryCode: 'AT', lat: 47.2197, lng: 14.7647 }, '2026-09-18', '2026-09-20', [
    { type: 'race', name: 'Race', startTime: '2026-09-20T12:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Japanese Grand Prix', { name: 'Mobility Resort Motegi', country: 'Japan', countryCode: 'JP', lat: 36.5328, lng: 140.2281 }, '2026-10-02', '2026-10-04', [
    { type: 'race', name: 'Race', startTime: '2026-10-04T05:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Indonesian Grand Prix', { name: 'Mandalika Circuit', country: 'Indonesia', countryCode: 'ID', lat: -8.8947, lng: 116.3483 }, '2026-10-09', '2026-10-11', [
    { type: 'race', name: 'Race', startTime: '2026-10-11T07:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Australian Grand Prix', { name: 'Phillip Island Circuit', country: 'Australia', countryCode: 'AU', lat: -38.5008, lng: 145.2331 }, '2026-10-23', '2026-10-25', [
    { type: 'race', name: 'Race', startTime: '2026-10-25T03:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Malaysian Grand Prix', { name: 'Sepang International Circuit', country: 'Malaysia', countryCode: 'MY', lat: 2.7606, lng: 101.7383 }, '2026-10-30', '2026-11-01', [
    { type: 'race', name: 'Race', startTime: '2026-11-01T07:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Qatar Grand Prix', { name: 'Lusail International Circuit', country: 'Qatar', countryCode: 'QA', lat: 25.49, lng: 51.4542 }, '2026-11-06', '2026-11-08', [
    { type: 'race', name: 'Race', startTime: '2026-11-08T15:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Portuguese Grand Prix', { name: 'Algarve International Circuit', country: 'Portugal', countryCode: 'PT', lat: 37.2319, lng: -8.6267 }, '2026-11-20', '2026-11-22', [
    { type: 'race', name: 'Race', startTime: '2026-11-22T13:00:00Z', state: 'upcoming' },
  ]),
  evt('motogp', 'Valencia Grand Prix', { name: 'Circuit Ricardo Tormo', country: 'Spain', countryCode: 'ES', lat: 39.4886, lng: -0.6306 }, '2026-11-27', '2026-11-29', [
    { type: 'race', name: 'Race', startTime: '2026-11-29T13:00:00Z', state: 'upcoming' },
  ]),
];

// ─── WRC 2026 ────────────────────────────────────────────
const wrc: CalendarEntry[] = [
  evt('wrc', 'Rallye Monte Carlo', { name: 'Monte Carlo', country: 'Monaco', countryCode: 'MC', lat: 43.7384, lng: 7.4246 }, '2026-01-22', '2026-01-25', [
    { type: 'race', name: 'Rally', startTime: '2026-01-22T07:00:00Z', state: 'finished' },
  ]),
  evt('wrc', 'Rally Sweden', { name: 'Umeå', country: 'Sweden', countryCode: 'SE', lat: 63.8258, lng: 20.2630 }, '2026-02-12', '2026-02-15', [
    { type: 'race', name: 'Rally', startTime: '2026-02-12T07:00:00Z', state: 'finished' },
  ]),
  evt('wrc', 'Safari Rally Kenya', { name: 'Nairobi', country: 'Kenya', countryCode: 'KE', lat: -1.2864, lng: 36.8172 }, '2026-03-12', '2026-03-15', [
    { type: 'race', name: 'Rally', startTime: '2026-03-12T06:00:00Z', state: 'finished' },
  ]),
  evt('wrc', 'Croatia Rally', { name: 'Rijeka', country: 'Croatia', countryCode: 'HR', lat: 45.327, lng: 14.4422 }, '2026-04-09', '2026-04-12', [
    { type: 'race', name: 'Rally', startTime: '2026-04-09T06:00:00Z', state: 'finished' },
  ]),
  evt('wrc', 'Rally Islas Canarias', { name: 'Las Palmas', country: 'Spain', countryCode: 'ES', lat: 28.1235, lng: -15.4363 }, '2026-04-23', '2026-04-26', [
    { type: 'race', name: 'Rally', startTime: '2026-04-23T07:00:00Z', state: 'finished' },
  ]),
  evt('wrc', 'Rally de Portugal', { name: 'Matosinhos', country: 'Portugal', countryCode: 'PT', lat: 41.1822, lng: -8.6889 }, '2026-05-07', '2026-05-10', [
    { type: 'race', name: 'Rally', startTime: '2026-05-07T06:00:00Z', state: 'finished' },
  ]),
  evt('wrc', 'Rally Japan', { name: 'Toyota', country: 'Japan', countryCode: 'JP', lat: 35.0844, lng: 137.1528 }, '2026-05-28', '2026-05-31', [
    { type: 'race', name: 'Rally', startTime: '2026-05-28T00:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Acropolis Rally Greece', { name: 'Loutraki', country: 'Greece', countryCode: 'GR', lat: 37.9715, lng: 22.9768 }, '2026-06-25', '2026-06-28', [
    { type: 'race', name: 'Rally', startTime: '2026-06-25T05:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Rally Estonia', { name: 'Tartu', country: 'Estonia', countryCode: 'EE', lat: 58.3776, lng: 26.7290 }, '2026-07-16', '2026-07-19', [
    { type: 'race', name: 'Rally', startTime: '2026-07-16T06:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Rally Finland', { name: 'Jyväskylä', country: 'Finland', countryCode: 'FI', lat: 62.2426, lng: 25.7473 }, '2026-07-30', '2026-08-02', [
    { type: 'race', name: 'Rally', startTime: '2026-07-30T06:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Rally del Paraguay', { name: 'Encarnación', country: 'Paraguay', countryCode: 'PY', lat: -27.3307, lng: -55.8667 }, '2026-08-27', '2026-08-30', [
    { type: 'race', name: 'Rally', startTime: '2026-08-27T10:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Rally Chile', { name: 'Concepción', country: 'Chile', countryCode: 'CL', lat: -36.8201, lng: -73.0444 }, '2026-09-10', '2026-09-13', [
    { type: 'race', name: 'Rally', startTime: '2026-09-10T10:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Rally Italia Sardegna', { name: 'Alghero', country: 'Italy', countryCode: 'IT', lat: 40.5564, lng: 8.3125 }, '2026-10-01', '2026-10-04', [
    { type: 'race', name: 'Rally', startTime: '2026-10-01T06:00:00Z', state: 'upcoming' },
  ]),
  evt('wrc', 'Rally Saudi Arabia', { name: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.5433, lng: 39.1728 }, '2026-11-11', '2026-11-14', [
    { type: 'race', name: 'Rally', startTime: '2026-11-11T06:00:00Z', state: 'upcoming' },
  ]),
];

// ─── ELMS 2026 ───────────────────────────────────────────
const elms: CalendarEntry[] = [
  evt('elms', '4 Hours of Barcelona', { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', lat: 41.57, lng: 2.2611 }, '2026-04-12', '2026-04-12', [
    { type: 'race', name: '4 Hours of Barcelona', startTime: '2026-04-12T11:00:00Z', state: 'finished' },
  ]),
  evt('elms', '4 Hours of Le Castellet', { name: 'Circuit Paul Ricard', country: 'France', countryCode: 'FR', lat: 43.2506, lng: 5.7917 }, '2026-05-03', '2026-05-03', [
    { type: 'race', name: '4 Hours of Le Castellet', startTime: '2026-05-03T11:00:00Z', state: 'finished' },
  ]),
  evt('elms', '4 Hours of Imola', { name: 'Imola Circuit', country: 'Italy', countryCode: 'IT', lat: 44.3439, lng: 11.7167 }, '2026-07-05', '2026-07-05', [
    { type: 'race', name: '4 Hours of Imola', startTime: '2026-07-05T11:00:00Z', state: 'upcoming' },
  ]),
  evt('elms', '4 Hours of Spa-Francorchamps', { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE', lat: 50.4372, lng: 5.9714 }, '2026-08-23', '2026-08-23', [
    { type: 'race', name: '4 Hours of Spa', startTime: '2026-08-23T11:00:00Z', state: 'upcoming' },
  ]),
  evt('elms', '4 Hours of Silverstone', { name: 'Silverstone Circuit', country: 'United Kingdom', countryCode: 'GB', lat: 52.0786, lng: -1.0169 }, '2026-09-13', '2026-09-13', [
    { type: 'race', name: '4 Hours of Silverstone', startTime: '2026-09-13T11:00:00Z', state: 'upcoming' },
  ]),
  evt('elms', '4 Hours of Portimão', { name: 'Algarve International Circuit', country: 'Portugal', countryCode: 'PT', lat: 37.2319, lng: -8.6267 }, '2026-10-10', '2026-10-10', [
    { type: 'race', name: '4 Hours of Portimão', startTime: '2026-10-10T11:00:00Z', state: 'upcoming' },
  ]),
];

// ─── DTM 2026 ────────────────────────────────────────────
const dtm: CalendarEntry[] = [
  evt('dtm', 'DTM Red Bull Ring', { name: 'Red Bull Ring', country: 'Austria', countryCode: 'AT', lat: 47.2197, lng: 14.7647 }, '2026-04-24', '2026-04-26', [
    { type: 'qualifying', name: 'Qualifying 1', startTime: '2026-04-25T08:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race 1', startTime: '2026-04-25T11:30:00Z', state: 'finished' },
    { type: 'qualifying', name: 'Qualifying 2', startTime: '2026-04-26T08:00:00Z', state: 'finished' },
    { type: 'race', name: 'Race 2', startTime: '2026-04-26T11:30:00Z', state: 'finished' },
  ]),
  evt('dtm', 'DTM Zandvoort', { name: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL', lat: 52.3888, lng: 4.5409 }, '2026-05-22', '2026-05-24', [
    { type: 'race', name: 'Race 1', startTime: '2026-05-23T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-05-24T11:30:00Z', state: 'upcoming' },
  ]),
  evt('dtm', 'DTM Lausitzring', { name: 'Dekra Lausitzring', country: 'Germany', countryCode: 'DE', lat: 51.5272, lng: 13.9256 }, '2026-06-19', '2026-06-21', [
    { type: 'race', name: 'Race 1', startTime: '2026-06-20T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-06-21T11:30:00Z', state: 'upcoming' },
  ]),
  evt('dtm', 'DTM Norisring', { name: 'Norisring', country: 'Germany', countryCode: 'DE', lat: 49.4417, lng: 11.0931 }, '2026-07-03', '2026-07-05', [
    { type: 'race', name: 'Race 1', startTime: '2026-07-04T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-07-05T11:30:00Z', state: 'upcoming' },
  ]),
  evt('dtm', 'DTM Oschersleben', { name: 'Motorsport Arena Oschersleben', country: 'Germany', countryCode: 'DE', lat: 52.0269, lng: 11.2792 }, '2026-07-24', '2026-07-26', [
    { type: 'race', name: 'Race 1', startTime: '2026-07-25T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-07-26T11:30:00Z', state: 'upcoming' },
  ]),
  evt('dtm', 'DTM Nürburgring', { name: 'Nürburgring', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-08-14', '2026-08-16', [
    { type: 'race', name: 'Race 1', startTime: '2026-08-15T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-08-16T11:30:00Z', state: 'upcoming' },
  ]),
  evt('dtm', 'DTM Sachsenring', { name: 'Sachsenring', country: 'Germany', countryCode: 'DE', lat: 50.7919, lng: 12.6869 }, '2026-09-11', '2026-09-13', [
    { type: 'race', name: 'Race 1', startTime: '2026-09-12T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-09-13T11:30:00Z', state: 'upcoming' },
  ]),
  evt('dtm', 'DTM Hockenheimring', { name: 'Hockenheimring', country: 'Germany', countryCode: 'DE', lat: 49.3278, lng: 8.5656 }, '2026-10-09', '2026-10-11', [
    { type: 'race', name: 'Race 1', startTime: '2026-10-10T11:30:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-10-11T11:30:00Z', state: 'upcoming' },
  ]),
];

// ─── GT WORLD CHALLENGE EUROPE 2026 ─────────────────────
const gtwce: CalendarEntry[] = [
  evt('gtwce', '6 Hours of Circuit Paul Ricard', { name: 'Circuit Paul Ricard', country: 'France', countryCode: 'FR', lat: 43.2506, lng: 5.7917 }, '2026-04-11', '2026-04-11', [
    { type: 'race', name: 'Endurance Cup Rd 1', startTime: '2026-04-11T10:00:00Z', state: 'finished' },
  ]),
  evt('gtwce', 'Sprint Cup Brands Hatch', { name: 'Brands Hatch', country: 'United Kingdom', countryCode: 'GB', lat: 51.3569, lng: 0.2631 }, '2026-05-02', '2026-05-03', [
    { type: 'race', name: 'Sprint Race 1', startTime: '2026-05-02T13:00:00Z', state: 'finished' },
    { type: 'race', name: 'Sprint Race 2', startTime: '2026-05-03T11:00:00Z', state: 'finished' },
  ]),
  evt('gtwce', '3 Hours of Monza', { name: 'Monza Circuit', country: 'Italy', countryCode: 'IT', lat: 45.6156, lng: 9.2811 }, '2026-05-31', '2026-05-31', [
    { type: 'race', name: 'Endurance Cup Rd 2', startTime: '2026-05-31T12:00:00Z', state: 'upcoming' },
  ]),
  evt('gtwce', 'Sprint Cup Misano', { name: 'Misano World Circuit', country: 'Italy', countryCode: 'IT', lat: 43.9628, lng: 12.6847 }, '2026-06-13', '2026-06-14', [
    { type: 'race', name: 'Sprint Race 1', startTime: '2026-06-13T13:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Sprint Race 2', startTime: '2026-06-14T11:00:00Z', state: 'upcoming' },
  ]),
  evt('gtwce', '24 Hours of Spa', { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE', lat: 50.4372, lng: 5.9714 }, '2026-07-04', '2026-07-05', [
    { type: 'qualifying', name: 'Superpole', startTime: '2026-07-03T16:00:00Z', state: 'upcoming' },
    { type: 'race', name: '24 Hours of Spa', startTime: '2026-07-04T16:00:00Z', state: 'upcoming' },
  ]),
  evt('gtwce', 'Sprint Cup Magny-Cours', { name: 'Circuit de Nevers Magny-Cours', country: 'France', countryCode: 'FR', lat: 46.8642, lng: 3.1636 }, '2026-08-29', '2026-08-30', [
    { type: 'race', name: 'Sprint Race 1', startTime: '2026-08-29T13:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Sprint Race 2', startTime: '2026-08-30T11:00:00Z', state: 'upcoming' },
  ]),
  evt('gtwce', 'Sprint Cup Zandvoort', { name: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL', lat: 52.3888, lng: 4.5409 }, '2026-09-19', '2026-09-20', [
    { type: 'race', name: 'Sprint Race 1', startTime: '2026-09-19T13:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Sprint Race 2', startTime: '2026-09-20T11:00:00Z', state: 'upcoming' },
  ]),
  evt('gtwce', 'Sprint Cup Barcelona', { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', lat: 41.57, lng: 2.2611 }, '2026-10-03', '2026-10-04', [
    { type: 'race', name: 'Sprint Race 1', startTime: '2026-10-03T13:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Sprint Race 2', startTime: '2026-10-04T11:00:00Z', state: 'upcoming' },
  ]),
  evt('gtwce', 'Endurance Cup Portimão', { name: 'Algarve International Circuit', country: 'Portugal', countryCode: 'PT', lat: 37.2319, lng: -8.6267 }, '2026-10-18', '2026-10-18', [
    { type: 'race', name: 'Endurance Cup Finale', startTime: '2026-10-18T10:00:00Z', state: 'upcoming' },
  ]),
];

// ─── NÜRBURGRING / NLS 2026 ─────────────────────────────
const nurburgring: CalendarEntry[] = [
  evt('nurburgring', 'NLS 1 — Westfalenfahrt', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-03-14', '2026-03-14', [
    { type: 'race', name: 'NLS 1', startTime: '2026-03-14T10:00:00Z', state: 'finished' },
  ]),
  evt('nurburgring', 'NLS 2 — Barbarossapreis', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-03-21', '2026-03-21', [
    { type: 'race', name: 'NLS 2', startTime: '2026-03-21T10:00:00Z', state: 'finished' },
  ]),
  evt('nurburgring', 'NLS 3 — Adenauer Trophy', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-04-11', '2026-04-11', [
    { type: 'race', name: 'NLS 3', startTime: '2026-04-11T10:00:00Z', state: 'finished' },
  ]),
  evt('nurburgring', '24h Qualifying Race 1', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-04-18', '2026-04-18', [
    { type: 'race', name: '24h Quali Race 1', startTime: '2026-04-18T10:00:00Z', state: 'finished' },
  ]),
  evt('nurburgring', '24h Qualifying Race 2', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-04-19', '2026-04-19', [
    { type: 'race', name: '24h Quali Race 2', startTime: '2026-04-19T10:00:00Z', state: 'finished' },
  ]),
  evt('nurburgring', 'ADAC 24h Nürburgring', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-05-16', '2026-05-17', [
    { type: 'qualifying', name: 'Top Qualifying', startTime: '2026-05-15T16:00:00Z', state: 'finished' },
    { type: 'race', name: '24 Hours of Nürburgring', startTime: '2026-05-16T13:00:00Z', state: 'finished' },
  ]),
  evt('nurburgring', 'NLS 6 — Eifel Trophy', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-06-20', '2026-06-20', [
    { type: 'race', name: 'NLS 6', startTime: '2026-06-20T10:00:00Z', state: 'upcoming' },
  ]),
  evt('nurburgring', 'NLS 7 — 6h Ruhr-Pokal', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-08-01', '2026-08-01', [
    { type: 'race', name: '6h Ruhr-Pokal', startTime: '2026-08-01T08:00:00Z', state: 'upcoming' },
  ]),
  evt('nurburgring', 'NLS 8 — Reinoldus', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-09-12', '2026-09-12', [
    { type: 'race', name: 'NLS 8', startTime: '2026-09-12T10:00:00Z', state: 'upcoming' },
  ]),
  evt('nurburgring', 'NLS 9 — ACAS Cup', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-09-13', '2026-09-13', [
    { type: 'race', name: 'NLS 9', startTime: '2026-09-13T10:00:00Z', state: 'upcoming' },
  ]),
  evt('nurburgring', 'NLS 10 — Sportwarte Trophy', { name: 'Nürburgring Nordschleife', country: 'Germany', countryCode: 'DE', lat: 50.3356, lng: 6.9475 }, '2026-10-10', '2026-10-10', [
    { type: 'race', name: 'NLS 10', startTime: '2026-10-10T10:00:00Z', state: 'upcoming' },
  ]),
];

// ─── PORSCHE SUPERCUP 2026 ──────────────────────────────
const porscheSupercup: CalendarEntry[] = [
  evt('porsche-supercup', 'Supercup Monaco', { name: 'Circuit de Monaco', country: 'Monaco', countryCode: 'MC', lat: 43.7347, lng: 7.4206 }, '2026-06-04', '2026-06-06', [
    { type: 'race', name: 'Race', startTime: '2026-06-06T09:00:00Z', state: 'upcoming' },
  ]),
  evt('porsche-supercup', 'Supercup Barcelona-Catalunya', { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', lat: 41.57, lng: 2.2611 }, '2026-06-12', '2026-06-14', [
    { type: 'race', name: 'Race', startTime: '2026-06-14T09:00:00Z', state: 'upcoming' },
  ]),
  evt('porsche-supercup', 'Supercup Austria', { name: 'Red Bull Ring', country: 'Austria', countryCode: 'AT', lat: 47.2197, lng: 14.7647 }, '2026-06-26', '2026-06-28', [
    { type: 'race', name: 'Race', startTime: '2026-06-28T09:00:00Z', state: 'upcoming' },
  ]),
  evt('porsche-supercup', 'Supercup Belgium', { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE', lat: 50.4372, lng: 5.9714 }, '2026-07-17', '2026-07-19', [
    { type: 'race', name: 'Race', startTime: '2026-07-19T09:00:00Z', state: 'upcoming' },
  ]),
  evt('porsche-supercup', 'Supercup Hungary', { name: 'Hungaroring', country: 'Hungary', countryCode: 'HU', lat: 47.5789, lng: 19.2486 }, '2026-07-24', '2026-07-26', [
    { type: 'race', name: 'Race', startTime: '2026-07-26T09:00:00Z', state: 'upcoming' },
  ]),
  evt('porsche-supercup', 'Supercup Zandvoort', { name: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL', lat: 52.3888, lng: 4.5409 }, '2026-08-21', '2026-08-23', [
    { type: 'race', name: 'Race 1', startTime: '2026-08-22T09:00:00Z', state: 'upcoming' },
    { type: 'race', name: 'Race 2', startTime: '2026-08-23T09:00:00Z', state: 'upcoming' },
  ]),
  evt('porsche-supercup', 'Supercup Monza', { name: 'Monza Circuit', country: 'Italy', countryCode: 'IT', lat: 45.6156, lng: 9.2811 }, '2026-09-04', '2026-09-06', [
    { type: 'race', name: 'Race', startTime: '2026-09-06T09:00:00Z', state: 'upcoming' },
  ]),
];

// ─── COMBINED EXPORT ─────────────────────────────────────
export const CALENDAR_2026: CalendarEntry[] = [
  ...f1,
  ...wec,
  ...imsa,
  ...motogp,
  ...wrc,
  ...elms,
  ...dtm,
  ...gtwce,
  ...nurburgring,
  ...porscheSupercup,
];
