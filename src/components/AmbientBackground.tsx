'use client';

export default function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 'var(--pw-z-bg)' }}
      aria-hidden
    >
      {/* Deep charcoal base */}
      <div className="absolute inset-0 bg-[var(--pw-bg-primary)]" />

      {/* Carbon fiber texture — subtle diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />

      {/* Primary orb — tracks active series accent */}
      <div
        className="pw-ambient-orb"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, var(--pw-series-accent, #E10600) 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
          animationDelay: '0s',
          animationDuration: '30s',
          transition: 'background 0.8s ease',
        }}
      />
      {/* Secondary orb — fixed complement */}
      <div
        className="pw-ambient-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #0090D4 0%, transparent 70%)',
          bottom: '-15%',
          left: '-8%',
          animationDelay: '-8s',
          animationDuration: '35s',
        }}
      />
      <div
        className="pw-ambient-orb"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #C4A747 0%, transparent 70%)',
          top: '40%',
          left: '50%',
          animationDelay: '-15s',
          animationDuration: '40s',
          opacity: 0.08,
        }}
      />

      {/* Top edge light — tracks active series accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--pw-series-accent, #E10600) 30%, transparent) 30%, color-mix(in srgb, var(--pw-series-accent, #E10600) 50%, transparent) 50%, color-mix(in srgb, var(--pw-series-accent, #E10600) 30%, transparent) 70%, transparent)',
          transition: 'background 0.8s ease',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, var(--pw-bg-primary) 100%)',
        }}
      />
    </div>
  );
}
