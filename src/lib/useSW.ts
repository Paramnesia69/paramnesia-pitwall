'use client';

import { useEffect, useState, useCallback } from 'react';

interface SWState {
  /** Whether the service worker is supported & registered */
  isReady: boolean;
  /** Whether a new version of the SW is waiting to activate */
  hasUpdate: boolean;
  /** Apply the waiting SW update (triggers page reload) */
  applyUpdate: () => void;
}

export function useServiceWorker(): SWState {
  const [isReady, setIsReady] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      // Reload once the new SW takes over
      waitingWorker.addEventListener('statechange', () => {
        if (waitingWorker.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, [waitingWorker]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        setIsReady(true);

        // Check for updates every 5 minutes
        const interval = setInterval(() => {
          registration.update().catch(() => {});
        }, 5 * 60 * 1000);

        // Detect waiting worker (new version available)
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setHasUpdate(true);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW installed but waiting — prompt user to update
              setWaitingWorker(newWorker);
              setHasUpdate(true);
            }
          });
        });

        return () => clearInterval(interval);
      })
      .catch(() => {
        // SW registration failed — not critical
      });

    // Handle controller change (another tab triggered update)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  return { isReady, hasUpdate, applyUpdate };
}
