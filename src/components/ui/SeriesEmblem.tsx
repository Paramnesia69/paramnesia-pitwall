import { SERIES_META, type SeriesId } from '@/types';

interface SeriesEmblemProps {
  series: SeriesId;
  /** Square size in px */
  size?: number;
  opacity?: number;
}

/**
 * Small frameless series-logo emblem — the mirror of CircuitEmblem. Rendered as
 * a neutral white silhouette so it matches the circuit mark's "design
 * characters", sized/aligned to sit opposite it across the card title.
 * Renders nothing when the series has no logo.
 */
export default function SeriesEmblem({ series, size = 38, opacity = 0.6 }: SeriesEmblemProps) {
  const meta = SERIES_META[series];
  if (!meta?.logo) return null;

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
          filter: 'brightness(0) invert(1)',
          opacity,
        }}
      />
    </span>
  );
}
