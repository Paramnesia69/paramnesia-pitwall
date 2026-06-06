/**
 * 2026 Championship Standings — real data.
 * F1: After Round 4 (Miami GP, May 3 2026) — source: formulaonehistory.com
 * MotoGP: After Round 6 (Catalan GP, May 17 2026) — source: gpblog.com / motogp.com
 * MotoGP Teams: computed from rider points (team pts = sum of both riders)
 * WEC: After Round 2 (6H Spa, May 10 2026) — source: fiawec.com / Wikipedia
 * WEC Manufacturers: official FIA WEC data (fiawec.com/en/page/manufacturers-classification)
 * WRC: After Round 6 (Rally Portugal, May 22 2026) — source: wrc.com
 * WRC Manufacturers: Toyota/Hyundai/Lancia/Ford — derived from driver pts top-3 per mfr
 * IMSA: After Round 4 (Laguna Seca, May 11 2026) — source: imsa.com / speedsport.com
 * IMSA Teams: each car entry IS the team entry — same pts as driver entry
 * DTM: After Round 2 (Zandvoort, May 24 2026) — source: pitdebrief.com / motorsport.com
 * DTM Manufacturers: top 2 drivers per brand per race — derived from driver standings
 * ELMS: After Round 2 (Le Castellet, May 18 2026) — source: europeanlemansseries.com
 */

export interface DriverStanding {
  pos: number;
  name: string;
  team: string;
  points: number;
  teamColor: string;
  /** Cumulative points after each completed round, in order. Optional — sparkline only renders when present. */
  roundPoints?: number[];
  /** Position after the previous round. Used to render ▲/▼ delta badge. */
  prevPos?: number;
}

export interface ConstructorStanding {
  pos: number;
  name: string;
  points: number;
  color: string;
  /** Cumulative points after each completed round, in order. Optional — sparkline only renders when present. */
  roundPoints?: number[];
  /** Position after the previous round. Used to render ▲/▼ delta badge. */
  prevPos?: number;
}

// ─── F1 2026 Drivers Championship (after R4 · Miami GP) ─
// roundPoints: cumulative after [R1 AUS, R2 CHN (sprint+race), R3 JPN, R4 MIA (sprint+race)]
// Source: formula1.com race & sprint result pages
export const F1_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'K. Antonelli', team: 'Mercedes', points: 100, teamColor: '#27F4D2', roundPoints: [18, 47, 72, 100] },
  { pos: 2, name: 'G. Russell', team: 'Mercedes', points: 80, teamColor: '#27F4D2', roundPoints: [25, 51, 63, 80] },
  { pos: 3, name: 'C. Leclerc', team: 'Ferrari', points: 59, teamColor: '#E8002D', roundPoints: [15, 34, 49, 59] },
  { pos: 4, name: 'L. Norris', team: 'McLaren', points: 51, teamColor: '#FF6700', roundPoints: [10, 15, 25, 51] },
  { pos: 5, name: 'L. Hamilton', team: 'Ferrari', points: 51, teamColor: '#E8002D', roundPoints: [12, 33, 41, 51] },
  { pos: 6, name: 'O. Piastri', team: 'McLaren', points: 43, teamColor: '#FF6700', roundPoints: [0, 3, 21, 43] },
  { pos: 7, name: 'M. Verstappen', team: 'Red Bull Racing', points: 26, teamColor: '#3671C6', roundPoints: [8, 8, 12, 26] },
  { pos: 8, name: 'O. Bearman', team: 'Haas', points: 17, teamColor: '#B6BABD', roundPoints: [6, 17, 17, 17] },
  { pos: 9, name: 'P. Gasly', team: 'Alpine', points: 16, teamColor: '#0093CC', roundPoints: [1, 9, 15, 16] },
  { pos: 10, name: 'L. Lawson', team: 'Racing Bulls', points: 10, teamColor: '#6692FF', roundPoints: [0, 8, 10, 10] },
];

// ─── F1 2026 Constructors Championship (after R4 · Miami GP) ─
// roundPoints: cumulative after [R1 AUS, R2 CHN (sprint+race), R3 JPN, R4 MIA (sprint+race)]
export const F1_CONSTRUCTORS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Mercedes', points: 180, color: '#27F4D2', roundPoints: [43, 98, 135, 180] },
  { pos: 2, name: 'Ferrari', points: 110, color: '#E8002D', roundPoints: [27, 67, 90, 110] },
  { pos: 3, name: 'McLaren', points: 94, color: '#FF6700', roundPoints: [10, 18, 46, 94] },
  { pos: 4, name: 'Red Bull Racing', points: 30, color: '#3671C6', roundPoints: [8, 12, 16, 30] },
  { pos: 5, name: 'Alpine', points: 23, color: '#0093CC', roundPoints: [1, 10, 16, 23] },
  { pos: 6, name: 'Haas', points: 18, color: '#B6BABD', roundPoints: [6, 17, 18, 18] },
  { pos: 7, name: 'Racing Bulls', points: 14, color: '#6692FF', roundPoints: [4, 12, 14, 14] },
  { pos: 8, name: 'Williams', points: 5, color: '#1868DB', roundPoints: [0, 2, 2, 5] },
  { pos: 9, name: 'Audi', points: 2, color: '#990000', roundPoints: [2, 2, 2, 2] },
  { pos: 10, name: 'Cadillac', points: 0, color: '#1E1E1E' },
  { pos: 11, name: 'Aston Martin', points: 0, color: '#358C75' },
];

// ─── WEC 2026 Hypercar Drivers Championship (after R2 · 6H Spa-Francorchamps) ─
// Source: Wikipedia / fiawec.com — full grid, grouped by car entry
export const WEC_DRIVERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'Frijns / Rast',                    team: 'BMW M Team WRT #20',           points: 35, teamColor: '#1E88E5', prevPos: 5,  roundPoints: [10, 35] },
  { pos: 2,  name: 'Buemi / Hartley / Hirakawa',       team: 'Toyota Racing #8',             points: 26, teamColor: '#EB0A1E', prevPos: 1,  roundPoints: [25, 26] },
  { pos: 3,  name: 'Conway / Kobayashi / de Vries',    team: 'Toyota Racing #7',             points: 25, teamColor: '#EB0A1E', prevPos: 3,  roundPoints: [15, 25] },
  { pos: 4,  name: 'van der Linde / Magnussen / Marciello', team: 'BMW M Team WRT #15',      points: 24, teamColor: '#1E88E5', prevPos: 7,  roundPoints: [6,  24] },
  { pos: 5,  name: 'Fuoco / Molina / Nielsen',         team: 'Ferrari AF Corse #50',         points: 23, teamColor: '#E8002D', prevPos: 6,  roundPoints: [8,  23] },
  { pos: 6,  name: 'Pier Guidi / Giovinazzi / Calado', team: 'Ferrari AF Corse #51',         points: 19, teamColor: '#E8002D', prevPos: 2,  roundPoints: [19, 19] },
  { pos: 7,  name: 'Vanthoor',                         team: 'BMW M Team WRT #15',           points: 18, teamColor: '#1E88E5' },
  { pos: 8,  name: 'Tincknell / Gamble',               team: 'Aston Martin THOR #27',        points: 14, teamColor: '#006241', prevPos: 9,  roundPoints: [2,  14] },
  { pos: 9,  name: 'Félix da Costa / Habsburg / Milesi', team: 'Alpine Endurance #36',       points: 12, teamColor: '#0093CC', prevPos: 4,  roundPoints: [12, 12] },
  { pos: 10, name: 'Hanson / Kubica / Ye',             team: 'AF Corse #83',                 points: 9,  teamColor: '#E8002D', prevPos: 10, roundPoints: [1,  9]  },
  { pos: 11, name: 'Cassidy / di Resta / Vandoorne',   team: 'Peugeot TotalEnergies #93',    points: 6,  teamColor: '#AAAAAA' },
  { pos: 12, name: 'Bamber / Bourdais',                team: 'Cadillac Hertz Jota #12',      points: 4,  teamColor: '#D4AF37' },
  { pos: 13, name: 'Derani / Jaubert / Lotterer',      team: 'Genesis Magma Racing #4',      points: 4,  teamColor: '#4A90D9' },
  { pos: 14, name: 'Nato / Stevens / Delétraz',        team: 'Cadillac Hertz Jota #38',      points: 2,  teamColor: '#D4AF37' },
  { pos: 15, name: 'Duval / Jakobsen / Pourchaire',    team: 'Peugeot TotalEnergies #94',    points: 1,  teamColor: '#AAAAAA' },
  { pos: 16, name: 'Gounon / Makowiecki / Martins',    team: 'Alpine Endurance #35',         points: 0,  teamColor: '#0093CC' },
  { pos: 17, name: 'Chatin / Jaminet / Juncadella',    team: 'Genesis Magma Racing #19',     points: 0,  teamColor: '#4A90D9' },
  { pos: 18, name: 'Riberas / Sørensen',               team: 'Aston Martin THOR #23',        points: 0,  teamColor: '#006241' },
];

// ─── WEC 2026 LMGT3 Drivers Championship (after R2 · 6H Spa-Francorchamps) ─
// Source: pitdebrief.com post-Spa standings
export const WEC_LMGT3_DRIVERS_2026: DriverStanding[] = [
  { pos: 1, name: 'Pera / Lietz / Shahin',              team: 'Manthey Porsche',          points: 30, teamColor: '#C0A062' },
  { pos: 2, name: 'Au / Kirchhöfer / Fleming',          team: 'Garage 59 McLaren',        points: 26, teamColor: '#FF6700' },
  { pos: 3, name: 'McIntosh / Harper / Thompson',       team: 'Team WRT BMW',             points: 25, teamColor: '#1E88E5' },
  { pos: 4, name: 'McDonald / Edgar / Catsburg',        team: 'TF Sport Corvette',        points: 22, teamColor: '#FFC906' },
  { pos: 5, name: 'Rovera / Hériau / Mann',             team: 'Ferrari AF Corse VISTA',   points: 20, teamColor: '#E8002D' },
  { pos: 6, name: 'James / Drudi / Robichon',           team: 'Heart of Racing Aston Martin', points: 18, teamColor: '#006241' },
  { pos: 7, name: 'Güven / Cottingham / Boguslavskiy', team: 'Manthey DK Porsche',       points: 18, teamColor: '#C0A062' },
  { pos: 8, name: 'West / Goethe / Gehrsitz',          team: 'Garage 59 McLaren',        points: 16, teamColor: '#FF6700' },
];

// ─── MotoGP 2026 Riders Championship (after R7 · Italian GP) ─
// Source: autohebdof1.com, crash.net standings (post-race)
export const MOTOGP_RIDERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'M. Bezzecchi',       team: 'Aprilia Racing',        points: 173, teamColor: '#41434C', prevPos: 1  },
  { pos: 2,  name: 'J. Martín',          team: 'Aprilia Racing',        points: 156, teamColor: '#41434C', prevPos: 2  },
  { pos: 3,  name: 'F. Di Giannantonio', team: 'Pertamina VR46 Ducati', points: 134, teamColor: '#FFEB3B', prevPos: 3  },
  { pos: 4,  name: 'P. Acosta',          team: 'Red Bull KTM',          points: 103, teamColor: '#FF6600', prevPos: 4  },
  { pos: 5,  name: 'A. Ogura',           team: 'Trackhouse Aprilia',    points: 92,  teamColor: '#8B4FBF', prevPos: 5  },
  { pos: 6,  name: 'R. Fernández',       team: 'Trackhouse Aprilia',    points: 87,  teamColor: '#8B4FBF', prevPos: 6  },
  { pos: 7,  name: 'F. Bagnaia',         team: 'Ducati Lenovo',         points: 82,  teamColor: '#E10600', prevPos: 8  },
  { pos: 8,  name: 'M. Márquez',         team: 'Ducati Lenovo',         points: 71,  teamColor: '#E10600', prevPos: 9  },
  { pos: 9,  name: 'A. Márquez',         team: 'BK8 Gresini Ducati',    points: 67,  teamColor: '#E10600', prevPos: 7  },
  { pos: 10, name: 'F. Aldeguer',        team: 'BK8 Gresini Ducati',    points: 59,  teamColor: '#E10600', prevPos: 10 },
  { pos: 11, name: 'L. Marini',          team: 'Honda HRC Castrol',     points: 43,  teamColor: '#E50000', prevPos: 11 },
  { pos: 12, name: 'E. Bastianini',      team: 'Red Bull KTM Tech3',    points: 39,  teamColor: '#FF6600', prevPos: 12 },
  { pos: 13, name: 'F. Quartararo',      team: 'Monster Yamaha',        points: 37,  teamColor: '#0059A8', prevPos: 13 },
  { pos: 14, name: 'B. Binder',          team: 'Red Bull KTM',          points: 37,  teamColor: '#FF6600', prevPos: 14 },
  { pos: 15, name: 'F. Morbidelli',      team: 'Pertamina VR46 Ducati', points: 36,  teamColor: '#FFEB3B', prevPos: 15 },
  { pos: 16, name: 'J. Zarco',           team: 'Castrol Honda LCR',     points: 34,  teamColor: '#E50000', prevPos: 16 },
  { pos: 17, name: 'D. Moreira',         team: 'Pro Honda LCR',         points: 17,  teamColor: '#E50000', prevPos: 17 },
  { pos: 18, name: 'J. Mir',             team: 'Honda HRC Castrol',     points: 11,  teamColor: '#E50000', prevPos: 18 },
  { pos: 19, name: 'A. Rins',            team: 'Monster Yamaha',        points: 9,   teamColor: '#0059A8', prevPos: 19 },
  { pos: 20, name: 'M. Viñales',         team: 'Red Bull KTM Tech3',    points: 5,   teamColor: '#FF6600' },
  { pos: 21, name: 'A. Fernández',       team: 'Yamaha Factory Racing', points: 4,   teamColor: '#0059A8' },
  { pos: 22, name: 'T. Razgatlıoğlu',   team: 'Pramac Yamaha',         points: 4,   teamColor: '#0059A8', prevPos: 22 },
  { pos: 23, name: 'J. Miller',          team: 'Pramac Yamaha',         points: 2,   teamColor: '#0059A8', prevPos: 23 },
];

// ─── WRC 2026 Drivers Championship (after R7 · FORUM8 Rally Japan) ─
// Source: autohebdof1.com post-Japan standings
export const WRC_DRIVERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'E. Evans',    team: 'Toyota',  points: 151, teamColor: '#EB0A1E', prevPos: 1  },
  { pos: 2,  name: 'T. Katsuta', team: 'Toyota',  points: 131, teamColor: '#EB0A1E', prevPos: 2  },
  { pos: 3,  name: 'O. Solberg', team: 'Toyota',  points: 102, teamColor: '#EB0A1E', prevPos: 3  },
  { pos: 4,  name: 'S. Pajari',  team: 'Toyota',  points: 96,  teamColor: '#EB0A1E', prevPos: 5  },
  { pos: 5,  name: 'S. Ogier',   team: 'Toyota',  points: 90,  teamColor: '#EB0A1E', prevPos: 6  },
  { pos: 6,  name: 'A. Fourmaux', team: 'Hyundai', points: 83, teamColor: '#003082', prevPos: 4  },
  { pos: 7,  name: 'T. Neuville', team: 'Hyundai', points: 69, teamColor: '#003082', prevPos: 7  },
  { pos: 8,  name: 'E. Lappi',   team: 'Hyundai', points: 21,  teamColor: '#003082', prevPos: 8  },
  { pos: 9,  name: 'Y. Rossel',  team: 'Lancia',  points: 20,  teamColor: '#0C2340', prevPos: 9  },
  { pos: 10, name: 'L. Rossel',  team: 'Citroën', points: 18,  teamColor: '#CC0000', prevPos: 10 },
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

// ─── DTM 2026 Driver Championship (after R2 · Zandvoort) ─
export const DTM_DRIVERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'M. Engel',         team: 'Mercedes-AMG',  points: 67, teamColor: '#00D2BE', prevPos: 1,  roundPoints: [44, 67] },
  { pos: 2,  name: 'L. Auer',          team: 'Mercedes-AMG',  points: 61, teamColor: '#00D2BE', prevPos: 2,  roundPoints: [37, 61] },
  { pos: 3,  name: 'M. Wittmann',      team: 'BMW',           points: 52, teamColor: '#1E88E5', prevPos: 3,  roundPoints: [31, 52] },
  { pos: 4,  name: 'T. Preining',      team: 'Porsche',       points: 46, teamColor: '#C0A062', prevPos: 4,  roundPoints: [29, 46] },
  { pos: 5,  name: 'M. Cairoli',       team: 'Ferrari',       points: 43, teamColor: '#E8002D', prevPos: 14, roundPoints: [10, 43] },
  { pos: 6,  name: 'B. Dörr',          team: 'McLaren',       points: 42, teamColor: '#FF6700', prevPos: 12, roundPoints: [11, 42] },
  { pos: 7,  name: 'K. van der Linde', team: 'BMW',           points: 41, teamColor: '#1E88E5', prevPos: 10, roundPoints: [13, 41] },
  { pos: 8,  name: 'T. Vermeulen',     team: 'Ferrari',       points: 41, teamColor: '#E8002D', prevPos: 15, roundPoints: [10, 41] },
  { pos: 9,  name: 'J. Gounon',        team: 'Mercedes-AMG',  points: 30, teamColor: '#00D2BE', prevPos: 8,  roundPoints: [13, 30] },
  { pos: 10, name: 'N. Thiim',         team: 'Aston Martin',  points: 24, teamColor: '#006241', prevPos: 5,  roundPoints: [17, 24] },
];

// ─── MotoGP 2026 Teams Championship (after R7 · Italian GP) ─
// Team pts = sum of both riders' championship points (official MotoGP method)
export const MOTOGP_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1,  name: 'Aprilia Racing',         points: 329, color: '#C8102E' }, // Bezzecchi 173 + Martín 156
  { pos: 2,  name: 'Trackhouse Aprilia',      points: 179, color: '#8B4FBF' }, // Ogura 92 + R.Fernández 87
  { pos: 3,  name: 'Pertamina VR46 Ducati',  points: 170, color: '#FFEB3B' }, // Di Giannantonio 134 + Morbidelli 36
  { pos: 4,  name: 'Ducati Lenovo',           points: 153, color: '#E10600' }, // Bagnaia 82 + M.Márquez 71
  { pos: 5,  name: 'Red Bull KTM',            points: 140, color: '#FF6600' }, // Acosta 103 + Binder 37
  { pos: 6,  name: 'BK8 Gresini Ducati',     points: 126, color: '#E10600' }, // A.Márquez 67 + Aldeguer 59
  { pos: 7,  name: 'Honda HRC Castrol',       points: 54,  color: '#E50000' }, // Marini 43 + Mir 11
  { pos: 8,  name: 'LCR Honda',              points: 51,  color: '#E50000' }, // Zarco 34 + Moreira 17
  { pos: 9,  name: 'Monster Yamaha',          points: 46,  color: '#0059A8' }, // Quartararo 37 + Rins 9
  { pos: 10, name: 'Red Bull KTM Tech3',      points: 44,  color: '#FF6600' }, // Bastianini 39 + Viñales 5
  { pos: 11, name: 'Pramac Yamaha',           points: 6,   color: '#0059A8' }, // Razgatlıoğlu 4 + Miller 2
];

// ─── WEC 2026 Hypercar Manufacturers Championship (after R2 · 6H Spa) ─
// Source: fiawec.com/en/page/manufacturers-classification — official FIA data
export const WEC_MANUFACTURERS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'BMW',          points: 59, color: '#1E88E5', prevPos: 3, roundPoints: [16, 59] }, // Imola 16 + Spa 43
  { pos: 2, name: 'Toyota',       points: 52, color: '#EB0A1E', prevPos: 1, roundPoints: [40, 52] }, // Imola 40 + Spa 12
  { pos: 3, name: 'Ferrari',      points: 42, color: '#E8002D', prevPos: 2, roundPoints: [27, 42] }, // Imola 26+1 + Spa 15
  { pos: 4, name: 'Aston Martin', points: 14, color: '#006241', prevPos: 6, roundPoints: [2,  14] }, // Imola 2 + Spa 12
  { pos: 5, name: 'Alpine',       points: 14, color: '#0093CC', prevPos: 4, roundPoints: [13, 14] }, // Imola 13 + Spa 1
  { pos: 6, name: 'Peugeot',      points: 9,  color: '#AAAAAA', prevPos: 7, roundPoints: [0,  9]  }, // Imola 0 + Spa 8+1
  { pos: 7, name: 'Cadillac',     points: 8,  color: '#D4AF37', prevPos: 5, roundPoints: [4,  8]  }, // Imola 4 + Spa 4
  { pos: 8, name: 'Genesis',      points: 6,  color: '#4A90D9', prevPos: 8, roundPoints: [0,  6]  }, // Imola 0 + Spa 6
];

// ─── WEC 2026 LMGT3 Manufacturers Championship (after R2 · 6H Spa) ─
// Manufacturer pts = sum of entered cars' pts for each brand
export const WEC_LMGT3_MANUFACTURERS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Porsche',     points: 48, color: '#C0A062' }, // Manthey #92 30 + Manthey DK 18
  { pos: 2, name: 'McLaren',     points: 42, color: '#FF6700' }, // G59 #59 26 + G59 #188 16
  { pos: 3, name: 'BMW',         points: 25, color: '#1E88E5' }, // WRT 25
  { pos: 4, name: 'Corvette',    points: 22, color: '#FFC906' }, // TF Sport 22
  { pos: 5, name: 'Ferrari',     points: 20, color: '#E8002D' }, // AF Corse VISTA 20
  { pos: 6, name: 'Aston Martin',points: 18, color: '#006241' }, // Heart of Racing 18
];

// ─── WRC 2026 Manufacturers Championship (after R6 · Rally of Portugal) ─
// Source: wrc.com — manufacturer pts sum top-3 drivers per rally per manufacturer
export const WRC_MANUFACTURERS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Toyota Gazoo Racing',  points: 326, color: '#EB0A1E' }, // Evans+Katsuta+Solberg top-3
  { pos: 2, name: 'Hyundai Shell WRT',    points: 165, color: '#003082' }, // Fourmaux+Neuville+Lappi
  { pos: 3, name: 'Lancia Corse WRT',     points: 20,  color: '#0C2340' }, // Y.Rossel
  { pos: 4, name: 'M-Sport Ford',         points: 18,  color: '#003CB4' }, // L.Rossel / Citroën entry
];

// ─── IMSA 2026 GTP Teams Championship (after R4 · Laguna Seca) ─
// IMSA team championship = car entry championship; pts identical to driver entry
export const IMSA_GTP_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'JDC-Miller Motorsports',    points: 1396, color: '#C0A062' },
  { pos: 2, name: 'Cadillac Racing (Whelen)',  points: 1375, color: '#D4AF37' },
  { pos: 3, name: 'Porsche Penske #7',         points: 1323, color: '#C0A062' },
  { pos: 4, name: 'Porsche Penske #6',         points: 1250, color: '#C0A062' },
  { pos: 5, name: 'Meyer Shank Racing',        points: 1242, color: '#C8102E' },
];

// ─── IMSA 2026 GTD Pro Teams Championship (after R4 · Laguna Seca) ─
export const IMSA_GTDPRO_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Corvette Racing',        points: 1300, color: '#FFC906' },
  { pos: 2, name: 'Paul Miller Racing',     points: 1249, color: '#1E88E5' },
  { pos: 3, name: 'AO Racing',             points: 1237, color: '#C0A062' },
  { pos: 4, name: 'Multimatic Motorsports', points: 1226, color: '#0032A0' },
];

// ─── IMSA 2026 GTD Teams Championship (after R4 · Laguna Seca) ─
export const IMSA_GTD_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Heart of Racing',   points: 1400, color: '#006241' },
  { pos: 2, name: 'Turner Motorsport', points: 1260, color: '#1E88E5' },
  { pos: 3, name: 'Vasser Sullivan',   points: 1200, color: '#C8102E' },
  { pos: 4, name: 'Winward Racing',    points: 1200, color: '#00BFBF' },
];

// ─── DTM 2026 Manufacturers Championship (after R2 · Zandvoort) ─
// Sum of top 2 drivers per brand from driver standings
export const DTM_MANUFACTURERS_2026: ConstructorStanding[] = [
  { pos: 1, name: 'Mercedes-AMG', points: 128, color: '#00D2BE', prevPos: 1, roundPoints: [81, 128] }, // Engel 67 + Auer 61
  { pos: 2, name: 'BMW',          points: 93,  color: '#1E88E5', prevPos: 2, roundPoints: [44, 93]  }, // Wittmann 52 + vdLinde 41
  { pos: 3, name: 'Ferrari',      points: 84,  color: '#E8002D', prevPos: 5, roundPoints: [20, 84]  }, // Cairoli 43 + Vermeulen 41
  { pos: 4, name: 'Porsche',      points: 46,  color: '#C0A062', prevPos: 3, roundPoints: [29, 46]  }, // Preining 46
  { pos: 5, name: 'McLaren',      points: 42,  color: '#FF6700', prevPos: 4, roundPoints: [22, 42]  }, // Dörr 42
  { pos: 6, name: 'Aston Martin', points: 24,  color: '#006241', prevPos: 6, roundPoints: [17, 24]  }, // Thiim 24
];

// ═══════════════════════════════════════════════════════════════════
// ELMS 2026 — European Le Mans Series (after R2 · 4H Le Castellet)
// Source: europeanlemansseries.com/en/page/classification-2?season_id=4180
// ═══════════════════════════════════════════════════════════════════

// ─── ELMS LMP2 Drivers (after R2 · Le Castellet) ─
export const ELMS_LMP2_DRIVERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'Hanley / Saucy / Peebles',            team: 'United Autosports #22',          points: 40, teamColor: '#1E3A5F' },
  { pos: 2,  name: 'Garg / De Gérus',                     team: 'Inter Europol #34',              points: 37, teamColor: '#D4AF37' },
  { pos: 3,  name: 'Masson / Rousset / Gray',             team: 'Forestier Racing by Panis #29',  points: 26, teamColor: '#C8102E' },
  { pos: 4,  name: 'Chadwick / Hörr / Rinicella',         team: 'IDEC Sport #18',                 points: 24, teamColor: '#0059A8' },
  { pos: 5,  name: 'Fittipaldi / Cullen / Lomko',         team: 'Vector Sport #10',               points: 18, teamColor: '#FF6600' },
  { pos: 6,  name: 'Van Uitert / Lafargue / Chatin',      team: 'IDEC Sport #28',                 points: 16, teamColor: '#0059A8' },
  { pos: 7,  name: 'Smiechowski / Dillmann',              team: 'Inter Europol #43',              points: 16, teamColor: '#D4AF37' },
  { pos: 8,  name: 'Closmenil / Aguilera / Jensen',       team: 'CLX Motorsport #37',             points: 12, teamColor: '#333333' },
  { pos: 9,  name: 'Pearson / Doohan / Nissany',          team: 'Nielsen Racing #24',             points: 7,  teamColor: '#00A86B' },
  { pos: 10, name: 'Ried / Rockenfeller / Priaulx',       team: 'Proton Competition #9',          points: 4,  teamColor: '#AAAAAA' },
  { pos: 11, name: 'Hughes / Kaiser / Vautier',           team: 'Algarve Pro Racing #25',         points: 4,  teamColor: '#006241' },
];

// ─── ELMS LMP2 Teams (after R2 · Le Castellet) ─
export const ELMS_LMP2_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1,  name: 'United Autosports #22',          points: 40, color: '#1E3A5F' },
  { pos: 2,  name: 'Inter Europol Competition #34',  points: 37, color: '#D4AF37' },
  { pos: 3,  name: 'Forestier Racing by Panis #29',  points: 26, color: '#C8102E' },
  { pos: 4,  name: 'IDEC Sport #18',                 points: 24, color: '#0059A8' },
  { pos: 5,  name: 'Vector Sport #10',               points: 18, color: '#FF6600' },
  { pos: 6,  name: 'IDEC Sport #28',                 points: 16, color: '#0059A8' },
  { pos: 7,  name: 'Inter Europol Competition #43',  points: 16, color: '#D4AF37' },
  { pos: 8,  name: 'CLX Motorsport #37',             points: 12, color: '#333333' },
  { pos: 9,  name: 'Nielsen Racing #24',             points: 7,  color: '#00A86B' },
  { pos: 10, name: 'Proton Competition #9',          points: 4,  color: '#AAAAAA' },
  { pos: 11, name: 'Algarve Pro Racing #25',         points: 4,  color: '#006241' },
];

// ─── ELMS LMP3 Drivers (after R2 · Le Castellet) ─
export const ELMS_LMP3_DRIVERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'Bukhantsov / Chou / Cubides',         team: 'Inter Europol #13',          points: 40, teamColor: '#D4AF37' },
  { pos: 2,  name: 'Rodella / Cautela / Pedersen',        team: 'Rinaldi Racing #5',          points: 31, teamColor: '#C8102E' },
  { pos: 3,  name: 'Michal / Schwarze / Provost',         team: 'R-ACE GP #85',               points: 27, teamColor: '#0059A8' },
  { pos: 4,  name: 'Fecury / Gravlund / Woodward',        team: 'Ultimate #35',               points: 20, teamColor: '#FF6600' },
  { pos: 5,  name: 'Adcock / Antonel / Imbourg',          team: 'M Racing #68',               points: 18, teamColor: '#333333' },
  { pos: 6,  name: 'Rammo / Favre / Brichacek',           team: 'DKR Engineering #4',         points: 18, teamColor: '#1E88E5' },
  { pos: 7,  name: 'Nogales / Stern / Quintarelli',       team: 'Team Virage #8',             points: 14, teamColor: '#8B4FBF' },
  { pos: 8,  name: 'Jacoby / Ribeiro / Lanchere',         team: 'CLX Motorsport #17',         points: 14, teamColor: '#333333' },
  { pos: 9,  name: 'Dedecker / Bell / Van Der Snel',      team: 'Eurointernational #11',      points: 12, teamColor: '#006241' },
  { pos: 10, name: 'De Sybourg / Meichtry',               team: 'Racing Spirit of Léman #31', points: 8,  teamColor: '#AAAAAA' },
];

// ─── ELMS LMP3 Teams (after R2 · Le Castellet) ─
export const ELMS_LMP3_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1,  name: 'Inter Europol Competition #13',  points: 40, color: '#D4AF37' },
  { pos: 2,  name: 'Rinaldi Racing #5',              points: 31, color: '#C8102E' },
  { pos: 3,  name: 'R-ACE GP #85',                   points: 27, color: '#0059A8' },
  { pos: 4,  name: 'Ultimate #35',                   points: 20, color: '#FF6600' },
  { pos: 5,  name: 'M Racing #68',                   points: 18, color: '#333333' },
  { pos: 6,  name: 'DKR Engineering #4',             points: 18, color: '#1E88E5' },
  { pos: 7,  name: 'Team Virage #8',                 points: 14, color: '#8B4FBF' },
  { pos: 8,  name: 'CLX Motorsport #17',             points: 14, color: '#333333' },
  { pos: 9,  name: 'Eurointernational #11',          points: 12, color: '#006241' },
  { pos: 10, name: 'Racing Spirit of Léman #31',     points: 8,  color: '#AAAAAA' },
];

// ─── ELMS LMGT3 Drivers (after R2 · Le Castellet) ─
export const ELMS_LMGT3_DRIVERS_2026: DriverStanding[] = [
  { pos: 1,  name: 'Serra / Jaubert / Kimura',            team: 'Kessel Racing #57',              points: 40, teamColor: '#E8002D' },
  { pos: 2,  name: 'Kurzejewski / Lietz / Sargent',       team: 'Proton Competition #75',         points: 31, teamColor: '#AAAAAA' },
  { pos: 3,  name: 'Perel / Cameron / Griffin',           team: 'Spirit of Race #55',             points: 20, teamColor: '#C8102E' },
  { pos: 4,  name: 'Patterson / Birch',                   team: 'United Autosports #23',          points: 18, teamColor: '#1E3A5F' },
  { pos: 5,  name: 'Udell / McDonald / Eastwood',         team: 'TF Sport #33',                   points: 18, teamColor: '#FFC906' },
  { pos: 6,  name: 'Hanafin / Jansen / Wainwright',       team: 'GR Racing #86',                  points: 15, teamColor: '#C0A062' },
  { pos: 7,  name: 'Al-Khelaifi / Hanses',                team: 'Team Qatar Iron Lynx #62',       points: 14, teamColor: '#8B1A4A' },
  { pos: 8,  name: 'Bankcy / Van Eijndhoven',             team: 'Proton Competition #77',         points: 14, teamColor: '#AAAAAA' },
  { pos: 9,  name: 'Naran / Andrade / Sette Câmara',      team: 'Iron Lynx #63',                  points: 14, teamColor: '#00A86B' },
  { pos: 10, name: 'Toledo / Agostini',                   team: 'RM AF Corse #50',                points: 10, teamColor: '#E8002D' },
];

// ─── ELMS LMGT3 Teams (after R2 · Le Castellet) ─
export const ELMS_LMGT3_TEAMS_2026: ConstructorStanding[] = [
  { pos: 1,  name: 'Kessel Racing #57',              points: 40, color: '#E8002D' },
  { pos: 2,  name: 'Proton Competition #75',         points: 31, color: '#AAAAAA' },
  { pos: 3,  name: 'Spirit of Race #55',             points: 20, color: '#C8102E' },
  { pos: 4,  name: 'United Autosports #23',          points: 18, color: '#1E3A5F' },
  { pos: 5,  name: 'TF Sport #33',                   points: 18, color: '#FFC906' },
  { pos: 6,  name: 'GR Racing #86',                  points: 15, color: '#C0A062' },
  { pos: 7,  name: 'Team Qatar Iron Lynx #62',       points: 14, color: '#8B1A4A' },
  { pos: 8,  name: 'Proton Competition #77',         points: 14, color: '#AAAAAA' },
  { pos: 9,  name: 'Iron Lynx #63',                  points: 14, color: '#00A86B' },
  { pos: 10, name: 'RM AF Corse #50',                points: 10, color: '#E8002D' },
];
