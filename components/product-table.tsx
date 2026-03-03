'use client'

import { useState, useEffect, useMemo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { loadCSVData, type ProductRow } from '@/lib/csv-loader'

interface ProductTableProps {
  searchTerm: string
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onTotalItemsChange: (total: number) => void
}

export default function ProductTable({
  searchTerm,
  currentPage,
  itemsPerPage,
  onPageChange,
  onTotalItemsChange,
}: ProductTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await loadCSVData()
        setProducts(data)
        onTotalItemsChange(data.length)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [onTotalItemsChange])

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    return products.filter((product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [products, searchTerm])

  // Update total items when filtered
  useEffect(() => {
    onTotalItemsChange(filteredProducts.length)
  }, [filteredProducts.length, onTotalItemsChange])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage, itemsPerPage])

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    )
  }

  const handleEdit = (id: number) => {
    console.log('Edit product:', id)
    // Add your edit logic here
  }

  const handleDelete = (id: number) => {
    console.log('Delete product:', id)
    // Add your delete logic here
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ minWidth: 'max-content' }}>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              <Checkbox />
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              ASG-ITEM-ID
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Nombre del Producto/Servicio
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Descripción Completa
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Precio
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Garantía
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Categoría
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Subcategoría
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Número de contrato
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Agencia
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Núm. de Partida
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Renglón
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Marca
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Modelo
            </th>
            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan={15} className="px-6 py-8 text-center text-muted-foreground">
                No se encontraron productos
              </td>
            </tr>
          ) : (
            paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedRows.includes(product.id)}
                    onChange={() => toggleRow(product.id)}
                  />
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.asgItemId}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.nombreProducto}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap max-w-xs truncate">
                  {product.descripcionCompleta}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.precio}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.garantia}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.categoria}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.subcategoria}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.numeroContrato}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.agencia}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.numPartida}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.renglon}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.marca}
                </td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">
                  {product.modelo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(product.id)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(product.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
