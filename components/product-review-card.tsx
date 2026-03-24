'use client'

import { motion, useMotionValue, useTransform } from 'motion/react'
import { Check, X, AlertCircle, Sparkles, Package, DollarSign, Building2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export interface ProductToReview {
  id: string
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  agency: string
  brand?: string
  model?: string
  aiMatch?: {
    found: boolean
    confidence: number
    existingProduct?: {
      asgItemId: string
      name: string
      price: number
      category: string
      subcategory: string
      brand?: string
      model?: string
    }
  }
  newItemId?: string
}

interface ProductReviewCardProps {
  product: ProductToReview
  onApprove: () => void
  onReject: () => void
  isTop?: boolean
}

function InfoBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-2 border border-[#E2E8F0]">
      <div className="flex items-center gap-1 mb-1">
        <Icon className="w-3 h-3 text-[#64748B]" />
        <span className="text-xs text-[#64748B]">{label}</span>
      </div>
      <p className="text-xs font-semibold text-[#0F172A] truncate">{value}</p>
    </div>
  )
}

export default function ProductReviewCard({
  product,
  onApprove,
  onReject,
  isTop = false,
}: ProductReviewCardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const handleDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      setExitDirection('right')
      setTimeout(onApprove, 300)
    } else if (info.offset.x < -100) {
      setExitDirection('left')
      setTimeout(onReject, 300)
    }
  }

  const handleApprove = () => {
    setExitDirection('right')
    setTimeout(onApprove, 300)
  }

  const handleReject = () => {
    setExitDirection('left')
    setTimeout(onReject, 300)
  }

  const getExitAnimation = () => {
    if (exitDirection === 'right') return { x: 500, rotate: 20, opacity: 0 }
    if (exitDirection === 'left') return { x: -500, rotate: -20, opacity: 0 }
    return {}
  }

  const hasMatch = product.aiMatch?.found
  const confidence = product.aiMatch?.confidence || 0

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      animate={exitDirection ? getExitAnimation() : {}}
      transition={{ duration: 0.3 }}
      className={`absolute inset-0 ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#E2E8F0] h-full overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 ${
            hasMatch
              ? 'bg-gradient-to-r from-[#0B5FCC] to-[#1E40AF]'
              : 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">
                {hasMatch ? 'Match Encontrado' : 'Producto Nuevo'}
              </span>
            </div>
            {hasMatch && (
              <Badge className="bg-white/20 text-white border-white/30">
                {confidence}% Confianza
              </Badge>
            )}
          </div>
          {!hasMatch && product.newItemId && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-white/80 mb-1">Nuevo ASG-ITEM-ID Generado</p>
              <p className="font-mono font-bold text-white text-lg">{product.newItemId}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 200px)' }}>
          {hasMatch ? (
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] rounded-xl p-5 border-2 border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-[#0B5FCC]" />
                  <h3 className="font-bold text-[#0F172A]">Producto Enviado</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] mb-1">{product.name}</p>
                    <p className="text-xs text-[#64748B]">{product.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBadge icon={DollarSign} label="Precio" value={`$${product.price.toFixed(2)}`} />
                    <InfoBadge icon={Building2} label="Agencia" value={product.agency} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBadge icon={Tag} label="Categoría" value={product.category} />
                    {product.brand && <InfoBadge icon={Package} label="Marca" value={product.brand} />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-[#E0E7FF] rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-[#0B5FCC]" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl p-5 border-2 border-[#0B5FCC]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#0B5FCC]" />
                  <h3 className="font-bold text-[#0F172A]">Match en Item Master</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-[#64748B] mb-1">ASG-ITEM-ID</p>
                    <p className="font-mono font-bold text-[#0B5FCC]">
                      {product.aiMatch?.existingProduct?.asgItemId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] mb-1">
                      {product.aiMatch?.existingProduct?.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBadge
                      icon={DollarSign}
                      label="Precio"
                      value={`$${product.aiMatch?.existingProduct?.price.toFixed(2)}`}
                    />
                    <InfoBadge
                      icon={Tag}
                      label="Categoría"
                      value={product.aiMatch?.existingProduct?.category || ''}
                    />
                  </div>
                  {product.aiMatch?.existingProduct?.brand && (
                    <InfoBadge icon={Package} label="Marca" value={product.aiMatch.existingProduct.brand} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-xl p-5 border-2 border-[#7C3AED]">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="font-bold text-[#0F172A]">Producto Nuevo</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] mb-1">{product.name}</p>
                  <p className="text-xs text-[#64748B]">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoBadge icon={DollarSign} label="Precio" value={`$${product.price.toFixed(2)}`} />
                  <InfoBadge icon={Building2} label="Agencia" value={product.agency} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoBadge icon={Tag} label="Categoría" value={product.category} />
                  <InfoBadge icon={Tag} label="Subcategoría" value={product.subcategory} />
                </div>
                {product.brand && (
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBadge icon={Package} label="Marca" value={product.brand} />
                    {product.model && <InfoBadge icon={Package} label="Modelo" value={product.model} />}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleReject}
              className="flex-1 h-14 bg-white border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2] rounded-xl font-bold text-lg"
            >
              <X className="w-6 h-6 mr-2" />
              Rechazar
            </Button>
            <Button
              onClick={handleApprove}
              className="flex-1 h-14 bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] rounded-xl font-bold text-lg"
            >
              <Check className="w-6 h-6 mr-2" />
              Aprobar
            </Button>
          </div>
          {isTop && (
            <p className="text-center text-xs text-[#94A3B8] mt-3">
              Desliza izquierda para rechazar, derecha para aprobar
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
