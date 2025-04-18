import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, Settings, ExternalLink } from "lucide-react"

import { DragonButton } from "@/components/ui/dragon-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { createServerSupabaseClient } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import { DeleteProjectButton } from "@/components/dashboard/delete-project-button"

export const dynamic = "force-dynamic"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single()

  if (!project) {
    notFound()
  }

  const { data: apiSpecs } = await supabase
    .from("api_specs")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  const { data: customization } = await supabase.from("customizations").select("*").eq("project_id", id).single()

  return (
    <DashboardShell>
      <DashboardHeader heading={project.name} text={project.description || "No description provided."}>
        <div className="flex items-center gap-2">
          <DragonButton variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </DragonButton>
          <DragonButton size="sm" asChild>
            <Link href={`/dashboard/projects/${id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DragonButton>
          <DeleteProjectButton projectId={id} projectName={project.name} />
        </div>
      </DashboardHeader>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic information about your API documentation project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{project.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Slug</p>
                  <p className="text-sm text-muted-foreground">{project.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(project.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(project.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation URL</CardTitle>
              <CardDescription>Share this URL to access your API documentation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-md border p-2">
                <p className="text-sm font-medium">https://{project.slug}.dragnDoc.com</p>
                <DragonButton variant="outline" size="sm">
                  Copy
                </DragonButton>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your documentation is currently {apiSpecs?.[0]?.is_published ? "published" : "not published"}.
              </p>
              <div className="mt-4 flex gap-2">
                <DragonButton asChild size="sm" variant="gradient">
                  <Link href={`/docs/${project.slug}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Documentation
                  </Link>
                </DragonButton>
                {!apiSpecs?.[0]?.is_published && (
                  <DragonButton variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${id}/settings`}>Publish</Link>
                  </DragonButton>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
              <CardDescription>Current customization settings for your documentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground capitalize">{customization?.theme || "Light"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Primary Color</p>
                  {customization?.primary_color ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: customization.primary_color }} />
                      <p className="text-sm text-muted-foreground">{customization.primary_color}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Default</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Logo</p>
                  <p className="text-sm text-muted-foreground">
                    {customization?.logo_url ? "Custom logo" : "Default logo"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Specification Versions</CardTitle>
              <CardDescription>Manage different versions of your API documentation.</CardDescription>
            </CardHeader>
            <CardContent>
              {apiSpecs && apiSpecs.length > 0 ? (
                <div className="space-y-4">
                  {apiSpecs.map((spec) => (
                    <div key={spec.id} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Version {spec.version}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(spec.created_at)} • {spec.is_published ? "Published" : "Draft"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DragonButton variant="outline" size="sm" asChild>
                          <Link href={`/docs/${project.slug}`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DragonButton>
                        {!spec.is_published && (
                          <DragonButton variant="gradient" size="sm" asChild>
                            <Link href={`/dashboard/projects/${id}/settings`}>Publish</Link>
                          </DragonButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No versions found</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    Upload an OpenAPI specification to create a new version.
                  </p>
                  <DragonButton variant="gradient">Upload Specification</DragonButton>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Analytics</CardTitle>
              <CardDescription>View usage statistics for your API documentation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Analytics are available on the Pro and Enterprise plans.
                </p>
                <DragonButton className="mt-4" variant="gradient-outline">
                  Upgrade Plan
                </DragonButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
