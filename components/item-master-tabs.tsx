'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Info, Package, CheckCircle, BarChart3 } from 'lucide-react'

const tabs = [
  { id: 'informacion', label: 'Información', icon: Info, href: '/informacion' },
  { id: 'productos', label: 'Productos y Servicios', icon: Package, href: '/' },
  { id: 'qa', label: 'QA', icon: CheckCircle, href: '/qa' },
  { id: 'dashboard', label: 'Dashboard Analytics', icon: BarChart3, href: '/dashboard' },
]

interface ItemMasterTabsProps {
  activeTab: string
}

export default function ItemMasterTabs({ activeTab }: ItemMasterTabsProps) {
  return (
    <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="px-6 pt-4">
        <div className="flex items-center gap-1 relative">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative px-5 py-3 rounded-t-lg transition-all duration-200 group ${
                  isActive
                    ? 'text-[#0B1F3B]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5 relative z-10">
                  <Icon
                    className={`w-4 h-4 transition-all ${
                      isActive
                        ? 'text-[#2F80FF]'
                        : 'text-[#94A3B8] group-hover:text-[#64748B]'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isActive ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-accent" />
                )}

                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#F6F8FC] to-transparent rounded-t-lg -z-0" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
    </div>
  )
}
