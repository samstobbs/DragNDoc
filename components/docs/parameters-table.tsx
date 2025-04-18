import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { OpenAPIParameter } from "@/lib/openapi-parser"

interface ParametersTableProps {
  parameters: OpenAPIParameter[]
}

export function ParametersTable({ parameters }: ParametersTableProps) {
  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case "string":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "number":
      case "integer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "boolean":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "object":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "array":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getLocationBadge = (location: string) => {
    switch (location) {
      case "path":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "query":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "header":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "cookie":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Located in</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Required</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parameters.map((param) => (
          <TableRow key={`${param.in}-${param.name}`}>
            <TableCell className="font-medium font-mono">{param.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getLocationBadge(param.in)}>
                {param.in}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getTypeColor(param.schema?.type)}>
                {param.schema?.type || "any"}
                {param.schema?.format && ` (${param.schema.format})`}
              </Badge>
            </TableCell>
            <TableCell>
              {param.required ? (
                <Badge variant="destructive">Required</Badge>
              ) : (
                <Badge variant="outline">Optional</Badge>
              )}
            </TableCell>
            <TableCell className="text-sm">{param.description || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
