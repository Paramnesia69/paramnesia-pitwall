'use client';

import { useEffect, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  targetDate: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="pw-glass px-3 py-1.5 sm:px-4 sm:py-2 text-center min-w-[50px] sm:min-w-[60px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={display}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-lg sm:text-2xl font-bold font-mono"
        >
          {display}
        </motion.div>
      </AnimatePresence>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>
        {label}
      </div>
    </div>
  );
}

export default function Countdown({ targetDate, compact = false }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {['Days', 'Hrs', 'Min', 'Sec'].map((l) => (
          <div key={l} className="pw-glass px-3 py-1.5 sm:px-4 sm:py-2 text-center min-w-[50px] sm:min-w-[60px]">
            <div className="text-lg sm:text-2xl font-bold font-mono">--</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pw-text-tertiary)' }}>{l}</div>
          </div>
        ))}
      </div>
    );
  }

  if (!timeLeft) return null;

  if (compact) {
    return (
      <span className="font-mono text-xs" style={{ color: 'var(--pw-text-secondary)' }}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.mins).padStart(2, '0')}:{String(timeLeft.secs).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && <FlipDigit value={timeLeft.days} label="Days" />}
      <FlipDigit value={timeLeft.hours} label="Hrs" />
      <FlipDigit value={timeLeft.mins} label="Min" />
      <FlipDigit value={timeLeft.secs} label="Sec" />
    </div>
  );
}
