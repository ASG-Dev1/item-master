'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken } from '@/lib/auth'

export default function SsoLoadingPage() {
  const router = useRouter()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const hash = window.location.hash

    if (hash.startsWith('#/')) {
      // Hash-based route (e.g. /#/sso/embedded or /#/sso/validate/TOKEN).
      // Navigate to the real path so middleware + Next.js routing take over.
      window.location.replace(hash.slice(1))
      return
    }

    // No hash — check if somehow already authenticated (cookie race).
    if (getAuthToken()) {
      router.replace('/')
      return
    }

    // Nothing to resolve — session is truly missing.
    router.replace('/offline')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto" />
        <p className="text-muted-foreground">Validando acceso...</p>
      </div>
    </div>
  )
}
