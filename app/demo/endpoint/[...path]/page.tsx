import { notFound } from "next/navigation"
import { parseOpenAPISpec } from "@/lib/openapi-parser"
import { EndpointDetail } from "@/components/docs/endpoint-detail"
import { DocsLayout } from "@/components/docs/docs-layout"
import { sampleOpenAPISpec } from "@/lib/sample-openapi"

interface EndpointPageProps {
  params: {
    path: string[]
  }
}

export default function EndpointPage({ params }: EndpointPageProps) {
  const { path } = params

  if (!path || path.length < 2) {
    notFound()
  }

  // The last segment is the HTTP method
  const method = path[path.length - 1].toLowerCase()

  // The rest of the segments form the path
  const pathSegments = path.slice(0, path.length - 1)

  // Decode URL-encoded path parameters
  const decodedPathSegments = pathSegments.map((segment) => decodeURIComponent(segment))

  // Reconstruct the path with slashes
  const endpointPath = `/${decodedPathSegments.join("/")}`

  // Parse the sample OpenAPI spec
  const spec = parseOpenAPISpec(sampleOpenAPISpec)

  if (!spec) {
    notFound()
  }

  // Find the path in the spec
  const pathItem = spec.paths[endpointPath]

  if (!pathItem) {
    // Try to find a matching path with path parameters
    const pathKeys = Object.keys(spec.paths)
    let matchedPath = null

    for (const pathKey of pathKeys) {
      // Convert OpenAPI path template to regex pattern
      // e.g., /books/{bookId} -> /books/([^/]+)
      const pattern = pathKey.replace(/\{([^}]+)\}/g, "([^/]+)")
      const regex = new RegExp(`^${pattern}$`)

      if (regex.test(endpointPath)) {
        matchedPath = pathKey
        break
      }
    }

    if (!matchedPath) {
      notFound()
    }

    // Use the matched path
    const pathItem = spec.paths[matchedPath]

    // Get the operation for the specified method
    const operation = pathItem[method as keyof typeof pathItem]

    if (!operation) {
      notFound()
    }

    return (
      <DocsLayout spec={spec} projectName="Demo API" projectSlug="demo">
        <EndpointDetail method={method} path={matchedPath} operation={operation} spec={spec} />
      </DocsLayout>
    )
  }

  // Get the operation for the specified method
  const operation = pathItem[method as keyof typeof pathItem]

  if (!operation) {
    notFound()
  }

  return (
    <DocsLayout spec={spec} projectName="Demo API" projectSlug="demo">
      <EndpointDetail method={method} path={endpointPath} operation={operation} spec={spec} />
    </DocsLayout>
  )
}
