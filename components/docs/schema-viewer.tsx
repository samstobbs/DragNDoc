"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SchemaViewerProps {
  schema: any
  name?: string
  required?: boolean
  depth?: number
}

export function SchemaViewer({ schema, name, required = false, depth = 0 }: SchemaViewerProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)
  const isObject = schema.type === "object" || schema.properties
  const isArray = schema.type === "array" || schema.items
  const hasChildren = isObject || isArray
  const indent = depth * 20

  const renderType = () => {
    if (isObject) return "object"
    if (isArray) return `array of ${schema.items?.type || "items"}`
    return schema.type || "any"
  }

  const renderProperties = () => {
    if (!isExpanded) return null

    if (isObject && schema.properties) {
      return (
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
      )
    }

    if (isArray && schema.items) {
      return (
        <div className="mt-2 pl-4 border-l-2 border-muted">
          <SchemaViewer schema={schema.items} depth={depth + 1} />
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ marginLeft: `${indent}px` }}>
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
        <span className="ml-2 text-sm text-muted-foreground">{renderType()}</span>
        {schema.description && <span className="ml-2 text-xs text-muted-foreground">- {schema.description}</span>}
      </div>
      {renderProperties()}
    </div>
  )
}
