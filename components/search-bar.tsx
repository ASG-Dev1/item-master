'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, Save, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [activeFilters, setActiveFilters] = useState([
    { id: 1, label: 'Categoría', value: 'Equipos HVAC' },
    { id: 2, label: 'Precio', value: '$0–$500' },
    { id: 3, label: 'Estado', value: 'Activo' },
  ])

  const removeFilter = (id: number) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== id))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por ID, nombre, descripción, categoría o subcategoría…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 pr-4 h-10 border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#2F80FF] focus:border-transparent text-sm"
          />
        </div>
        <Button
          variant="outline"
          className="h-10 px-4 text-sm border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        <Button
          variant="outline"
          className="h-10 px-4 text-sm border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar vista
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="inline-flex items-center gap-2 bg-[#F1F5F9] text-[#475569] px-3 py-1.5 rounded-full text-xs font-medium"
              >
                <span className="text-[#64748B]">{filter.label}:</span>
                <span>{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="hover:text-[#0F172A] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#475569] hover:text-[#0F172A] hover:underline font-medium whitespace-nowrap"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  )
}
