'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Package, FolderTree, Grid3x3 } from 'lucide-react'

const metrics = [
  {
    icon: Package,
    label: 'Ítems',
    value: '122,455',
    delta: '+2.6%',
    deltaPositive: true,
  },
  {
    icon: FolderTree,
    label: 'Categorías',
    value: '3,560',
    delta: '+1.8%',
    deltaPositive: true,
  },
  {
    icon: Grid3x3,
    label: 'Subcategorías',
    value: '3,560',
    delta: '+4.3%',
    deltaPositive: true,
  },
]

export default function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card
            key={index}
            className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-0.5 gradient-accent" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
                  <span className="text-xs text-[#64748B] font-medium uppercase tracking-wide">
                    {metric.label}
                  </span>
                </div>
                <button className="text-[#64748B] hover:text-[#475569]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                  </svg>
                </button>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-semibold text-[#0F172A] text-tabular">
                  {metric.value}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.deltaPositive
                      ? 'bg-[#ECFDF5] text-[#16A34A]'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {metric.delta}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
