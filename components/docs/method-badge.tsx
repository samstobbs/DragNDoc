import { cn } from "@/lib/utils"

interface MethodBadgeProps {
  method: string
  className?: string
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "get":
        return "bg-green-500 text-white"
      case "post":
        return "bg-blue-500 text-white"
      case "put":
        return "bg-amber-500 text-white"
      case "delete":
        return "bg-red-500 text-white"
      case "patch":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase",
        getMethodColor(method),
        className,
      )}
    >
      {method}
    </span>
  )
}
