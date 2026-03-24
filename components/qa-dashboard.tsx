'use client'

import { useState } from 'react'
import RequisitionCard, { type Requisition } from './requisition-card'
import ProductReviewCard, { type ProductToReview } from './product-review-card'
import QAProgressDashboard from './qa-progress-dashboard'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

const mockRequisitions: Requisition[] = [
  {
    id: '1',
    requisitionNumber: 'REQ-2024-001',
    agency: 'Departamento de Hacienda',
    submittedDate: '15 Mar 2024',
    productCount: 5,
    reviewedCount: 2,
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: '2',
    requisitionNumber: 'REQ-2024-002',
    agency: 'Departamento de Seguridad Pública',
    submittedDate: '14 Mar 2024',
    productCount: 8,
    reviewedCount: 0,
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '3',
    requisitionNumber: 'REQ-2024-003',
    agency: 'Departamento de Estado',
    submittedDate: '13 Mar 2024',
    productCount: 3,
    reviewedCount: 3,
    status: 'completed',
    priority: 'low',
  },
  {
    id: '4',
    requisitionNumber: 'REQ-2024-004',
    agency: 'Departamento de Educación',
    submittedDate: '12 Mar 2024',
    productCount: 12,
    reviewedCount: 0,
    status: 'pending',
    priority: 'high',
  },
]

const mockProducts: Record<string, ProductToReview[]> = {
  '1': [
    {
      id: 'p1',
      name: 'Laptop Dell Latitude 5520',
      description: 'Laptop empresarial con procesador Intel Core i7, 16GB RAM, 512GB SSD',
      price: 1299.99,
      category: 'Microcomputadoras',
      subcategory: 'Laptops y notebooks',
      agency: 'Departamento de Hacienda',
      brand: 'Dell',
      model: 'Latitude 5520',
      aiMatch: {
        found: true,
        confidence: 95,
        existingProduct: {
          asgItemId: '204-54-005-05-0000000171',
          name: 'Laptops Dell Latitude 15',
          price: 1099.66,
          category: 'Microcomputadoras',
          subcategory: 'Laptops y notebooks',
          brand: 'Dell',
          model: 'Dell Latitude 5520 Xcto',
        },
      },
    },
    {
      id: 'p2',
      name: 'Monitor Dell 24 Pulgadas',
      description: 'Monitor LED 24" Full HD con soporte ajustable',
      price: 156.33,
      category: 'Microcomputadoras',
      subcategory: 'Monitores color y monocromo',
      agency: 'Departamento de Hacienda',
      brand: 'Dell',
      model: 'P2419H',
      aiMatch: {
        found: true,
        confidence: 98,
        existingProduct: {
          asgItemId: '204-60-005-06-0000000175',
          name: 'Dell Monitor 23.5',
          price: 156.33,
          category: 'Microcomputadoras',
          subcategory: 'Monitores color y monocromo',
          brand: 'Dell',
          model: 'Dell 24 P2419H',
        },
      },
    },
    {
      id: 'p3',
      name: 'Teclado y Mouse Dell USB',
      description: 'Kit de teclado y mouse USB para computadora',
      price: 20.0,
      category: 'Periféricos de computador',
      subcategory: 'Teclados y ratones USB',
      agency: 'Departamento de Hacienda',
      brand: 'Dell',
      model: 'MS116',
      aiMatch: {
        found: true,
        confidence: 92,
        existingProduct: {
          asgItemId: '207-66-005-01-0000000174',
          name: 'Dell Usb Keyboard And Dell Usb Mouse',
          price: 20.0,
          category: 'Periféricos de computador',
          subcategory: 'Teclados y ratones USB',
          brand: 'Dell',
          model: 'Dell Ms116',
        },
      },
    },
    {
      id: 'p4',
      name: 'Sistema de Videoconferencia Logitech',
      description: 'Cámara web HD 1080p con micrófono integrado para reuniones virtuales',
      price: 299.99,
      category: 'Equipos Audiovisuales',
      subcategory: 'Cámaras de videoconferencia',
      agency: 'Departamento de Hacienda',
      brand: 'Logitech',
      model: 'Rally Bar',
      aiMatch: { found: false, confidence: 0 },
      newItemId: '840-92-002-01-0000002450',
    },
    {
      id: 'p5',
      name: 'Impresora Multifuncional HP LaserJet Pro',
      description: 'Impresora láser multifuncional con escáner, copiadora y WiFi',
      price: 449.99,
      category: 'Equipos de oficina',
      subcategory: 'Impresoras multifuncionales',
      agency: 'Departamento de Hacienda',
      brand: 'HP',
      model: 'LaserJet Pro MFP M428fdw',
      aiMatch: { found: false, confidence: 0 },
      newItemId: '600-48-002-01-0000002451',
    },
  ],
  '2': [
    {
      id: 'p6',
      name: 'Aire Acondicionado Mini Split 18,000 BTU',
      description: 'Unidad de aire acondicionado tipo mini split montaje en pared',
      price: 1058.0,
      category: 'Equipos HVAC',
      subcategory: 'Aire acondicionado tipo mini split',
      agency: 'Departamento de Seguridad Pública',
      brand: 'Trane',
      model: 'Clase A',
      aiMatch: {
        found: true,
        confidence: 89,
        existingProduct: {
          asgItemId: '031-72-006-06-0000001014',
          name: 'Acondicionador De Aire Tipo Mini Split (Pared) De 18,000 Btu Y 230 Voltios',
          price: 1058.0,
          category: 'Equipos de HVAC',
          subcategory: 'Unidades Montadas en Pared',
          brand: 'Trane',
          model: 'Clase A Real Capacity',
        },
      },
    },
  ],
}

export default function QADashboard() {
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null)
  const [products, setProducts] = useState<ProductToReview[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedProducts, setReviewedProducts] = useState(0)
  const [approvedMatches, setApprovedMatches] = useState(0)
  const [rejectedMatches, setRejectedMatches] = useState(0)

  const totalProducts = Object.values(mockProducts).flat().length
  const aiAccuracy =
    approvedMatches + rejectedMatches > 0
      ? Math.round((approvedMatches / (approvedMatches + rejectedMatches)) * 100)
      : 85

  const handleRequisitionClick = (requisition: Requisition) => {
    setSelectedRequisition(requisition)
    setProducts(mockProducts[requisition.id] || [])
    setCurrentIndex(0)
  }

  const handleApprove = () => {
    setReviewedProducts((prev) => prev + 1)
    if (products[currentIndex]?.aiMatch?.found) {
      setApprovedMatches((prev) => prev + 1)
    }
    setCurrentIndex((prev) => prev + 1)
  }

  const handleReject = () => {
    setReviewedProducts((prev) => prev + 1)
    if (products[currentIndex]?.aiMatch?.found) {
      setRejectedMatches((prev) => prev + 1)
    }
    setCurrentIndex((prev) => prev + 1)
  }

  const handleBackToList = () => {
    setSelectedRequisition(null)
    setProducts([])
    setCurrentIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9]">
      {/* QA Title with gradient */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#16A34A] to-[#10B981] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Quality Assurance</h1>
              <p className="text-base text-[#475569] mt-1">
                Validación inteligente y control de calidad de datos con IA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8">
        {!selectedRequisition ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Requisitions */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Control de Calidad</h2>
                <p className="text-[#64748B]">
                  Revisa y valida las requisiciones enviadas con asistencia de IA
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-xl p-4 mb-6 border border-[#BFDBFE]">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#0B5FCC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] mb-1">
                      Sistema de Validación Inteligente
                    </p>
                    <p className="text-xs text-[#475569]">
                      Nuestra IA analiza cada producto y sugiere matches automáticos del Item Master.
                      Revisa las sugerencias y aprueba o rechaza según tu criterio profesional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {mockRequisitions.map((requisition) => (
                  <RequisitionCard
                    key={requisition.id}
                    requisition={requisition}
                    onClick={() => handleRequisitionClick(requisition)}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Dashboard */}
            <div className="lg:col-span-1">
              <QAProgressDashboard
                totalRequisitions={mockRequisitions.length}
                reviewedRequisitions={mockRequisitions.filter((r) => r.status === 'completed').length}
                totalProducts={totalProducts}
                reviewedProducts={reviewedProducts}
                approvedMatches={approvedMatches}
                rejectedMatches={rejectedMatches}
                aiAccuracy={aiAccuracy}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Review Cards */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Button
                  onClick={handleBackToList}
                  variant="ghost"
                  className="mb-4 text-[#64748B] hover:text-[#0F172A]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Requisiciones
                </Button>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
                  {selectedRequisition.requisitionNumber}
                </h2>
                <p className="text-[#64748B]">{selectedRequisition.agency}</p>
              </div>

              {currentIndex < products.length ? (
                <div className="relative h-[700px]">
                  <AnimatePresence>
                    {products
                      .slice(currentIndex, currentIndex + 2)
                      .reverse()
                      .map((product, idx) => (
                        <ProductReviewCard
                          key={product.id}
                          product={product}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          isTop={idx === 1}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-12 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                    ¡Requisición Completada!
                  </h2>
                  <p className="text-[#64748B] mb-6">
                    Has revisado todos los productos de esta requisición
                  </p>
                  <Button
                    onClick={handleBackToList}
                    className="bg-gradient-to-r from-[#0B5FCC] to-[#1E40AF] text-white"
                  >
                    Volver a Requisiciones
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Right Column - Progress */}
            <div className="lg:col-span-1">
              <QAProgressDashboard
                totalRequisitions={mockRequisitions.length}
                reviewedRequisitions={mockRequisitions.filter((r) => r.status === 'completed').length}
                totalProducts={totalProducts}
                reviewedProducts={reviewedProducts}
                approvedMatches={approvedMatches}
                rejectedMatches={rejectedMatches}
                aiAccuracy={aiAccuracy}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
