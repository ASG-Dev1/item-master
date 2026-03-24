'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Lightbulb,
  Target,
  Code,
  FileText,
  Building2,
  ShoppingCart,
  AlertTriangle,
  Users,
  ArrowDown,
  Cpu,
  FileCheck,
  Tag,
  Network,
} from 'lucide-react'
import { motion } from 'motion/react'

const metodosAdquisicion = [
  { code: '01', name: 'Compra contra contrato' },
  { code: '02', name: 'Compra directa' },
  { code: '03', name: 'Licitación pública' },
  { code: '04', name: 'Compra de emergencia' },
  { code: '05', name: 'Compra cooperativa' },
  { code: '06', name: 'Compra por excepción' },
]

const casosUso = [
  {
    title: 'Para Requisiciones',
    format: 'AAA-BB-EEEEEEEEEE',
    purpose:
      'Formato simplificado pero trazable, utilizado en los menús desplegables (dropdowns) de Oracle/JEDI, ideal para los flujos operativos diarios de compra.',
    example: '204-53-0000012345',
    icon: ShoppingCart,
  },
  {
    title: 'Para Licitaciones Públicas / Concursos',
    format: 'AAA',
    purpose:
      'Clasificación de alto nivel basada únicamente en la clase NIGP, útil para la publicación de RFPs o para estudios de mercado.',
    example: '204 (Equipos de Oficina)',
    icon: FileText,
  },
  {
    title: 'Para Planificación Presupuestaria (Opcional)',
    format: 'AAA-BB-DD',
    purpose:
      'Permite resumir las compras por categoría y tipo de adquisición entre agencias, siendo útil para proyecciones fiscales y estrategias de abastecimiento.',
    example: '204-53-03',
    icon: Building2,
  },
  {
    title: 'Para el Registro Maestro Completo',
    format: 'AAA-BB-CCC-DD-EEEEEEEEEE',
    purpose:
      'Código completo de inteligencia con trazabilidad total, datos de origen y control sobre el ciclo de vida y la titularidad del ítem.',
    example: '204-53-105-02-0000012345',
    icon: Code,
  },
]

function AIAgentCard({
  delay,
  stepNumber,
  title,
  description,
  icon: Icon,
  color,
  status,
  output,
}: {
  delay: number
  stepNumber: number
  title: string
  description: string
  icon: React.ElementType
  color: string
  status: string
  output: string
}) {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-xl blur-lg`} />
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-lg relative`}
            >
              <Icon className="w-6 h-6 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#0B1F3B] border-2 border-white/20 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{stepNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-bold text-white">{title}</h4>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#FF8C00] rounded-full animate-pulse" />
                <span className="text-[10px] text-[#FF8C00] font-semibold uppercase">{status}</span>
              </div>
            </div>
            <p className="text-xs text-white/60 mb-3">{description}</p>
            <div className="bg-[#0B1F3B] rounded-lg p-3 border border-white/10">
              <p className="text-white/50 text-[10px] mb-1 uppercase tracking-wide">Output:</p>
              <p className="text-white text-xs leading-relaxed">{output}</p>
            </div>
          </div>
        </div>
        <div className="absolute left-[30px] -bottom-6 w-0.5 h-6 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </motion.div>
  )
}

export default function Informacion() {
  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2F80FF] to-[#7B2CFF] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">ASG Item Master List</h1>
              <p className="text-sm text-[#475569] mt-1">
                Creación de identificadores únicos ASG y modelo sostenible de mantenimiento inteligente con IA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#F6F8FC] to-white rounded-xl border border-[#E2E8F0] p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#0B1F3B] rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-[#0F172A]">¿Qué es el Item Master de ASG?</h2>
          </div>

          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            El <span className="font-semibold text-[#0B1F3B]">ASG Item Master List</span> es el registro central
            y estandarizado de los bienes y servicios que la Administración de Servicios Generales de Puerto Rico
            (ASG) adquiere, administra o pone a disposición de las entidades gubernamentales.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2F80FF]/10 to-[#7B2CFF]/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-6 hover:border-[#2F80FF]/30 transition-all shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2F80FF] to-[#7B2CFF] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#0F172A] mb-2">Función dentro de ASG</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Centraliza y organiza los artículos y servicios utilizados en los procesos de compra pública de ASG.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/10 to-[#F59E0B]/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-6 hover:border-[#EF4444]/30 transition-all shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-[#EF4444] to-[#F59E0B] rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-[#0F172A] mb-2">Problema que resuelve</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Reduce duplicidad de ítems, descripciones inconsistentes y errores de clasificación.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/10 to-[#10B981]/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-6 hover:border-[#16A34A]/30 transition-all shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-[#16A34A] to-[#10B981] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#0F172A] mb-2">Valor para la institución</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Permite a ASG desarrollar Item IDs estandarizados con apoyo de inteligencia artificial.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Process Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3B] via-[#0d2440] to-[#0B1F3B]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#60A5FA 1px, transparent 1px), linear-gradient(90deg, #60A5FA 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF8C00]/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#2F80FF]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

          <div className="relative z-10 p-8 md:p-12">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-[#FF8C00] rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[#FF8C00] uppercase tracking-wider">Live AI Processing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Cómo Funciona el Proceso de Creación del Item Master
              </h2>
              <p className="text-white/70 text-sm max-w-2xl mx-auto">
                Un pipeline inteligente de agentes especializados que transforman datos crudos en registros estructurados
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Raw Data Input */}
              <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444]/20 to-[#F59E0B]/20 rounded-2xl blur-xl" />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#EF4444] to-[#F59E0B] rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">Datos Crudos de Entrada</h3>
                          <span className="px-2 py-0.5 bg-[#EF4444]/20 text-[#FCA5A5] text-[10px] font-semibold rounded-full uppercase">Raw Data</span>
                        </div>
                        <p className="text-white/60 text-sm mb-4">Descripción del producto sin procesar desde requisiciones</p>
                        <div className="bg-[#0B1F3B] rounded-lg p-4 border border-white/10 font-mono text-xs">
                          <p className="text-white/50 mb-1">// Ejemplo de entrada:</p>
                          <p className="text-[#60A5FA]">&quot;COMPUTADORA PORTATIL HP ELITEBOOK 840 G8 INTEL CORE I7 16GB RAM 512GB SSD WINDOWS 11 PRO PANTALLA 14 PULGADAS&quot;</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center my-6">
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[#FF8C00]">
                    <ArrowDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>

              <AIAgentCard delay={0.3} stepNumber={1} title="Standardize Description" description="Limpia y normaliza la descripción del producto" icon={FileCheck} color="from-[#2F80FF] to-[#1E40AF]" status="Processing" output="Computadora Portátil HP EliteBook 840 G8, Intel Core i7, 16GB RAM, 512GB SSD" />
              <AIAgentCard delay={0.4} stepNumber={2} title="Generate Product Name" description="Crea un nombre estandarizado y conciso" icon={Tag} color="from-[#7C3AED] to-[#6D28D9]" status="Processing" output="HP EliteBook 840 G8 Core i7 16GB 512GB" />
              <AIAgentCard delay={0.5} stepNumber={3} title="Assign NIGP Code" description="Clasifica el producto en la categoría NIGP correcta" icon={Code} color="from-[#10B981] to-[#059669]" status="Processing" output="NIGP: 204-53 (Microcomputadoras Portátiles)" />
              <AIAgentCard delay={0.6} stepNumber={4} title="Categorize Product/Service" description="Determina si es un producto físico o servicio" icon={Network} color="from-[#F59E0B] to-[#D97706]" status="Processing" output="Tipo: Producto" />

              {/* Final Output */}
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }} className="lg:col-span-2">
                <div className="flex justify-center mb-6">
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="text-[#10B981]">
                    <ArrowDown className="w-6 h-6" />
                  </motion.div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/30 to-[#16A34A]/30 rounded-2xl blur-2xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-[#10B981]/40 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#10B981]/50">
                        <Cpu className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">ASG-ITEM-ID Generado</h3>
                          <span className="px-3 py-1 bg-[#10B981]/20 text-[#86EFAC] text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete
                          </span>
                        </div>
                        <div className="bg-[#0B1F3B] rounded-lg p-5 border border-[#10B981]/30 mt-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-white/50 text-xs mb-1">ASG-ITEM-ID:</p>
                              <p className="font-mono text-lg font-bold text-[#10B981] tracking-wider">204-53-024-02-0000012847</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-white/50 mb-1">Nombre:</p>
                                <p className="text-white">HP EliteBook 840 G8 Core i7 16GB 512GB</p>
                              </div>
                              <div>
                                <p className="text-white/50 mb-1">Categoría NIGP:</p>
                                <p className="text-white">204-53 (Microcomputadoras)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">Procesado</p>
                            <p className="text-white text-lg font-bold">0.8s</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">Precisión</p>
                            <p className="text-[#10B981] text-lg font-bold">99.2%</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">Ahorro</p>
                            <p className="text-[#FF8C00] text-lg font-bold">10min</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Objetivo Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-[#0B1F3B]" />
            <h2 className="text-xl font-semibold text-[#0F172A]">Objetivo</h2>
          </div>
          <Card className="border-[#E2E8F0] shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                El objetivo principal del Item Master es convertirse en el{' '}
                <span className="font-semibold text-[#0B1F3B]">
                  catálogo maestro único (&quot;single source of truth&quot;)
                </span>{' '}
                de todos los bienes y servicios que compra el Gobierno de Puerto Rico a través de ASG.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { color: 'bg-[#2F80FF]', title: 'Estandarizar y consolidar', desc: 'Un universo grande de ítems (299,986+ registros) que hoy está fragmentado.' },
                  { color: 'bg-[#7B2CFF]', title: 'Prevenir duplicación futura', desc: 'Obligando a que requisiciones/POs se anclen a un identificador único.' },
                  { color: 'bg-[#16A34A]', title: 'Habilitar compras trazables', desc: 'Compras "compliant" con auditoría, control y estandarización por NIGP.' },
                  { color: 'bg-[#F59E0B]', title: 'Mejorar analítica y decisiones', desc: 'Gasto por ítem, tendencias de uso, distribución por categorías.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 flex-shrink-0`} />
                    <div>
                      <p className="text-sm text-[#0F172A] font-medium mb-1">{item.title}</p>
                      <p className="text-xs text-[#64748B]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ASG-ITEM-ID Structure */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-[#0B1F3B]" />
            <h2 className="text-xl font-semibold text-[#0F172A]">ASG-ITEM-ID: Estructura del Código</h2>
          </div>
          <Card className="border-[#E2E8F0] shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="bg-[#0B1F3B] rounded-lg p-6 mb-6">
                <div className="text-center mb-3">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-wide mb-2">Formato Completo</p>
                  <div className="font-mono text-3xl font-bold text-white tracking-wider text-tabular">
                    AAA-BB-CCC-DD-EEEEEEEEEE
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-6">
                  {[
                    { code: 'AAA', label: 'Clase NIGP', bg: 'bg-[#2F80FF]' },
                    { code: 'BB', label: 'Ítem NIGP', bg: 'bg-[#4F8FFF]' },
                    { code: 'CCC', label: 'Agencia', bg: 'bg-[#6F9FFF]' },
                    { code: 'DD', label: 'Método', bg: 'bg-[#8FAFFF]' },
                    { code: 'EEEE...', label: 'Secuencia', bg: 'bg-[#AFBFFF]' },
                  ].map((s) => (
                    <div key={s.code} className="text-center">
                      <div className={`${s.bg} text-white px-2 py-1 rounded text-xs font-mono font-semibold mb-1`}>{s.code}</div>
                      <p className="text-[10px] text-[#94A3B8]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#E2E8F0]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide">Parte</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide">Longitud</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide">Fuente/Significado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0B1F3B]">AAA</td>
                      <td className="px-4 py-3 text-[#475569]">3 dígitos</td>
                      <td className="px-4 py-3 text-[#475569]">Clase NIGP</td>
                    </tr>
                    <tr className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0B1F3B]">BB</td>
                      <td className="px-4 py-3 text-[#475569]">2 dígitos</td>
                      <td className="px-4 py-3 text-[#475569]">Ítem NIGP (Detalle)</td>
                    </tr>
                    <tr className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0B1F3B]">CCC</td>
                      <td className="px-4 py-3 text-[#475569]">3 dígitos</td>
                      <td className="px-4 py-3 text-[#475569]">Agencia solicitante (ID interno de las 105 agencias)</td>
                    </tr>
                    <tr className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0B1F3B]">DD</td>
                      <td className="px-4 py-3 text-[#475569]">2 dígitos</td>
                      <td className="px-4 py-3">
                        <p className="text-[#475569] mb-2">Método de adquisición:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {metodosAdquisicion.map((m) => (
                            <div key={m.code} className="flex items-center gap-2 text-xs">
                              <span className="font-mono font-semibold text-[#0B1F3B] bg-[#F1F5F9] px-2 py-0.5 rounded">{m.code}</span>
                              <span className="text-[#64748B]">{m.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0B1F3B]">EEEEEEEEEE</td>
                      <td className="px-4 py-3 text-[#475569]">10 dígitos</td>
                      <td className="px-4 py-3 text-[#475569]">Secuencia cronológica del ítem</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-[#ECFDF5] border border-[#16A34A]/20 rounded-lg">
                <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide mb-2">Ejemplo Completo</p>
                <div className="font-mono text-2xl font-bold text-[#0F172A] tracking-wider text-tabular">
                  207-30-024-03-0000014589
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Casos de Uso */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-[#0B1F3B]" />
            <h2 className="text-xl font-semibold text-[#0F172A]">Diferentes Casos de Uso del Código</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {casosUso.map((caso, index) => {
              const Icon = caso.icon
              return (
                <Card key={index} className="border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-1 gradient-accent" />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#0B1F3B]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{caso.title}</h3>
                        <div className="font-mono text-xs font-semibold text-[#2F80FF] bg-[#EEF2FF] px-2 py-1 rounded inline-block">
                          {caso.format}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-3">{caso.purpose}</p>
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2">
                      <p className="text-[10px] text-[#64748B] uppercase tracking-wide mb-1">Ejemplo:</p>
                      <p className="font-mono text-sm font-semibold text-[#0F172A] text-tabular">{caso.example}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#92400E] mb-1">Nota Importante</p>
            <p className="text-xs text-[#78350F] leading-relaxed">
              El código completo AAA-BB-CCC-DD-EEEEEEEEEE se utiliza únicamente en el Item Master List centralizado.
              Para otros contextos operativos, se utilizan versiones simplificadas del código según el caso de uso específico.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
