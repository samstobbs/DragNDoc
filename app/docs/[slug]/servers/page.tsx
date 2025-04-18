import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseOpenAPISpec } from "@/lib/openapi-parser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ServersPageProps {
  params: {
    slug: string
  }
}

export default async function ServersPage({ params }: ServersPageProps) {
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
    notFound()
  }

  if (!spec.servers || spec.servers.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Servers</h1>
        <p>No servers defined in the OpenAPI specification.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Servers</h1>
      <p className="text-lg text-muted-foreground">Available servers for the API.</p>

      <div className="grid gap-4">
        {spec.servers.map((server, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Server {index + 1}</CardTitle>
              {server.description && <CardDescription>{server.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <pre className="rounded-md bg-muted p-4 overflow-auto">{server.url}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
