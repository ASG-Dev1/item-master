import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'jedi_catalog_auth'

const PUBLIC_PATHS = ['/sso', '/offline']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    // Show loading spinner while SSO resolves instead of the offline page.
    // The loading page handles hash-based redirects (e.g. /#/sso/embedded)
    // and falls back to /offline if there is nothing to resolve.
    const loadingUrl = new URL('/sso/loading', request.url)
    return NextResponse.redirect(loadingUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|data/.*|public/.*).*)'],
}
