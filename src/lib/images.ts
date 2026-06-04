/**
 * Maps circuit names to official F1 circuit map images from the F1 media CDN.
 * These detailed diagrams show turn numbers, DRS zones, and sector colors.
 * Used in EventDetailOverlay hero and CircuitStatsPanel.
 */

const F1_CDN_BASE =
  'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/';

/**
 * Local circuit-map assets for non-F1 circuits the F1 CDN doesn't cover.
 * White line-art on transparent bg — matches the F1 CDN style so the same
 * screen-blend watermark treatment works (HeroCard, EventCard, overlay).
 */
const LOCAL_CIRCUIT_MAPS: Record<string, string> = {
  'Circuit de la Sarthe': '/circuits/le-mans.svg',
};

/** Maps circuit names → F1 CDN image filename (without _Circuit.png suffix) */
const CIRCUIT_CDN_NAMES: Record<string, string> = {
  // ── F1 circuits ──────────────────────────────────────────
  'Albert Park Circuit':            'Australia',
  'Shanghai International Circuit': 'China',
  'Suzuka International Racing Course': 'Japan',
  'Suzuka Circuit':                 'Japan',
  'Bahrain International Circuit':  'Bahrain',
  'Jeddah Corniche Circuit':        'Saudi_Arabia',
  'Miami International Autodrome':  'Miami',
  'Imola':                          'Emilia_Romagna',
  'Imola Circuit':                  'Emilia_Romagna',
  'Circuit de Monaco':              'Monaco',
  'Circuit de Barcelona-Catalunya': 'Spain',
  'Circuit Gilles Villeneuve':      'Canada',
  'Red Bull Ring':                  'Austria',
  'Silverstone Circuit':            'Great_Britain',
  'Circuit de Spa-Francorchamps':   'Belgium',
  'Hungaroring':                    'Hungary',
  'Circuit Zandvoort':              'Netherlands',
  'Autodromo Nazionale Monza':      'Italy',
  'Monza Circuit':                  'Italy',
  'Baku City Circuit':              'Baku',
  'Marina Bay Street Circuit':      'Singapore',
  'Circuit of the Americas':        'USA',
  'Autodromo Hermanos Rodriguez':   'Mexico',
  'Autódromo Hermanos Rodríguez':   'Mexico',
  'Interlagos':                     'Brazil',
  'Interlagos Circuit':             'Brazil',
  'Las Vegas Strip Circuit':        'Las_Vegas',
  'Losail International Circuit':   'Qatar',
  'Lusail International Circuit':   'Qatar',
  'Yas Marina Circuit':             'Abu_Dhabi',
  'Circuito de Madrid':             'Spain',
  'Madring Street Circuit':         'Spain',
};

/**
 * Returns the official F1 circuit map image URL for a given circuit name.
 * Falls back to fuzzy matching if no direct match is found.
 */
export function getCircuitImage(circuitName: string): string | undefined {
  // Local assets first (non-F1 circuits)
  const local = LOCAL_CIRCUIT_MAPS[circuitName];
  if (local) return local;

  // Direct match
  const cdnName = CIRCUIT_CDN_NAMES[circuitName];
  if (cdnName) return `${F1_CDN_BASE}${cdnName}_Circuit.png`;

  // Fuzzy match — partial name containment
  for (const [key, value] of Object.entries(CIRCUIT_CDN_NAMES)) {
    if (circuitName.includes(key) || key.includes(circuitName)) {
      return `${F1_CDN_BASE}${value}_Circuit.png`;
    }
  }

  return undefined;
}
