"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DragContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  isDragActive?: boolean
  children: React.ReactNode
}

const DragContainer = React.forwardRef<HTMLDivElement, DragContainerProps>(
  ({ className, onDrop, onDragOver, onDragLeave, isDragActive = false, children, ...props }, ref) => {
    const [isHovering, setIsHovering] = React.useState(false)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsHovering(true)
      if (onDragOver) onDragOver(e)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsHovering(false)
      if (onDragLeave) onDragLeave(e)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsHovering(false)
      if (onDrop) onDrop(e)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "drag-indicator",
          isDragActive ? "drag-indicator-active" : isHovering ? "drag-indicator-hover" : "drag-indicator-idle",
          className,
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DragContainer.displayName = "DragContainer"

export { DragContainer }
