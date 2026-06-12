'use client';

import { m as motion } from 'framer-motion';
import { SERIES_META } from '@/types';
import type { SeriesId } from '@/types';

const SERIES_LINKS: { id: SeriesId; url: string }[] = [
  { id: 'f1', url: 'https://www.formula1.com' },
  { id: 'motogp', url: 'https://www.motogp.com' },
  { id: 'wec', url: 'https://www.fiawec.com' },
  { id: 'imsa', url: 'https://www.imsa.com' },
  { id: 'wrc', url: 'https://www.wrc.com' },
  { id: 'dtm', url: 'https://www.dtm.com' },
];

export default function Footer() {
  return (
    <motion.footer
      className="mt-16 pt-8 pb-6 border-t"
      style={{ borderColor: 'var(--pw-glass-border)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Series quick links */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {SERIES_LINKS.map(({ id, url }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: `${SERIES_META[id].accent}08`,
                border: `1px solid ${SERIES_META[id].accent}20`,
                color: SERIES_META[id].accent,
              }}
            >
              {SERIES_META[id].name}
            </a>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--pw-accent)' }}
            />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--pw-text-tertiary)' }}>
              Paramnesia Pitwall
            </span>
          </div>

          <p className="text-[10px] text-center" style={{ color: 'var(--pw-text-tertiary)' }}>
            Motorsport command center · Not affiliated with FIA, FIM, or any racing series
          </p>

          <div className="flex items-center gap-3">
            <a
              href="/api/calendar"
              title="Subscribe to full motorsport calendar (.ics)"
              className="flex items-center gap-1.5 text-[10px] transition-colors hover:opacity-80"
              style={{ color: 'var(--pw-accent)' }}
            >
              {/* Calendar icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Subscribe
            </a>

          </div>
        </div>
      </div>
    </motion.footer>
  );
}
