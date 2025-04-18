import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { OpenAPIParameter } from "@/lib/openapi-parser"

interface ParametersTableProps {
  parameters: OpenAPIParameter[]
}

export function ParametersTable({ parameters }: ParametersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Located in</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Required</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parameters.map((param) => (
          <TableRow key={`${param.in}-${param.name}`}>
            <TableCell className="font-medium">{param.name}</TableCell>
            <TableCell>{param.in}</TableCell>
            <TableCell>{param.description || "-"}</TableCell>
            <TableCell>{param.schema?.type || "-"}</TableCell>
            <TableCell>
              {param.required ? (
                <Badge variant="destructive">Required</Badge>
              ) : (
                <Badge variant="outline">Optional</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
