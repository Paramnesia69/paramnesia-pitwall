/**
 * Converts an ISO 3166-1 alpha-2 country code to its flag emoji.
 * e.g. 'GB' → '🇬🇧', 'AU' → '🇦🇺'
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';
  return countryCode
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1F1E6))
    .join('');
}
