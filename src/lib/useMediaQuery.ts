'use client';

import { useState, useEffect } from 'react';

/**
 * Reactive matchMedia hook. SSR-safe: returns false on the server and
 * first client render, then syncs in an effect (no hydration mismatch).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** True below Tailwind's `sm` breakpoint — phones. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/** True on touch-primary devices (no meaningful hover). */
export function useIsCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}
