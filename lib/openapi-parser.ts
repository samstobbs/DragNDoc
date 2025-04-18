import type { Json } from "@/types/database.types"

export interface OpenAPIInfo {
  title: string
  version: string
  description?: string
}

export interface OpenAPIServer {
  url: string
  description?: string
}

export interface OpenAPIParameter {
  name: string
  in: "path" | "query" | "header" | "cookie"
  description?: string
  required?: boolean
  schema?: any
  example?: any
}

export interface OpenAPIRequestBody {
  description?: string
  required?: boolean
  content: Record<string, { schema?: any; example?: any }>
}

export interface OpenAPIResponse {
  description: string
  content?: Record<string, { schema?: any; example?: any }>
}

export interface OpenAPIOperation {
  operationId?: string
  summary?: string
  description?: string
  tags?: string[]
  parameters?: OpenAPIParameter[]
  requestBody?: OpenAPIRequestBody
  responses: Record<string, OpenAPIResponse>
  deprecated?: boolean
}

export interface OpenAPIPath {
  get?: OpenAPIOperation
  post?: OpenAPIOperation
  put?: OpenAPIOperation
  delete?: OpenAPIOperation
  patch?: OpenAPIOperation
  options?: OpenAPIOperation
  head?: OpenAPIOperation
  trace?: OpenAPIOperation
}

export interface OpenAPIComponent {
  schemas?: Record<string, any>
  responses?: Record<string, any>
  parameters?: Record<string, any>
  examples?: Record<string, any>
  requestBodies?: Record<string, any>
  headers?: Record<string, any>
  securitySchemes?: Record<string, any>
  links?: Record<string, any>
  callbacks?: Record<string, any>
}

export interface OpenAPISpec {
  openapi: string
  info: OpenAPIInfo
  servers?: OpenAPIServer[]
  paths: Record<string, OpenAPIPath>
  components?: OpenAPIComponent
  tags?: { name: string; description?: string }[]
}

export function parseOpenAPISpec(content: Json): OpenAPISpec | null {
  try {
    if (typeof content === "object" && content !== null) {
      // Basic validation
      const spec = content as any
      if (!spec.openapi || !spec.info || !spec.paths) {
        console.error("Invalid OpenAPI specification: missing required fields", {
          hasOpenapi: !!spec.openapi,
          hasInfo: !!spec.info,
          hasPaths: !!spec.paths,
        })
        return null
      }
      return spec as OpenAPISpec
    }
    console.error("Invalid OpenAPI specification: content is not an object", { contentType: typeof content })
    return null
  } catch (error) {
    console.error("Error parsing OpenAPI spec:", error)
    return null
  }
}

export function getOperationMethods(path: OpenAPIPath): { method: string; operation: OpenAPIOperation }[] {
  const methods = []
  if (path.get) methods.push({ method: "get", operation: path.get })
  if (path.post) methods.push({ method: "post", operation: path.post })
  if (path.put) methods.push({ method: "put", operation: path.put })
  if (path.delete) methods.push({ method: "delete", operation: path.delete })
  if (path.patch) methods.push({ method: "patch", operation: path.patch })
  if (path.options) methods.push({ method: "options", operation: path.options })
  if (path.head) methods.push({ method: "head", operation: path.head })
  if (path.trace) methods.push({ method: "trace", operation: path.trace })
  return methods
}

export function getTagsFromSpec(spec: OpenAPISpec): string[] {
  // Get tags defined in the spec
  const definedTags = spec.tags?.map((tag) => tag.name) || []

  // Get tags used in operations
  const usedTags = new Set<string>()
  Object.values(spec.paths).forEach((path) => {
    getOperationMethods(path).forEach(({ operation }) => {
      operation.tags?.forEach((tag) => usedTags.add(tag))
    })
  })

  // Combine and deduplicate
  return Array.from(new Set([...definedTags, ...usedTags]))
}

export function getOperationsByTag(
  spec: OpenAPISpec,
): Record<string, { path: string; method: string; operation: OpenAPIOperation }[]> {
  const operationsByTag: Record<string, { path: string; method: string; operation: OpenAPIOperation }[]> = {}

  // Initialize with defined tags
  getTagsFromSpec(spec).forEach((tag) => {
    operationsByTag[tag] = []
  })

  // Add "untagged" category
  operationsByTag["untagged"] = []

  // Group operations by tag
  Object.entries(spec.paths).forEach(([path, pathItem]) => {
    getOperationMethods(pathItem).forEach(({ method, operation }) => {
      if (operation.tags && operation.tags.length > 0) {
        operation.tags.forEach((tag) => {
          if (!operationsByTag[tag]) {
            operationsByTag[tag] = []
          }
          operationsByTag[tag].push({ path, method, operation })
        })
      } else {
        operationsByTag["untagged"].push({ path, method, operation })
      }
    })
  })

  return operationsByTag
}

export function getMethodColor(method: string): string {
  switch (method.toLowerCase()) {
    case "get":
      return "bg-green-500"
    case "post":
      return "bg-blue-500"
    case "put":
      return "bg-amber-500"
    case "delete":
      return "bg-red-500"
    case "patch":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}

export function formatExample(example: any): string {
  if (typeof example === "object") {
    return JSON.stringify(example, null, 2)
  }
  return String(example)
}
