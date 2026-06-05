'use client';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ padding: 24, fontFamily: 'monospace', background: '#0a0a0f', minHeight: '100vh', color: '#fff' }}>
      <h2 style={{ color: '#E10600', marginBottom: 12 }}>RENDER ERROR</h2>
      <p style={{ color: '#ff6b6b', marginBottom: 8 }}><strong>{error.message}</strong></p>
      {error.digest && <p style={{ color: '#888', fontSize: 12 }}>digest: {error.digest}</p>}
      <pre style={{ color: '#aaa', fontSize: 11, whiteSpace: 'pre-wrap', marginTop: 16, background: '#111', padding: 12, borderRadius: 6 }}>
        {error.stack}
      </pre>
    </div>
  );
}
