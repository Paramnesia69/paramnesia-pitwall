/**
 * 2026 Race Results — real data.
 * F1: Rounds 1–4 (Australia → Miami) — source: formula1.com, Wikipedia
 *     Bahrain & Saudi Arabia GPs cancelled (Middle East conflict)
 *     Round 5 = Canada (May 24) — handled by /api/f1/results (Jolpica)
 * MotoGP: Rounds 1–7 (Thailand → Italy) — source: motogp.com, crash.net
 *     Catalunya result reflects post-penalty classification (Mir -16s)
 * WEC: Rounds 1–2 (Imola, Spa) — source: fiawec.com, Wikipedia
 * GTWCE: R1 Paul Ricard (6h), R2 Brands Hatch (Race 1+2), R3 Monza (3h) — source: gt-world-challenge-europe.com, pitdebrief.com
 */

import type { RaceResult } from '@/types';
export type { RaceResult };

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
    sessions: [
      {
        type: 'race',
        fastestLap: 'Fabio Di Giannantonio',
        entries: [
          { pos: 1, driver: 'Fabio Di Giannantonio', team: 'Ducati', time: '20m 6.243s' },
          { pos: 2, driver: 'Fermín Aldeguer', team: 'Ducati', gap: '+1.466s' },
          { pos: 3, driver: 'Francesco Bagnaia', team: 'Ducati', gap: '+4.320s' },
          { pos: 4, driver: 'Marco Bezzecchi', team: 'Aprilia', gap: '+4.679s' },
          { pos: 5, driver: 'Fabio Quartararo', team: 'Yamaha', gap: '+4.876s' },
          { pos: 6, driver: 'Luca Marini', team: 'Honda', gap: '+4.971s' },
          { pos: 7, driver: 'Brad Binder', team: 'KTM', gap: '+5.137s' },
          { pos: 8, driver: 'Ai Ogura', team: 'Aprilia', gap: '+5.377s' },
          { pos: 9, driver: 'Diogo Moreira', team: 'Honda', gap: '+6.839s' },
          { pos: 10, driver: 'Franco Morbidelli', team: 'Ducati', gap: '+7.160s' },
        ],
      },
      {
        type: 'sprint',
        entries: [
          { pos: 1, driver: 'Alex Márquez', team: 'Ducati', time: '20m 2.258s' },
          { pos: 2, driver: 'Pedro Acosta', team: 'KTM', gap: '+0.041s' },
          { pos: 3, driver: 'Fabio Di Giannantonio', team: 'Ducati', gap: '+0.457s' },
          { pos: 4, driver: 'Raúl Fernández', team: 'Aprilia', gap: '+2.928s' },
          { pos: 5, driver: 'Johann Zarco', team: 'Honda', gap: '+4.764s' },
          { pos: 6, driver: 'Francesco Bagnaia', team: 'Ducati', gap: '+4.894s' },
          { pos: 7, driver: 'Franco Morbidelli', team: 'Ducati', gap: '+6.175s' },
          { pos: 8, driver: 'Ai Ogura', team: 'Aprilia', gap: '+6.871s' },
          { pos: 9, driver: 'Marco Bezzecchi', team: 'Aprilia', gap: '+7.381s' },
          { pos: 10, driver: 'Enea Bastianini', team: 'KTM', gap: '+7.869s' },
        ],
      },
      {
        type: 'qualifying',
        label: 'Qualifying',
        entries: [
          { pos: 1, driver: 'Pedro Acosta', team: 'KTM', time: '1\'38.068s' },
          { pos: 2, driver: 'Franco Morbidelli', team: 'Ducati', gap: '+0.233s' },
          { pos: 3, driver: 'Alex Márquez', team: 'Ducati', gap: '+0.274s' },
          { pos: 4, driver: 'Raúl Fernández', team: 'Aprilia', gap: '+0.385s' },
          { pos: 5, driver: 'Johann Zarco', team: 'Honda', gap: '+0.406s' },
          { pos: 6, driver: 'Fabio Di Giannantonio', team: 'Ducati', gap: '+0.409s' },
          { pos: 7, driver: 'Fabio Quartararo', team: 'Yamaha', gap: '+0.443s' },
          { pos: 8, driver: 'Brad Binder', team: 'KTM', gap: '+0.529s' },
          { pos: 9, driver: 'Jorge Martín', team: 'Aprilia', gap: '+0.584s' },
          { pos: 10, driver: 'Joan Mir', team: 'Honda', gap: '+0.618s' },
          { pos: 11, driver: 'Jack Miller', team: 'Yamaha', gap: '+0.705s' },
          { pos: 12, driver: 'Marco Bezzecchi', team: 'Aprilia', gap: '+0.717s' },
        ],
      },
    ],
  },
  {
    id: 'motogp-r7-italy',
    series: 'motogp',
    round: 7,
    name: 'Italian Grand Prix',
    circuit: 'Autodromo Internazionale del Mugello',
    country: 'Italy',
    countryCode: 'IT',
    date: '2026-05-31',
    podium: [
      { pos: 1, driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
      { pos: 2, driver: 'Jorge Martín', team: 'Aprilia Racing' },
      { pos: 3, driver: 'Francesco Bagnaia', team: 'Ducati Lenovo' },
    ],
    fastestLap: { driver: 'Marco Bezzecchi', team: 'Aprilia Racing' },
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
      { pos: 3, driver: 'Pier Guidi / Giovinazzi / Calado', team: 'Ferrari AF Corse #51' },
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
      { pos: 2, driver: 'Magnussen / Marciello / Vanthoor', team: 'BMW M Team WRT #15' },
      { pos: 3, driver: 'Fuoco / Molina / Nielsen', team: 'Ferrari AF Corse #50' },
    ],
    sessions: [
      {
        type: 'race',
        label: 'Race — Hypercar',
        entries: [
          { pos: 1, driver: 'Frijns / Rast / van der Linde', team: 'BMW' },
          { pos: 2, driver: 'Magnussen / Marciello / Vanthoor', team: 'BMW' },
          { pos: 3, driver: 'Fuoco / Molina / Nielsen', team: 'Ferrari' },
          { pos: 4, driver: 'Tincknell / Gamble', team: 'Aston Martin' },
          { pos: 5, driver: 'Conway / Kobayashi / De Vries', team: 'Toyota' },
          { pos: 6, driver: 'Ye / Kubica / Hanson', team: 'Ferrari' },
          { pos: 7, driver: 'Di Resta / Vandoorne / Cassidy', team: 'Peugeot' },
          { pos: 8, driver: 'Lotterer / Derani / Jaubert', team: 'Genesis' },
          { pos: 9, driver: 'Deletraz / Stevens / Nato', team: 'Cadillac' },
          { pos: 10, driver: 'Buemi / Hartley / Hirakawa', team: 'Toyota' },
        ],
      },
    ],
  },
  {
    id: 'wec-r1-imola-lmgt3',
    series: 'wec',
    round: 1,
    name: '6 Hours of Imola — LMGT3',
    circuit: 'Autodromo Enzo e Dino Ferrari',
    country: 'Italy',
    countryCode: 'IT',
    date: '2026-04-19',
    podium: [
      { pos: 1, driver: 'McIntosh / Thompson / Harper', team: 'Team WRT BMW #69' },
      { pos: 2, driver: 'Catsburg / Edgar / McDonald', team: 'TF Sport Corvette #33' },
      { pos: 3, driver: 'Lietz / Shahin / Pera', team: 'Manthey Porsche #92' },
    ],
  },
  {
    id: 'wec-r2-spa-lmgt3',
    series: 'wec',
    round: 2,
    name: '6 Hours of Spa-Francorchamps — LMGT3',
    circuit: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    countryCode: 'BE',
    date: '2026-05-09',
    podium: [
      { pos: 1, driver: 'Heriau / Mann / Rovera', team: 'Vista AF Corse — Ferrari #21' },
      { pos: 2, driver: 'Au / Fleming / Kirchhöfer', team: 'Garage 59 McLaren #10' },
      { pos: 3, driver: 'James / Robichon / Drudi', team: 'Heart of Racing Aston Martin #27' },
    ],
    sessions: [
      {
        type: 'race',
        label: 'Race — LMGT3',
        entries: [
          { pos: 1, driver: 'Heriau / Mann / Rovera', team: 'Ferrari' },
          { pos: 2, driver: 'Au / Fleming / Kirchhöfer', team: 'McLaren' },
          { pos: 3, driver: 'James / Robichon / Drudi', team: 'Aston Martin' },
          { pos: 4, driver: 'Shahin / Pera / Lietz', team: 'Porsche' },
          { pos: 5, driver: 'Dempsey / Yoluc / Eastwood', team: 'Ferrari' },
          { pos: 6, driver: 'West / Gehrsitz / Goethe', team: 'McLaren' },
          { pos: 7, driver: 'Umbrarescu / Schmid / Lopez', team: 'Mercedes-AMG' },
          { pos: 8, driver: 'Cottingham / Boguslavskiy / Güven', team: 'Porsche' },
          { pos: 9, driver: 'Mcdonald / Edgar / Catsburg', team: 'Corvette' },
          { pos: 10, driver: 'Berry / Andrade / Martin', team: 'Ferrari' },
        ],
      },
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
    sessions: [
      {
        type: 'race',
        label: 'Overall Classification',
        entries: [
          { pos: 1, driver: 'T. Neuville / M. Wydaeghe', team: 'Hyundai', time: '3h 53m 01.7s' },
          { pos: 2, driver: 'O. Solberg / E. Edmondson', team: 'Toyota', gap: '+16.3s' },
          { pos: 3, driver: 'E. Evans / S. Martin', team: 'Toyota', gap: '+29.1s' },
          { pos: 4, driver: 'A. Fourmaux / A. Coria', team: 'Hyundai', gap: '+54.8s' },
          { pos: 5, driver: 'T. Katsuta / A. Johnston', team: 'Toyota', gap: '+1m 12.6s' },
          { pos: 6, driver: 'S. Ogier / V. Landais', team: 'Toyota', gap: '+1m 26.6s' },
          { pos: 7, driver: 'S. Pajari / M. Salminen', team: 'Toyota', gap: '+2m 50.9s' },
          { pos: 8, driver: 'D. Sordo / C. Carrera', team: 'Hyundai', gap: '+4m 10.0s' },
          { pos: 9, driver: 'M. Sesks / R. Francis', team: 'Ford', gap: '+6m 49.2s' },
          { pos: 10, driver: 'T. Suninen / J. Hussi', team: 'Toyota', gap: '+11m 13.8s' },
        ],
      },
    ],
  },
  {
    id: 'wrc-r7-japan',
    series: 'wrc',
    round: 7,
    name: 'FORUM8 Rally Japan',
    circuit: 'Aichi / Nagoya',
    country: 'Japan',
    countryCode: 'JP',
    date: '2026-05-31',
    podium: [
      { pos: 1, driver: 'E. Evans / S. Martin', team: 'Toyota' },
      { pos: 2, driver: 'S. Ogier / V. Landais', team: 'Toyota' },
      { pos: 3, driver: 'S. Pajari / M. Salminen', team: 'Toyota' },
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
  {
    id: 'imsa-r5-detroit',
    series: 'imsa',
    round: 5,
    name: 'Chevrolet Detroit Sports Car Classic',
    circuit: 'Detroit Street Circuit',
    country: 'United States',
    countryCode: 'US',
    date: '2026-05-30',
    podium: [
      { pos: 1, driver: 'Aitken / Bamber', team: 'Whelen Cadillac' },
      { pos: 2, driver: 'Eng / Wittmann', team: 'BMW M Team WRT' },
      { pos: 3, driver: 'R. Taylor / Albuquerque', team: 'Wayne Taylor Cadillac' },
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
  {
    id: 'elms-r1-barcelona-lmp3',
    series: 'elms',
    round: 1,
    name: '4 Hours of Barcelona — LMP3',
    circuit: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    countryCode: 'ES',
    date: '2026-04-06',
    podium: [
      { pos: 1, driver: 'Cautela / Pedersen / Rodella', team: 'Rinaldi Racing #5' },
      { pos: 2, driver: 'Brichacek / Favre / Rammo', team: 'DKR Engineering #4' },
      { pos: 3, driver: 'Bukhantsov / Chou / Cubides', team: 'Inter Europol #13' },
    ],
  },
  {
    id: 'elms-r1-barcelona-lmgt3',
    series: 'elms',
    round: 1,
    name: '4 Hours of Barcelona — LMGT3',
    circuit: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    countryCode: 'ES',
    date: '2026-04-06',
    podium: [
      { pos: 1, driver: 'Kurzejewski / Lietz / Sargent', team: 'Proton Competition #75 Porsche' },
      { pos: 2, driver: 'Birch / Boyd / Patterson', team: 'United Autosports #23 McLaren' },
      { pos: 3, driver: 'Jaubert / Kimura / Serra', team: 'Kessel Racing #57 Ferrari' },
    ],
  },
  {
    id: 'elms-r2-lecastellet-lmp3',
    series: 'elms',
    round: 2,
    name: '4 Hours of Le Castellet — LMP3',
    circuit: 'Circuit Paul Ricard',
    country: 'France',
    countryCode: 'FR',
    date: '2026-05-18',
    podium: [
      { pos: 1, driver: 'Bukhantsov / Chou / Cubides', team: 'Inter Europol #13' },
      { pos: 2, driver: 'Adcock / Antonel / Imbourg', team: 'M Racing #68' },
      { pos: 3, driver: 'Michal / Schwarze / Provost', team: 'R-ACE GP #85' },
    ],
  },
  {
    id: 'elms-r2-lecastellet-lmgt3',
    series: 'elms',
    round: 2,
    name: '4 Hours of Le Castellet — LMGT3',
    circuit: 'Circuit Paul Ricard',
    country: 'France',
    countryCode: 'FR',
    date: '2026-05-18',
    podium: [
      { pos: 1, driver: 'Jaubert / Kimura / Serra', team: 'Kessel Racing #57 Ferrari' },
      { pos: 2, driver: 'Eastwood / McDonald / Udell', team: 'TF Sport #33 Corvette' },
      { pos: 3, driver: 'Fjordbach / Andersen / Heinrich', team: 'High Class Racing #54' },
    ],
  },
];

// ─── DTM 2026 Race Results ────────────────────────────────
// Source: pitdebrief.com, autosport.com, motorsport.com
// Round 1: Red Bull Ring (Apr 25-26) | Round 2: Zandvoort (May 23-24)
export const DTM_RESULTS_2026: RaceResult[] = [
  {
    id: 'dtm-r1-rbr-race1',
    series: 'dtm',
    round: 1,
    name: 'DTM Red Bull Ring — Race 1',
    circuit: 'Red Bull Ring',
    country: 'Austria',
    countryCode: 'AT',
    date: '2026-04-25',
    podium: [
      { pos: 1, driver: 'Thomas Preining', team: 'Porsche' },
      { pos: 2, driver: 'Lucas Auer', team: 'Mercedes-AMG' },
      { pos: 3, driver: 'Maro Engel', team: 'Mercedes-AMG' },
    ],
  },
  {
    id: 'dtm-r1-rbr-race2',
    series: 'dtm',
    round: 1,
    name: 'DTM Red Bull Ring — Race 2',
    circuit: 'Red Bull Ring',
    country: 'Austria',
    countryCode: 'AT',
    date: '2026-04-26',
    podium: [
      { pos: 1, driver: 'Maro Engel', team: 'Mercedes-AMG' },
      { pos: 2, driver: 'Marco Wittmann', team: 'BMW' },
      { pos: 3, driver: 'Lucas Auer', team: 'Mercedes-AMG' },
    ],
  },
  {
    id: 'dtm-r2-zandvoort-race1',
    series: 'dtm',
    round: 2,
    name: 'DTM Zandvoort — Race 1',
    circuit: 'Circuit Zandvoort',
    country: 'Netherlands',
    countryCode: 'NL',
    date: '2026-05-23',
    podium: [
      { pos: 1, driver: 'Matteo Cairoli', team: 'Ferrari' },
      { pos: 2, driver: 'Lucas Auer', team: 'Mercedes-AMG' },
      { pos: 3, driver: 'Thierry Vermeulen', team: 'Ferrari' },
    ],
  },
  {
    id: 'dtm-r2-zandvoort-race2',
    series: 'dtm',
    round: 2,
    name: 'DTM Zandvoort — Race 2',
    circuit: 'Circuit Zandvoort',
    country: 'Netherlands',
    countryCode: 'NL',
    date: '2026-05-24',
    podium: [
      { pos: 1, driver: 'Kelvin van der Linde', team: 'BMW' },
      { pos: 2, driver: 'Ben Dörr', team: 'McLaren' },
      { pos: 3, driver: 'Marco Wittmann', team: 'BMW' },
    ],
    sessions: [
      {
        type: 'race',
        entries: [
          { pos: 1, driver: 'Kelvin van der Linde', team: 'BMW' },
          { pos: 2, driver: 'Ben Dörr', team: 'McLaren' },
          { pos: 3, driver: 'Marco Wittmann', team: 'BMW' },
          { pos: 4, driver: 'Maro Engel', team: 'Mercedes-AMG' },
          { pos: 5, driver: 'Thierry Vermeulen', team: 'Ferrari' },
          { pos: 6, driver: 'Luca Engstler', team: 'Lamborghini' },
          { pos: 7, driver: 'Marco Mapelli', team: 'Lamborghini' },
          { pos: 8, driver: 'Thomas Preining', team: 'Porsche' },
          { pos: 9, driver: 'Mirko Bortolotti', team: 'Lamborghini' },
          { pos: 10, driver: 'Ricardo Feller', team: 'Porsche' },
        ],
      },
    ],
  },
];

// ─── GTWCE 2026 Race Results ──────────────────────────────
// Source: gt-world-challenge-europe.com official results
// R1: 6 Hours of Paul Ricard (Apr 11) — Endurance Cup
// R2: Sprint Cup Brands Hatch (May 2–3) — Race 1 + Race 2
export const GTWCE_RESULTS_2026: RaceResult[] = [
  {
    id: 'gtwce-r1-paulricard',
    series: 'gtwce',
    round: 1,
    name: '6 Hours of Paul Ricard',
    circuit: 'Circuit Paul Ricard',
    country: 'France',
    countryCode: 'FR',
    date: '2026-04-11',
    podium: [
      { pos: 1, driver: 'Drudi / Sorensen / Thiim', team: 'Comtoyou Racing — Aston Martin' },
      { pos: 2, driver: 'Auer / Stolz / Engel', team: 'Mercedes-AMG Team MANN-FILTER' },
      { pos: 3, driver: 'Fleming / Prette / Goethe', team: 'Garage 59 — McLaren' },
    ],
  },
  {
    id: 'gtwce-r2-brandshatch-race1',
    series: 'gtwce',
    round: 2,
    name: 'Sprint Cup Brands Hatch — Race 1',
    circuit: 'Brands Hatch',
    country: 'United Kingdom',
    countryCode: 'GB',
    date: '2026-05-02',
    podium: [
      { pos: 1, driver: 'Leclerc / Neubauer', team: 'AF Corse — Ferrari' },
      { pos: 2, driver: 'Schuring / Boccolacci', team: 'Boutsen VDS — Porsche' },
      { pos: 3, driver: 'Weerts / van der Linde', team: 'Team WRT — BMW' },
    ],
    sessions: [
      {
        type: 'race',
        entries: [
          { pos: 1, driver: 'A. Leclerc / T. Neubauer', team: 'Ferrari' },
          { pos: 2, driver: 'M. Schuring / D. Boccolacci', team: 'Porsche' },
          { pos: 3, driver: 'C. Weerts / K. van der Linde', team: 'BMW' },
          { pos: 4, driver: 'A. Cordeel / J. Pepper', team: 'BMW' },
          { pos: 5, driver: 'K. Lappalainen / M. Cairoli', team: 'Ferrari' },
          { pos: 6, driver: 'L. Auer / M. Engel', team: 'Mercedes-AMG' },
          { pos: 7, driver: 'T. Mosca / M. Zagazeta', team: 'Ferrari' },
          { pos: 8, driver: 'T. Fleming / L. Prette', team: 'McLaren' },
          { pos: 9, driver: 'N. Thiim / K. Pauwels', team: 'Aston Martin' },
          { pos: 10, driver: 'B. Green / T. Vermeulen', team: 'Ferrari' },
        ],
      },
    ],
  },
  {
    id: 'gtwce-r2-brandshatch-race2',
    series: 'gtwce',
    round: 2,
    name: 'Sprint Cup Brands Hatch — Race 2',
    circuit: 'Brands Hatch',
    country: 'United Kingdom',
    countryCode: 'GB',
    date: '2026-05-03',
    podium: [
      { pos: 1, driver: 'Feller / Buus', team: 'Lionspeed GP — Porsche' },
      { pos: 2, driver: 'Juncadella / Lulham', team: 'Verstappen Racing — Mercedes-AMG' },
      { pos: 3, driver: 'Auer / Engel', team: 'Winward Racing — Mercedes-AMG' },
    ],
    sessions: [
      {
        type: 'race',
        entries: [
          { pos: 1, driver: 'R. Feller / B. Buus', team: 'Porsche' },
          { pos: 2, driver: 'D. Juncadella / C. Lulham', team: 'Mercedes-AMG' },
          { pos: 3, driver: 'L. Auer / M. Engel', team: 'Mercedes-AMG' },
          { pos: 4, driver: 'M. Hesse / V. Rossi', team: 'BMW' },
          { pos: 5, driver: 'D. Macdonald / M. Kirchhöfer', team: 'McLaren' },
          { pos: 6, driver: 'C. Weerts / K. van der Linde', team: 'BMW' },
          { pos: 7, driver: 'A. Cordeel / J. Pepper', team: 'BMW' },
          { pos: 8, driver: 'M. Lismont / I. Montenegro', team: 'BMW' },
          { pos: 9, driver: 'K. Lappalainen / M. Cairoli', team: 'Ferrari' },
          { pos: 10, driver: 'R. Andriolo / S. Gachet', team: 'McLaren' },
        ],
      },
    ],
  },
  {
    id: 'gtwce-r3-monza',
    series: 'gtwce',
    round: 3,
    name: 'Endurance Cup Monza',
    circuit: 'Autodromo Nazionale di Monza',
    country: 'Italy',
    countryCode: 'IT',
    date: '2026-05-31',
    podium: [
      { pos: 1, driver: 'Levi / Øgaard / Mazzola', team: 'Tresor Attempto — Audi' },
      { pos: 2, driver: 'Winward Racing', team: 'Winward Racing — Mercedes-AMG' },
      { pos: 3, driver: 'CSA Racing', team: 'CSA Racing — McLaren' },
    ],
  },
];

// ─── Nürburgring 2026 Results ─────────────────────────────
// Source: nuerburgring-langstrecken-serie.de, motorsport.com, pitdebrief.com
// NLS1 (Mar 14): Cancelled for safety reasons
// NLS2 (Mar 21): Verstappen/Winward DSQ → Harper/Pepper (Rowe BMW) inherit win
// NLS3 (Apr 11): Schubert BMW wins after KCMG Mercedes 85s penalty
// 24h Quali R1 (Apr 18): Cancelled — fatal accident (Juha Miettinen), race not resumed
// 24h Quali R2 (Apr 19): Haase/Green/Sims (Scherer-Phx Audi)
// 24h Nürburgring (May 16–17): Engel/Stolz/Schiller/Martin (Winward Mercedes)
export const NURBURGRING_RESULTS_2026: RaceResult[] = [
  {
    id: 'nurburgring-nls2-2026',
    series: 'nurburgring',
    round: 2,
    name: '58. ADAC Barbarossapreis (NLS2)',
    circuit: 'Nürburgring Nordschleife',
    country: 'Germany',
    countryCode: 'DE',
    date: '2026-03-21',
    podium: [
      { pos: 1, driver: 'Dan Harper / Jordan Pepper', team: 'Rowe Racing — BMW M4 GT3' },
      { pos: 2, driver: 'Tim Heinemann / Sven Müller', team: 'Falken Motorsports — Porsche' },
      { pos: 3, driver: 'Kaya / Piana / Stursberg', team: 'LOSCH Motorsport by Black Falcon — Porsche 911 GT3 R' },
    ],
  },
  {
    id: 'nurburgring-nls3-2026',
    series: 'nurburgring',
    round: 3,
    name: '57. Adenauer ADAC Rundstrecken-Trophy (NLS3)',
    circuit: 'Nürburgring Nordschleife',
    country: 'Germany',
    countryCode: 'DE',
    date: '2026-04-11',
    podium: [
      { pos: 1, driver: 'Eng / Wittmann / Frijns', team: 'Schubert Motorsport #77 — BMW M4 GT3 EVO' },
      { pos: 2, driver: 'Güven / Campbell', team: 'Manthey Racing #911 — Porsche GT3 R' },
      { pos: 3, driver: 'Olsen / Vervisch / Mies / Kolb', team: 'HRT Ford Racing #65 — Ford Mustang GT3' },
    ],
  },
  {
    id: 'nurburgring-24hq2-2026',
    series: 'nurburgring',
    round: 4,
    name: 'ADAC 24h Qualifying Race 2',
    circuit: 'Nürburgring Nordschleife',
    country: 'Germany',
    countryCode: 'DE',
    date: '2026-04-19',
    podium: [
      { pos: 1, driver: 'Haase / Green / Sims', team: 'Scherer-Phx #16 — Audi R8 LMS GT3' },
      { pos: 2, driver: 'Engstler / Bortolotti / Niederhauser', team: 'Red Bull Team Abt #84 — Lamborghini' },
      { pos: 3, driver: 'Preining / Campbell', team: 'Manthey Racing #911 — Porsche GT3 R "Grello"' },
    ],
  },
  {
    id: 'nurburgring-24h-2026',
    series: 'nurburgring',
    round: 6,
    name: 'ADAC RAVENOL 24h Nürburgring',
    circuit: 'Nürburgring Nordschleife',
    country: 'Germany',
    countryCode: 'DE',
    date: '2026-05-17',
    podium: [
      { pos: 1, driver: 'Engel / Stolz / Schiller / Martin', team: 'Winward Racing Ravenol #80 — Mercedes-AMG GT3 EVO' },
      { pos: 2, driver: 'Engstler / Bortolotti / Niederhauser', team: 'Red Bull Team Abt #84 — Lamborghini Huracán GT3' },
      { pos: 3, driver: 'Drudi / Krognes / Thiim / Fernandez Laser', team: 'Walkenhorst Motorsport #34 — Aston Martin Vantage GT3' },
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
  ...DTM_RESULTS_2026,
  ...GTWCE_RESULTS_2026,
  ...NURBURGRING_RESULTS_2026,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
