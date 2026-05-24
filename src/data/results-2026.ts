/**
 * 2026 Race Results — real data.
 * F1: Rounds 1–4 (Australia → Miami) — source: formula1.com, Wikipedia
 *     Bahrain & Saudi Arabia GPs cancelled (Middle East conflict)
 *     Round 5 = Canada (May 24, in progress)
 * MotoGP: Rounds 1–6 (Thailand → Catalunya) — source: motogp.com, crash.net
 *     Catalunya result reflects post-penalty classification (Mir -16s)
 * WEC: Rounds 1–2 (Imola, Spa) — source: fiawec.com, Wikipedia
 */

import type { SeriesId } from '@/types';

export interface RaceResult {
  id: string;
  series: SeriesId;
  round: number;
  name: string;
  circuit: string;
  country: string;
  countryCode: string;
  date: string;
  podium: {
    pos: number;
    driver: string;
    team: string;
    time?: string;
  }[];
  fastestLap?: { driver: string; team: string };
}

// ─── F1 2026 Race Results ───────────────────────────────
export const F1_RESULTS_2026: RaceResult[] = [
  {
    id: 'f1-r1-australia',
    series: 'f1',
    round: 1,
    name: 'Australian Grand Prix',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    countryCode: 'AU',
    date: '2026-03-08',
    podium: [
      { pos: 1, driver: 'George Russell', team: 'Mercedes', time: '1:23:06.801' },
      { pos: 2, driver: 'Kimi Antonelli', team: 'Mercedes' },
      { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari' },
    ],
    fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing' },
  },
  {
    id: 'f1-r2-china',
    series: 'f1',
    round: 2,
    name: 'Chinese Grand Prix',
    circuit: 'Shanghai International Circuit',
    country: 'China',
    countryCode: 'CN',
    date: '2026-03-15',
    podium: [
      { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:33:15.607' },
      { pos: 2, driver: 'Lewis Hamilton', team: 'Ferrari' },
      { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari' },
    ],
    fastestLap: { driver: 'Kimi Antonelli', team: 'Mercedes' },
  },
  {
    id: 'f1-r3-japan',
    series: 'f1',
    round: 3,
    name: 'Japanese Grand Prix',
    circuit: 'Suzuka Circuit',
    country: 'Japan',
    countryCode: 'JP',
    date: '2026-03-29',
    podium: [
      { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:28:03.403' },
      { pos: 2, driver: 'Oscar Piastri', team: 'McLaren' },
      { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari' },
    ],
    fastestLap: { driver: 'Kimi Antonelli', team: 'Mercedes' },
  },
  {
    id: 'f1-r4-miami',
    series: 'f1',
    round: 4,
    name: 'Miami Grand Prix',
    circuit: 'Miami International Autodrome',
    country: 'United States',
    countryCode: 'US',
    date: '2026-05-03',
    podium: [
      { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:33:19.273' },
      { pos: 2, driver: 'Lando Norris', team: 'McLaren' },
      { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari' },
    ],
    fastestLap: { driver: 'Lando Norris', team: 'McLaren' },
  },
];

// ─── MotoGP 2026 Race Results ───────────────────────────
export const MOTOGP_RESULTS_2026: RaceResult[] = [
  {
    id: 'motogp-r1-thailand',
    series: 'motogp',
    round: 1,
    name: 'Thailand Grand Prix',
    circuit: 'Chang International Circuit',
    country: 'Thailand',
    countryCode: 'TH',
    date: '2026-03-01',
    podium: [
      { pos: 1, driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
      { pos: 2, driver: 'Jorge Martín', team: 'Aprilia Racing' },
      { pos: 3, driver: 'Pedro Acosta', team: 'KTM' },
    ],
  },
  {
    id: 'motogp-r2-brazil',
    series: 'motogp',
    round: 2,
    name: 'Brazilian Grand Prix',
    circuit: 'Autódromo Ayrton Senna',
    country: 'Brazil',
    countryCode: 'BR',
    date: '2026-03-22',
    podium: [
      { pos: 1, driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
      { pos: 2, driver: 'Fabio Di Giannantonio', team: 'VR46' },
      { pos: 3, driver: 'Jorge Martín', team: 'Aprilia Racing' },
    ],
  },
  {
    id: 'motogp-r3-usa',
    series: 'motogp',
    round: 3,
    name: 'United States Grand Prix',
    circuit: 'Circuit of the Americas',
    country: 'United States',
    countryCode: 'US',
    date: '2026-03-29',
    podium: [
      { pos: 1, driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
      { pos: 2, driver: 'Pedro Acosta', team: 'KTM' },
      { pos: 3, driver: 'Ai Ogura', team: 'Trackhouse' },
    ],
  },
  {
    id: 'motogp-r4-spain',
    series: 'motogp',
    round: 4,
    name: 'Spanish Grand Prix',
    circuit: 'Circuito de Jerez',
    country: 'Spain',
    countryCode: 'ES',
    date: '2026-04-26',
    podium: [
      { pos: 1, driver: 'Álex Márquez', team: 'Gresini Racing' },
      { pos: 2, driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
      { pos: 3, driver: 'Fabio Di Giannantonio', team: 'VR46' },
    ],
  },
  {
    id: 'motogp-r5-france',
    series: 'motogp',
    round: 5,
    name: 'French Grand Prix',
    circuit: 'Bugatti Circuit',
    country: 'France',
    countryCode: 'FR',
    date: '2026-05-10',
    podium: [
      { pos: 1, driver: 'Jorge Martín', team: 'Aprilia Racing' },
      { pos: 2, driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
      { pos: 3, driver: 'Raúl Fernández', team: 'Trackhouse' },
    ],
  },
  {
    id: 'motogp-r6-catalunya',
    series: 'motogp',
    round: 6,
    name: 'Catalan Grand Prix',
    circuit: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    countryCode: 'ES',
    date: '2026-05-17',
    podium: [
      { pos: 1, driver: 'Fabio Di Giannantonio', team: 'VR46' },
      { pos: 2, driver: 'Fermín Aldeguer', team: 'Gresini Racing' },
      { pos: 3, driver: 'Francesco Bagnaia', team: 'Ducati' },
    ],
  },
];

// ─── WEC 2026 Hypercar Results ──────────────────────────
export const WEC_RESULTS_2026: RaceResult[] = [
  {
    id: 'wec-r1-imola',
    series: 'wec',
    round: 1,
    name: '6 Hours of Imola',
    circuit: 'Autodromo Enzo e Dino Ferrari',
    country: 'Italy',
    countryCode: 'IT',
    date: '2026-04-19',
    podium: [
      { pos: 1, driver: 'Buemi / Hartley / Hirakawa', team: 'Toyota Racing #8' },
      { pos: 2, driver: 'Frijns / Rast / van der Linde', team: 'BMW M Team WRT #20' },
      { pos: 3, driver: 'Estre / Christensen / Makowiecki', team: 'Porsche Penske #6' },
    ],
  },
  {
    id: 'wec-r2-spa',
    series: 'wec',
    round: 2,
    name: '6 Hours of Spa-Francorchamps',
    circuit: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    countryCode: 'BE',
    date: '2026-05-09',
    podium: [
      { pos: 1, driver: 'Frijns / Rast / van der Linde', team: 'BMW M Team WRT #20' },
      { pos: 2, driver: 'Buemi / Hartley / Hirakawa', team: 'Toyota Racing #8' },
      { pos: 3, driver: 'Fuoco / Molina / Nielsen', team: 'Ferrari AF Corse #50' },
    ],
  },
];

// ─── WRC 2026 Rally Results ──────────────────────────────
// Source: wrc.com, Wikipedia, DirtFish, TGR press releases
export const WRC_RESULTS_2026: RaceResult[] = [
  {
    id: 'wrc-r1-montecarlo',
    series: 'wrc',
    round: 1,
    name: 'Rallye Monte-Carlo',
    circuit: 'Monte Carlo',
    country: 'Monaco',
    countryCode: 'MC',
    date: '2026-01-25',
    podium: [
      { pos: 1, driver: 'O. Solberg / E. Edmondson', team: 'Toyota' },
      { pos: 2, driver: 'E. Evans / S. Martin', team: 'Toyota' },
      { pos: 3, driver: 'S. Ogier / V. Landais', team: 'Toyota' },
    ],
  },
  {
    id: 'wrc-r2-sweden',
    series: 'wrc',
    round: 2,
    name: 'Rally Sweden',
    circuit: 'Umeå Service Park',
    country: 'Sweden',
    countryCode: 'SE',
    date: '2026-02-15',
    podium: [
      { pos: 1, driver: 'E. Evans / S. Martin', team: 'Toyota' },
      { pos: 2, driver: 'T. Katsuta / A. Johnston', team: 'Toyota' },
      { pos: 3, driver: 'S. Pajari / M. Salminen', team: 'Toyota' },
    ],
  },
  {
    id: 'wrc-r3-kenya',
    series: 'wrc',
    round: 3,
    name: 'Safari Rally Kenya',
    circuit: 'Naivasha',
    country: 'Kenya',
    countryCode: 'KE',
    date: '2026-03-29',
    podium: [
      { pos: 1, driver: 'T. Katsuta / A. Johnston', team: 'Toyota' },
      { pos: 2, driver: 'A. Fourmaux / A. Coria', team: 'Hyundai Motorsport' },
      { pos: 3, driver: 'S. Pajari / M. Salminen', team: 'Toyota' },
    ],
  },
  {
    id: 'wrc-r4-croatia',
    series: 'wrc',
    round: 4,
    name: 'Croatia Rally',
    circuit: 'Zagreb',
    country: 'Croatia',
    countryCode: 'HR',
    date: '2026-04-27',
    podium: [
      { pos: 1, driver: 'T. Katsuta / A. Johnston', team: 'Toyota' },
      { pos: 2, driver: 'S. Pajari / M. Salminen', team: 'Toyota' },
      { pos: 3, driver: 'H. Paddon', team: 'Hyundai Motorsport' },
    ],
  },
  {
    id: 'wrc-r5-canarias',
    series: 'wrc',
    round: 5,
    name: 'Rally Islas Canarias',
    circuit: 'Las Palmas',
    country: 'Spain',
    countryCode: 'ES',
    date: '2026-05-04',
    podium: [
      { pos: 1, driver: 'S. Ogier / V. Landais', team: 'Toyota' },
      { pos: 2, driver: 'E. Evans / S. Martin', team: 'Toyota' },
      { pos: 3, driver: 'S. Pajari / M. Salminen', team: 'Toyota' },
    ],
  },
  {
    id: 'wrc-r6-portugal',
    series: 'wrc',
    round: 6,
    name: 'Rally de Portugal',
    circuit: 'Matosinhos',
    country: 'Portugal',
    countryCode: 'PT',
    date: '2026-05-11',
    podium: [
      { pos: 1, driver: 'T. Neuville / M. Wydaeghe', team: 'Hyundai Motorsport' },
      { pos: 2, driver: 'O. Solberg / E. Edmondson', team: 'Toyota' },
      { pos: 3, driver: 'E. Evans / S. Martin', team: 'Toyota' },
    ],
  },
];

// ─── IMSA 2026 GTP Results ────────────────────────────────
// Source: imsa.com, motorsport.com, porsche.com racing, racer.com
export const IMSA_RESULTS_2026: RaceResult[] = [
  {
    id: 'imsa-r1-daytona',
    series: 'imsa',
    round: 1,
    name: 'Rolex 24 At Daytona',
    circuit: 'Daytona International Speedway',
    country: 'United States',
    countryCode: 'US',
    date: '2026-01-25',
    podium: [
      { pos: 1, driver: 'Nasr / Andlauer / Heinrich', team: 'Porsche Penske Motorsport' },
      { pos: 2, driver: 'Bamber / Aitken / Vesti', team: 'Whelen Cadillac' },
      { pos: 3, driver: 'Eng / Wittmann / Yelloly', team: 'BMW M Team WRT' },
    ],
  },
  {
    id: 'imsa-r2-sebring',
    series: 'imsa',
    round: 2,
    name: '12 Hours of Sebring',
    circuit: 'Sebring International Raceway',
    country: 'United States',
    countryCode: 'US',
    date: '2026-03-21',
    podium: [
      { pos: 1, driver: 'Nasr / Andlauer / Heinrich', team: 'Porsche Penske Motorsport' },
      { pos: 2, driver: 'Jaminet / Campbell / Estre', team: 'Porsche Penske Motorsport' },
      { pos: 3, driver: 'Bamber / Aitken / Vesti', team: 'Whelen Cadillac' },
    ],
  },
  {
    id: 'imsa-r3-longbeach',
    series: 'imsa',
    round: 3,
    name: 'Acura Grand Prix of Long Beach',
    circuit: 'Long Beach Street Circuit',
    country: 'United States',
    countryCode: 'US',
    date: '2026-04-18',
    podium: [
      { pos: 1, driver: 'van der Zande / Yelloly', team: 'MSR Acura' },
      { pos: 2, driver: 'Aitken / Vesti', team: 'Whelen Cadillac' },
      { pos: 3, driver: 'Vanthoor / Estre', team: 'Porsche Penske Motorsport' },
    ],
  },
  {
    id: 'imsa-r4-lagunaseca',
    series: 'imsa',
    round: 4,
    name: 'WeatherTech 240 at Laguna Seca',
    circuit: 'WeatherTech Raceway Laguna Seca',
    country: 'United States',
    countryCode: 'US',
    date: '2026-05-03',
    podium: [
      { pos: 1, driver: 'Heinrich / van der Helm', team: 'JDC-Miller Porsche' },
      { pos: 2, driver: 'Bamber / Aitken', team: 'Whelen Cadillac' },
      { pos: 3, driver: 'Eng / Wittmann', team: 'BMW M Team WRT' },
    ],
  },
];

// ─── ELMS 2026 LMP2 Results ───────────────────────────────
// Source: europeanlemansseries.com, prescottmotorsport.co.uk, autohebdof1.com
export const ELMS_RESULTS_2026: RaceResult[] = [
  {
    id: 'elms-r1-barcelona',
    series: 'elms',
    round: 1,
    name: '4 Hours of Barcelona',
    circuit: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    countryCode: 'ES',
    date: '2026-04-06',
    podium: [
      { pos: 1, driver: 'Masson / Gray / Rousset', team: 'Forestier Racing by Panis' },
      { pos: 2, driver: 'Garg / De Gerus', team: 'Inter Europol Competition' },
      { pos: 3, driver: 'Hanley / Saucy / Peebles', team: 'United Autosports' },
    ],
  },
  {
    id: 'elms-r2-lecastellet',
    series: 'elms',
    round: 2,
    name: '4 Hours of Le Castellet',
    circuit: 'Circuit Paul Ricard',
    country: 'France',
    countryCode: 'FR',
    date: '2026-05-18',
    podium: [
      { pos: 1, driver: 'Peebles / Saucy / Hanley', team: 'United Autosports' },
      { pos: 2, driver: 'De Gerus', team: 'Inter Europol Competition' },
      { pos: 3, driver: 'Chatin', team: 'IDEC Sport' },
    ],
  },
];

// ─── Combined recent results (latest first) ─────────────
export const ALL_RESULTS_2026: RaceResult[] = [
  ...F1_RESULTS_2026,
  ...MOTOGP_RESULTS_2026,
  ...WEC_RESULTS_2026,
  ...WRC_RESULTS_2026,
  ...IMSA_RESULTS_2026,
  ...ELMS_RESULTS_2026,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
