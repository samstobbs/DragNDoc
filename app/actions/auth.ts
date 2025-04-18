"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function createUserProfile(userId: string, email: string, planTier = "free") {
  const supabase = createServerSupabaseClient()

  // Using the service role key allows bypassing RLS
  const { error } = await supabase.from("users").insert({
    id: userId,
    email: email,
    plan_tier: planTier,
  })

  if (error) {
    console.error("Error creating user profile:", error)
    throw new Error("Failed to create user profile")
  }

  return { success: true }
}
