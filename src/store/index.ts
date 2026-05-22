'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SeriesId } from '@/types';

interface PitwallStore {
  favorites: SeriesId[];
  toggleFavorite: (series: SeriesId) => void;
  isFavorite: (series: SeriesId) => boolean;

  selectedEventId: string | null;
  openEvent: (id: string) => void;
  closeEvent: () => void;
}

export const useStore = create<PitwallStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (series) =>
        set((state) => ({
          favorites: state.favorites.includes(series)
            ? state.favorites.filter((s) => s !== series)
            : [...state.favorites, series],
        })),
      isFavorite: (series) => get().favorites.includes(series),

      selectedEventId: null,
      openEvent: (id) => set({ selectedEventId: id }),
      closeEvent: () => set({ selectedEventId: null }),
    }),
    {
      name: 'pitwall-store',
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
