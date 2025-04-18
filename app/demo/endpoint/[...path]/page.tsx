import { notFound } from "next/navigation"
import { DocsLayout } from "@/components/docs/docs-layout"
import { EndpointDetail } from "@/components/docs/endpoint-detail"
import { parseOpenAPISpec, getOperationMethods } from "@/lib/openapi-parser"
import { sampleOpenAPI } from "@/lib/sample-openapi"

interface DemoEndpointPageProps {
  params: {
    path: string[]
  }
}

export default function DemoEndpointPage({ params }: DemoEndpointPageProps) {
  const { path } = params
  const spec = parseOpenAPISpec(sampleOpenAPI)

  if (!spec) {
    return <div>Error loading demo documentation</div>
  }

  // The last element in the path array is the HTTP method
  const method = path[path.length - 1]

  // The rest of the path array is the actual path
  // We need to decode URL components and reconstruct the path
  const pathSegments = path.slice(0, -1).map((segment) => decodeURIComponent(segment))
  const apiPath = `/${pathSegments.join("/")}`

  console.log("Looking for path:", apiPath)

  // Find the path in the spec - we need to handle path parameters
  // OpenAPI uses {param} format, but in URLs these might be encoded
  let pathItem = spec.paths[apiPath]

  // If not found directly, try to match against path templates
  if (!pathItem) {
    // Try to find a matching path pattern
    const pathPatterns = Object.keys(spec.paths)
    for (const pattern of pathPatterns) {
      // Convert OpenAPI path template to a regex pattern
      // e.g., /books/{bookId} -> /books/([^/]+)
      const regexPattern = pattern.replace(/\{([^}]+)\}/g, "([^/]+)").replace(/\//g, "\\/")

      const regex = new RegExp(`^${regexPattern}$`)
      if (regex.test(apiPath)) {
        pathItem = spec.paths[pattern]
        console.log("Found matching path pattern:", pattern)
        break
      }
    }
  }

  if (!pathItem) {
    notFound()
  }

  // Find the operation for the specified method
  const operations = getOperationMethods(pathItem)
  const operation = operations.find((op) => op.method.toLowerCase() === method.toLowerCase())

  if (!operation) {
    notFound()
  }

  // For display purposes, we'll use the original path from the spec
  const displayPath =
    Object.keys(spec.paths).find((p) => {
      const regexPattern = p.replace(/\{([^}]+)\}/g, "([^/]+)").replace(/\//g, "\\/")

      const regex = new RegExp(`^${regexPattern}$`)
      return regex.test(apiPath)
    }) || apiPath

  return (
    <DocsLayout spec={spec} projectName="Demo API Documentation" projectSlug="demo">
      <EndpointDetail
        path={displayPath}
        method={operation.method}
        operation={operation.operation}
        servers={spec.servers}
      />
    </DocsLayout>
  )
}
