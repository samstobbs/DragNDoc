import { cn } from "@/lib/utils"

interface MethodBadgeProps {
  method: string
  className?: string
  size?: "default" | "lg"
}

export function MethodBadge({ method, className, size = "default" }: MethodBadgeProps) {
  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "get":
        return "bg-emerald-500 text-white"
      case "post":
        return "bg-blue-500 text-white"
      case "put":
        return "bg-amber-500 text-white"
      case "delete":
        return "bg-red-500 text-white"
      case "patch":
        return "bg-purple-500 text-white"
      case "options":
        return "bg-indigo-500 text-white"
      case "head":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium uppercase",
        getMethodColor(method),
        size === "lg" && "px-3 py-1 text-sm",
        className,
      )}
    >
      {method}
    </span>
  )
}
