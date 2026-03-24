'use client'

import { usePathname } from 'next/navigation'
import ItemMasterTabs from '@/components/item-master-tabs'

const HIDDEN_NAV_PREFIXES = ['/sso', '/offline']

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
