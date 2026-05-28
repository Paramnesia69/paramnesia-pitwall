import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'pw-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE)
  const expected = btoa(`${process.env.PITWALL_USER}:${process.env.PITWALL_PASS}`)

  if (cookie?.value === expected) {
    return NextResponse.next()
  }

  const url = new URL('/login', request.url)
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logos|icons|circuits|fonts|manifest.json|sw.js|workbox|icon|og-image|offline).*)'],
}
