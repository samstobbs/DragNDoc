import type React from "react"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseOpenAPISpec } from "@/lib/openapi-parser"

interface DocsLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export default async function DocsLayoutWrapper({ children, params }: DocsLayoutProps) {
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
    <>
      {!isPublished && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 p-2 text-center text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <p className="text-sm font-medium">
            Preview Mode - This documentation is not published yet. Only you can see this preview.
          </p>
        </div>
      )}
      {children}
    </>
  )
}
