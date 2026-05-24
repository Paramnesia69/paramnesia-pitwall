'use client';

import { motion } from 'framer-motion';
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

            <a
              href="https://github.com/Paramnesia69/paramnesia-pitwall"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] transition-colors hover:opacity-80"
              style={{ color: 'var(--pw-text-tertiary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Source
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
