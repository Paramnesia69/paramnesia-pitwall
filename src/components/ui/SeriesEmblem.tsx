import { SERIES_META, type SeriesId } from '@/types';

interface SeriesEmblemProps {
  series: SeriesId;
  /** Square size in px */
  size?: number;
  opacity?: number;
}

/**
 * Small frameless series-logo emblem, sized/aligned to sit opposite the
 * CircuitEmblem across the card title. Rendered in the logo's NATURAL brand
 * colours (matching the faded series watermark on the upcoming-events cards) —
 * white-silhouette inversion destroyed detailed badges like IMSA. Dark-fill
 * logos (Porsche) are the one exception that must be whitened to show on dark.
 * Renders nothing when the series has no logo.
 */
export default function SeriesEmblem({ series, size = 38, opacity = 0.85 }: SeriesEmblemProps) {
  const meta = SERIES_META[series];
  if (!meta?.logo) return null;
  const invert = meta.logo === '/logos/porsche.svg';

  return (
    <span
      className="shrink-0 inline-flex items-center justify-center pointer-events-none select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src={meta.logo}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: invert ? 'brightness(0) invert(1)' : undefined,
          opacity,
        }}
      />
    </span>
  );
}
