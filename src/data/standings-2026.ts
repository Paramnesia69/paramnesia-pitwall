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

// ─── MotoGP 2026 Riders Championship (after R6 · Catalan GP) ─
export const MOTOGP_RIDERS_2026: DriverStanding[] = [
  { pos: 1, name: 'M. Bezzecchi', team: 'Aprilia', points: 142, teamColor: '#41434C' },
  { pos: 2, name: 'J. Martin', team: 'Aprilia', points: 127, teamColor: '#41434C' },
  { pos: 3, name: 'F. Di Giannantonio', team: 'VR46', points: 116, teamColor: '#FFEB3B' },
  { pos: 4, name: 'P. Acosta', team: 'KTM', points: 92, teamColor: '#FF6600' },
  { pos: 5, name: 'A. Ogura', team: 'Trackhouse', points: 77, teamColor: '#8B4FBF' },
  { pos: 6, name: 'R. Fernandez', team: 'Trackhouse', points: 68, teamColor: '#8B4FBF' },
  { pos: 7, name: 'A. Marquez', team: 'Gresini', points: 67, teamColor: '#E10600' },
  { pos: 8, name: 'F. Bagnaia', team: 'Ducati', points: 63, teamColor: '#E10600' },
  { pos: 9, name: 'M. Marquez', team: 'Ducati', points: 57, teamColor: '#E10600' },
  { pos: 10, name: 'F. Aldeguer', team: 'Gresini', points: 47, teamColor: '#E10600' },
];
