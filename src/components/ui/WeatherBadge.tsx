'use client';

import type { WeatherData } from '@/types';

interface WeatherBadgeProps {
  weather: WeatherData;
  compact?: boolean;
  accentColor?: string;
}

function WeatherIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  const s = size;
  // SVG weather icons — minimal, clean line style
  switch (icon) {
    case 'sun':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case 'moon':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#B8C4D0" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      );
    case 'cloud-sun':
    case 'cloud-moon':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#B8C4D0" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v1M4.93 4.93l.7.7M2 12h1M4.93 19.07l.7-.7" stroke="#FFB800" />
          <path d="M18 10a4 4 0 00-7.46-2A5 5 0 106 17h12a3 3 0 000-6h-.5" />
        </svg>
      );
    case 'cloud':
    case 'clouds':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#8899AA" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10a4 4 0 00-7.46-2A5 5 0 106 17h12a3 3 0 000-6h-.5" />
        </svg>
      );
    case 'rain':
    case 'rain-sun':
    case 'rain-moon':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#4A9EFF" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10a4 4 0 00-7.46-2A5 5 0 106 17h12a3 3 0 000-6h-.5" stroke="#8899AA" />
          <path d="M8 19v2M12 19v2M16 19v2" />
        </svg>
      );
    case 'storm':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10a4 4 0 00-7.46-2A5 5 0 106 17h12a3 3 0 000-6h-.5" stroke="#8899AA" />
          <path d="M13 17l-2 4h4l-2 4" />
        </svg>
      );
    case 'snow':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#B8C4D0" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10a4 4 0 00-7.46-2A5 5 0 106 17h12a3 3 0 000-6h-.5" stroke="#8899AA" />
          <circle cx="8" cy="20" r="0.5" fill="#B8C4D0" />
          <circle cx="12" cy="20" r="0.5" fill="#B8C4D0" />
          <circle cx="16" cy="20" r="0.5" fill="#B8C4D0" />
        </svg>
      );
    case 'mist':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#8899AA" strokeWidth="2" strokeLinecap="round">
          <path d="M5 8h14M3 12h18M7 16h10" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#8899AA" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10a4 4 0 00-7.46-2A5 5 0 106 17h12a3 3 0 000-6h-.5" />
        </svg>
      );
  }
}

/** Compact badge: icon + temp — used on cards */
export function WeatherBadgeCompact({ weather }: { weather: WeatherData }) {
  return (
    <div
      className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-md"
      style={{ background: 'var(--pw-glass-bg)', border: '1px solid var(--pw-glass-border)' }}
      title={`${weather.condition} · ${weather.temp}°C · Wind ${weather.windSpeed} km/h · Rain ${weather.rainChance}%`}
    >
      <WeatherIcon icon={weather.icon} size={14} />
      <span style={{ color: 'var(--pw-text-secondary)' }}>{weather.temp}°</span>
      {weather.rainChance > 30 && (
        <span style={{ color: '#4A9EFF' }}>{weather.rainChance}%</span>
      )}
    </div>
  );
}

/** Full weather panel — used in detail overlay */
export default function WeatherBadge({ weather, accentColor }: WeatherBadgeProps) {
  return (
    <div
      className="pw-glass p-4 relative overflow-hidden"
    >
      <h4 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
        Race Weekend Weather
      </h4>
      <div className="flex items-center gap-4">
        {/* Big icon + temp */}
        <div className="flex items-center gap-3">
          <WeatherIcon icon={weather.icon} size={32} />
          <div>
            <span className="text-2xl font-bold tabular-nums">{weather.temp}°</span>
            <span className="text-xs ml-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>C</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10" style={{ background: 'var(--pw-glass-border)' }} />

        {/* Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>Condition</div>
            <div className="text-xs font-medium">{weather.condition}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>Rain</div>
            <div className="text-xs font-medium" style={{ color: weather.rainChance > 40 ? '#4A9EFF' : undefined }}>
              {weather.rainChance}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>Wind</div>
            <div className="text-xs font-medium">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>

      {/* Accent glow */}
      {accentColor && (
        <div
          className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-10"
          style={{ background: accentColor }}
        />
      )}
    </div>
  );
}
