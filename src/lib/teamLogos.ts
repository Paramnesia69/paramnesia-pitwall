/**
 * Maps team / manufacturer name strings → /public/logos/constructors/*.svg
 * Returns null when no logo is available so callers can fall back to the team colour bar.
 */

const MAP: Record<string, string> = {
  // ── F1 constructors ───────────────────────────────────────────
  Mercedes:                     '/logos/constructors/mercedes.svg',
  'Mercedes-AMG':               '/logos/constructors/mercedes.svg',
  'Mercedes-AMG Petronas':      '/logos/constructors/mercedes.svg',
  Ferrari:                      '/logos/constructors/ferrari.svg',
  'Scuderia Ferrari':           '/logos/constructors/ferrari.svg',
  McLaren:                      '/logos/constructors/mclaren.svg',
  'McLaren Racing':             '/logos/constructors/mclaren.svg',
  'Red Bull Racing':            '/logos/constructors/red-bull.svg',
  'Oracle Red Bull Racing':     '/logos/constructors/red-bull.svg',
  'Red Bull':                   '/logos/constructors/red-bull.svg',
  'Racing Bulls':               '/logos/constructors/racing-bulls.svg',
  VCARB:                        '/logos/constructors/racing-bulls.svg',
  'Visa Cash App RB':           '/logos/constructors/racing-bulls.svg',
  Alpine:                       '/logos/constructors/alpine.svg',
  'BWT Alpine':                 '/logos/constructors/alpine.svg',
  Haas:                         '/logos/constructors/haas.svg',
  'Haas F1 Team':               '/logos/constructors/haas.svg',
  Williams:                     '/logos/constructors/williams.svg',
  'Williams Racing':            '/logos/constructors/williams.svg',
  Audi:                         '/logos/constructors/audi.svg',
  'Stake F1 Team Kick Sauber':  '/logos/constructors/audi.svg',
  'Aston Martin':               '/logos/constructors/aston-martin.svg',
  'Aston Martin Aramco':        '/logos/constructors/aston-martin.svg',
  Cadillac:                     '/logos/constructors/cadillac.svg',
  'Andretti Cadillac':          '/logos/constructors/cadillac.svg',
  'Haas Cadillac':              '/logos/constructors/cadillac.svg',

  // ── MotoGP manufacturers / team → manufacturer ────────────────
  Ducati:                       '/logos/constructors/ducati.svg',
  'Ducati Lenovo':              '/logos/constructors/ducati.svg',
  VR46:                         '/logos/constructors/ducati.svg',
  'VR46 Racing':                '/logos/constructors/ducati.svg',
  Gresini:                      '/logos/constructors/ducati.svg',
  'Gresini Racing':             '/logos/constructors/ducati.svg',
  Pramac:                       '/logos/constructors/ducati.svg',
  Pertamina:                    '/logos/constructors/ducati.svg',
  Aprilia:                      '/logos/constructors/aprilia.svg',
  'Aprilia Racing':             '/logos/constructors/aprilia.svg',
  Trackhouse:                   '/logos/constructors/aprilia.svg',
  KTM:                          '/logos/constructors/ktm.svg',
  'Red Bull KTM':               '/logos/constructors/ktm.svg',
  'Tech3 KTM':                  '/logos/constructors/ktm.svg',
  Honda:                        '/logos/constructors/honda.svg',
  'Repsol Honda':               '/logos/constructors/honda.svg',
  'LCR Honda':                  '/logos/constructors/honda.svg',
  Yamaha:                       '/logos/constructors/yamaha.svg',
  'Monster Energy Yamaha':      '/logos/constructors/yamaha.svg',
  'Pramac Yamaha':              '/logos/constructors/yamaha.svg',

  // ── WEC / endurance manufacturers ────────────────────────────
  Toyota:                       '/logos/constructors/toyota.svg',
  'Toyota Racing':              '/logos/constructors/toyota.svg',
  'Toyota GR Sport':            '/logos/constructors/toyota.svg',
  BMW:                          '/logos/constructors/bmw.svg',
  'BMW M WRT':                  '/logos/constructors/bmw.svg',
  'BMW M Team WRT':             '/logos/constructors/bmw.svg',
  'BMW M Team WRT #20':         '/logos/constructors/bmw.svg',
  'BMW M Team WRT #15':         '/logos/constructors/bmw.svg',
  Porsche:                      '/logos/constructors/porsche.svg',
  'Porsche Penske':             '/logos/constructors/porsche.svg',
  'Porsche Penske Motorsport':  '/logos/constructors/porsche.svg',
  'Porsche Penske #5':          '/logos/constructors/porsche.svg',
  'Porsche Penske #6':          '/logos/constructors/porsche.svg',
  'JDC-Miller Porsche':         '/logos/constructors/porsche.svg',
  Lamborghini:                  '/logos/constructors/lamborghini.svg',
  'Lamborghini Iron Lynx':      '/logos/constructors/lamborghini.svg',
  Peugeot:                      '/logos/constructors/peugeot.svg',
  'Peugeot TotalEnergies':      '/logos/constructors/peugeot.svg',
  'Ferrari AF Corse':           '/logos/constructors/ferrari.svg',
  'Ferrari AF Corse #50':       '/logos/constructors/ferrari.svg',
  'Ferrari AF Corse #51':       '/logos/constructors/ferrari.svg',

  // ── WRC manufacturers ─────────────────────────────────────────
  Hyundai:                      '/logos/constructors/hyundai.svg',
  'Hyundai Motorsport':         '/logos/constructors/hyundai.svg',
  Ford:                         '/logos/constructors/ford.svg',
  'M-Sport Ford':               '/logos/constructors/ford.svg',
  Lancia:                       '/logos/constructors/lancia.svg',
  Citroën:                      '/logos/constructors/peugeot.svg', // PSA group, close enough

  // ── IMSA ──────────────────────────────────────────────────────
  Acura:                        '/logos/constructors/acura.svg',
  'Acura ARX-06':               '/logos/constructors/acura.svg',
  'Wayne Taylor Acura':         '/logos/constructors/acura.svg',
  'Whelen Cadillac':            '/logos/constructors/cadillac.svg',
  'Action Express Cadillac':    '/logos/constructors/cadillac.svg',

  // ── DTM extra aliases ─────────────────────────────────────────
  'Mercedes-AMG DTM':           '/logos/constructors/mercedes.svg',
};

export function getTeamLogo(teamName: string): string | null {
  if (!teamName) return null;
  // Direct match
  if (MAP[teamName]) return MAP[teamName];
  // Partial match — e.g. "Toyota Racing #8" → Toyota
  const lower = teamName.toLowerCase();
  if (lower.includes('mercedes')) return '/logos/constructors/mercedes.svg';
  if (lower.includes('ferrari')) return '/logos/constructors/ferrari.svg';
  if (lower.includes('mclaren')) return '/logos/constructors/mclaren.svg';
  if (lower.includes('red bull')) return '/logos/constructors/red-bull.svg';
  if (lower.includes('alpine')) return '/logos/constructors/alpine.svg';
  if (lower.includes('haas')) return '/logos/constructors/haas.svg';
  if (lower.includes('williams')) return '/logos/constructors/williams.svg';
  if (lower.includes('audi') || lower.includes('sauber')) return '/logos/constructors/audi.svg';
  if (lower.includes('aston martin')) return '/logos/constructors/aston-martin.svg';
  if (lower.includes('cadillac')) return '/logos/constructors/cadillac.svg';
  if (lower.includes('racing bulls') || lower.includes('vcarb') || lower.includes('rb formula')) return '/logos/constructors/racing-bulls.svg';
  if (lower.includes('ducati') || lower.includes('vr46') || lower.includes('gresini') || lower.includes('pramac')) return '/logos/constructors/ducati.svg';
  if (lower.includes('aprilia') || lower.includes('trackhouse')) return '/logos/constructors/aprilia.svg';
  if (lower.includes('ktm')) return '/logos/constructors/ktm.svg';
  if (lower.includes('honda')) return '/logos/constructors/honda.svg';
  if (lower.includes('yamaha')) return '/logos/constructors/yamaha.svg';
  if (lower.includes('toyota')) return '/logos/constructors/toyota.svg';
  if (lower.includes('bmw')) return '/logos/constructors/bmw.svg';
  if (lower.includes('porsche')) return '/logos/constructors/porsche.svg';
  if (lower.includes('lamborghini')) return '/logos/constructors/lamborghini.svg';
  if (lower.includes('peugeot') || lower.includes('citroën') || lower.includes('citroen')) return '/logos/constructors/peugeot.svg';
  if (lower.includes('hyundai')) return '/logos/constructors/hyundai.svg';
  if (lower.includes('ford') || lower.includes('m-sport')) return '/logos/constructors/ford.svg';
  if (lower.includes('lancia')) return '/logos/constructors/lancia.svg';
  if (lower.includes('acura')) return '/logos/constructors/acura.svg';
  return null;
}
