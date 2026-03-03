'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { clearAuthToken, getAuthToken } from '@/lib/auth'

const HIDDEN_NAV_PREFIXES = ['/sso', '/offline']

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const hideNav = HIDDEN_NAV_PREFIXES.some((p) => pathname.startsWith(p))

  const menuItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/qa', label: 'QA' },
  ]

  const handleLogout = () => {
    clearAuthToken()
    router.replace('/offline')
  }

  if (hideNav) {
    return <>{children}</>
  }

  const isAuthenticated = !!getAuthToken()

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'text-white hover:text-white',
                        isActive
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'hover:bg-white/10'
                      )}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/10 gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  )
}
