'use client'

import { useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ShoppingCart,
  Settings,
  Check,
  X,
} from 'lucide-react'

const mockRequisitions = {
  pendientes: [
    {
      id: '2022-001',
      fechaRecibo: '2021-07-16',
      numeroCaso: '22J-00006',
      idRequisicion: 6,
      agencia: 'Junta Reglamentadora de Servicio Público',
      items: 5,
      total: 15420.5,
      status: 'Pendiente',
    },
    {
      id: '2022-002',
      fechaRecibo: '2021-08-22',
      numeroCaso: '22J-00012',
      idRequisicion: 12,
      agencia: 'Departamento de Hacienda',
      items: 3,
      total: 8240,
      status: 'Pendiente',
    },
  ],
  enProgreso: [
    {
      id: '2022-003',
      fechaRecibo: '2021-09-10',
      numeroCaso: '22J-00015',
      idRequisicion: 15,
      agencia: 'Power Equipment PR',
      items: 2,
      total: 1875,
      status: 'En Progreso',
      procesados: 1,
      totalItems: 2,
    },
  ],
  completadas: [],
}

const mockItem = {
  requisicionId: '2022-001',
  total: 15420.5,
  proveedor: 'Tech Solutions PR',
  status: 'Pendiente',
  items: [
    {
      id: 1,
      description: 'Aire Acondicionado 48000 BTU Daikin',
      cantidad: 2,
      precioUnit: 3890,
      total: 7780,
      sugerencia: {
        confianza: 95,
        asgItemId: '031-02-002-01-0000000058',
        nombre: 'Adquisicion Unidad A/C 48,000Btu Daikin Aruf',
        marca: 'Daikin',
        categoria: 'Equipos HVAC',
        precioCatalogo: 3890,
        modelo: 'Aruf',
      },
    },
  ],
  procesados: 0,
  totalItems: 5,
}

export default function QADashboard() {
  const [activeTab, setActiveTab] = useState('pendientes')
  const [selectedRequisicion, setSelectedRequisicion] = useState(
    mockRequisitions.pendientes[0]
  )

  const summaryCards = [
    {
      title: 'Pendientes',
      value: `${mockRequisitions.pendientes.length} Requisiciones`,
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      title: 'En Progreso',
      value: `${mockRequisitions.enProgreso.length} Requisiciones`,
      icon: TrendingUp,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Completadas',
      value: `${mockRequisitions.completadas.length} Requisiciones`,
      icon: CheckCircle2,
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Total Items',
      value: '10 Para revisar',
      icon: ShoppingCart,
      bgColor: 'bg-white dark:bg-gray-900',
      iconColor: 'text-gray-600 dark:text-gray-400',
      borderColor: 'border-gray-200 dark:border-gray-800',
    },
  ]

  const getStatusBadge = (status: string) => {
    if (status === 'Pendiente') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700">
          {status}
        </Badge>
      )
    }
    if (status === 'En Progreso') {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700">
          {status}
        </Badge>
      )
    }
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700">
        {status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-6">QA</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card
                key={index}
                className={cn(
                  card.bgColor,
                  card.borderColor,
                  'border-2'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {card.title}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {card.value}
                      </p>
                    </div>
                    <Icon className={cn('w-8 h-8', card.iconColor)} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - Requisiciones */}
          <div className="space-y-4">
            <Card className="border-2 border-purple-200 dark:border-purple-800 rounded-t-lg overflow-hidden pt-0">
              <div className="bg-purple-600 text-white p-4 h-16 flex items-center">
                <CardTitle className="text-xl font-bold">Requisiciones</CardTitle>
              </div>
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full rounded-none border-b bg-gray-100 dark:bg-gray-900">
                    <TabsTrigger value="pendientes" className="flex-1">
                      Pendientes
                    </TabsTrigger>
                    <TabsTrigger value="enProgreso" className="flex-1">
                      En Progreso
                    </TabsTrigger>
                    <TabsTrigger value="completadas" className="flex-1">
                      Completadas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pendientes" className="p-4 space-y-4">
                    {mockRequisitions.pendientes.map((req) => (
                      <Card
                        key={req.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedRequisicion(req)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-foreground">
                                Requisición {req.id}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {req.agencia}
                              </p>
                            </div>
                            {getStatusBadge(req.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Fecha Recibo:
                              </span>{' '}
                              <span className="font-medium">{req.fechaRecibo}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Número de Caso:
                              </span>{' '}
                              <span className="font-medium">{req.numeroCaso}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                ID Requisición:
                              </span>{' '}
                              <span className="font-medium">{req.idRequisicion}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-sm text-muted-foreground">
                              {req.items} items
                            </span>{' '}
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              ${req.total.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="enProgreso" className="p-4 space-y-4">
                    {mockRequisitions.enProgreso.map((req) => (
                      <Card
                        key={req.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedRequisicion(req)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-foreground">
                                Requisición {req.id}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {req.agencia}
                              </p>
                            </div>
                            {getStatusBadge(req.status)}
                          </div>
                          {req.procesados !== undefined && (
                            <div className="mb-3">
                              <Progress
                                value={(req.procesados / req.totalItems) * 100}
                                className="h-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {req.procesados}/{req.totalItems} procesados
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Fecha Recibo:
                              </span>{' '}
                              <span className="font-medium">{req.fechaRecibo}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Número de Caso:
                              </span>{' '}
                              <span className="font-medium">{req.numeroCaso}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              ${req.total.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="completadas" className="p-4">
                    <p className="text-center text-muted-foreground py-8">
                      No hay requisiciones completadas
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Item Review with AI Suggestions */}
          <div className="space-y-4">
            <Card className="border-2 border-purple-200 dark:border-purple-800 rounded-t-lg overflow-hidden pt-0">
              <div className="bg-purple-600 text-white p-4 h-16 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <CardTitle className="text-xl font-bold">
                    Revisión de Items - Sugerencias AI
                  </CardTitle>
                </div>
                <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-700">
                  {mockItem.procesados}/{mockItem.totalItems} Procesados
                </Badge>
              </div>
              <CardContent className="p-4 space-y-4">
                {/* Requisición Details */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Requisición:</span>
                        <span className="text-sm font-bold">{mockItem.requisicionId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Total:</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          ${mockItem.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Proveedor:</span>
                        <span className="text-sm">{mockItem.proveedor}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Estado:</span>
                        {getStatusBadge(mockItem.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Item Details */}
                {mockItem.items.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold text-lg mb-3">ITEM #{item.id}</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-semibold">Description:</span>
                            <p className="text-sm">{item.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-sm font-semibold">Cantidad:</span>
                              <span className="text-sm ml-2">{item.cantidad}</span>
                            </div>
                            <div>
                              <span className="text-sm font-semibold">Precio Unit:</span>
                              <span className="text-sm ml-2">
                                ${item.precioUnit.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-semibold">Total:</span>
                            <span className="text-sm ml-2 font-bold text-green-600 dark:text-green-400">
                              ${item.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Suggestion */}
                    <Card className="bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold text-sm">
                            Sugerencia AI del Item Master
                          </h5>
                          <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-700">
                            95% confianza
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold">ASG-ITEM-ID:</span>
                            <a
                              href="#"
                              className="text-blue-600 dark:text-blue-400 underline ml-2"
                            >
                              {item.sugerencia.asgItemId}
                            </a>
                          </div>
                          <div>
                            <span className="font-semibold">Nombre:</span>
                            <span className="ml-2">{item.sugerencia.nombre}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Marca:</span>
                            <span className="ml-2">{item.sugerencia.marca}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Categoría:</span>
                            <span className="ml-2">{item.sugerencia.categoria}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Precio Catálogo:</span>
                            <span className="ml-2 font-bold text-green-600 dark:text-green-400">
                              ${item.sugerencia.precioCatalogo.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Modelo:</span>
                            <span className="ml-2">{item.sugerencia.modelo}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Aceptar Sugerencia
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
