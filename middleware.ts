import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'jedi_catalog_auth'

const PUBLIC_PATHS = ['/sso/', '/offline']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    const offlineUrl = new URL('/offline', request.url)
    return NextResponse.redirect(offlineUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|data/.*|public/.*).*)'],
}
