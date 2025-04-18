"use client"

import { useState, memo } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SchemaViewerProps {
  schema: any
  name?: string
  required?: boolean
  depth?: number
}

// Use memo to prevent unnecessary re-renders
const SchemaViewer = memo(function SchemaViewer({ schema, name, required = false, depth = 0 }: SchemaViewerProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)

  // Calculate these values once
  const isObject = schema.type === "object" || schema.properties
  const isArray = schema.type === "array" || schema.items
  const hasChildren = isObject || isArray
  const indent = depth * 20

  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case "string":
        return "text-green-600 dark:text-green-400"
      case "number":
      case "integer":
        return "text-blue-600 dark:text-blue-400"
      case "boolean":
        return "text-purple-600 dark:text-purple-400"
      case "object":
        return "text-amber-600 dark:text-amber-400"
      case "array":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const renderType = () => {
    if (isObject) return "object"
    if (isArray) return `array of ${schema.items?.type || "items"}`
    return schema.type || "any"
  }

  // Don't render properties if not expanded
  if (!isExpanded && depth > 0) {
    return (
      <div style={{ marginLeft: `${indent}px` }} className="py-1">
        <div className="flex items-center">
          {hasChildren && (
            <button type="button" onClick={() => setIsExpanded(true)} className="mr-1 p-1 rounded-sm hover:bg-muted">
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
          {name && (
            <span className={cn("font-mono text-sm", required ? "font-bold" : "")}>
              {name}
              {required && <span className="text-red-500 ml-0.5">*</span>}:
            </span>
          )}
          <span className={cn("ml-2 text-sm", getTypeColor(schema.type))}>{renderType()}</span>
          {schema.format && <span className="ml-1 text-xs text-muted-foreground">({schema.format})</span>}
          {schema.description && <span className="ml-2 text-xs text-muted-foreground">- {schema.description}</span>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginLeft: `${indent}px` }} className="py-1">
      <div className="flex items-center">
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-1 p-1 rounded-sm hover:bg-muted"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
        {name && (
          <span className={cn("font-mono text-sm", required ? "font-bold" : "")}>
            {name}
            {required && <span className="text-red-500 ml-0.5">*</span>}:
          </span>
        )}
        <span className={cn("ml-2 text-sm", getTypeColor(schema.type))}>{renderType()}</span>
        {schema.format && <span className="ml-1 text-xs text-muted-foreground">({schema.format})</span>}
        {schema.description && <span className="ml-2 text-xs text-muted-foreground">- {schema.description}</span>}
      </div>

      {/* Only render children if expanded */}
      {isExpanded && (
        <>
          {isObject && schema.properties && (
            <div className="mt-2 space-y-2">
              {Object.entries(schema.properties).map(([propName, propSchema]: [string, any]) => (
                <SchemaViewer
                  key={propName}
                  schema={propSchema}
                  name={propName}
                  required={schema.required?.includes(propName)}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}

          {isArray && schema.items && (
            <div className="mt-2 pl-4 border-l-2 border-muted">
              <SchemaViewer schema={schema.items} depth={depth + 1} />
            </div>
          )}
        </>
      )}
    </div>
  )
})

export { SchemaViewer }
