'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '@/lib/useOnlineStatus';

export default function OfflineBadge() {
  const isOnline = useOnlineStatus();
  const [justCameOnline, setJustCameOnline] = useState(false);
  const [hasEverGoneOffline, setHasEverGoneOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHasEverGoneOffline(true);
      setJustCameOnline(false);
    } else if (hasEverGoneOffline) {
      setJustCameOnline(true);
      const t = setTimeout(() => setJustCameOnline(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isOnline, hasEverGoneOffline]);

  const visible = !isOnline || justCameOnline;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={isOnline ? 'online' : 'offline'}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-center py-1.5"
          style={
            isOnline
              ? {
                  background: 'rgba(22, 101, 52, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderBottom: '1px solid rgba(74, 222, 128, 0.25)',
                }
              : {
                  background: 'rgba(146, 64, 14, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderBottom: '1px solid rgba(251, 191, 36, 0.25)',
                }
          }
        >
          <span
            className="text-[10px] font-mono tracking-wider uppercase"
            style={{ color: isOnline ? 'rgba(187, 247, 208, 0.95)' : 'rgba(254, 240, 138, 0.95)' }}
          >
            {isOnline ? 'Back online' : 'No connection · showing cached data'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
