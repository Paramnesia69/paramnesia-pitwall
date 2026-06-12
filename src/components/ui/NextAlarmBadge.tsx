'use client';

import { useState, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';

function formatCountdown(remindAt: string): string {
  const ms = new Date(remindAt).getTime() - Date.now();
  if (ms <= 0) return '';
  const totalMins = Math.ceil(ms / 60_000);
  if (totalMins < 60) return `In ${totalMins}m`;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `In ${h}h ${m}m` : `In ${h}h`;
}

export default function NextAlarmBadge() {
  const reminders = useStore((s) => s.reminders);
  const openEvent = useStore((s) => s.openEvent);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const next = reminders
    .filter((r) => !r.fired && new Date(r.remindAt).getTime() > Date.now())
    .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime())[0];

  return (
    <AnimatePresence>
      {next && (
        <motion.button
          key={next.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={() => openEvent(next.eventId)}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:opacity-80"
          style={{
            background: 'var(--pw-glass-bg)',
            border: '1px solid var(--pw-glass-border)',
            color: 'var(--pw-text-secondary)',
          }}
          title={`${next.sessionName} — ${next.eventName} (${next.leadMinutes}m reminder)`}
        >
          {/* Bell icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="text-[10px] font-mono whitespace-nowrap">{formatCountdown(next.remindAt)}</span>
          <span className="hidden sm:inline text-[10px] whitespace-nowrap" style={{ color: 'var(--pw-text-tertiary)' }}>
            · {next.sessionName}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
