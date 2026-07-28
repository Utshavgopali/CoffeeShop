import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/profile', '/orders', '/wishlist', '/admin', '/notifications', '/checkout']
const AUTH_PAGES = ['/login', '/register']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isAuthPage  = AUTH_PAGES.includes(pathname)

  if (isProtected && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && token) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/orders/:path*', '/wishlist/:path*', '/admin/:path*', '/notifications/:path*', '/checkout/:path*', '/login', '/register'],
}
