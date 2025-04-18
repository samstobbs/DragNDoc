"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OpenAPISpec } from "@/lib/openapi-parser"

interface DebugPanelProps {
  spec: OpenAPISpec
  rawContent: any
}

export function DebugPanel({ spec, rawContent }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mt-8">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Debug Information</CardTitle>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">OpenAPI Version</h3>
              <p className="text-sm text-muted-foreground">{spec.openapi}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Paths</h3>
              <p className="text-sm text-muted-foreground">{Object.keys(spec.paths).length} paths defined</p>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.keys(spec.paths)
                  .slice(0, 5)
                  .map((path) => (
                    <li key={path} className="font-mono">
                      {path}
                    </li>
                  ))}
                {Object.keys(spec.paths).length > 5 && <li>...</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Raw Content (First 500 chars)</h3>
              <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-muted p-2 text-xs">
                {JSON.stringify(rawContent, null, 2).substring(0, 500)}...
              </pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Raw OpenAPI Spec:", rawContent)}
              className="mt-2"
            >
              Log Full Spec to Console
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
