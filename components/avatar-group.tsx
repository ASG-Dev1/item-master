import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarGroupProps {
  avatars: Array<{
    initials: string
    color: string
  }>
}

export function AvatarGroup({ avatars }: AvatarGroupProps) {
  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, 3).map((avatar, index) => (
        <div
          key={index}
          className={cn(`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-background`)}
        >
          {avatar.initials}
        </div>
      ))}
      {avatars.length > 3 && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-background">
          +{avatars.length - 3}
        </div>
      )}
    </div>
  )
}
