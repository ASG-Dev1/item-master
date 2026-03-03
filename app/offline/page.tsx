import { Card } from '@/components/ui/card'
import { ShieldX } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="max-w-md w-full mx-4 p-8 text-center space-y-4">
        <ShieldX className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground">
          Su sesión ha expirado o el enlace de acceso no es válido.
          Por favor, inicie sesión nuevamente desde el portal JEDI.
        </p>
      </Card>
    </div>
  )
}
