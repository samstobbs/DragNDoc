import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseOpenAPISpec } from "@/lib/openapi-parser"
import { DocsLayout } from "@/components/docs/docs-layout"
import { Badge } from "@/components/ui/badge"

interface DocsPageProps {
  params: {
    slug: string
  }
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = params
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
    return (
      <DocsLayout
        spec={{
          openapi: "unknown",
          info: { title: "Error", version: "unknown" },
          paths: {},
        }}
        projectName={project.name}
        projectSlug={project.slug}
      >
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Error Parsing OpenAPI Specification</h1>
          <p className="text-lg text-muted-foreground">
            There was an error parsing your OpenAPI specification. Please check the format and try again.
          </p>
        </div>
      </DocsLayout>
    )
  }

  // Count endpoints by method
  const endpointStats = {
    total: 0,
    get: 0,
    post: 0,
    put: 0,
    delete: 0,
    patch: 0,
    other: 0,
  }

  Object.values(spec.paths).forEach((pathItem) => {
    if (pathItem.get) {
      endpointStats.get++
      endpointStats.total++
    }
    if (pathItem.post) {
      endpointStats.post++
      endpointStats.total++
    }
    if (pathItem.put) {
      endpointStats.put++
      endpointStats.total++
    }
    if (pathItem.delete) {
      endpointStats.delete++
      endpointStats.total++
    }
    if (pathItem.patch) {
      endpointStats.patch++
      endpointStats.total++
    }
    if (pathItem.options || pathItem.head || pathItem.trace) {
      endpointStats.other++
      endpointStats.total++
    }
  })

  return (
    <DocsLayout spec={spec} projectName={project.name} projectSlug={project.slug}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{spec.info.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Version {spec.info.version}</Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {endpointStats.total} Endpoints
            </Badge>
          </div>
        </div>

        {spec.info.description && (
          <div className="prose max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: spec.info.description }} />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">API Overview</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Endpoints</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GET</span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                  >
                    {endpointStats.get}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">POST</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {endpointStats.post}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">PUT</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  >
                    {endpointStats.put}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">DELETE</span>
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    {endpointStats.delete}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">PATCH</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  >
                    {endpointStats.patch}
                  </Badge>
                </div>
                {endpointStats.other > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Other</span>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {endpointStats.other}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {spec.servers && spec.servers.length > 0 && (
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Servers</h3>
                <div className="mt-2 space-y-2">
                  {spec.servers.map((server, index) => (
                    <div key={index} className="space-y-1">
                      <div className="font-mono text-sm break-all">{server.url}</div>
                      {server.description && <p className="text-xs text-muted-foreground">{server.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {spec.components?.securitySchemes && (
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Authentication</h3>
                <div className="mt-2 space-y-2">
                  {Object.entries(spec.components.securitySchemes).map(([name, scheme]: [string, any]) => (
                    <div key={name} className="space-y-1">
                      <div className="font-medium">{name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {scheme.type}
                          {scheme.scheme && ` (${scheme.scheme})`}
                        </Badge>
                      </div>
                      {scheme.description && <p className="text-xs text-muted-foreground">{scheme.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <p>
            This documentation provides information about the {spec.info.title} API. Use the navigation on the left to
            browse the API endpoints.
          </p>

          {spec.servers && spec.servers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Base URL</h3>
              <p>The API is available at the following base URL:</p>
              <pre className="rounded-md bg-muted p-4 overflow-auto font-mono text-sm">{spec.servers[0].url}</pre>
            </div>
          )}
        </div>
      </div>
    </DocsLayout>
  )
}
