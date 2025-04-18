import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SchemaViewer } from "@/components/docs/schema-viewer"
import type { OpenAPIResponse } from "@/lib/openapi-parser"

interface ResponsesTableProps {
  responses: Record<string, OpenAPIResponse>
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
  return (
    <div className="space-y-4">
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
              <TableCell className="font-medium">{status}</TableCell>
              <TableCell>{response.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {Object.entries(responses).map(([status, response]) => {
        if (!response.content) return null

        return Object.entries(response.content).map(([contentType, content]) => {
          if (!content.schema) return null

          return (
            <div key={`${status}-${contentType}`} className="mt-4">
              <h4 className="mb-2 text-sm font-medium">
                Response {status} ({contentType})
              </h4>
              <SchemaViewer schema={content.schema} />
              {content.example && (
                <div className="mt-4">
                  <h5 className="mb-2 text-sm font-medium">Example:</h5>
                  <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                    {JSON.stringify(content.example, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )
        })
      })}
    </div>
  )
}
