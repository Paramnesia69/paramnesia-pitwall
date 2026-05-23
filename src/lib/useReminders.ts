'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store';

/**
 * Schedules browser notifications for all active reminders.
 * Runs timers client-side — if the tab is closed, the reminder won't fire.
 * For persistent reminders, push notifications via a backend would be needed.
 */
export function useReminderScheduler() {
  const reminders = useStore((s) => s.reminders);
  const markFired = useStore((s) => s.markFired);
  const clearExpiredReminders = useStore((s) => s.clearExpiredReminders);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Clean up expired reminders on mount
  useEffect(() => {
    clearExpiredReminders();
  }, [clearExpiredReminders]);

  useEffect(() => {
    const currentTimers = timersRef.current;

    // Clear timers that no longer have a matching reminder
    for (const [id, timer] of currentTimers) {
      if (!reminders.find((r) => r.id === id)) {
        clearTimeout(timer);
        currentTimers.delete(id);
      }
    }

    // Schedule timers for unfired reminders
    for (const reminder of reminders) {
      if (reminder.fired) continue;
      if (currentTimers.has(reminder.id)) continue;

      const remindTime = new Date(reminder.remindAt).getTime();
      const delay = remindTime - Date.now();

      if (delay <= 0) {
        // Already past — fire immediately if session hasn't started yet
        const sessionTime = new Date(reminder.sessionStart).getTime();
        if (Date.now() < sessionTime) {
          fireNotification(reminder.eventName, reminder.sessionName, reminder.leadMinutes);
        }
        markFired(reminder.id);
        continue;
      }

      // Cap at ~24 hours to avoid setTimeout overflow issues
      if (delay > 86_400_000) continue;

      const timer = setTimeout(() => {
        fireNotification(reminder.eventName, reminder.sessionName, reminder.leadMinutes);
        markFired(reminder.id);
        currentTimers.delete(reminder.id);
      }, delay);

      currentTimers.set(reminder.id, timer);
    }

    return () => {
      // Cleanup all timers on unmount
      for (const timer of currentTimers.values()) {
        clearTimeout(timer);
      }
      currentTimers.clear();
    };
  }, [reminders, markFired]);
}

async function fireNotification(eventName: string, sessionName: string, leadMinutes: number) {
  if (!('Notification' in window)) return;

  // Request permission if not granted
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission !== 'granted') return;

  const timeText = leadMinutes <= 0 ? 'now' : `in ${leadMinutes} min`;

  try {
    // Try service worker notification first (works even when tab isn't focused)
    const reg = await navigator.serviceWorker?.ready;
    if (reg) {
      await reg.showNotification('PARAMNESIA PITWALL', {
        body: `${sessionName} starts ${timeText} — ${eventName}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `reminder-${eventName}-${sessionName}`,
        data: { url: '/' },
      } as NotificationOptions);
      return;
    }
  } catch {
    // SW not available — fallback to basic notification
  }

  // Fallback: basic Notification API
  new Notification('PARAMNESIA PITWALL', {
    body: `${sessionName} starts ${timeText} — ${eventName}`,
    icon: '/icon-192.png',
    tag: `reminder-${eventName}-${sessionName}`,
  });
}

/**
 * Request notification permission proactively.
 * Returns true if granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}
