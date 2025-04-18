import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Server-side client (for server components and API routes)
export const createServerSupabaseClient = () => {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}
