'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SeriesId, RaceResult } from '@/types';

export type Theme = 'dark' | 'light';

export interface Reminder {
  /** Unique key: eventId::sessionName */
  id: string;
  eventId: string;
  eventName: string;
  sessionName: string;
  /** When the session starts (ISO 8601) */
  sessionStart: string;
  /** Minutes before session to fire notification */
  leadMinutes: number;
  /** When the notification should fire (ISO 8601) */
  remindAt: string;
  /** Whether it has already fired */
  fired: boolean;
}

export interface DiaryEntry {
  /** Whether the user has marked this event as watched */
  watched: boolean;
  /** Personal star rating 1–5 */
  rating?: number;
  /** Free-text note */
  note?: string;
  /** ISO timestamp of last edit — drives chronological diary ordering */
  updatedAt: string;
  /** Denormalized snapshot so the diary survives after the event leaves the live feed */
  eventName?: string;
  series?: SeriesId;
  eventDate?: string;
}

/** Snapshot passed when creating a diary entry so it can render standalone */
export type DiaryMeta = Pick<DiaryEntry, 'eventName' | 'series' | 'eventDate'>;

interface PitwallStore {
  favorites: SeriesId[];
  toggleFavorite: (series: SeriesId) => void;
  isFavorite: (series: SeriesId) => boolean;

  selectedEventId: string | null;
  openEvent: (id: string) => void;
  closeEvent: () => void;

  selectedResult: RaceResult | null;
  openResult: (result: RaceResult) => void;
  closeResult: () => void;

  theme: Theme;
  toggleTheme: () => void;

  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'remindAt' | 'fired'>) => void;
  removeReminder: (id: string) => void;
  markFired: (id: string) => void;
  getReminder: (eventId: string, sessionName: string) => Reminder | undefined;
  clearExpiredReminders: () => void;

  /** Race diary — keyed by eventId; unifies watched-state (7) + rating/note (5) */
  diary: Record<string, DiaryEntry>;
  setDiaryEntry: (eventId: string, partial: Partial<Omit<DiaryEntry, 'updatedAt'>>) => void;
  toggleWatched: (eventId: string, meta?: DiaryMeta) => void;
  getDiaryEntry: (eventId: string) => DiaryEntry | undefined;
  removeDiaryEntry: (eventId: string) => void;
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
      openEvent: (id) => {
        set({ selectedEventId: id });
        // Update URL with event deep link (without triggering navigation)
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('event', id);
          window.history.replaceState({}, '', url.toString());
        }
      },
      closeEvent: () => {
        set({ selectedEventId: null });
        // Remove event from URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('event');
          window.history.replaceState({}, '', url.toString());
        }
      },

      selectedResult: null,
      openResult: (result) => {
        set({ selectedResult: result });
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('result', result.id);
          window.history.replaceState({}, '', url.toString());
        }
      },
      closeResult: () => {
        set({ selectedResult: null });
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('result');
          window.history.replaceState({}, '', url.toString());
        }
      },

      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', next);
          }
          return { theme: next };
        }),

      reminders: [],
      addReminder: (r) =>
        set((state) => {
          const id = `${r.eventId}::${r.sessionName}`;
          const remindAt = new Date(
            new Date(r.sessionStart).getTime() - r.leadMinutes * 60 * 1000,
          ).toISOString();
          // Remove existing reminder for same session if any
          const filtered = state.reminders.filter((rem) => rem.id !== id);
          return {
            reminders: [...filtered, { ...r, id, remindAt, fired: false }],
          };
        }),
      removeReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      markFired: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, fired: true } : r,
          ),
        })),
      getReminder: (eventId, sessionName) =>
        get().reminders.find((r) => r.eventId === eventId && r.sessionName === sessionName),
      clearExpiredReminders: () =>
        set((state) => ({
          reminders: state.reminders.filter(
            (r) => new Date(r.sessionStart).getTime() > Date.now() - 3600_000,
          ),
        })),

      diary: {},
      setDiaryEntry: (eventId, partial) =>
        set((state) => {
          const existing = state.diary[eventId] ?? { watched: false };
          return {
            diary: {
              ...state.diary,
              [eventId]: { ...existing, ...partial, updatedAt: new Date().toISOString() },
            },
          };
        }),
      toggleWatched: (eventId, meta) =>
        set((state) => {
          const existing = state.diary[eventId] ?? { watched: false };
          return {
            diary: {
              ...state.diary,
              [eventId]: {
                ...existing,
                ...meta,
                watched: !existing.watched,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      getDiaryEntry: (eventId) => get().diary[eventId],
      removeDiaryEntry: (eventId) =>
        set((state) => {
          const next = { ...state.diary };
          delete next[eventId];
          return { diary: next };
        }),
    }),
    {
      name: 'pitwall-store',
      partialize: (state) => ({
        favorites: state.favorites,
        theme: state.theme,
        reminders: state.reminders,
        diary: state.diary,
      }),
    },
  ),
);
