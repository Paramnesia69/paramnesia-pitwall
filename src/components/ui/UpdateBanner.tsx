'use client';

/**
 * Notification banner shown when a new service worker version
 * is waiting to activate. Prompts user to reload.
 */
export default function UpdateBanner({
  onUpdate,
}: {
  onUpdate: () => void;
}) {
  return (
    <div
      className="fixed top-4 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl max-w-md mx-auto"
      style={{
        background: 'var(--pw-glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--pw-glass-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E10600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
      <p className="text-sm flex-1" style={{ color: 'var(--pw-text-primary)' }}>
        New version available
      </p>
      <button
        onClick={onUpdate}
        className="text-xs font-bold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85 shrink-0"
        style={{ background: '#E10600', color: 'white' }}
      >
        Update
      </button>
    </div>
  );
}
