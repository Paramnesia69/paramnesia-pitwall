/**
 * Manufacturer / constructor logo resolution.
 *
 * Three tiers:
 *   F1_OFFICIAL  — official white-on-transparent WebP logos from media.formula1.com
 *                  Display as-is, opacity 0.95 only.
 *   SVG_MOTO     — motorcycle brand SVGs. Black-fill logos need a cssFilter to show colour;
 *                  Ducati SVG already contains red+white so no filter needed.
 *   MANUFACTURER — transparent-bg PNG badges (car-logos-dataset).
 *                  Apply brightness(1.6) saturate(2.5) contrast(1.2) to make colours vivid.
 *
 * Call getTeamLogo(name, true) in F1 contexts (timing, F1 standings, F1 results).
 * Call getTeamLogo(name)       in all other series contexts.
 */

export interface TeamLogoInfo {
  src: string;
  /** true = official F1 white WebP — opacity only, no colour filter */
  white: boolean;
  /**
   * If set, apply this CSS filter string directly.
   * Overrides the default per-tier filter logic in components.
   */
  cssFilter?: string;
  /** true = brand PNG badge — render at larger size than SVG moto logos */
  png?: boolean;
}

// ── Official F1 team logos (white WebP from media.formula1.com) ──────────────
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

// ── Motorcycle brand SVGs — each needs its own colour treatment ───────────────
// Ducati SVG already has red+white fills → no filter, just slight opacity
// Aprilia/Yamaha SVGs are black-fill → use cssFilter to tint to brand colour
const DUCATI_FILTER  = undefined; // natural red+white, no distortion
const APRILIA_FILTER = 'brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(325deg) brightness(0.85)';
const YAMAHA_FILTER  = 'brightness(0) invert(1) sepia(1) saturate(6) hue-rotate(195deg) brightness(0.9)';
// ktm.svg has orange background (#f27620) + dark text — shows as orange badge naturally on dark UI
const KTM_FILTER     = undefined;

const SVG_MOTO_MAP: Record<string, { src: string; cssFilter?: string }> = {
  Ducati:                  { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  'Ducati Lenovo':         { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  VR46:                    { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  'VR46 Racing':           { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  'Pertamina VR46 Ducati': { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  Gresini:                 { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  'Gresini Racing':        { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  'BK8 Gresini Ducati':    { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  Pramac:                  { src: '/logos/constructors/ducati.svg',  cssFilter: DUCATI_FILTER },
  'Pramac Yamaha':         { src: '/logos/constructors/yamaha.svg',  cssFilter: YAMAHA_FILTER },
  Aprilia:                 { src: '/logos/constructors/aprilia.svg', cssFilter: APRILIA_FILTER },
  'Aprilia Racing':        { src: '/logos/constructors/aprilia.svg', cssFilter: APRILIA_FILTER },
  Trackhouse:              { src: '/logos/constructors/aprilia.svg', cssFilter: APRILIA_FILTER },
  'Trackhouse Aprilia':    { src: '/logos/constructors/aprilia.svg', cssFilter: APRILIA_FILTER },
  Yamaha:                  { src: '/logos/constructors/yamaha.svg',  cssFilter: YAMAHA_FILTER },
  'Monster Yamaha':        { src: '/logos/constructors/yamaha.svg',  cssFilter: YAMAHA_FILTER },
  'Monster Energy Yamaha': { src: '/logos/constructors/yamaha.svg',  cssFilter: YAMAHA_FILTER },
  'Yamaha Factory Racing': { src: '/logos/constructors/yamaha.svg',  cssFilter: YAMAHA_FILTER },
  KTM:                     { src: '/logos/constructors/ktm.svg',     cssFilter: KTM_FILTER },
  'Red Bull KTM':          { src: '/logos/constructors/ktm.svg',     cssFilter: KTM_FILTER },
  'Red Bull KTM Tech3':    { src: '/logos/constructors/ktm.svg',     cssFilter: KTM_FILTER },
  'Tech3 KTM':             { src: '/logos/constructors/ktm.svg',     cssFilter: KTM_FILTER },
};

// ── Car badge PNGs from filippofilip95/car-logos-dataset (transparent bg) ────
const MFR_MAP: Record<string, string> = {
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
  'MSR Acura':                 '/logos/constructors/brand-acura.png',
  'Meyer Shank Acura':         '/logos/constructors/brand-acura.png',
  Corvette:                    '/logos/constructors/brand-corvette.png',
  'Corvette Racing':           '/logos/constructors/brand-corvette.png',
  'TF Sport Corvette':         '/logos/constructors/brand-corvette.png',
  Honda:                       '/logos/constructors/brand-honda.png',
  'Repsol Honda':              '/logos/constructors/brand-honda.png',
  'LCR Honda':                 '/logos/constructors/brand-honda.png',
  KTM:                         '/logos/constructors/brand-ktm.png',
  'Red Bull KTM':              '/logos/constructors/brand-ktm.png',
  'Tech3 KTM':                 '/logos/constructors/brand-ktm.png',
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
  if (lower.includes('ktm')) return '/logos/constructors/brand-ktm.png';
  if (lower.includes('honda')) return '/logos/constructors/brand-honda.png';
  if (lower.includes('hyundai')) return '/logos/constructors/brand-hyundai.png';
  if (lower.includes('ford') || lower.includes('m-sport')) return '/logos/constructors/brand-ford.png';
  if (lower.includes('cadillac')) return '/logos/constructors/brand-cadillac.png';
  if (lower.includes('acura')) return '/logos/constructors/brand-acura.png';
  if (lower.includes('corvette')) return '/logos/constructors/brand-corvette.png';
  if (lower.includes('peugeot') || lower.includes('citroën') || lower.includes('citroen')) return '/logos/constructors/brand-peugeot.png';
  if (lower.includes('lancia')) return '/logos/constructors/brand-lancia.png';
  if (lower.includes('alpine')) return '/logos/constructors/brand-alpine.png';
  if (lower.includes('mclaren')) return '/logos/constructors/brand-mclaren.png';
  if (lower.includes('aston martin')) return '/logos/constructors/brand-aston-martin.png';
  if (lower.includes('audi') || lower.includes('sauber')) return '/logos/constructors/brand-audi.png';
  return null;
}

/**
 * @param teamName  Team or manufacturer name from data
 * @param f1Context Pass true for F1 timing / standings / results — uses official white logos.
 */
export function getTeamLogo(teamName: string, f1Context = false): TeamLogoInfo | null {
  if (!teamName) return null;
  const lower = teamName.toLowerCase();

  // F1 official white logos
  if (f1Context) {
    const src = F1_MAP[teamName] ?? partialF1Match(lower);
    if (src) return { src, white: true };
  }

  // Motorcycle SVGs — colour-treated per brand
  const motoEntry = SVG_MOTO_MAP[teamName];
  if (motoEntry) return { src: motoEntry.src, white: false, cssFilter: motoEntry.cssFilter };

  if (lower.includes('ducati') || lower.includes('vr46') || lower.includes('gresini') || lower.includes('pramac'))
    return { src: '/logos/constructors/ducati.svg', white: false, cssFilter: DUCATI_FILTER };
  if (lower.includes('aprilia') || lower.includes('trackhouse'))
    return { src: '/logos/constructors/aprilia.svg', white: false, cssFilter: APRILIA_FILTER };
  if (lower.includes('yamaha'))
    return { src: '/logos/constructors/yamaha.svg', white: false, cssFilter: YAMAHA_FILTER };
  if (lower.includes('ktm'))
    return { src: '/logos/constructors/ktm.svg', white: false, cssFilter: KTM_FILTER };

  // Coloured brand PNG badges
  const src = MFR_MAP[teamName] ?? partialMfrMatch(lower);
  if (src) {
    // Black-fill logos need inversion to show on dark backgrounds
    if (lower.includes('mercedes-amg') || lower === 'amg')
      return { src, white: false, cssFilter: 'brightness(0) invert(1) opacity(0.85)', png: true };
    if (lower.includes('audi') || lower.includes('sauber'))
      return { src, white: false, cssFilter: 'brightness(0) invert(1) opacity(0.85)', png: true };
    return { src, white: false, png: true };
  }

  return null;
}
