'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Eye, Columns3 } from 'lucide-react'
import { loadCSVData, type ProductRow } from '@/lib/csv-loader'

interface Col {
  id: string
  label: string
  field: keyof ProductRow
  minW: number
  initW: number
  align?: 'left' | 'right'
  badge?: { bg: string; text: string; border: string }
  gradient?: boolean
}

const COLUMNS: Col[] = [
  { id: 'asgItemId',         label: 'ASG-ITEM-ID',                  field: 'asgItemId',           minW: 200, initW: 240, gradient: true },
  { id: 'categoriaNigp',     label: 'Categoría NIGP',               field: 'categoriaNigp',       minW: 100, initW: 130, badge: { bg: 'bg-[#2F80FF]/20', text: 'text-[#60A5FA]', border: 'border-[#2F80FF]/30' } },
  { id: 'subCategoriaNigp',  label: 'Sub-Categoría NIGP',           field: 'subCategoriaNigp',    minW: 100, initW: 130, badge: { bg: 'bg-[#7B2CFF]/20', text: 'text-[#A78BFA]', border: 'border-[#7B2CFF]/30' } },
  { id: 'agenciaId',         label: 'Agencia ID',                   field: 'agenciaId',           minW: 90,  initW: 110, badge: { bg: 'bg-[#16A34A]/20', text: 'text-[#86EFAC]', border: 'border-[#16A34A]/30' } },
  { id: 'modoAdquisicion',   label: 'Modo de Adquisición',          field: 'modoAdquisicion',     minW: 90,  initW: 110, badge: { bg: 'bg-[#F59E0B]/20', text: 'text-[#FCD34D]', border: 'border-[#F59E0B]/30' } },
  { id: 'idArticulo',        label: 'ID Articulo',                  field: 'idArticulo',          minW: 110, initW: 150, badge: { bg: 'bg-[#EF4444]/20', text: 'text-[#FCA5A5]', border: 'border-[#EF4444]/30' } },
  { id: 'nombreProducto',    label: 'Nombre del Producto/Servicio', field: 'nombreProducto',      minW: 180, initW: 250 },
  { id: 'descripcion',       label: 'Descripción Completa',         field: 'descripcionCompleta', minW: 200, initW: 300 },
  { id: 'precio',            label: 'Precio',                       field: 'precio',              minW: 100, initW: 130, align: 'right' },
  { id: 'categoria',         label: 'Categoría',                    field: 'categoria',           minW: 120, initW: 170 },
  { id: 'subcategoria',      label: 'Subcategoría',                 field: 'subcategoria',        minW: 130, initW: 200 },
  { id: 'agencia',           label: 'Agencia',                      field: 'agencia',             minW: 150, initW: 220 },
  { id: 'requisicionItemId', label: 'Requisición Item ID',          field: 'requisicionItemId',   minW: 140, initW: 180 },
  { id: 'licitacion',        label: 'Licitación',                   field: 'licitacion',          minW: 80,  initW: 100 },
  { id: 'marca',             label: 'Marca',                        field: 'marca',               minW: 90,  initW: 130 },
  { id: 'modelo',            label: 'Modelo',                       field: 'modelo',              minW: 90,  initW: 130 },
  { id: 'garantia',          label: 'Garantía',                     field: 'garantia',            minW: 100, initW: 160 },
  { id: 'numeroContrato',    label: 'Número de Contrato',           field: 'numeroContrato',      minW: 120, initW: 160 },
  { id: 'numPartida',        label: 'Núm. de Partida',              field: 'numPartida',          minW: 100, initW: 120 },
  { id: 'renglon',           label: 'Renglón',                      field: 'renglon',             minW: 70,  initW: 90 },
]

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
  const [density, setDensity] = useState<'compact' | 'standard'>('standard')
  const [visible, setVisible] = useState<Set<string>>(() => new Set(COLUMNS.map((c) => c.id)))
  const [showPicker, setShowPicker] = useState(false)
  const [widths, setWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.id, c.initW]))
  )

  // Resize refs
  const dragCol = useRef<string | null>(null)
  const dragStartX = useRef(0)
  const dragStartW = useRef(0)

  // Synced scroll refs
  const topScrollRef = useRef<HTMLDivElement>(null)
  const bottomScrollRef = useRef<HTMLDivElement>(null)
  const scrollSyncSource = useRef<'top' | 'bottom' | null>(null)

  const onTopScroll = useCallback(() => {
    if (scrollSyncSource.current === 'bottom') return
    scrollSyncSource.current = 'top'
    if (bottomScrollRef.current && topScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft
    }
    requestAnimationFrame(() => { scrollSyncSource.current = null })
  }, [])

  const onBottomScroll = useCallback(() => {
    if (scrollSyncSource.current === 'top') return
    scrollSyncSource.current = 'bottom'
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft
    }
    requestAnimationFrame(() => { scrollSyncSource.current = null })
  }, [])

  // Resize handlers on document
  const onResizeMove = useCallback((e: PointerEvent) => {
    if (!dragCol.current) return
    const diff = e.clientX - dragStartX.current
    const col = COLUMNS.find((c) => c.id === dragCol.current)
    const min = col?.minW ?? 60
    setWidths((prev) => ({ ...prev, [dragCol.current!]: Math.max(min, dragStartW.current + diff) }))
  }, [])

  const onResizeUp = useCallback(() => {
    dragCol.current = null
    document.removeEventListener('pointermove', onResizeMove)
    document.removeEventListener('pointerup', onResizeUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [onResizeMove])

  const startResize = useCallback((colId: string, e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCol.current = colId
    dragStartX.current = e.clientX
    dragStartW.current = widths[colId]
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('pointermove', onResizeMove)
    document.addEventListener('pointerup', onResizeUp)
  }, [widths, onResizeMove, onResizeUp])

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

  const filtered = useMemo(() => {
    if (!searchTerm) return products
    const q = searchTerm.toLowerCase()
    return products.filter((p) =>
      Object.values(p).some((v) => String(v).toLowerCase().includes(q))
    )
  }, [products, searchTerm])

  useEffect(() => {
    onTotalItemsChange(filtered.length)
  }, [filtered.length, onTotalItemsChange])

  const paginated = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage
    return filtered.slice(s, s + itemsPerPage)
  }, [filtered, currentPage, itemsPerPage])

  const toggleRow = (id: number) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  const toggleAll = () =>
    setSelectedRows(selectedRows.length === paginated.length ? [] : paginated.map((p) => p.id))
  const toggleCol = (id: string) =>
    setVisible((prev) => {
      const n = new Set(prev)
      n.has(id) ? (n.size > 1 && n.delete(id)) : n.add(id)
      return n
    })

  const cols = COLUMNS.filter((c) => visible.has(c.id))
  const py = density === 'compact' ? 'py-2' : 'py-3'

  const totalTableWidth = 44 + cols.reduce((sum, c) => sum + widths[c.id], 0) + 100

  const renderCell = (col: Col, p: ProductRow) => {
    const raw = p[col.field]
    const val = typeof raw === 'number' ? String(raw) : (raw || '')

    if (col.gradient)
      return <div className="font-mono text-sm font-semibold text-white whitespace-nowrap">{val}</div>

    if (col.badge && val)
      return (
        <span className={`inline-flex px-2 py-1 rounded font-mono text-xs font-semibold border whitespace-nowrap ${col.badge.bg} ${col.badge.text} ${col.badge.border}`}>
          {val}
        </span>
      )

    if (col.align === 'right')
      return <span className="whitespace-nowrap text-tabular text-[#eff3fd]">{val}</span>

    return <span className="line-clamp-2">{val}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/70">Cargando datos...</div>
      </div>
    )
  }

  const tableContent = (
    <table className="text-sm border-collapse" style={{ width: totalTableWidth, tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: 44 }} />
        {cols.map((c) => (
          <col key={c.id} style={{ width: widths[c.id] }} />
        ))}
        <col style={{ width: 100 }} />
      </colgroup>
      <thead>
        <tr className="bg-white/5 border-b border-white/10">
          <th className="px-4 py-3 text-left">
            <Checkbox
              checked={selectedRows.length === paginated.length && paginated.length > 0}
              onCheckedChange={toggleAll}
            />
          </th>
          {cols.map((c) => (
            <th
              key={c.id}
              className={`px-4 py-3 text-xs font-semibold text-white/90 uppercase tracking-wide whitespace-nowrap relative group ${
                c.gradient ? 'bg-gradient-to-r from-[#2F80FF]/10 to-[#7B2CFF]/10' : ''
              }`}
              style={{ textAlign: c.align || 'left' }}
            >
              <span className="block truncate pr-2">{c.label}</span>
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onPointerDown={(e) => startResize(c.id, e)}
              >
                <div className="w-0.5 h-4/5 bg-white/20 group-hover:bg-[#FF8C00] rounded-full transition-colors" />
              </div>
            </th>
          ))}
          <th className="px-4 py-3 text-center text-xs font-semibold text-white/90 uppercase tracking-wide">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {paginated.length === 0 ? (
          <tr>
            <td colSpan={cols.length + 2} className="px-6 py-8 text-center text-white/50">
              No se encontraron productos
            </td>
          </tr>
        ) : (
          paginated.map((product, idx) => (
            <tr
              key={`${product.id}-${idx}`}
              className={`${idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'} hover:bg-white/20 border-b border-white/10 transition-colors`}
            >
              <td className={`px-4 ${py}`}>
                <Checkbox
                  checked={selectedRows.includes(product.id)}
                  onCheckedChange={() => toggleRow(product.id)}
                />
              </td>
              {cols.map((c) => (
                <td
                  key={c.id}
                  className={`px-4 ${py} text-sm text-white overflow-hidden ${
                    c.gradient ? 'bg-gradient-to-r from-[#2F80FF]/10 to-[#7B2CFF]/10' : ''
                  }`}
                  style={{ textAlign: c.align || 'left' }}
                >
                  {renderCell(c, product)}
                </td>
              ))}
              <td className={`px-4 ${py}`}>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#2F80FF]/20 hover:text-[#60A5FA] text-white/70" title="Ver detalles">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/20 text-white/70 hover:text-white" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#EF4444]/20 hover:text-[#FCA5A5] text-white/70" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )

  return (
    <>
      {/* Top Bar */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="text-sm text-white/70">
          <span className="font-medium text-white">{filtered.length.toLocaleString()}</span> resultados
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setDensity('compact')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${density === 'compact' ? 'bg-[#FF8C00] text-white shadow-sm' : 'text-white/60 hover:text-white/80'}`}
            >Compacto</button>
            <button
              onClick={() => setDensity('standard')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${density === 'standard' ? 'bg-[#FF8C00] text-white shadow-sm' : 'text-white/60 hover:text-white/80'}`}
            >Estándar</button>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPicker(!showPicker)}
              className="text-xs border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
            >
              <Columns3 className="w-4 h-4 mr-2" />
              Columnas ({cols.length}/{COLUMNS.length})
            </Button>
            {showPicker && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-[#0B1F3B] border border-white/20 rounded-xl shadow-2xl z-50 p-3">
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2 px-1">Columnas visibles</div>
                {COLUMNS.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer">
                    <Checkbox checked={visible.has(c.id)} onCheckedChange={() => toggleCol(c.id)} />
                    <span className="text-xs text-white/80">{c.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection Bar */}
      {selectedRows.length > 0 && (
        <div className="px-4 py-3 bg-[#FF8C00]/10 border-b border-[#FF8C00]/20 flex items-center justify-between backdrop-blur-sm">
          <div className="text-sm text-white/70">
            <span className="font-medium text-white">{selectedRows.length}</span> seleccionados —
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-white/70 hover:text-white font-medium">Exportar</button>
            <button className="text-sm text-white/70 hover:text-white font-medium">Asignar categoría</button>
            <button className="text-sm text-white/70 hover:text-white font-medium">Cambiar estado</button>
          </div>
        </div>
      )}

      {/* Top scrollbar */}
      <div
        ref={topScrollRef}
        className="overflow-x-auto overflow-y-hidden table-scroll-top"
        style={{ height: 14 }}
        onScroll={onTopScroll}
      >
        <div style={{ width: totalTableWidth, height: 1 }} />
      </div>

      {/* Table with bottom scrollbar */}
      <div
        ref={bottomScrollRef}
        className="overflow-x-auto table-scroll"
        onScroll={onBottomScroll}
      >
        {tableContent}
      </div>
    </>
  )
}
