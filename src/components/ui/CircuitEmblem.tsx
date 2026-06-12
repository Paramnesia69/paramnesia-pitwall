import { getCircuitImage, getCircuitFilter } from '@/lib/images';

interface CircuitEmblemProps {
  circuitName: string;
  /** Square size in px */
  size?: number;
  /** Series accent — tints the chip frame */
  accent?: string;
}

/**
 * Framed circuit-map chip — an emblem, not a watermark. Full opacity inside a
 * glass-bordered box, so on dense cards (event/result) the map adds info in a
 * fixed corner instead of bleeding under the text. Renders nothing when no
 * map exists for the circuit.
 */
export default function CircuitEmblem({ circuitName, size = 40, accent }: CircuitEmblemProps) {
  const img = getCircuitImage(circuitName);
  if (!img) return null;

  return (
    <div
      className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: accent ? `${accent}0e` : 'var(--pw-glass-bg)',
        border: `1px solid ${accent ? `${accent}28` : 'var(--pw-glass-border)'}`,
      }}
    >
      <img
        src={img.src}
        alt=""
        aria-hidden
        style={{
          width: '76%',
          height: '76%',
          objectFit: 'contain',
          filter: getCircuitFilter(img),
          opacity: 0.95,
        }}
      />
    </div>
  );
}
