'use client';

import Image from 'next/image';
import type { CircuitStats } from '@/lib/circuitStats';
import Circuit3D from './Circuit3D';

interface CircuitStatsPanelProps {
  stats: CircuitStats;
  circuitName: string;
  accentColor: string;
}

export default function CircuitStatsPanel({ stats, circuitName, accentColor }: CircuitStatsPanelProps) {
  const hasImage = !!stats.image3d;

  return (
    <div className="relative overflow-hidden rounded-xl" style={{ border: '1px solid var(--pw-glass-border)' }}>
      {/* Background: the Box Box screenshot or gradient */}
      {hasImage ? (
        <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
          <Image
            src={stats.image3d!}
            alt={`${circuitName} circuit`}
            fill
            className="object-cover"
            sizes="(max-width: 520px) 100vw, 480px"
            priority
          />
          {/* Gradient overlay for readability at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)`,
            }}
          />
        </div>
      ) : (
        /* Fallback: stats + SVG 3D render */
        <div className="p-4" style={{ background: 'var(--pw-glass-bg)', backdropFilter: 'blur(12px)' }}>
          <h4 className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--pw-text-tertiary)' }}>
            Circuit Stats
          </h4>
          <div className="flex gap-4">
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <FallbackStatRow label="Length" value={stats.lengthKm} unit="KM" accentColor={accentColor} />
              {stats.laps > 0 && <FallbackStatRow label="Laps" value={stats.laps} unit="" accentColor={accentColor} />}
              <FallbackStatRow label="Turns" value={stats.turns} unit="" accentColor={accentColor} />
              <FallbackStatRow label="Top Speed" value={stats.topSpeedKmph} unit="KMPH" accentColor={accentColor} />
              <FallbackStatRow label="Elevation" value={stats.elevationM} unit="M" accentColor={accentColor} />
            </div>
            <div className="relative w-40 h-40 shrink-0 self-center">
              <Circuit3D circuitName={circuitName} accentColor={accentColor} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FallbackStatRow({ label, value, unit, accentColor }: {
  label: string;
  value: string | number;
  unit: string;
  accentColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${accentColor}18` }}
      >
        <span className="text-[10px] font-bold" style={{ color: accentColor }}>
          {label.charAt(0)}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-[14px] font-bold tabular-nums">{value}</span>
          {unit && (
            <span className="text-[9px] font-medium uppercase" style={{ color: 'var(--pw-text-tertiary)' }}>
              {unit}
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
