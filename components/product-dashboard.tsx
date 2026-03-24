'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import MetricsCards from './metrics-cards'
import SearchBar from './search-bar'
import ProductTable from './product-table'

const ITEMS_PER_PAGE = 25

export default function ProductDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleTotalItemsChange = (total: number) => {
    setTotalItems(total)
    if (currentPage > Math.ceil(total / ITEMS_PER_PAGE)) {
      setCurrentPage(1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0B1F3B] to-[#1E3A5F] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-[1.75rem] leading-9 font-semibold text-[#0F172A] mb-2">
                  Productos y Servicios
                </h1>
                <p className="text-sm text-[#475569]">
                  Catálogo central para organizar, buscar y clasificar ítems de adquisiciones.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button className="bg-[#0B1F3B] hover:bg-[#0B1F3B]/90 text-white h-10 px-4 text-sm font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Crear ítem
              </Button>
              <Button
                variant="outline"
                className="border-[#E2E8F0] hover:bg-[#F8FAFC] h-10 px-4 text-sm"
              >
                Exportar ▾
              </Button>
              <Button
                variant="outline"
                className="border-[#E2E8F0] hover:bg-[#F8FAFC] h-10 w-10 p-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-8">
        <MetricsCards />
        <SearchBar
          value={searchTerm}
          onChange={(term) => {
            setSearchTerm(term)
            setCurrentPage(1)
          }}
        />

        {/* Table with dark theme wrapper */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3B] via-[#0d2440] to-[#0B1F3B]">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(#60A5FA 1px, transparent 1px), linear-gradient(90deg, #60A5FA 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF8C00]/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#2F80FF]/20 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1.5s' }}
          />

          <div className="relative z-10">
            <ProductTable
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              onTotalItemsChange={handleTotalItemsChange}
            />

            {/* Pagination Footer */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-sm text-white/70">
                Mostrando{' '}
                <span className="font-medium text-white">
                  {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                </span>{' '}
                de <span className="font-medium text-white">{totalItems.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="text-xs border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`text-xs ${
                          currentPage === page
                            ? 'border-[#FF8C00] bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90'
                            : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  {totalPages > 3 && (
                    <span className="text-sm text-white/50 px-1">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage >= totalPages}
                    className="text-xs border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                  >
                    Siguiente
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Items por página:</span>
                  <select className="text-xs border border-white/20 rounded px-2 py-1 bg-white/5 text-white">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
