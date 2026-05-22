'use client';

import { getCircuitSvg } from '@/lib/circuits';

interface Circuit3DProps {
  circuitName: string;
  accentColor: string;
  className?: string;
}

export default function Circuit3D({ circuitName, accentColor, className = '' }: Circuit3DProps) {
  const svg = getCircuitSvg(circuitName);
  if (!svg) return null;

  // Unique ID for gradients (avoid collisions with multiple instances)
  const uid = circuitName.replace(/[^a-zA-Z0-9]/g, '');

  // More depth layers and larger offset for dramatic extrusion
  const depthLayers = 12;
  const layerOffset = 1.5;

  return (
    <div
      className={className}
      style={{
        perspective: '350px',
        perspectiveOrigin: '50% 35%',
      }}
    >
      <div
        style={{
          transform: 'rotateX(50deg) rotateZ(-20deg)',
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
        }}
      >
        <svg
          viewBox={svg.viewBox}
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: `drop-shadow(0 6px 20px ${accentColor}50) drop-shadow(0 2px 6px ${accentColor}30)`,
            overflow: 'visible',
          }}
        >
          <defs>
            {/* Top surface gradient — bright to slightly darker */}
            <linearGradient id={`top-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
              <stop offset="50%" stopColor={accentColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.75" />
            </linearGradient>
            {/* Side/depth gradient */}
            <linearGradient id={`side-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
            </linearGradient>
            {/* Glow filter */}
            <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Shadow underneath */}
          <g transform={`translate(${depthLayers * layerOffset * 0.6 + 3}, ${depthLayers * layerOffset + 5})`}>
            <path
              d={svg.path}
              fill="black"
              opacity="0.25"
              style={{ filter: 'blur(4px)' }}
            />
          </g>

          {/* Depth extrusion layers (bottom to top) */}
          {Array.from({ length: depthLayers }, (_, i) => {
            const offset = (depthLayers - i) * layerOffset;
            // Gradient from dark at bottom to brighter near top
            const t = i / depthLayers;
            const opacity = 0.08 + t * 0.25;
            return (
              <g key={i} transform={`translate(${offset * 0.5}, ${offset})`}>
                <path
                  d={svg.path}
                  fill={accentColor}
                  opacity={opacity}
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeOpacity={opacity * 0.4}
                />
              </g>
            );
          })}

          {/* Edge highlight between extrusion and top */}
          <g transform={`translate(${layerOffset * 0.25}, ${layerOffset * 0.5})`}>
            <path
              d={svg.path}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.1"
            />
          </g>

          {/* Top surface */}
          <path
            d={svg.path}
            fill={`url(#top-${uid})`}
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gloss highlight — top-left bright spot */}
          <path
            d={svg.path}
            fill="white"
            opacity="0.1"
            clipPath={`url(#gloss-clip-${uid})`}
          />

          {/* Track center dashed line for realism */}
          <path
            d={svg.path}
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            strokeOpacity="0.15"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    </div>
  );
}
