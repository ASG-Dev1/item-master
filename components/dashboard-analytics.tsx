'use client'

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  TrendingUp, Package, Clock, Zap, AlertTriangle,
  Target, Users, Activity, Database, ArrowRight,
  CheckCircle, CheckCircle2, Lightbulb, Sparkles, Code,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

const growthData = [
  { week: 'Sem 1', nuevos: 45, reutilizados: 78 },
  { week: 'Sem 2', nuevos: 52, reutilizados: 91 },
  { week: 'Sem 3', nuevos: 38, reutilizados: 105 },
  { week: 'Sem 4', nuevos: 61, reutilizados: 98 },
  { week: 'Sem 5', nuevos: 47, reutilizados: 112 },
  { week: 'Sem 6', nuevos: 55, reutilizados: 124 },
  { week: 'Sem 7', nuevos: 49, reutilizados: 118 },
  { week: 'Sem 8', nuevos: 58, reutilizados: 135 },
]

const itemMasterGrowth = [
  { month: 'Jul', total: 450 },
  { month: 'Ago', total: 580 },
  { month: 'Sep', total: 720 },
  { month: 'Oct', total: 850 },
  { month: 'Nov', total: 990 },
  { month: 'Dic', total: 1100 },
  { month: 'Ene', total: 1247 },
]

const qaOutcomes = [
  { id: 'match-accepted', name: 'Match Aceptado', value: 68, color: '#10B981' },
  { id: 'match-rejected', name: 'Match Rechazado', value: 12, color: '#EF4444' },
  { id: 'new-product', name: 'Producto Nuevo', value: 20, color: '#FF8C00' },
]

const confidenceDistribution = [
  { id: 'conf-90-100', range: '90-100%', count: 145 },
  { id: 'conf-80-89', range: '80-89%', count: 98 },
  { id: 'conf-70-79', range: '70-79%', count: 52 },
  { id: 'conf-60-69', range: '60-69%', count: 28 },
  { id: 'conf-below-60', range: '<60%', count: 15 },
]

const categoryAccuracy = [
  { category: 'Microcomputadoras', accuracy: 94 },
  { category: 'Equipos HVAC', accuracy: 88 },
  { category: 'Mobiliario', accuracy: 91 },
  { category: 'Vehículos', accuracy: 85 },
  { category: 'Suministros', accuracy: 78 },
]

function KpiCard({ label, value, icon: Icon, highlight = false, alert = false }: {
  label: string; value: string; icon: React.ElementType; highlight?: boolean; alert?: boolean
}) {
  return (
    <div className={`rounded-xl p-4 border backdrop-blur-sm ${
      highlight ? 'bg-[#FF8C00]/20 border-[#FF8C00]/40'
        : alert ? 'bg-[#EF4444]/20 border-[#EF4444]/40'
        : 'bg-white/10 border-white/20'
    }`}>
      <Icon className={`w-5 h-5 mb-2 ${highlight ? 'text-[#FF8C00]' : alert ? 'text-[#FCA5A5]' : 'text-white/80'}`} />
      <p className="text-xs mb-1 text-white/70">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-[#FF8C00]' : alert ? 'text-[#FCA5A5]' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function QaMetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
      <p className="text-xs text-[#64748B] mb-2">{label}</p>
      <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
    </div>
  )
}

function DataQualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#64748B]">{label}</span>
        <span className="text-xs font-bold text-[#0F172A]">{value}%</span>
      </div>
      <div className="bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ImpactCard({ icon: Icon, label, value, description, color }: {
  icon: React.ElementType; label: string; value: string; description: string; color: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-sm text-[#64748B] mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#0F172A] mb-2">{value}</p>
      <p className="text-xs text-[#94A3B8]">{description}</p>
    </div>
  )
}

function DataTransformationContent() {
  const [duplicatesFound, setDuplicatesFound] = useState(0)
  const [newItemsAdded, setNewItemsAdded] = useState(0)
  const [timeSaved, setTimeSaved] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setDuplicatesFound(12847), 500)
    const t2 = setTimeout(() => setNewItemsAdded(8234), 800)
    const t3 = setTimeout(() => setTimeSaved(82340), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const formatNumber = (num: number) => num.toLocaleString('en-US')
  const formatTime = (minutes: number) => `${Math.floor(minutes / 60).toLocaleString('en-US')} hrs`

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="flex-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-[#F59E0B]" />
                <p className="text-xs uppercase tracking-wide text-white/70">Datos originales</p>
              </div>
              <p className="text-4xl font-bold text-white text-tabular">299,986</p>
              <p className="text-xs text-white/60 mt-1">registros sin procesar</p>
            </div>
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="w-6 h-6 text-[#2F80FF]" />
            <span className="text-[10px] text-white/70 whitespace-nowrap">Limpieza IA</span>
          </div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                <p className="text-xs uppercase tracking-wide text-white/70">Datos limpios</p>
              </div>
              <p className="text-4xl font-bold text-white text-tabular">150,000</p>
              <p className="text-xs text-white/60 mt-1">registros validados</p>
            </div>
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="w-6 h-6 text-[#2F80FF]" />
            <span className="text-[10px] text-white/70 whitespace-nowrap">Asignación NIGP</span>
          </div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex-1">
            <div className="bg-gradient-to-br from-[#2F80FF]/30 to-[#7B2CFF]/30 backdrop-blur-sm rounded-xl p-5 border border-[#2F80FF]/50 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-5 h-5 text-[#60A5FA]" />
                <p className="text-xs uppercase tracking-wide text-white font-semibold">Item Master</p>
              </div>
              <p className="text-4xl font-bold text-white text-tabular">150,000</p>
              <p className="text-xs text-white/80 mt-1">con códigos NIGP asignados</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-[#EF4444]/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="flex items-center gap-1 bg-[#EF4444]/20 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse" />
              <span className="text-[10px] text-[#FCA5A5]">LIVE</span>
            </div>
          </div>
          <p className="text-xs text-white/70 uppercase tracking-wide mb-2">Duplicados Identificados</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white text-tabular">{formatNumber(duplicatesFound)}</p>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-[#16A34A]/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div className="flex items-center gap-1 bg-[#16A34A]/20 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
              <span className="text-[10px] text-[#86EFAC]">LIVE</span>
            </div>
          </div>
          <p className="text-xs text-white/70 uppercase tracking-wide mb-2">Nuevos Items Añadidos</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white text-tabular">{formatNumber(newItemsAdded)}</p>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="bg-gradient-to-br from-[#2F80FF]/20 to-[#7B2CFF]/20 backdrop-blur-sm rounded-xl p-5 border border-[#2F80FF]/40">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[10px] text-white font-semibold">IA</span>
            </div>
          </div>
          <p className="text-xs text-white/70 uppercase tracking-wide mb-2">Tiempo Ahorrado</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white text-tabular">{formatTime(timeSaved)}</p>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
        </motion.div>
      </div>

      <div className="mt-6 bg-[#2F80FF]/10 border border-[#2F80FF]/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#2F80FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-[#60A5FA]" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1 text-white">Impacto de la Automatización</p>
            <p className="text-xs text-white/70 leading-relaxed">
              Por cada ítem que se digitaliza automáticamente, el sistema ahorra <span className="text-white font-semibold">10 minutos</span> de
              trabajo manual. La IA identifica compras, asigna códigos NIGP, genera ASG-ITEM-IDs y detecta duplicados en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const kpis = {
  totalProducts: 1247, totalRequisitions: 342, newProducts: 287, matchedProducts: 955,
  aiMatchRate: 82, aiAccuracy: 89, pendingQaProducts: 45, pendingQaRequisitions: 12,
}

const qaMetrics = {
  tasksAssigned: 158, productsValidated: 113,
  avgTimePerProduct: '2.4 min', avgTimePerRequisition: '18 min', backlog: 45,
}

const dataQuality = {
  standardizedDescription: 87, standardizedName: 92, completeNigp: 95,
  completeAttributes: 81, brandIdentified: 88, unitOfMeasure: 90,
}

export default function DashboardAnalytics() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#2F80FF] to-[#7B2CFF] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Dashboard Analytics</h1>
              <p className="text-base text-[#475569] mt-1">Análisis inteligente de datos del Item Master impulsado por IA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Hero Section with KPIs */}
      <div className="px-8 py-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3B] via-[#0d2440] to-[#0B1F3B] text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#60A5FA 1px, transparent 1px), linear-gradient(90deg, #60A5FA 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF8C00]/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#2F80FF]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FF8C00]" />
                  <span className="text-sm text-white/60 uppercase tracking-wider">Dashboard Analytics</span>
                </div>
              </div>

              <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                <KpiCard label="Total de Productos" value={kpis.totalProducts.toLocaleString()} icon={Package} />
                <KpiCard label="Requisiciones Procesadas" value={kpis.totalRequisitions.toLocaleString()} icon={CheckCircle2} />
                <KpiCard label="Productos Nuevos Creados" value={kpis.newProducts.toLocaleString()} icon={Zap} />
                <KpiCard label="Productos Vinculados" value={kpis.matchedProducts.toLocaleString()} icon={Target} />
                <KpiCard label="Match Rate IA" value={`${kpis.aiMatchRate}%`} icon={TrendingUp} highlight />
                <KpiCard label="Precisión IA" value={`${kpis.aiAccuracy}%`} icon={Target} highlight />
                <KpiCard label="Productos Pendientes QA" value={kpis.pendingQaProducts.toLocaleString()} icon={Clock} alert />
                <KpiCard label="Requisiciones Pendientes" value={kpis.pendingQaRequisitions.toLocaleString()} icon={AlertTriangle} alert />
              </div>

              <DataTransformationContent />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-[#F8FAFC] px-8 py-8">
        <div className="max-w-[1800px] mx-auto space-y-8">
          {/* Growth Charts */}
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Actividad y Crecimiento del Item Master</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#FF8C00]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#FF8C00]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Crecimiento del Item Master</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={itemMasterGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="total" stroke="#0B1F3B" strokeWidth={3} dot={{ fill: '#FF8C00', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#0B5FCC]/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#0B5FCC]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Productos Nuevos vs Reutilizados</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
                    <Bar dataKey="nuevos" fill="#FF8C00" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="reutilizados" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FF8C00]" /><span className="text-xs text-[#64748B]">Nuevos</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10B981]" /><span className="text-xs text-[#64748B]">Reutilizados</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Performance */}
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Desempeño de la IA</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Resultados QA</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={qaOutcomes} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {qaOutcomes.map((entry) => (<Cell key={entry.id} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {qaOutcomes.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-[#64748B]">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#0B5FCC]/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#0B5FCC]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Distribución de Confianza IA</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={confidenceDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis type="category" dataKey="range" tick={{ fill: '#64748B', fontSize: 12 }} width={70} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0B5FCC" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Precisión por Categoría</h3>
                </div>
                <div className="space-y-4">
                  {categoryAccuracy.map((cat, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#64748B]">{cat.category}</span>
                        <span className="text-sm font-bold text-[#0F172A]">{cat.accuracy}%</span>
                      </div>
                      <div className="bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500" style={{ width: `${cat.accuracy}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* QA Operations + Data Quality */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#FF8C00]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#FF8C00]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Operación de QA</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <QaMetricCard label="Tareas Asignadas" value={qaMetrics.tasksAssigned} />
                <QaMetricCard label="Productos Validados" value={qaMetrics.productsValidated} />
                <QaMetricCard label="Tiempo Promedio/Producto" value={qaMetrics.avgTimePerProduct} />
                <QaMetricCard label="Tiempo Promedio/Requisición" value={qaMetrics.avgTimePerRequisition} />
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-[#FEF3C7] to-[#FEF9E7] rounded-xl border border-[#FCD34D]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#92400E]">Backlog Actual</span>
                  <span className="text-3xl font-bold text-[#FF8C00]">{qaMetrics.backlog}</span>
                </div>
                <p className="text-xs text-[#92400E] mt-2">productos pendientes de validación</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Calidad de Datos</h3>
              </div>
              <div className="space-y-3">
                <DataQualityBar label="Descripción Estandarizada" value={dataQuality.standardizedDescription} />
                <DataQualityBar label="Nombre Estandarizado" value={dataQuality.standardizedName} />
                <DataQualityBar label="NIGP Completo" value={dataQuality.completeNigp} />
                <DataQualityBar label="Atributos Completos" value={dataQuality.completeAttributes} />
                <DataQualityBar label="Marca Identificada" value={dataQuality.brandIdentified} />
                <DataQualityBar label="Unidad de Medida" value={dataQuality.unitOfMeasure} />
              </div>
            </div>
          </div>

          {/* Impact */}
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Impacto Operativo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ImpactCard icon={Target} label="Tasa de Reutilización" value="76.9%" description="955 de 1,247 productos vinculados" color="from-[#10B981] to-[#059669]" />
              <ImpactCard icon={TrendingUp} label="Reducción de Duplicados" value="68%" description="Estimado basado en matches exitosos" color="from-[#0B5FCC] to-[#1E40AF]" />
              <ImpactCard icon={Clock} label="Tiempo Ahorrado" value="~340 hrs" description="Por automatización de matches IA" color="from-[#FF8C00] to-[#F59E0B]" />
              <ImpactCard icon={Zap} label="Validaciones Automatizadas" value="82%" description="Productos pre-validados por IA antes de QA" color="from-[#7C3AED] to-[#6D28D9]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
