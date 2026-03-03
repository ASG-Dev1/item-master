import { Card } from '@/components/ui/card'
import { Package, Edit, Zap, CircleSlash, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: 'package' | 'edit' | 'zap' | 'circle-slash'
}

const iconMap = {
  package: Package,
  edit: Edit,
  zap: Zap,
  'circle-slash': CircleSlash,
}

export default function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const IconComponent = iconMap[icon]

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-muted rounded-lg">
          <IconComponent className="w-5 h-5 text-foreground" />
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
      <h3 className="text-xl text-muted-foreground">{title}</h3>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
          {change}
        </span>
      </div>
    </Card>
  )
}
