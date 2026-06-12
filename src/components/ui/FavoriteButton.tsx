'use client';

import { m as motion } from 'framer-motion';
import type { SeriesId } from '@/types';
import { useStore } from '@/store';

interface FavoriteButtonProps {
  series: SeriesId;
  accentColor: string;
}

export default function FavoriteButton({ series, accentColor }: FavoriteButtonProps) {
  const { favorites, toggleFavorite, showToast } = useStore();
  const isFav = favorites.includes(series);

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(series);
        showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
      }}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: isFav ? `${accentColor}20` : 'var(--pw-glass-bg)',
        border: `1px solid ${isFav ? accentColor : 'var(--pw-glass-border)'}`,
      }}
      whileTap={{ scale: 0.85 }}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill={isFav ? accentColor : 'none'}
        stroke={isFav ? accentColor : 'var(--pw-text-tertiary)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </motion.button>
  );
}
