'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import type { NormalizedRaceEvent } from '@/types';
import { SERIES_META } from '@/types';
import { useStore } from '@/store';
import { F1_DRIVER_REFS, F1_CONSTRUCTOR_REFS } from '@/lib/f1DriverRefs';
import { MOTOGP_RIDER_REFS } from '@/lib/motogpRiders';
import {
  F1_DRIVERS_2026, F1_CONSTRUCTORS_2026,
  MOTOGP_RIDERS_2026, MOTOGP_TEAMS_2026,
} from '@/data/standings-2026';

interface PaletteEntry {
  key: string;
  label: string;
  sub: string;
  kind: 'event' | 'driver' | 'team';
  accent: string;
  action: () => void;
}

interface CommandPaletteProps {
  events: NormalizedRaceEvent[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/** Simple scorer: prefix > word-start > substring; 0 = no match */
function score(haystack: string, q: string): number {
  const h = haystack.toLowerCase();
  if (h.startsWith(q)) return 3;
  if (h.split(/[\s—·-]+/).some((w) => w.startsWith(q))) return 2;
  if (h.includes(q)) return 1;
  return 0;
}

const KIND_LABEL: Record<PaletteEntry['kind'], string> = {
  event: 'Event', driver: 'Driver', team: 'Team',
};

export default function CommandPalette({ events, open, onOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openEvent = useStore((s) => s.openEvent);
  const openDriver = useStore((s) => s.openDriver);
  const openTeam = useStore((s) => s.openTeam);

  // Global hotkey — ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose(); else onOpen();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpen, onClose]);

  // Reset + focus on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      // focus after the panel mounts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const allEntries = useMemo<PaletteEntry[]>(() => {
    const entries: PaletteEntry[] = [];

    for (const e of events) {
      entries.push({
        key: `event-${e.id}`,
        label: e.name,
        sub: `${e.circuit.name} · ${SERIES_META[e.series].name}`,
        kind: 'event',
        accent: SERIES_META[e.series].accent,
        action: () => openEvent(e.id),
      });
    }

    for (const d of F1_DRIVERS_2026) {
      entries.push({
        key: `f1d-${d.name}`,
        label: d.name,
        sub: `${d.team} · F1`,
        kind: 'driver',
        accent: d.teamColor,
        action: () => openDriver({
          ref: F1_DRIVER_REFS[d.name] ?? '',
          name: d.name, team: d.team, teamColor: d.teamColor,
          series: 'f1', points: d.points, pos: d.pos,
        }),
      });
    }

    for (const d of MOTOGP_RIDERS_2026) {
      entries.push({
        key: `mgd-${d.name}`,
        label: d.name,
        sub: `${d.team} · MotoGP`,
        kind: 'driver',
        accent: d.teamColor,
        action: () => openDriver({
          ref: MOTOGP_RIDER_REFS[d.name] ?? '',
          name: d.name, team: d.team, teamColor: d.teamColor,
          series: 'motogp', points: d.points, pos: d.pos,
        }),
      });
    }

    for (const c of F1_CONSTRUCTORS_2026) {
      entries.push({
        key: `f1c-${c.name}`,
        label: c.name,
        sub: 'Constructor · F1',
        kind: 'team',
        accent: c.color,
        action: () => openTeam({
          ref: F1_CONSTRUCTOR_REFS[c.name] ?? c.name.toLowerCase().replace(/ /g, '_'),
          name: c.name, teamColor: c.color,
          series: 'f1', points: c.points, pos: c.pos,
        }),
      });
    }

    for (const c of MOTOGP_TEAMS_2026) {
      entries.push({
        key: `mgt-${c.name}`,
        label: c.name,
        sub: 'Team · MotoGP',
        kind: 'team',
        accent: c.color,
        action: () => openTeam({
          ref: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: c.name, teamColor: c.color,
          series: 'motogp', points: c.points, pos: c.pos,
        }),
      });
    }

    return entries;
  }, [events, openEvent, openDriver, openTeam]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default: next upcoming events
      return allEntries.filter((e) => e.kind === 'event').slice(0, 6);
    }
    return allEntries
      .map((e) => ({ e, s: Math.max(score(e.label, q), score(e.sub, q) - 0.5) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map(({ e }) => e);
  }, [allEntries, query]);

  // Keep selection in range when results change
  useEffect(() => { setActiveIdx(0); }, [query]);

  function select(entry: PaletteEntry) {
    entry.action();
    onClose();
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[activeIdx]) { e.preventDefault(); select(results[activeIdx]); }
    else if (e.key === 'Escape') { onClose(); }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[340] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-[350] left-1/2 w-[min(560px,92vw)]"
            style={{ top: 'calc(12vh + env(safe-area-inset-top))', x: '-50%' }}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--pw-bg-elevated)',
                border: '1px solid var(--pw-glass-border)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Input */}
              <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: '1px solid var(--pw-glass-border)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pw-text-tertiary)" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Search events, drivers, teams…"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: 'var(--pw-text-primary)' }}
                />
                <kbd className="hidden sm:block text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--pw-glass-bg)', border: '1px solid var(--pw-glass-border)', color: 'var(--pw-text-tertiary)' }}>
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto py-1.5">
                {results.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
                    No matches.
                  </p>
                ) : results.map((r, i) => (
                  <button
                    key={r.key}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ background: i === activeIdx ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => select(r)}
                  >
                    <span className="w-1 h-4 rounded-full shrink-0" style={{ background: r.accent }} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate" style={{ color: 'var(--pw-text-primary)' }}>{r.label}</span>
                      <span className="block text-[10px] truncate" style={{ color: 'var(--pw-text-tertiary)' }}>{r.sub}</span>
                    </span>
                    <span
                      className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: `${r.accent}15`, color: r.accent, border: `1px solid ${r.accent}30` }}
                    >
                      {KIND_LABEL[r.kind]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
