'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.replace(from)
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--pw-bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-geist-sans), sans-serif',
    }}>
      <div className="pw-glass" style={{
        width: '100%',
        maxWidth: 360,
        padding: '2.5rem 2rem',
        borderRadius: '1rem',
        margin: '1rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--pw-accent)',
            marginBottom: '0.5rem',
          }}>
            PITWALL
          </div>
          <div style={{
            fontSize: 13,
            color: 'var(--pw-text-muted, rgba(255,255,255,0.4))',
          }}>
            Private access only
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '0.5rem',
              padding: '0.65rem 0.875rem',
              color: 'white',
              fontSize: 14,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '0.5rem',
              padding: '0.65rem 0.875rem',
              color: 'white',
              fontSize: 14,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />

          {error && (
            <div style={{ fontSize: 12, color: 'rgba(239,68,68,0.9)', textAlign: 'center' }}>
              Invalid credentials
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.25rem',
              background: 'var(--pw-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.7rem',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
