'use client'

import { motion } from 'motion/react'
import { FileText, Package, Calendar, Building2, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface Requisition {
  id: string
  requisitionNumber: string
  agency: string
  submittedDate: string
  productCount: number
  reviewedCount: number
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
}

interface RequisitionCardProps {
  requisition: Requisition
  onClick: () => void
}

const statusConfig = {
  pending: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'Pendiente' },
  'in-progress': { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', label: 'En Progreso' },
  completed: { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', label: 'Completado' },
}

const priorityConfig = {
  high: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', label: 'Alta' },
  medium: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'Media' },
  low: { bg: 'bg-[#E0E7FF]', text: 'text-[#3730A3]', label: 'Baja' },
}

export default function RequisitionCard({ requisition, onClick }: RequisitionCardProps) {
  const progress = (requisition.reviewedCount / requisition.productCount) * 100
  const status = statusConfig[requisition.status]
  const priority = priorityConfig[requisition.priority]

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white border-2 border-[#E2E8F0] rounded-xl p-5 cursor-pointer hover:border-[#0B5FCC] hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0B5FCC] to-[#1E40AF] rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A] text-lg">{requisition.requisitionNumber}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
              <p className="text-sm text-[#64748B]">{requisition.agency}</p>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#0B5FCC] transition-colors" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs text-[#64748B]">Enviado:</span>
          <span className="text-xs font-semibold text-[#0F172A]">{requisition.submittedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs text-[#64748B]">Productos:</span>
          <span className="text-xs font-semibold text-[#0F172A]">{requisition.productCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#0B5FCC] to-[#3B82F6]"
          />
        </div>
        <span className="text-xs font-bold text-[#475569] min-w-[45px] text-right">
          {requisition.reviewedCount}/{requisition.productCount}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={`${status.bg} ${status.text} border-0 text-xs`}>
          {status.label}
        </Badge>
        <Badge className={`${priority.bg} ${priority.text} border-0 text-xs`}>
          Prioridad {priority.label}
        </Badge>
      </div>
    </motion.div>
  )
}
