"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function deleteProject(projectId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "You must be logged in to delete a project" }
    }

    // Verify that the project belongs to the user
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (projectError || !project) {
      console.error("Project not found:", projectError)
      return { success: false, error: "Project not found" }
    }

    if (project.user_id !== user.id) {
      console.error("Permission denied: project.user_id:", project.user_id, "user.id:", user.id)
      return { success: false, error: "You don't have permission to delete this project" }
    }

    // Delete the project
    // Note: This will cascade delete all related records (api_specs, customizations, etc.)
    // if you've set up your foreign key constraints correctly in Supabase
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", projectId)

    if (deleteError) {
      console.error("Error deleting project:", deleteError)
      return { success: false, error: "Failed to delete project" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteProject action:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
