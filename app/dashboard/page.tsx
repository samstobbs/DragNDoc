import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { SampleProjectButton } from "@/components/dashboard/sample-project-button"
import { createServerSupabaseClient } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
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
      <DashboardHeader heading="Projects" text="Create and manage your API documentation projects.">
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </DashboardHeader>
      <div>
        {projects && projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>Last updated {formatDate(project.updated_at)}</CardDescription>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {project.description || "No description provided."}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon>
              <FileText className="h-8 w-8" />
            </EmptyPlaceholder.Icon>
            <EmptyPlaceholder.Title>No projects created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any projects yet. Start by creating one or use our sample project.
            </EmptyPlaceholder.Description>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
              <SampleProjectButton />
            </div>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
