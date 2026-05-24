'use client';

import Image from 'next/image';
import type { SeriesId } from '@/types';
import { SERIES_META } from '@/types';

/**
 * Series logos that have non-transparent (opaque) backgrounds.
 * These need mixBlendMode: screen + brightness boost to extract just the mark.
 */
const OPAQUE_LOGO_SERIES = new Set<SeriesId>(['wec', 'elms', 'gtwce']);

interface SeriesBadgeProps {
  series: SeriesId;
  /** 'sm' = 9px text for news/results/timeline; 'md' = 11px for event cards */
  size?: 'sm' | 'md';
}

export default function SeriesBadge({ series, size = 'sm' }: SeriesBadgeProps) {
  const meta = SERIES_META[series];
  if (!meta) return null;

  const iconPx = size === 'md' ? 14 : 11;
  const textClass = size === 'md' ? 'text-[11px]' : 'text-[9px]';
  const padClass = size === 'md' ? 'px-2 py-0.5' : 'px-1.5 py-0.5';
  const isOpaque = OPAQUE_LOGO_SERIES.has(series);

  return (
    <span
      className={`inline-flex items-center gap-1 ${textClass} font-bold uppercase tracking-wider ${padClass} rounded whitespace-nowrap shrink-0`}
      style={{
        background: `${meta.accent}18`,
        color: meta.accent,
        border: `1px solid ${meta.accent}25`,
      }}
    >
      {meta.logo && (
        <Image
          src={meta.logo}
          alt=""
          width={iconPx}
          height={iconPx}
          className="inline-block flex-shrink-0 object-contain"
          style={
            isOpaque
              ? { filter: 'grayscale(1) contrast(3) brightness(6)', mixBlendMode: 'screen' }
              : { opacity: 0.9 }
          }
        />
      )}
      {meta.name}
    </span>
  );
}
