/**
 * Manufacturer / constructor logo resolution.
 *
 * Two tiers:
 *   F1_OFFICIAL  — official white-on-transparent WebP logos from media.formula1.com
 *                  Downloaded locally; no colour manipulation needed (they're pre-rendered white).
 *   MANUFACTURER — SVG brand logos (Wikimedia, worldvectorlogo) for non-F1 series.
 *                  Use mix-blend-mode:screen so black parts disappear on dark bg.
 *
 * Call getTeamLogo(name, true) in F1 contexts (timing panel, F1 standings tabs, F1 results).
 * Call getTeamLogo(name)       in all other series contexts.
 */

export interface TeamLogoInfo {
  src: string;
  /** true = white pre-rendered logo; render as-is (no blend mode).
   *  false = coloured brand SVG; use mix-blend-mode:screen on dark bg. */
  white: boolean;
}

// ── Official F1 team logos (white, from media.formula1.com) ──────────────────
const F1_MAP: Record<string, string> = {
  Mercedes:             '/logos/constructors/f1-mercedes.webp',
  'Mercedes-AMG':       '/logos/constructors/f1-mercedes.webp',
  Ferrari:              '/logos/constructors/f1-ferrari.webp',
  'Scuderia Ferrari':   '/logos/constructors/f1-ferrari.webp',
  McLaren:              '/logos/constructors/f1-mclaren.webp',
  'McLaren Racing':     '/logos/constructors/f1-mclaren.webp',
  'Red Bull Racing':    '/logos/constructors/f1-redbull.webp',
  'Oracle Red Bull Racing': '/logos/constructors/f1-redbull.webp',
  'Red Bull':           '/logos/constructors/f1-redbull.webp',
  Alpine:               '/logos/constructors/f1-alpine.webp',
  'BWT Alpine':         '/logos/constructors/f1-alpine.webp',
  Haas:                 '/logos/constructors/f1-haas.webp',
  'Haas F1 Team':       '/logos/constructors/f1-haas.webp',
  Williams:             '/logos/constructors/f1-williams.webp',
  'Williams Racing':    '/logos/constructors/f1-williams.webp',
  Audi:                 '/logos/constructors/f1-audi.webp',
  'Stake F1 Team Kick Sauber': '/logos/constructors/f1-audi.webp',
  'Aston Martin':       '/logos/constructors/f1-astonmartin.webp',
  'Aston Martin Aramco':'/logos/constructors/f1-astonmartin.webp',
  'Racing Bulls':       '/logos/constructors/f1-racingbulls.webp',
  VCARB:                '/logos/constructors/f1-racingbulls.webp',
  'Visa Cash App RB':   '/logos/constructors/f1-racingbulls.webp',
  Cadillac:             '/logos/constructors/f1-cadillac.webp',
  'Andretti Cadillac':  '/logos/constructors/f1-cadillac.webp',
};

// ── Coloured manufacturer / brand SVGs (for WEC, MotoGP, IMSA, WRC, DTM) ────
const MFR_MAP: Record<string, string> = {
  // ── Car manufacturers (WEC / IMSA / DTM / WRC) ──
  Ferrari:              '/logos/constructors/ferrari.svg',
  'Scuderia Ferrari':   '/logos/constructors/ferrari.svg',
  'Ferrari AF Corse':   '/logos/constructors/ferrari.svg',
  Toyota:               '/logos/constructors/toyota.svg',
  'Toyota Racing':      '/logos/constructors/toyota.svg',
  'Toyota GR Sport':    '/logos/constructors/toyota.svg',
  BMW:                  '/logos/constructors/bmw.svg',
  'BMW M WRT':          '/logos/constructors/bmw.svg',
  'BMW M Team WRT':     '/logos/constructors/bmw.svg',
  'Mercedes-AMG':       '/logos/constructors/mercedes.svg',
  'Mercedes-AMG DTM':   '/logos/constructors/mercedes.svg',
  Mercedes:             '/logos/constructors/mercedes.svg',
  Porsche:              '/logos/constructors/porsche.svg',
  'Porsche Penske':     '/logos/constructors/porsche.svg',
  'Porsche Penske Motorsport': '/logos/constructors/porsche.svg',
  'JDC-Miller Porsche': '/logos/constructors/porsche.svg',
  Lamborghini:          '/logos/constructors/lamborghini.svg',
  'Lamborghini Iron Lynx': '/logos/constructors/lamborghini.svg',
  McLaren:              '/logos/constructors/mclaren.svg',
  'Aston Martin':       '/logos/constructors/aston-martin.svg',
  Alpine:               '/logos/constructors/alpine.svg',
  Cadillac:             '/logos/constructors/cadillac.svg',
  'Whelen Cadillac':    '/logos/constructors/cadillac.svg',
  'Action Express Cadillac': '/logos/constructors/cadillac.svg',
  Ford:                 '/logos/constructors/ford.svg',
  'M-Sport Ford':       '/logos/constructors/ford.svg',
  Hyundai:              '/logos/constructors/hyundai.svg',
  'Hyundai Motorsport': '/logos/constructors/hyundai.svg',
  Lancia:               '/logos/constructors/lancia.svg',
  Peugeot:              '/logos/constructors/peugeot.svg',
  'Peugeot TotalEnergies': '/logos/constructors/peugeot.svg',
  Citroën:              '/logos/constructors/peugeot.svg',
  Acura:                '/logos/constructors/acura.svg',
  'Wayne Taylor Acura': '/logos/constructors/acura.svg',
  // ── MotoGP manufacturers / team → manufacturer ──
  Ducati:               '/logos/constructors/ducati.svg',
  'Ducati Lenovo':      '/logos/constructors/ducati.svg',
  VR46:                 '/logos/constructors/ducati.svg',
  'VR46 Racing':        '/logos/constructors/ducati.svg',
  Gresini:              '/logos/constructors/ducati.svg',
  'Gresini Racing':     '/logos/constructors/ducati.svg',
  Pramac:               '/logos/constructors/ducati.svg',
  Aprilia:              '/logos/constructors/aprilia.svg',
  'Aprilia Racing':     '/logos/constructors/aprilia.svg',
  Trackhouse:           '/logos/constructors/aprilia.svg',
  KTM:                  '/logos/constructors/ktm.svg',
  'Red Bull KTM':       '/logos/constructors/ktm.svg',
  'Tech3 KTM':          '/logos/constructors/ktm.svg',
  Honda:                '/logos/constructors/honda.svg',
  'Repsol Honda':       '/logos/constructors/honda.svg',
  'LCR Honda':          '/logos/constructors/honda.svg',
  Yamaha:               '/logos/constructors/yamaha.svg',
  'Monster Energy Yamaha': '/logos/constructors/yamaha.svg',
};

function partialF1Match(lower: string): string | null {
  if (lower.includes('mercedes')) return '/logos/constructors/f1-mercedes.webp';
  if (lower.includes('ferrari')) return '/logos/constructors/f1-ferrari.webp';
  if (lower.includes('mclaren')) return '/logos/constructors/f1-mclaren.webp';
  if (lower.includes('red bull')) return '/logos/constructors/f1-redbull.webp';
  if (lower.includes('alpine')) return '/logos/constructors/f1-alpine.webp';
  if (lower.includes('haas')) return '/logos/constructors/f1-haas.webp';
  if (lower.includes('williams')) return '/logos/constructors/f1-williams.webp';
  if (lower.includes('audi') || lower.includes('sauber')) return '/logos/constructors/f1-audi.webp';
  if (lower.includes('aston martin')) return '/logos/constructors/f1-astonmartin.webp';
  if (lower.includes('racing bulls') || lower.includes('vcarb')) return '/logos/constructors/f1-racingbulls.webp';
  if (lower.includes('cadillac')) return '/logos/constructors/f1-cadillac.webp';
  return null;
}

function partialMfrMatch(lower: string): string | null {
  if (lower.includes('ferrari')) return '/logos/constructors/ferrari.svg';
  if (lower.includes('toyota')) return '/logos/constructors/toyota.svg';
  if (lower.includes('bmw')) return '/logos/constructors/bmw.svg';
  if (lower.includes('porsche')) return '/logos/constructors/porsche.svg';
  if (lower.includes('lamborghini')) return '/logos/constructors/lamborghini.svg';
  if (lower.includes('mercedes')) return '/logos/constructors/mercedes.svg';
  if (lower.includes('ducati') || lower.includes('vr46') || lower.includes('gresini') || lower.includes('pramac')) return '/logos/constructors/ducati.svg';
  if (lower.includes('aprilia') || lower.includes('trackhouse')) return '/logos/constructors/aprilia.svg';
  if (lower.includes('ktm')) return '/logos/constructors/ktm.svg';
  if (lower.includes('honda')) return '/logos/constructors/honda.svg';
  if (lower.includes('yamaha')) return '/logos/constructors/yamaha.svg';
  if (lower.includes('hyundai')) return '/logos/constructors/hyundai.svg';
  if (lower.includes('ford') || lower.includes('m-sport')) return '/logos/constructors/ford.svg';
  if (lower.includes('cadillac')) return '/logos/constructors/cadillac.svg';
  if (lower.includes('acura')) return '/logos/constructors/acura.svg';
  if (lower.includes('peugeot') || lower.includes('citroën') || lower.includes('citroen')) return '/logos/constructors/peugeot.svg';
  if (lower.includes('lancia')) return '/logos/constructors/lancia.svg';
  if (lower.includes('alpine')) return '/logos/constructors/alpine.svg';
  if (lower.includes('mclaren')) return '/logos/constructors/mclaren.svg';
  if (lower.includes('aston martin')) return '/logos/constructors/aston-martin.svg';
  return null;
}

/**
 * @param teamName  Team or manufacturer name string from data
 * @param f1Context Pass true when rendering F1 timing / standings / results.
 *                  Uses the official white F1 team logos instead of brand SVGs.
 */
export function getTeamLogo(teamName: string, f1Context = false): TeamLogoInfo | null {
  if (!teamName) return null;
  const lower = teamName.toLowerCase();

  if (f1Context) {
    const src = F1_MAP[teamName] ?? partialF1Match(lower);
    if (src) return { src, white: true };
  }

  const src = MFR_MAP[teamName] ?? partialMfrMatch(lower);
  if (src) return { src, white: false };
  return null;
}
