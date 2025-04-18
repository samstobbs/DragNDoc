import type React from "react"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsHeader } from "@/components/docs/docs-header"
import { parseOpenAPISpec } from "@/lib/openapi-parser"

interface DocsLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
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

  // Add a warning banner if the spec is not published
  const isPublished = apiSpec.is_published

  return (
    <div className="flex min-h-screen flex-col">
      <DocsHeader projectName={project.name} projectSlug={project.slug} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r md:sticky md:block">
          <DocsSidebar spec={spec} slug={slug} />
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            {!isPublished && (
              <div className="mb-4 rounded-md bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <p className="font-medium">Preview Mode</p>
                <p className="text-sm">This documentation is not published yet. Only you can see this preview.</p>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
