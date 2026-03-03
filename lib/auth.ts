import Cookies from 'js-cookie'

export const AUTH_COOKIE_NAME = 'jedi_catalog_auth'
export const RETURN_COOKIE_NAME = 'jedi_return'
export const SOURCE_COOKIE_NAME = 'jedi_source'
const COOKIE_EXPIRY_DAYS = 7

const catalogEndpoint = process.env.NEXT_PUBLIC_CATALOG_ENDPOINT || ''

export function getAuthToken(): string | undefined {
  return Cookies.get(AUTH_COOKIE_NAME)
}

export function setAuthToken(token: string) {
  Cookies.set(AUTH_COOKIE_NAME, token, {
    expires: COOKIE_EXPIRY_DAYS,
    secure: true,
    sameSite: 'none',
  })
}

export function clearAuthToken() {
  Cookies.remove(AUTH_COOKIE_NAME)
}

export function storeReturnUrl(url: string) {
  Cookies.set(RETURN_COOKIE_NAME, url, {
    expires: COOKIE_EXPIRY_DAYS,
    secure: true,
    sameSite: 'none',
  })
}

export function storeSource(source: string) {
  Cookies.set(SOURCE_COOKIE_NAME, source, {
    expires: COOKIE_EXPIRY_DAYS,
    secure: true,
    sameSite: 'none',
  })
}

export function getReturnUrl(): string | undefined {
  return Cookies.get(RETURN_COOKIE_NAME)
}

export function getSource(): string | undefined {
  return Cookies.get(SOURCE_COOKIE_NAME)
}

export async function catalogFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  return fetch(`${catalogEndpoint}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })
}

export interface SsoValidateResponse {
  valid: number
  action?: string
  returnUrl?: string
  source?: string
}

export async function validateSsoToken(token: string): Promise<SsoValidateResponse> {
  const res = await fetch(`${catalogEndpoint}/sso/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return res.json()
}
