'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DriverStanding } from '@/data/standings-2026';

interface Props {
  drivers: DriverStanding[];
  maxDrivers?: number;
  round?: number | null;
}

const ROUND_LABELS = [
  'AUS','CHN','JPN','BHR','SAU','MIA','MON','SPA','CAN','AUT',
  'GBR','BEL','HUN','NED','ITA','AZE','SIN','USA','MEX','BRA',
  'LVG','ABU',
];

export default function ChampionshipChart({ drivers, maxDrivers = 6, round }: Props) {
  const [open, setOpen] = useState(false);

  const withData = drivers.filter((d) => d.roundPoints && d.roundPoints.length >= 2);
  const topN = withData.slice(0, maxDrivers);
  if (topN.length < 2) return null;

  const numRounds = Math.max(...topN.map((d) => d.roundPoints!.length));
  const maxPts   = Math.max(...topN.flatMap((d) => d.roundPoints!));

  /* SVG geometry */
  const W = 540, H = 172;
  const P = { t: 12, r: 20, b: 30, l: 34 };
  const cW = W - P.l - P.r;
  const cH = H - P.t - P.b;

  const xAt = (i: number) => P.l + (numRounds <= 1 ? cW / 2 : (i / (numRounds - 1)) * cW);
  const yAt = (pts: number) => P.t + cH * (1 - pts / (maxPts || 1));

  const yTicks = Array.from({ length: 4 }, (_, i) => Math.round((maxPts * i) / 3));

  return (
    <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--pw-glass-border)' }}>
      <button
        className="flex items-center gap-2 w-full mb-0 hover:opacity-70 transition-opacity"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-0.5 h-3 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.3)' }} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Points Trajectory
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--pw-glass-border)' }} />
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'transform 0.25s', transform: open ? 'none' : 'rotate(180deg)' }}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="mt-3 overflow-x-auto">
              <svg
                width="100%"
                viewBox={`0 0 ${W} ${H}`}
                style={{ display: 'block', minWidth: 300 }}
              >
                {/* Y grid + labels */}
                {yTicks.map((t) => (
                  <g key={t}>
                    <line
                      x1={P.l} x2={W - P.r} y1={yAt(t)} y2={yAt(t)}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    />
                    <text x={P.l - 5} y={yAt(t) + 3.5} textAnchor="end" fontSize="7.5" fill="rgba(255,255,255,0.28)">
                      {t}
                    </text>
                  </g>
                ))}

                {/* X labels */}
                {Array.from({ length: numRounds }, (_, i) => (
                  <text key={i} x={xAt(i)} y={H - 4} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.28)">
                    {ROUND_LABELS[i] ?? `R${i + 1}`}
                  </text>
                ))}

                {/* Lines + dots — rendered back-to-front so leader is on top */}
                {[...topN].reverse().map((d, ri) => {
                  const pts = d.roundPoints!;
                  const polyPts = pts.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
                  const lx = xAt(pts.length - 1).toFixed(1);
                  const ly = yAt(pts[pts.length - 1]).toFixed(1);
                  const isLeader = topN[0] === d;
                  return (
                    <g key={ri}>
                      <polyline
                        points={polyPts}
                        fill="none"
                        stroke={d.teamColor}
                        strokeWidth={isLeader ? 2.2 : 1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isLeader ? 0.9 : 0.55}
                      />
                      {pts.map((v, i) => (
                        <circle key={i} cx={xAt(i)} cy={yAt(v)} r={i === pts.length - 1 ? 3.2 : 1.8}
                          fill={d.teamColor} opacity={i === pts.length - 1 ? 0.95 : 0.45} />
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2.5">
              {topN.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: d.teamColor, opacity: 0.85 }} />
                  <span className="text-[10px]" style={{ color: 'var(--pw-text-tertiary)' }}>{d.name}</span>
                </div>
              ))}
            </div>
            {round != null && (
              <p className="text-[9px] mt-2 text-right" style={{ color: 'var(--pw-text-tertiary)' }}>
                After Round {round}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
