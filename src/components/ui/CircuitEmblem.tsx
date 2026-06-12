import { getCircuitImage, getCircuitFilter } from '@/lib/images';

interface CircuitEmblemProps {
  circuitName: string;
  /** Square size in px */
  size?: number;
  /** Opacity of the white track mark (default subtle) */
  opacity?: number;
}

/**
 * Small frameless circuit-map mark — a unified neutral white track silhouette
 * paired inline with the circuit name. All maps are pre-cleaned (no corner
 * numbers/markers) and stroke-normalized, then recoloured white via
 * getCircuitFilter, so every circuit reads as one consistent line-art family.
 * Renders nothing when no map exists.
 */
export default function CircuitEmblem({ circuitName, size = 40, opacity = 0.6 }: CircuitEmblemProps) {
  const img = getCircuitImage(circuitName);
  if (!img) return null;

  return (
    <span
      className="shrink-0 inline-flex items-center justify-center pointer-events-none select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src={img.src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: getCircuitFilter(),
          opacity,
        }}
      />
    </span>
  );
}
