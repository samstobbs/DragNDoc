"use client"

import { useState, useCallback } from "react"
import { Check, Copy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SchemaViewer } from "@/components/docs/schema-viewer"
import type { OpenAPIResponse } from "@/lib/openapi-parser"

interface ResponsesTableProps {
  responses: Record<string, OpenAPIResponse>
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = useCallback(
    (text: string, id: string) => {
      if (copiedId) return // Prevent multiple clicks

      navigator.clipboard.writeText(text)
      setCopiedId(id)

      // Clear the copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    },
    [copiedId],
  )

  const getStatusColor = useCallback((status: string) => {
    const code = Number.parseInt(status, 10)
    if (isNaN(code)) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"

    if (code >= 200 && code < 300) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    } else if (code >= 300 && code < 400) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    } else if (code >= 400 && code < 500) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
    } else if (code >= 500) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }

    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }, [])

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(responses).map(([status, response]) => (
            <TableRow key={status}>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(status)}>
                  {status}
                </Badge>
              </TableCell>
              <TableCell>{response.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {Object.entries(responses).map(([status, response]) => {
        if (!response.content) return null

        return Object.entries(response.content).map(([contentType, content]) => {
          if (!content.schema && !content.example) return null

          const exampleId = `${status}-${contentType}`

          return (
            <div key={exampleId} className="space-y-4 rounded-md border p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(status)}>
                  {status}
                </Badge>
                <span className="text-sm font-medium">{contentType}</span>
              </div>

              {content.schema && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Response Schema</h4>
                  <SchemaViewer schema={content.schema} />
                </div>
              )}

              {content.example && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Example Response</h4>
                  <div className="relative">
                    <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                      {JSON.stringify(content.example, null, 2)}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-8 gap-1 text-xs"
                      onClick={() => copyToClipboard(JSON.stringify(content.example, null, 2), exampleId)}
                    >
                      {copiedId === exampleId ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })
      })}
    </div>
  )
}
