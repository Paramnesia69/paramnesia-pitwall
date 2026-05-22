'use client';

import { getCircuitSvg } from '@/lib/circuits';

interface CircuitOutlineProps {
  circuitName: string;
  accentColor: string;
  className?: string;
}

export default function CircuitOutline({ circuitName, accentColor, className = '' }: CircuitOutlineProps) {
  const svg = getCircuitSvg(circuitName);
  if (!svg) return null;

  return (
    <svg
      viewBox={svg.viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={svg.path}
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <path
        d={svg.path}
        fill={`${accentColor}`}
        opacity="0.04"
      />
    </svg>
  );
}
