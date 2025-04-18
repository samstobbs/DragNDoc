"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { sampleOpenAPI } from "@/lib/sample-openapi"

export async function seedSampleProject(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Create a sample project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: "Sample API",
        slug: "sample-api",
        description: "A sample API to demonstrate OpenAPI documentation",
        user_id: userId,
      })
      .select()
      .single()

    if (projectError) {
      throw projectError
    }

    // Create API spec - store content directly in the database
    const { error: specError } = await supabase.from("api_specs").insert({
      project_id: project.id,
      file_path: "sample.json", // Just store the filename
      content: sampleOpenAPI,
      version: "1.0.0",
      is_published: true,
    })

    if (specError) {
      throw specError
    }

    // Create customization
    const { error: customizationError } = await supabase.from("customizations").insert({
      project_id: project.id,
      theme: "light",
    })

    if (customizationError) {
      throw customizationError
    }

    // Create access control
    const { error: accessControlError } = await supabase.from("access_controls").insert({
      project_id: project.id,
      is_password_protected: false,
    })

    if (accessControlError) {
      throw accessControlError
    }

    return { success: true, projectId: project.id }
  } catch (error) {
    console.error("Error seeding sample project:", error)
    return { success: false, error }
  }
}
