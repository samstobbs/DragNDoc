import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseOpenAPISpec } from "@/lib/openapi-parser"
import { DocsLayout } from "@/components/docs/docs-layout"
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
      <DocsLayout spec={spec} projectName={project.name} projectSlug={project.slug}>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Servers</h1>
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">No servers defined in the OpenAPI specification.</p>
          </div>
        </div>
      </DocsLayout>
    )
  }

  return (
    <DocsLayout spec={spec} projectName={project.name} projectSlug={project.slug}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Servers</h1>
        <p className="text-lg text-muted-foreground">Available servers for the API.</p>

        <div className="grid gap-4 md:grid-cols-2">
          {spec.servers.map((server, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Server {index + 1}</CardTitle>
                {server.description && <CardDescription>{server.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <pre className="rounded-md bg-muted p-4 overflow-auto font-mono text-sm">{server.url}</pre>

                {server.variables && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium">Variables</h3>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left text-sm">Name</th>
                            <th className="px-4 py-2 text-left text-sm">Default</th>
                            <th className="px-4 py-2 text-left text-sm">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(server.variables).map(([name, variable]: [string, any]) => (
                            <tr key={name} className="border-b last:border-0">
                              <td className="px-4 py-2 font-mono text-sm">{name}</td>
                              <td className="px-4 py-2 font-mono text-sm">{variable.default}</td>
                              <td className="px-4 py-2 text-sm">{variable.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DocsLayout>
  )
}
