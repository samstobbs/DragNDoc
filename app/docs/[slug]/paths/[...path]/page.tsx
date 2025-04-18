import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseOpenAPISpec, getOperationMethods } from "@/lib/openapi-parser"
import { EndpointCard } from "@/components/docs/endpoint-card"

interface PathPageProps {
  params: {
    slug: string
    path: string[]
  }
}

export default async function PathPage({ params }: PathPageProps) {
  const { slug, path } = params
  const supabase = createServerSupabaseClient()

  // Get project by slug
  const { data: project, error: projectError } = await supabase.from("projects").select("*").eq("slug", slug).single()

  if (projectError || !project) {
    console.error("Project not found:", slug, projectError)
    notFound()
  }

  // Get the latest API spec for the project
  const { data: apiSpec, error: apiSpecError } = await supabase
    .from("api_specs")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (apiSpecError || !apiSpec) {
    console.error("API spec not found for project:", project.id, apiSpecError)
    notFound()
  }

  // Parse the OpenAPI spec
  const spec = parseOpenAPISpec(apiSpec.content)

  if (!spec) {
    console.error("Failed to parse OpenAPI spec for project:", project.id)
    notFound()
  }

  // The last element in the path array is the HTTP method
  const method = path[path.length - 1]
  // The rest of the path array is the actual path
  const apiPath = `/${path.slice(0, -1).join("/")}`

  // Find the path in the spec
  const pathItem = spec.paths[apiPath]

  if (!pathItem) {
    console.error("Path not found in spec:", apiPath)
    notFound()
  }

  // Find the operation for the specified method
  const operations = getOperationMethods(pathItem)
  const operation = operations.find((op) => op.method.toLowerCase() === method.toLowerCase())

  if (!operation) {
    console.error("Method not found for path:", method, apiPath)
    notFound()
  }

  return (
    <div className="space-y-6">
      <EndpointCard path={apiPath} method={operation.method} operation={operation.operation} servers={spec.servers} />
    </div>
  )
}
