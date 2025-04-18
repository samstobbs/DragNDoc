import { cn } from "@/lib/utils"
import { Flame } from "lucide-react"

interface LogoProps {
  className?: string
  textClassName?: string
  iconClassName?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, textClassName, iconClassName, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Flame className={cn("text-primary-500 animate-fire-pulse", iconSizes[size], iconClassName)} />
      </div>
      {showText && (
        <span className={cn("font-heading font-bold dragon-text-gradient", sizeClasses[size], textClassName)}>
          DragNDoc
        </span>
      )}
    </div>
  )
}
