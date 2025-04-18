"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { supabase } from "@/lib/supabase"
import { DeleteProjectButton } from "@/components/dashboard/delete-project-button"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters",
  }),
  slug: z
    .string()
    .min(3, {
      message: "Slug must be at least 3 characters",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
})

interface ProjectSettingsPageProps {
  params: {
    id: string
  }
}

export default function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [apiSpec, setApiSpec] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isPublished: false,
    },
  })

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoadingData(true)
      try {
        const { data: projectData } = await supabase.from("projects").select("*").eq("id", id).single()

        if (projectData) {
          setProject(projectData)
          form.setValue("name", projectData.name)
          form.setValue("slug", projectData.slug)
          form.setValue("description", projectData.description || "")

          // Fetch the latest API spec
          const { data: apiSpecData } = await supabase
            .from("api_specs")
            .select("*")
            .eq("project_id", id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          if (apiSpecData) {
            setApiSpec(apiSpecData)
            form.setValue("isPublished", apiSpecData.is_published)
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error)
        toast({
          variant: "destructive",
          title: "Error loading project",
          description: "Failed to load project data. Please try again.",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchProject()
  }, [id, form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      // Check if slug is already taken (if changed)
      if (values.slug !== project.slug) {
        const { data: existingProject } = await supabase
          .from("projects")
          .select("id")
          .eq("slug", values.slug)
          .neq("id", id)
          .single()

        if (existingProject) {
          form.setError("slug", {
            message: "This slug is already taken. Please choose another one.",
          })
          throw new Error("Slug already taken")
        }
      }

      // Update project
      const { error: projectError } = await supabase
        .from("projects")
        .update({
          name: values.name,
          slug: values.slug,
          description: values.description || null,
        })
        .eq("id", id)

      if (projectError) {
        throw projectError
      }

      // Update API spec published status
      if (apiSpec) {
        const { error: specError } = await supabase
          .from("api_specs")
          .update({
            is_published: values.isPublished,
          })
          .eq("id", apiSpec.id)

        if (specError) {
          throw specError
        }
      }

      toast({
        title: "Settings updated",
        description: "Your project settings have been updated successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update settings",
        description: error.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Project Settings" text="Loading project settings...">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        </DashboardHeader>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Project Settings" text="Manage your project settings and configuration.">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
      </DashboardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Update your project's basic information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My API Documentation" {...field} />
                    </FormControl>
                    <FormDescription>This will be displayed as the title of your documentation.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="my-api-docs" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in your documentation URL: https://[slug].apidocshub.com
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief description of your API" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Control the visibility of your API documentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish Documentation</FormLabel>
                      <FormDescription>
                        When enabled, your API documentation will be publicly accessible.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild type="button">
                <Link href={`/dashboard/projects/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Separate card for delete functionality - outside the form */}
      <Card className="border-destructive mt-6">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions in this section can lead to permanent data loss. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive p-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Delete Project</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this project and all of its data. This action cannot be undone.
                </p>
              </div>
              {project && <DeleteProjectButton projectId={id} projectName={project.name || "this project"} />}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
