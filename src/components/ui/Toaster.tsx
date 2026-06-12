'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';

const TOAST_MS = 2400;

/**
 * Single glass toast, bottom-center. Triggered via useStore showToast().
 * Sits below the overlays (z-modal 300+) but above the mini-leaderboard (190).
 */
export default function Toaster() {
  const toast = useStore((s) => s.toast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {toast && visible && (
        <motion.div
          key={toast.id}
          className="fixed left-1/2 z-[290] flex items-center gap-2.5 px-4 py-2.5 rounded-full pointer-events-none"
          style={{
            bottom: 'calc(76px + env(safe-area-inset-bottom))',
            background: 'rgba(6, 6, 11, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--pw-glass-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            x: '-50%',
          }}
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--pw-text-primary)' }}>
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
