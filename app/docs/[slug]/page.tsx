import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseOpenAPISpec } from "@/lib/openapi-parser"
import { DebugPanel } from "@/components/docs/debug-panel"

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
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Error Parsing OpenAPI Specification</h1>
        <p className="text-lg text-muted-foreground">
          There was an error parsing your OpenAPI specification. Please check the format and try again.
        </p>
        <DebugPanel
          spec={{
            openapi: "unknown",
            info: { title: "Error", version: "unknown" },
            paths: {},
          }}
          rawContent={apiSpec.content}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{spec.info.title}</h1>
        <p className="text-lg text-muted-foreground">Version {spec.info.version}</p>
      </div>

      {spec.info.description && (
        <div className="prose max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: spec.info.description }} />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Getting Started</h2>
        <p>
          This documentation provides information about the {spec.info.title} API. Use the navigation on the left to
          browse the API endpoints.
        </p>

        {spec.servers && spec.servers.length > 0 && (
          <div className="space-y-2">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Base URL</h3>
            <p>The API is available at the following base URL:</p>
            <pre className="rounded-md bg-muted p-4 overflow-auto">{spec.servers[0].url}</pre>
          </div>
        )}
      </div>

      {/* Include the debug panel at the bottom */}
      <DebugPanel spec={spec} rawContent={apiSpec.content} />
    </div>
  )
}
