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

// ── Car badge PNGs from filippofilip95/car-logos-dataset (transparent bg) ────
// ── + Wikimedia SVGs for motorcycle brands not in that dataset ───────────────
const MFR_MAP: Record<string, string> = {
  // ── Car manufacturers (WEC / IMSA / DTM / WRC) ──
  Ferrari:                     '/logos/constructors/brand-ferrari.png',
  'Scuderia Ferrari':          '/logos/constructors/brand-ferrari.png',
  'Ferrari AF Corse':          '/logos/constructors/brand-ferrari.png',
  Toyota:                      '/logos/constructors/brand-toyota.png',
  'Toyota Racing':             '/logos/constructors/brand-toyota.png',
  'Toyota GR Sport':           '/logos/constructors/brand-toyota.png',
  BMW:                         '/logos/constructors/brand-bmw.png',
  'BMW M WRT':                 '/logos/constructors/brand-bmw.png',
  'BMW M Team WRT':            '/logos/constructors/brand-bmw.png',
  Mercedes:                    '/logos/constructors/brand-mercedes-benz.png',
  'Mercedes-AMG':              '/logos/constructors/brand-mercedes-amg.png',
  'Mercedes-AMG DTM':          '/logos/constructors/brand-mercedes-amg.png',
  Porsche:                     '/logos/constructors/brand-porsche.png',
  'Porsche Penske':            '/logos/constructors/brand-porsche.png',
  'Porsche Penske Motorsport': '/logos/constructors/brand-porsche.png',
  'JDC-Miller Porsche':        '/logos/constructors/brand-porsche.png',
  Lamborghini:                 '/logos/constructors/brand-lamborghini.png',
  'Lamborghini Iron Lynx':     '/logos/constructors/brand-lamborghini.png',
  McLaren:                     '/logos/constructors/brand-mclaren.png',
  'Aston Martin':              '/logos/constructors/brand-aston-martin.png',
  Alpine:                      '/logos/constructors/brand-alpine.png',
  'BWT Alpine':                '/logos/constructors/brand-alpine.png',
  Cadillac:                    '/logos/constructors/brand-cadillac.png',
  'Whelen Cadillac':           '/logos/constructors/brand-cadillac.png',
  'Action Express Cadillac':   '/logos/constructors/brand-cadillac.png',
  Audi:                        '/logos/constructors/brand-audi.png',
  Ford:                        '/logos/constructors/brand-ford.png',
  'M-Sport Ford':              '/logos/constructors/brand-ford.png',
  Hyundai:                     '/logos/constructors/brand-hyundai.png',
  'Hyundai Motorsport':        '/logos/constructors/brand-hyundai.png',
  Lancia:                      '/logos/constructors/brand-lancia.png',
  Peugeot:                     '/logos/constructors/brand-peugeot.png',
  'Peugeot TotalEnergies':     '/logos/constructors/brand-peugeot.png',
  Citroën:                     '/logos/constructors/brand-peugeot.png',
  Acura:                       '/logos/constructors/brand-acura.png',
  'Wayne Taylor Acura':        '/logos/constructors/brand-acura.png',
  Honda:                       '/logos/constructors/brand-honda.png',
  'Repsol Honda':              '/logos/constructors/brand-honda.png',
  'LCR Honda':                 '/logos/constructors/brand-honda.png',
  KTM:                         '/logos/constructors/brand-ktm.png',
  'Red Bull KTM':              '/logos/constructors/brand-ktm.png',
  'Tech3 KTM':                 '/logos/constructors/brand-ktm.png',
  // ── MotoGP motorcycle brands (Wikimedia SVG — not in car dataset) ──
  Ducati:                      '/logos/constructors/ducati.svg',
  'Ducati Lenovo':             '/logos/constructors/ducati.svg',
  VR46:                        '/logos/constructors/ducati.svg',
  'VR46 Racing':               '/logos/constructors/ducati.svg',
  Gresini:                     '/logos/constructors/ducati.svg',
  'Gresini Racing':            '/logos/constructors/ducati.svg',
  Pramac:                      '/logos/constructors/ducati.svg',
  Aprilia:                     '/logos/constructors/aprilia.svg',
  'Aprilia Racing':            '/logos/constructors/aprilia.svg',
  Trackhouse:                  '/logos/constructors/aprilia.svg',
  Yamaha:                      '/logos/constructors/yamaha.svg',
  'Monster Energy Yamaha':     '/logos/constructors/yamaha.svg',
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
  if (lower.includes('ferrari')) return '/logos/constructors/brand-ferrari.png';
  if (lower.includes('toyota')) return '/logos/constructors/brand-toyota.png';
  if (lower.includes('bmw')) return '/logos/constructors/brand-bmw.png';
  if (lower.includes('porsche')) return '/logos/constructors/brand-porsche.png';
  if (lower.includes('lamborghini')) return '/logos/constructors/brand-lamborghini.png';
  if (lower.includes('mercedes-amg') || lower.includes('amg')) return '/logos/constructors/brand-mercedes-amg.png';
  if (lower.includes('mercedes')) return '/logos/constructors/brand-mercedes-benz.png';
  if (lower.includes('ducati') || lower.includes('vr46') || lower.includes('gresini') || lower.includes('pramac')) return '/logos/constructors/ducati.svg';
  if (lower.includes('aprilia') || lower.includes('trackhouse')) return '/logos/constructors/aprilia.svg';
  if (lower.includes('ktm')) return '/logos/constructors/brand-ktm.png';
  if (lower.includes('honda')) return '/logos/constructors/brand-honda.png';
  if (lower.includes('yamaha')) return '/logos/constructors/yamaha.svg';
  if (lower.includes('hyundai')) return '/logos/constructors/brand-hyundai.png';
  if (lower.includes('ford') || lower.includes('m-sport')) return '/logos/constructors/brand-ford.png';
  if (lower.includes('cadillac')) return '/logos/constructors/brand-cadillac.png';
  if (lower.includes('acura')) return '/logos/constructors/brand-acura.png';
  if (lower.includes('peugeot') || lower.includes('citroën') || lower.includes('citroen')) return '/logos/constructors/brand-peugeot.png';
  if (lower.includes('lancia')) return '/logos/constructors/brand-lancia.png';
  if (lower.includes('alpine')) return '/logos/constructors/brand-alpine.png';
  if (lower.includes('mclaren')) return '/logos/constructors/brand-mclaren.png';
  if (lower.includes('aston martin')) return '/logos/constructors/brand-aston-martin.png';
  if (lower.includes('audi') || lower.includes('sauber')) return '/logos/constructors/brand-audi.png';
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
