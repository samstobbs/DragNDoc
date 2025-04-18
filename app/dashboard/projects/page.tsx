import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { createServerSupabaseClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage your API documentation projects.">
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </DashboardHeader>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Project cards would go here */}
          <p>You have {projects.length} projects</p>
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon>
            <FileText className="h-8 w-8" />
          </EmptyPlaceholder.Icon>
          <EmptyPlaceholder.Title>No projects created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any projects yet. Start by creating one.
          </EmptyPlaceholder.Description>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  )
}
