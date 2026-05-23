'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { NormalizedRaceEvent } from '@/types';

const POLL_INTERVAL = 2 * 60 * 1000; // 2 minutes

interface LiveDataState {
  /** Live-updated events (falls back to SSR data until first poll) */
  events: NormalizedRaceEvent[];
  /** Live-updated featured event */
  featured: NormalizedRaceEvent | null;
  /** Timestamp of last successful refresh */
  lastUpdated: Date | null;
  /** Whether a poll is currently in progress */
  isRefreshing: boolean;
  /** Force an immediate refresh */
  refresh: () => void;
}

/**
 * Polls /api/events and /api/events?featured=1 to keep the dashboard
 * live without a full page reload. Uses SSR data as initial state.
 *
 * - Only polls when the tab is visible (saves battery on mobile)
 * - Pauses when offline
 * - Automatically resumes on visibility/online changes
 */
export function useLiveData(
  initialEvents: NormalizedRaceEvent[],
  initialFeatured: NormalizedRaceEvent | null,
): LiveDataState {
  const [events, setEvents] = useState(initialEvents);
  const [featured, setFeatured] = useState(initialFeatured);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    // Don't poll if offline or tab is hidden
    if (!navigator.onLine) return;
    if (document.visibilityState === 'hidden') return;

    setIsRefreshing(true);
    try {
      const [eventsRes, featuredRes] = await Promise.allSettled([
        fetch('/api/events', { cache: 'no-store' }),
        fetch('/api/events?featured=1', { cache: 'no-store' }),
      ]);

      if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
        const data = await eventsRes.value.json();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      }

      if (featuredRes.status === 'fulfilled' && featuredRes.value.ok) {
        const data = await featuredRes.value.json();
        if (data && typeof data === 'object' && data.id) {
          setFeatured(data);
        }
      }

      setLastUpdated(new Date());
    } catch {
      // Network error — skip this cycle, try again next interval
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
  }, [fetchData]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchData();
    // Reset the interval so the next poll is a full POLL_INTERVAL from now
    startPolling();
  }, [fetchData, startPolling]);

  useEffect(() => {
    // Start polling after a short delay (let SSR data render first)
    const timeout = setTimeout(() => {
      startPolling();
    }, 5000);

    // Pause/resume on visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Immediate refresh when tab becomes visible again
        fetchData();
        startPolling();
      } else {
        stopPolling();
      }
    };

    // Resume when coming back online
    const handleOnline = () => {
      fetchData();
      startPolling();
    };

    const handleOffline = () => {
      stopPolling();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timeout);
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchData, startPolling, stopPolling]);

  return { events, featured, lastUpdated, isRefreshing, refresh };
}
