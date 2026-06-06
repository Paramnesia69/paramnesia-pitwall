export interface CircuitImageInfo {
  src: string;
  dark?: boolean;
  vivid?: boolean;
  filterOverride?: string;  // per-circuit CSS filter; bypasses dark/vivid/base selection
  sharpOpacity: number;
  glowOpacity: number;
  cardTop?: string;   // override top% of card circuit zone (default '48%')
  cardRight?: string; // override right% of card circuit zone (default '48%')
}

const VIVID_SVGS = new Set([
  '/circuits/le-mans-sarthe-v2.svg',
  '/circuits/sebring.svg',
]);

const DARK_SVGS = new Set([
  '/circuits/f1-madrid.svg',
  '/circuits/fuji.svg',
  '/circuits/miami.svg',
  '/circuits/mugello.svg',
  '/circuits/daytona.svg',
  '/circuits/nurburgring-gp.svg',
  '/circuits/las-vegas.svg',
  '/circuits/misano-v2.svg',
  '/circuits/laguna-seca.svg',
  '/circuits/road-america.svg',
  '/circuits/shanghai.svg',
]);

// Per-circuit filter overrides — takes precedence over dark/vivid/base
const FILTER_OVERRIDES: Record<string, string> = {
  // Nordschleife: gray strokes + red sector marks; needs strong brightness + shape-glow
  '/circuits/nurburgring-nordschleife.svg': 'brightness(4.2) contrast(1.6) saturate(2.2) drop-shadow(0 0 2px rgba(255,255,255,0.72)) drop-shadow(0 0 7px rgba(160,230,160,0.32))',
  // Watkins Glen: inverted to white, reduced glow/glare
  '/circuits/watkins-glen-long.svg': 'brightness(0) invert(1) contrast(1.1) drop-shadow(0 0 2px rgba(255,255,255,0.38)) drop-shadow(0 0 5px rgba(240,190,80,0.18))',
  // Misano: simple white inversion, no blue tint, low contrast
  '/circuits/misano-v2.svg': 'brightness(0) invert(1) contrast(1.1)',
  // Portimão (Algarve): natural color, slightly boosted clarity
  '/circuits/algarve.svg': 'brightness(1.12) contrast(1.35) saturate(0.8)',
};

// Per-circuit tuning: [sharpOpacity, glowOpacity, cardTop?, cardRight?]
// dark default: 0.42/0.20 | vivid default: 0.42/0.30 | base default: 0.28/0.14
// cardTop default '48%', cardRight default '48%'
const TUNING: Record<string, [number, number, string?, string?]> = {
  '/circuits/algarve.svg':                [0.52, 0.22],          // Portimão: more visible, natural
  '/circuits/nurburgring-nordschleife.svg':[0.68, 0.35],
  '/circuits/misano-v2.svg':              [0.20, 0.07, '56%'],   // Misano: shrunk + dimmed
  '/circuits/watkins-glen-long.svg':      [0.42, 0.20],          // Watkins Glen: less glare
  '/circuits/mugello.svg':                [0.30, 0.13],
  '/circuits/road-america.svg':           [0.30, 0.13],
  '/circuits/brands-hatch.svg':           [0.18, 0.08],
  '/circuits/sebring.svg':                [0.38, 0.22],
};

const CIRCUIT_MAP: Record<string, string> = {
  // ── F1 ───────────────────────────────────────────────────────────────────
  'Albert Park Circuit':            '/circuits/f1-australia.svg',
  'Bahrain International Circuit':  '/circuits/f1-bahrain.svg',
  'Jeddah':                         '/circuits/f1-saudi-arabia.svg',
  'Jeddah Corniche Circuit':        '/circuits/f1-saudi-arabia.svg',
  'Shanghai International Circuit': '/circuits/shanghai.svg',
  'Miami International Autodrome':  '/circuits/miami.svg',
  'Imola Circuit':                  '/circuits/f1-imola.svg',
  'Imola':                          '/circuits/f1-imola.svg',
  'Circuit de Monaco':              '/circuits/f1-monaco.svg',
  'Monte Carlo':                    '/circuits/f1-monaco.svg',
  'Circuit Gilles Villeneuve':      '/circuits/f1-canada.svg',
  'Red Bull Ring':                  '/circuits/f1-austria.svg',
  'Silverstone Circuit':            '/circuits/f1-britain.svg',
  'Circuit de Spa-Francorchamps':   '/circuits/f1-belgium.svg',
  'Hungaroring':                    '/circuits/f1-hungary.svg',
  'Circuit Zandvoort':              '/circuits/f1-netherlands.svg',
  'Autodromo Nazionale Monza':      '/circuits/f1-italia.svg',
  'Monza Circuit':                  '/circuits/f1-italia.svg',
  'Baku City Circuit':              '/circuits/f1-azerbaijan.svg',
  'Marina Bay Street Circuit':      '/circuits/f1-singapore.svg',
  'Suzuka International Racing Course': '/circuits/f1-japan.svg',
  'Suzuka Circuit':                 '/circuits/f1-japan.svg',
  'Circuit of the Americas':        '/circuits/f1-cota.svg',
  'Autodromo Hermanos Rodriguez':   '/circuits/f1-mexico.svg',
  'Autódromo Hermanos Rodríguez':   '/circuits/f1-mexico.svg',
  'Interlagos':                     '/circuits/f1-sao-paulo.svg',
  'Interlagos Circuit':             '/circuits/f1-sao-paulo.svg',
  'Las Vegas Strip Circuit':        '/circuits/las-vegas.svg',
  'Lusail International Circuit':   '/circuits/f1-qatar.svg',
  'Losail International Circuit':   '/circuits/f1-qatar.svg',
  'Yas Marina Circuit':             '/circuits/f1-abu-dhabi.svg',
  'Madring Street Circuit':         '/circuits/f1-madrid.svg',
  'Circuit de Barcelona-Catalunya': '/circuits/f1-barcelona.svg',

  // ── WEC / ELMS / Multi-series ────────────────────────────────────────────
  'Circuit de la Sarthe':           '/circuits/le-mans-sarthe-v2.svg',
  'Circuit Paul Ricard':            '/circuits/paul-ricard.svg',
  'Fuji Speedway':                  '/circuits/fuji.svg',
  'Mugello':                        '/circuits/mugello.svg',
  'Mugello Circuit':                '/circuits/mugello.svg',
  'Brands Hatch':                   '/circuits/brands-hatch.svg',
  'Misano World Circuit':           '/circuits/misano-v2.svg',
  'Algarve International Circuit':  '/circuits/algarve.svg',

  // ── IMSA ─────────────────────────────────────────────────────────────────
  'Daytona International Speedway': '/circuits/daytona.svg',
  'Sebring International Raceway':  '/circuits/sebring.svg',
  'Watkins Glen International':     '/circuits/watkins-glen-long.svg',
  'WeatherTech Raceway Laguna Seca':'/circuits/laguna-seca.svg',
  'Road America':                   '/circuits/road-america.svg',

  // ── Nürburgring ──────────────────────────────────────────────────────────
  'Nürburgring Nordschleife':       '/circuits/nurburgring-nordschleife.svg',
  'Nürburgring':                    '/circuits/nurburgring-gp.svg',
};

export function getCircuitImage(circuitName: string): CircuitImageInfo | undefined {
  let src: string | undefined;

  // Direct match
  src = CIRCUIT_MAP[circuitName];

  // Fuzzy match — partial containment for minor name variations
  if (!src) {
    for (const [key, value] of Object.entries(CIRCUIT_MAP)) {
      if (circuitName.includes(key) || key.includes(circuitName)) {
        src = value;
        break;
      }
    }
  }

  if (!src) return undefined;
  const dark = DARK_SVGS.has(src);
  const vivid = VIVID_SVGS.has(src);
  const filterOverride = FILTER_OVERRIDES[src];
  const defaults: [number, number, string?, string?] = dark ? [0.42, 0.20] : vivid ? [0.42, 0.30] : [0.28, 0.14];
  const [sharpOpacity, glowOpacity, cardTop, cardRight] = TUNING[src] ?? defaults;
  return { src, dark, vivid, filterOverride, sharpOpacity, glowOpacity, cardTop, cardRight };
}
