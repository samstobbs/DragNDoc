"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface DragHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
  children?: React.ReactNode
}

const DragHandle = React.forwardRef<HTMLDivElement, DragHandleProps>(
  ({ className, onDragStart, onDragEnd, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("drag-handle", className)}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        {...props}
      >
        {children || <GripVertical className="h-4 w-4" />}
      </div>
    )
  },
)
DragHandle.displayName = "DragHandle"

export { DragHandle }
