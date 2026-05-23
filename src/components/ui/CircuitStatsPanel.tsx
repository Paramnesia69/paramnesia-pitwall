'use client';

import Image from 'next/image';
import type { CircuitStats } from '@/lib/circuitStats';
import { getCircuitImage } from '@/lib/images';
import Circuit3D from './Circuit3D';

interface CircuitStatsPanelProps {
  stats: CircuitStats;
  circuitName: string;
  accentColor: string;
}

/* ── Stat icon SVGs ────────────────────────────── */
function LengthIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  );
}
function TurnsIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function SpeedIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0" />
      <path d="M12 12l4-4" />
      <path d="M12 7v1" />
    </svg>
  );
}
function ElevationIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3l4-3 4 3" /><path d="M12 0v12" />
      <path d="M2 19l5-5 4 4 6-7 5 5" />
    </svg>
  );
}
function LapsIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function DrsIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  );
}

/* ── Single stat tile ────────────────────────────── */
function StatTile({
  icon,
  label,
  value,
  unit,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  accentColor: string;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
      style={{ background: `${accentColor}08` }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${accentColor}15` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold tabular-nums">{value}</span>
          {unit && (
            <span className="text-[9px] font-semibold uppercase" style={{ color: 'var(--pw-text-tertiary)' }}>
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

/* ── Main panel ────────────────────────────── */
export default function CircuitStatsPanel({ stats, circuitName, accentColor }: CircuitStatsPanelProps) {
  const circuitMapUrl = getCircuitImage(circuitName);

  return (
    <div className="relative overflow-hidden rounded-xl" style={{ border: '1px solid var(--pw-glass-border)' }}>
      {/* Circuit visual: F1 official map or 3D SVG fallback */}
      {circuitMapUrl ? (
        <div className="relative w-full" style={{ aspectRatio: '16 / 9', background: '#15151e' }}>
          <Image
            src={circuitMapUrl}
            alt={`${circuitName} circuit`}
            fill
            className="object-contain"
            sizes="(max-width: 520px) 100vw, 480px"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          {/* Circuit type badge overlaid on image */}
          {stats.circuitType && (
            <div className="absolute top-3 left-3">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  color: accentColor,
                  border: `1px solid ${accentColor}40`,
                }}
              >
                {stats.circuitType === 'street' ? 'Street Circuit' : stats.circuitType === 'hybrid' ? 'Hybrid Circuit' : 'Permanent Circuit'}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* No image — show 3D circuit SVG */
        <div
          className="relative p-4 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)`,
            minHeight: 140,
          }}
        >
          {stats.circuitType && (
            <div className="absolute top-3 left-3">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                style={{
                  background: 'var(--pw-glass-bg)',
                  color: accentColor,
                  border: `1px solid ${accentColor}20`,
                }}
              >
                {stats.circuitType === 'street' ? 'Street Circuit' : stats.circuitType === 'hybrid' ? 'Hybrid Circuit' : 'Permanent Circuit'}
              </span>
            </div>
          )}
          <Circuit3D circuitName={circuitName} accentColor={accentColor} className="w-36 h-36" />
        </div>
      )}

      {/* Stats grid — always shown */}
      <div className="p-4" style={{ background: 'var(--pw-glass-bg)', backdropFilter: 'blur(12px)' }}>
        <h4 className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--pw-text-tertiary)' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Circuit Data
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <StatTile
            icon={<LengthIcon color={accentColor} />}
            label="Length"
            value={stats.lengthKm}
            unit="km"
            accentColor={accentColor}
          />
          {stats.laps > 0 && (
            <StatTile
              icon={<LapsIcon color={accentColor} />}
              label="Race Laps"
              value={stats.laps}
              accentColor={accentColor}
            />
          )}
          <StatTile
            icon={<TurnsIcon color={accentColor} />}
            label="Turns"
            value={stats.turns}
            accentColor={accentColor}
          />
          <StatTile
            icon={<SpeedIcon color={accentColor} />}
            label="Top Speed"
            value={stats.topSpeedKmph}
            unit="km/h"
            accentColor={accentColor}
          />
          <StatTile
            icon={<ElevationIcon color={accentColor} />}
            label="Elevation Δ"
            value={stats.elevationM}
            unit="m"
            accentColor={accentColor}
          />
          {stats.drsZones && (
            <StatTile
              icon={<DrsIcon color={accentColor} />}
              label="DRS Zones"
              value={stats.drsZones}
              accentColor={accentColor}
            />
          )}
        </div>

        {/* Lap record */}
        {stats.lapRecord && (
          <div
            className="mt-3 px-3 py-2.5 rounded-lg flex items-center gap-3"
            style={{
              background: `${accentColor}06`,
              border: `1px solid ${accentColor}15`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${accentColor}15` }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
                <path d="M4 22h16" />
                <path d="M10 22V2h4v20" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>
                Fastest Lap Record
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-bold font-mono tabular-nums" style={{ color: accentColor }}>
                  {stats.lapRecord.time}
                </span>
                <span className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>
                  {stats.lapRecord.driver}
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--pw-text-tertiary)' }}>
                  ({stats.lapRecord.year})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
