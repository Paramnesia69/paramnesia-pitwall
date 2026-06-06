/**
 * Maps circuit names to self-hosted Wikimedia Commons SVG circuit maps.
 * All files live in /public/circuits/ — no external CDN dependency.
 *
 * Files not yet downloaded return a 404 (graceful — same as undefined).
 * Background download script populates them without requiring code changes.
 */
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
  'Madring Street Circuit':           '/circuits/f1-madrid.svg',

  // ── WEC / ELMS / Multi-series ────────────────────────────────────────────
  'Circuit de la Sarthe':           '/circuits/le-mans-sarthe-v2.svg',
  'Circuit Paul Ricard':            '/circuits/paul-ricard.svg',
  'Fuji Speedway':                  '/circuits/fuji.svg',
  'Mugello':                        '/circuits/mugello.svg',
  'Mugello Circuit':                '/circuits/mugello.svg',
  'Brands Hatch':                   '/circuits/brands-hatch.svg',
  'Misano World Circuit':           '/circuits/misano.svg',
  'Algarve International Circuit':  '/circuits/algarve.svg',

  // ── IMSA ─────────────────────────────────────────────────────────────────
  'Daytona International Speedway': '/circuits/daytona.svg',
  'Sebring International Raceway':  '/circuits/sebring.svg',
  'Watkins Glen International':     '/circuits/watkins-glen.svg',
  'WeatherTech Raceway Laguna Seca':'/circuits/laguna-seca.svg',
  'Road America':                   '/circuits/road-america.svg',

  // ── Nürburgring ──────────────────────────────────────────────────────────
  'Nürburgring Nordschleife':       '/circuits/nurburgring-nordschleife.svg',
  'Nürburgring':                    '/circuits/nurburgring-gp.svg',
};

export function getCircuitImage(circuitName: string): string | undefined {
  // Direct match
  const direct = CIRCUIT_MAP[circuitName];
  if (direct) return direct;

  // Fuzzy match — partial containment for minor name variations
  for (const [key, value] of Object.entries(CIRCUIT_MAP)) {
    if (circuitName.includes(key) || key.includes(circuitName)) {
      return value;
    }
  }

  return undefined;
}
