import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'jedi_catalog_auth'

const PUBLIC_PATHS = ['/sso', '/offline', '/api/agent', '/api/workflow']

// Comma-separated list of origins allowed to call the public API routes.
// Example: CORS_ALLOWED_ORIGINS=https://padawan.akcelita.com,https://dev.padawan.akcelita.com
// Falls back to NEXT_PUBLIC_CATALOG_ENDPOINT (set in .env.local) for local dev.
const ALLOWED_ORIGINS: string[] = (
  process.env.CORS_ALLOWED_ORIGINS ?? process.env.NEXT_PUBLIC_CATALOG_ENDPOINT ?? ''
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

function isApiPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => p.startsWith('/api') && (pathname === p || pathname.startsWith(p + '/'))
  )
}

function addCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set('Access-Control-Allow-Origin', origin)
  Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v))
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin)

  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS' && isApiPath(pathname)) {
    const preflight = new NextResponse(null, { status: 204 })
    if (isAllowedOrigin) addCorsHeaders(preflight, origin)
    return preflight
  }

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    const response = NextResponse.next()
    if (isAllowedOrigin && isApiPath(pathname)) addCorsHeaders(response, origin)
    return response
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
