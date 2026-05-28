import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (
    username === process.env.PITWALL_USER &&
    password === process.env.PITWALL_PASS
  ) {
    const token = btoa(`${username}:${password}`)
    const res = NextResponse.json({ ok: true })
    res.cookies.set('pw-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
