'use client'

import { motion } from 'motion/react'
import { TrendingUp, Target, Zap, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface QAProgressDashboardProps {
  totalRequisitions: number
  reviewedRequisitions: number
  totalProducts: number
  reviewedProducts: number
  approvedMatches: number
  rejectedMatches: number
  aiAccuracy: number
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white`}
    >
      <Icon className="w-8 h-8 mb-3 opacity-80" />
      <p className="text-white/80 text-xs mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 text-center">
      <p className="text-xs text-[#64748B] mb-1">{label}</p>
      <p className="text-xl font-bold text-[#0F172A]">{value}</p>
    </div>
  )
}

export default function QAProgressDashboard({
  totalRequisitions,
  reviewedRequisitions,
  totalProducts,
  reviewedProducts,
  approvedMatches,
  rejectedMatches,
  aiAccuracy,
}: QAProgressDashboardProps) {
  const productProgress = totalProducts > 0 ? (reviewedProducts / totalProducts) * 100 : 0
  const pendingProducts = totalProducts - reviewedProducts

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-[#0B5FCC] to-[#1E40AF] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Progreso General</p>
            <h2 className="text-4xl font-bold">{Math.round(productProgress)}%</h2>
          </div>
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-10 h-10" />
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${productProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/80 text-xs mb-1">Productos Revisados</p>
            <p className="text-2xl font-bold">
              {reviewedProducts}/{totalProducts}
            </p>
          </div>
          <div>
            <p className="text-white/80 text-xs mb-1">Requisiciones</p>
            <p className="text-2xl font-bold">
              {reviewedRequisitions}/{totalRequisitions}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={pendingProducts.toString()}
          color="from-[#F59E0B] to-[#D97706]"
        />
        <StatCard
          icon={Target}
          label="Precisión IA"
          value={`${aiAccuracy}%`}
          color="from-[#7C3AED] to-[#6D28D9]"
        />
      </div>

      {/* AI Performance */}
      <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="font-bold text-[#0F172A]">Rendimiento IA</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-[#64748B]">Matches Aprobados</span>
              </div>
              <span className="text-sm font-bold text-[#0F172A]">{approvedMatches}</span>
            </div>
            <div className="bg-[#F1F5F9] rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                style={{
                  width: `${(approvedMatches / (approvedMatches + rejectedMatches || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-sm text-[#64748B]">Matches Rechazados</span>
              </div>
              <span className="text-sm font-bold text-[#0F172A]">{rejectedMatches}</span>
            </div>
            <div className="bg-[#F1F5F9] rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-full"
                style={{
                  width: `${(rejectedMatches / (approvedMatches + rejectedMatches || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-br from-[#F8FAFC] to-white rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#64748B]">Tasa de Precisión</span>
            <span className="text-2xl font-bold text-[#0B5FCC]">{aiAccuracy}%</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2">
            Basado en {approvedMatches + rejectedMatches} revisiones
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <QuickStat label="Hoy" value="12" />
        <QuickStat label="Esta Semana" value="87" />
        <QuickStat label="Total" value={reviewedProducts.toString()} />
      </div>
    </div>
  )
}
