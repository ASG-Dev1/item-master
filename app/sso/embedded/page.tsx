'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { validateSsoToken, setAuthToken, storeReturnUrl, storeSource } from '@/lib/auth'

export default function SsoEmbeddedPage() {
  const router = useRouter()
  const hasValidated = useRef(false)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const token = event.data?.token
      if (!token || hasValidated.current) return
      hasValidated.current = true

      validateSsoToken(token).then((data) => {
        if (!data.valid || data.valid === 0) {
          router.replace('/offline')
          return
        }

        storeReturnUrl(data.returnUrl || '')
        storeSource(data.source || 'JEDI')
        setAuthToken(token)
        router.replace('/')
      }).catch(() => {
        router.replace('/offline')
      })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
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
