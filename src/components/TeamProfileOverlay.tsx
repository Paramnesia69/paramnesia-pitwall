'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { getTeamLogo } from '@/lib/teamLogos';
import type { TeamProfile } from '@/types';

const NATIONALITY_FLAGS: Record<string, string> = {
  British: '🇬🇧', Dutch: '🇳🇱', Monegasque: '🇲🇨', Australian: '🇦🇺', Spanish: '🇪🇸',
  Italian: '🇮🇹', French: '🇫🇷', German: '🇩🇪', Finnish: '🇫🇮', Mexican: '🇲🇽',
  Canadian: '🇨🇦', American: '🇺🇸', Japanese: '🇯🇵', Chinese: '🇨🇳', Thai: '🇹🇭',
  Brazilian: '🇧🇷', Argentine: '🇦🇷', Austrian: '🇦🇹', Swiss: '🇨🇭', Belgian: '🇧🇪',
};

function nationalityFlag(nat: string): string {
  return NATIONALITY_FLAGS[nat] ?? NATIONALITY_FLAGS[nat.replace(/ /g, '_')] ?? '';
}

function StatCard({ label, value, accent, delay = 0 }: { label: string; value: string | number; accent: string; delay?: number }) {
  return (
    <motion.div
      className="relative flex flex-col gap-1.5 px-4 pt-4 pb-3 rounded-xl overflow-hidden cursor-default"
      style={{ background: `${accent}0c`, border: `1px solid ${accent}28` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 24 }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 0 0 1px ${accent}45, 0 8px 28px ${accent}18`,
        transition: { duration: 0.12, ease: 'easeOut' },
      }}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: accent, opacity: 0.7 }}>
        {label}
      </span>
      <span className="text-2xl font-bold tabular-nums tracking-tight">{value}</span>
    </motion.div>
  );
}

function InfoRow({ label, children, accent, last }: { label: string; children: React.ReactNode; accent: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3"
      style={last ? undefined : { borderBottom: `1px solid ${accent}14` }}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.18em] shrink-0" style={{ color: accent, opacity: 0.6 }}>
        {label}
      </span>
      <div className="min-w-0 flex items-center justify-end gap-1.5 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function TeamProfileOverlay() {
  const selectedTeam = useStore((s) => s.selectedTeam);
  const closeTeam    = useStore((s) => s.closeTeam);

  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedTeam) { setProfile(null); return; }
    if (!selectedTeam.ref) { setProfile(null); return; }
    setLoading(true);
    setProfile(null);
    fetch(`/api/f1/constructor/${encodeURIComponent(selectedTeam.ref)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProfile(data ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [selectedTeam?.ref]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeTeam();
  }, [closeTeam]);

  useEffect(() => {
    if (!selectedTeam) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedTeam, handleKey]);

  const t = selectedTeam;
  const logo = t ? getTeamLogo(t.name, t.series === 'f1') : null;
  const accent = t?.teamColor ?? '#888';

  return (
    <AnimatePresence>
      {t && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[310] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTeam}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-[320] flex flex-col overflow-hidden"
            style={{
              width: 'min(420px, 92vw)',
              background: 'var(--pw-bg-elevated)',
              borderLeft: `1px solid ${accent}25`,
              boxShadow: `-24px 0 80px rgba(0,0,0,0.75), inset 1px 0 0 ${accent}15`,
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* ── HERO ── */}
            <div className="relative h-56 shrink-0 overflow-hidden">
              {/* Team gradient */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${accent}35 0%, ${accent}08 55%, var(--pw-bg-elevated) 100%)` }}
              />

              {/* Left: large team logo watermark */}
              {logo && (
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    left: 16, top: '50%', transform: 'translateY(-50%)',
                    width: 160, height: 100,
                    opacity: 0.10,
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                  }}
                >
                  <img
                    src={logo.src} alt=""
                    style={{
                      width: '100%', height: '100%', objectFit: 'contain',
                      ...(logo.white
                        ? { opacity: 1 }
                        : logo.cssFilter !== undefined
                        ? { filter: logo.cssFilter }
                        : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)' }),
                    }}
                  />
                </div>
              )}

              {/* Right: championship position watermark */}
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 font-black tabular-nums pointer-events-none select-none"
                style={{
                  fontSize: 120, lineHeight: 1,
                  color: accent, opacity: 0.07,
                  fontFamily: 'var(--font-orbitron, ui-monospace)',
                  letterSpacing: '-0.04em',
                }}
              >
                #{t.pos}
              </div>

              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--pw-bg-elevated)] to-transparent" />

              {/* Animated scan line */}
              <motion.div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />

              {/* Close button */}
              <button
                onClick={closeTeam}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 2 }}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ── IDENTITY ── */}
            <div className="px-6 -mt-4 relative shrink-0">
              <motion.div
                className="flex items-center gap-2 mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded"
                  style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}
                >
                  {t.series.toUpperCase()} · Constructor
                </span>
              </motion.div>

              <motion.div
                className="flex items-end gap-3 mb-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                <h2
                  className="text-3xl font-extrabold tracking-tight leading-none"
                  style={{ fontFamily: 'var(--font-orbitron, var(--pw-font-display))' }}
                >
                  {t.name}
                </h2>
              </motion.div>

              {profile?.nationality && (
                <motion.div
                  className="flex items-center gap-2 mb-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-base leading-none">{nationalityFlag(profile.nationality)}</span>
                </motion.div>
              )}
              {!profile?.nationality && (
                <div className="mb-5" />
              )}
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div className="flex-1 overflow-y-auto pb-8 space-y-6 relative" style={{ scrollbarWidth: 'none' }}>
              <div
                className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${accent}10, transparent)` }}
              />

              <div className="px-6 pt-4 space-y-6 relative">
                {/* 2026 Season */}
                <div>
                  <motion.p
                    className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                    style={{ color: 'var(--pw-text-tertiary)' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
                  >
                    2026 Season
                  </motion.p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <StatCard label="Position" value={`P${t.pos}`} accent={accent} delay={0.26} />
                    <StatCard label="Points" value={t.points} accent={accent} delay={0.31} />
                  </div>
                </div>

                {/* Career */}
                <div>
                  <motion.p
                    className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                    style={{ color: 'var(--pw-text-tertiary)' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  >
                    Career
                  </motion.p>
                  {loading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-xl h-16 animate-pulse" style={{ background: `${accent}10` }} />
                      ))}
                    </div>
                  ) : profile ? (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <StatCard label="Wins" value={profile.wins} accent={accent} delay={0.38} />
                        <StatCard label="Seasons" value={profile.seasons} accent={accent} delay={0.43} />
                        <StatCard label="Since" value={profile.firstSeason || '—'} accent={accent} delay={0.48} />
                      </div>
                      <motion.div
                        className="rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${accent}20`, background: `${accent}08` }}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
                      >
                        {profile.nationality && (
                          <InfoRow label="Nationality" accent={accent} last={profile.drivers2026.length === 0}>
                            <span className="text-base leading-none select-none">{nationalityFlag(profile.nationality)}</span>
                          </InfoRow>
                        )}
                        {profile.drivers2026.length > 0 && (
                          <InfoRow label="2026 Drivers" accent={accent} last>
                            <span className="text-[12px] font-semibold truncate text-right">
                              {profile.drivers2026.map(d => `${d.givenName} ${d.familyName}`).join(' · ')}
                            </span>
                          </InfoRow>
                        )}
                      </motion.div>
                    </>
                  ) : (
                    <p className="text-[11px]" style={{ color: 'var(--pw-text-tertiary)' }}>Career data unavailable</p>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
