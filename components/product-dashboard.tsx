'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Download, Upload, Plus, Search, Settings } from 'lucide-react'
import MetricCard from './metric-card'
import ProductTable from './product-table'

const mockMetrics = [
  {
    title: 'Número de items',
    value: '122,455',
    change: '+25.0%',
    icon: 'package',
  },
  {
    title: 'Categorías',
    value: '3,560',
    change: '+18.0%',
    icon: 'edit',
  },
  {
    title: 'Subcategorías',
    value: '3,560',
    change: '+43.0%',
    icon: 'zap',
  },
  {
    title: 'Productos Inactivos',
    value: '3,560',
    change: '+15.0%',
    icon: 'circle-slash',
  },
]

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
    // Reset to page 1 if current page is out of bounds
    if (currentPage > Math.ceil(total / ITEMS_PER_PAGE)) {
      setCurrentPage(1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">MIS PRODUCTOS</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </Button>
              <Button size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4" />
                Agregar Producto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon as "package" | "edit" | "zap" | "circle-slash"}
            />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Más filtros
            </Button>
          </div>
          <ProductTable
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            onTotalItemsChange={handleTotalItemsChange}
          />
        </Card>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages || 1} ({totalItems.toLocaleString()} items)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
