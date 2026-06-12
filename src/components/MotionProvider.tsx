'use client';

import { LazyMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * LazyMotion bundle cut: every component imports `m as motion` instead of the
 * full `motion` proxy, and the feature pack (domMax — the bottom sheets need
 * drag) loads async after first paint instead of blocking the initial bundle.
 * `strict` throws if a full `motion.*` component slips back in.
 */
const loadFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
