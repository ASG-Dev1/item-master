'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ItemMasterTabs from '@/components/item-master-tabs'

const HIDDEN_NAV_PREFIXES = ['/sso', '/offline']

function useHashRedirect() {
  const router = useRouter()
  const redirectedRef = useRef(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#/') && !redirectedRef.current) {
      redirectedRef.current = true
      router.replace(hash.slice(1))
    }
  }, [router])
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  useHashRedirect()

  const hideNav = HIDDEN_NAV_PREFIXES.some((p) => pathname.startsWith(p))

  if (hideNav) {
    return <>{children}</>
  }

  const activeTab = (() => {
    if (pathname === '/') return 'productos'
    if (pathname === '/informacion') return 'informacion'
    if (pathname === '/qa') return 'qa'
    if (pathname === '/dashboard') return 'dashboard'
    return 'productos'
  })()

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <ItemMasterTabs activeTab={activeTab} />
      <main>{children}</main>
    </div>
  )
}
