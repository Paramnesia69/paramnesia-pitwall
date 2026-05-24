/**
 * 2026 Championship Standings — real data.
 * F1: After Round 4 (Miami GP, May 3 2026) — source: formulaonehistory.com
 * MotoGP: After Round 6 (Catalan GP, May 17 2026) — source: gpblog.com
 */

export interface DriverStanding {
  pos: number;
  name: string;
  team: string;
  points: number;
  teamColor: string;
}

export interface ConstructorStanding {
  pos: number;
  name: string;
  points: number;
  color: string;
}

// ─── F1 2026 Drivers Championship (after R4 · Miami GP) ─
export const F1_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'K. Antonelli', team: 'Mercedes', points: 100, teamColor: '#27F4D2' },
  { pos: 2, name: 'G. Russell', team: 'Mercedes', points: 80, teamColor: '#27F4D2' },
  { pos: 3, name: 'C. Leclerc', team: 'Ferrari', points: 59, teamColor: '#E8002D' },
  { pos: 4, name: 'L. Norris', team: 'McLaren', points: 51, teamColor: '#FF8000' },
  { pos: 5, name: 'L. Hamilton', team: 'Ferrari', points: 51, teamColor: '#E8002D' },
  { pos: 6, name: 'O. Piastri', team: 'McLaren', points: 43, teamColor: '#FF8000' },
  { pos: 7, name: 'M. Verstappen', team: 'Red Bull Racing', points: 26, teamColor: '#3671C6' },
  { pos: 8, name: 'O. Bearman', team: 'Haas', points: 17, teamColor: '#B6BABD' },
  { pos: 9, name: 'P. Gasly', team: 'Alpine', points: 16, teamColor: '#0093CC' },
  { pos: 10, name: 'L. Lawson', team: 'Racing Bulls', points: 10, teamColor: '#6692FF' },
];

// ─── F1 2026 Constructors Championship (after R4 · Miami GP) ─
export const F1_CONSTRUCTORS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Mercedes', points: 180, color: '#27F4D2' },
  { pos: 2, name: 'Ferrari', points: 110, color: '#E8002D' },
  { pos: 3, name: 'McLaren', points: 94, color: '#FF8000' },
  { pos: 4, name: 'Red Bull Racing', points: 30, color: '#3671C6' },
  { pos: 5, name: 'Alpine', points: 23, color: '#0093CC' },
  { pos: 6, name: 'Haas', points: 18, color: '#B6BABD' },
  { pos: 7, name: 'Racing Bulls', points: 14, color: '#6692FF' },
  { pos: 8, name: 'Williams', points: 5, color: '#1868DB' },
  { pos: 9, name: 'Audi', points: 2, color: '#990000' },
  { pos: 10, name: 'Cadillac', points: 0, color: '#1E1E1E' },
  { pos: 11, name: 'Aston Martin', points: 0, color: '#358C75' },
];

// ─── WEC 2026 Hypercar Drivers Championship (after R2 · 6H Spa-Francorchamps) ─
// Source: fiawec.com / pitdebrief.com — BMW 1-2 at Spa
export const WEC_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'Frijns / Rast',                  team: 'BMW M WRT',         points: 35, teamColor: '#1E88E5' },
  { pos: 2, name: 'Buemi / Hartley / Hirakawa',     team: 'Toyota GR Sport',   points: 26, teamColor: '#EB0A1E' },
  { pos: 3, name: 'S. van der Linde / co.',         team: 'BMW M WRT',         points: 22, teamColor: '#1E88E5' },
  { pos: 4, name: 'Estre / Christensen',            team: 'Porsche Penske',    points: 19, teamColor: '#C0A062' },
  { pos: 5, name: 'Fuoco / Molina / Nielsen',       team: 'Ferrari AF Corse',  points: 15, teamColor: '#E8002D' },
];

// ─── WEC 2026 LMGT3 Drivers Championship (after R2 · 6H Spa-Francorchamps) ─
// Source: pitdebrief.com post-Spa standings
export const WEC_LMGT3_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'Pera / Lietz / Shahin',              team: 'Manthey Porsche',          points: 30, teamColor: '#C0A062' },
  { pos: 2, name: 'Au / Kirchhöfer / Fleming',          team: 'Garage 59 McLaren',        points: 26, teamColor: '#FF8000' },
  { pos: 3, name: 'McIntosh / Harper / Thompson',       team: 'Team WRT BMW',             points: 25, teamColor: '#1E88E5' },
  { pos: 4, name: 'McDonald / Edgar / Catsburg',        team: 'TF Sport Corvette',        points: 22, teamColor: '#FFC906' },
  { pos: 5, name: 'Rovera / Hériau / Mann',             team: 'Ferrari AF Corse VISTA',   points: 20, teamColor: '#E8002D' },
  { pos: 6, name: 'James / Drudi / Robichon',           team: 'Heart of Racing Aston Martin', points: 18, teamColor: '#006241' },
  { pos: 7, name: 'Güven / Cottingham / Boguslavskiy', team: 'Manthey DK Porsche',       points: 18, teamColor: '#C0A062' },
  { pos: 8, name: 'West / Goethe / Gehrsitz',          team: 'Garage 59 McLaren',        points: 16, teamColor: '#FF8000' },
];

// ─── MotoGP 2026 Riders Championship (after R6 · Catalan GP) ─
// Source: crash.net standings table (after penalties applied)
export const MOTOGP_RIDERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'M. Bezzecchi',       team: 'Aprilia Racing',        points: 142, teamColor: '#41434C' },
  { pos: 2,  name: 'J. Martín',          team: 'Aprilia Racing',        points: 127, teamColor: '#41434C' },
  { pos: 3,  name: 'F. Di Giannantonio', team: 'Pertamina VR46 Ducati', points: 116, teamColor: '#FFEB3B' },
  { pos: 4,  name: 'P. Acosta',          team: 'Red Bull KTM',          points: 92,  teamColor: '#FF6600' },
  { pos: 5,  name: 'A. Ogura',           team: 'Trackhouse Aprilia',    points: 77,  teamColor: '#8B4FBF' },
  { pos: 6,  name: 'R. Fernández',       team: 'Trackhouse Aprilia',    points: 68,  teamColor: '#8B4FBF' },
  { pos: 7,  name: 'A. Márquez',         team: 'BK8 Gresini Ducati',    points: 67,  teamColor: '#E10600' },
  { pos: 8,  name: 'F. Bagnaia',         team: 'Ducati Lenovo',         points: 63,  teamColor: '#E10600' },
  { pos: 9,  name: 'M. Márquez',         team: 'Ducati Lenovo',         points: 57,  teamColor: '#E10600' },
  { pos: 10, name: 'F. Aldeguer',        team: 'BK8 Gresini Ducati',    points: 47,  teamColor: '#E10600' },
  { pos: 11, name: 'L. Marini',          team: 'Honda HRC Castrol',     points: 43,  teamColor: '#E50000' },
  { pos: 12, name: 'E. Bastianini',      team: 'Red Bull KTM Tech3',    points: 39,  teamColor: '#FF6600' },
  { pos: 13, name: 'F. Quartararo',      team: 'Monster Yamaha',        points: 37,  teamColor: '#0059A8' },
  { pos: 14, name: 'B. Binder',          team: 'Red Bull KTM',          points: 37,  teamColor: '#FF6600' },
  { pos: 15, name: 'F. Morbidelli',      team: 'Pertamina VR46 Ducati', points: 36,  teamColor: '#FFEB3B' },
  { pos: 16, name: 'J. Zarco',           team: 'Castrol Honda LCR',     points: 34,  teamColor: '#E50000' },
  { pos: 17, name: 'D. Moreira',         team: 'Pro Honda LCR',         points: 17,  teamColor: '#E50000' },
  { pos: 18, name: 'J. Mir',             team: 'Honda HRC Castrol',     points: 11,  teamColor: '#E50000' },
  { pos: 19, name: 'A. Rins',            team: 'Monster Yamaha',        points: 9,   teamColor: '#0059A8' },
  { pos: 20, name: 'M. Viñales',         team: 'Red Bull KTM Tech3',    points: 5,   teamColor: '#FF6600' },
  { pos: 21, name: 'A. Fernández',       team: 'Yamaha Factory Racing', points: 4,   teamColor: '#0059A8' },
  { pos: 22, name: 'T. Razgatlıoğlu',   team: 'Pramac Yamaha',         points: 4,   teamColor: '#0059A8' },
  { pos: 23, name: 'J. Miller',          team: 'Pramac Yamaha',         points: 2,   teamColor: '#0059A8' },
];

// ─── WRC 2026 Drivers Championship (after R6 · Rally of Portugal) ─
export const WRC_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'E. Evans', team: 'Toyota', points: 123, teamColor: '#EB0A1E' },
  { pos: 2, name: 'T. Katsuta', team: 'Toyota', points: 111, teamColor: '#EB0A1E' },
  { pos: 3, name: 'O. Solberg', team: 'Toyota', points: 92, teamColor: '#EB0A1E' },
  { pos: 4, name: 'A. Fourmaux', team: 'Hyundai', points: 79, teamColor: '#003082' },
  { pos: 5, name: 'S. Pajari', team: 'Toyota', points: 78, teamColor: '#EB0A1E' },
  { pos: 6, name: 'S. Ogier', team: 'Toyota', points: 67, teamColor: '#EB0A1E' },
  { pos: 7, name: 'T. Neuville', team: 'Hyundai', points: 65, teamColor: '#003082' },
  { pos: 8, name: 'E. Lappi', team: 'Hyundai', points: 21, teamColor: '#003082' },
  { pos: 9, name: 'Y. Rossel', team: 'Lancia', points: 20, teamColor: '#0C2340' },
  { pos: 10, name: 'L. Rossel', team: 'Citroën', points: 18, teamColor: '#CC0000' },
];

// ─── IMSA GTP 2026 Driver Championship (after R4 · Laguna Seca) ─
// Source: imsa.com / speedsport.com — gaps confirmed, exact totals from NBC Sports PDF
export const IMSA_GTP_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'L. Heinrich',               team: 'JDC-Miller Porsche',    points: 1396, teamColor: '#C0A062' },
  { pos: 2, name: 'J. Aitken',                 team: 'Whelen Cadillac',       points: 1375, teamColor: '#D4AF37' },
  { pos: 3, name: 'F. Nasr / J. Andlauer',    team: 'Porsche Penske #7',     points: 1323, teamColor: '#C0A062' },
  { pos: 4, name: 'K. Estre / L. Vanthoor',   team: 'Porsche Penske #6',     points: 1250, teamColor: '#C0A062' },
  { pos: 5, name: 'R. van der Zande / N. Yelloly', team: 'Meyer Shank Acura', points: 1242, teamColor: '#C8102E' },
];

// ─── IMSA GTD Pro 2026 Driver Championship (after R4 · Laguna Seca) ─
// Source: imsa.com / speedsport.com — positions + gaps confirmed; point totals approx (gaps exact)
export const IMSA_GTD_PRO_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'T. Milner / N. Catsburg',        team: 'Corvette Racing',    points: 1300, teamColor: '#FFC906' },
  { pos: 2, name: 'C. De Phillippi / N. Verhagen',  team: 'Paul Miller BMW',    points: 1249, teamColor: '#1E88E5' },
  { pos: 3, name: 'H. King / N. Tandy',             team: 'AO Racing Porsche',  points: 1237, teamColor: '#C0A062' },
  { pos: 4, name: 'F. Vervisch / C. Mies',          team: 'Ford Racing',        points: 1226, teamColor: '#0032A0' },
];

// ─── IMSA GTD 2026 Driver Championship (after R4 · Laguna Seca) ─
// Source: dailysportscar.com / racer.com — positions + gaps confirmed; point totals approx
export const IMSA_GTD_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'E. Barrichello / T. Gamble', team: 'Heart of Racing Aston Martin', points: 1400, teamColor: '#006241' },
  { pos: 2, name: 'P. Gallagher / R. Foley',    team: 'Turner BMW',         points: 1260, teamColor: '#1E88E5' },
  { pos: 3, name: 'A. Telitz / B. Pedersen',    team: 'Vasser Sullivan',    points: 1200, teamColor: '#C8102E' },
  { pos: 4, name: 'R. Ward / P. Ellis',         team: 'Winward Mercedes',   points: 1200, teamColor: '#00BFBF' },
];

// ─── DTM 2026 Driver Championship (after R1 · Red Bull Ring) ─
export const DTM_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'M. Engel', team: 'Mercedes-AMG', points: 44, teamColor: '#00D2BE' },
  { pos: 2, name: 'L. Auer', team: 'Mercedes-AMG', points: 37, teamColor: '#00D2BE' },
  { pos: 3, name: 'M. Wittmann', team: 'BMW', points: 31, teamColor: '#1E88E5' },
  { pos: 4, name: 'T. Preining', team: 'Porsche', points: 29, teamColor: '#C0A062' },
  { pos: 5, name: 'N. Thiim', team: 'Aston Martin', points: 17, teamColor: '#006241' },
  { pos: 6, name: 'F. Wiebelhaus', team: 'Ford', points: 15, teamColor: '#0032A0' },
  { pos: 7, name: 'A. Maini', team: 'Ford', points: 14, teamColor: '#0032A0' },
  { pos: 8, name: 'J. Gounon', team: 'Mercedes-AMG', points: 13, teamColor: '#00D2BE' },
  { pos: 8, name: 'T. Kalender', team: 'Mercedes-AMG', points: 13, teamColor: '#00D2BE' },
  { pos: 8, name: 'K. van der Linde', team: 'BMW', points: 13, teamColor: '#1E88E5' },
];
