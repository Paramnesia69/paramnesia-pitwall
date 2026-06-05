'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { getTeamLogo } from '@/lib/teamLogos';
import type { DriverProfile } from '@/app/api/f1/driver/[driverRef]/route';

const NATIONALITY_FLAGS: Record<string, string> = {
  British: '🇬🇧', Dutch: '🇳🇱', Monegasque: '🇲🇨', Australian: '🇦🇺', Spanish: '🇪🇸',
  Italian: '🇮🇹', French: '🇫🇷', German: '🇩🇪', Finnish: '🇫🇮', Mexican: '🇲🇽',
  Canadian: '🇨🇦', American: '🇺🇸', Japanese: '🇯🇵', Chinese: '🇨🇳', Thai: '🇹🇭',
  Brazilian: '🇧🇷', Argentine: '🇦🇷', New_Zealander: '🇳🇿', Danish: '🇩🇰', Swiss: '🇨🇭',
  Belgian: '🇧🇪', Austrian: '🇦🇹', Swedish: '🇸🇪', Norwegian: '🇳🇴', Polish: '🇵🇱',
};

function nationalityFlag(nat: string): string {
  return NATIONALITY_FLAGS[nat] ?? NATIONALITY_FLAGS[nat.replace(/ /g, '_')] ?? '';
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="pw-glass px-3 py-2.5 rounded-xl text-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'var(--pw-text-tertiary)' }}>{label}</p>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

export default function DriverProfileOverlay() {
  const { selectedDriver, closeDriver, openDriver } = useStore((s) => ({
    selectedDriver: s.selectedDriver,
    closeDriver: s.closeDriver,
    openDriver: s.openDriver,
  }));

  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset profile + fetch when driver changes
  useEffect(() => {
    if (!selectedDriver) { setProfile(null); return; }
    if (selectedDriver.series !== 'f1' || !selectedDriver.ref) { setProfile(null); return; }

    setLoading(true);
    setProfile(null);
    fetch(`/api/f1/driver/${encodeURIComponent(selectedDriver.ref)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProfile(data ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [selectedDriver?.ref]);

  // Escape key closes
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDriver();
  }, [closeDriver]);
  useEffect(() => {
    if (!selectedDriver) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedDriver, handleKey]);

  const d = selectedDriver;
  const logo = d ? getTeamLogo(d.team, d.series === 'f1') : null;

  return (
    <AnimatePresence>
      {d && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[310]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDriver}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-[320] flex flex-col overflow-hidden"
            style={{
              width: 'min(380px, 92vw)',
              background: 'var(--pw-bg-primary)',
              borderLeft: '1px solid var(--pw-glass-border)',
              boxShadow: '-24px 0 60px rgba(0,0,0,0.7)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            {/* Header strip with team accent */}
            <div
              className="relative px-5 pt-5 pb-4 shrink-0"
              style={{ borderBottom: '1px solid var(--pw-glass-border)', background: `${d.teamColor}0a` }}
            >
              {/* Close */}
              <button
                onClick={closeDriver}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Series label */}
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: d.teamColor, opacity: 0.8 }}>
                {d.series.toUpperCase()} · Driver
              </p>

              {/* Team logo + name row */}
              <div className="flex items-start gap-3 pr-10">
                {logo && (
                  <div className="shrink-0" style={{ width: 52, height: 32, display: 'flex', alignItems: 'center' }}>
                    <img
                      src={logo.src}
                      alt={d.team}
                      style={{
                        height: logo.white ? 26 : logo.png ? 30 : 24,
                        width: 'auto',
                        maxWidth: 52,
                        objectFit: 'contain',
                        ...(logo.white
                          ? { opacity: 0.9 }
                          : logo.cssFilter !== undefined
                          ? { filter: logo.cssFilter, opacity: 0.88 }
                          : { filter: 'brightness(1.6) saturate(2.5) contrast(1.2)', opacity: 1 }),
                      }}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-xl font-bold leading-tight tracking-tight">{d.name}</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>{d.team}</p>
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

              {/* 2026 season snapshot (always available from store) */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
                  2026 Season
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <StatBox label="Position" value={`P${d.pos}`} />
                  <StatBox label="Points" value={d.points} />
                </div>
              </div>

              {/* F1 career stats — loaded from API */}
              {d.series === 'f1' && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--pw-text-tertiary)' }}>
                    Career
                  </p>
                  {loading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="pw-glass rounded-xl h-16 animate-pulse" style={{ background: 'var(--pw-glass-bg)' }} />
                      ))}
                    </div>
                  ) : profile ? (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        <StatBox label="Wins" value={profile.wins} />
                        <StatBox label="Seasons" value={profile.seasons} />
                        <StatBox label="Number" value={profile.permanentNumber ? `#${profile.permanentNumber}` : '—'} />
                      </div>

                      {/* Driver meta */}
                      <div className="mt-3 space-y-1.5">
                        {profile.nationality && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px]" style={{ color: 'var(--pw-text-tertiary)' }}>Nationality</span>
                            <span className="text-[11px] font-medium">
                              {nationalityFlag(profile.nationality)} {profile.nationality}
                            </span>
                          </div>
                        )}
                        {profile.dateOfBirth && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px]" style={{ color: 'var(--pw-text-tertiary)' }}>Born</span>
                            <span className="text-[11px] font-medium">
                              {new Date(profile.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-[11px]" style={{ color: 'var(--pw-text-tertiary)' }}>
                      Career data unavailable
                    </p>
                  )}
                </div>
              )}

              {/* Headshot (if available from API) */}
              {profile?.headshotUrl && (
                <div className="flex justify-center">
                  <img
                    src={profile.headshotUrl}
                    alt={d.name}
                    style={{ height: 160, width: 'auto', objectFit: 'contain', borderRadius: 12, opacity: 0.9 }}
                  />
                </div>
              )}

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
