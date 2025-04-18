"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { DragonButton } from "@/components/ui/dragon-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { FileUploader } from "@/components/file-uploader"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { supabase } from "@/lib/supabase"
import { parseOpenAPIFile } from "@/lib/parse-openapi"

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
})

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  })

  const handleFileChange = (file: File | null) => {
    setFile(file)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload an OpenAPI specification file",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to create a project")
      }

      // Check if slug is already taken
      const { data: existingProject } = await supabase.from("projects").select("id").eq("slug", values.slug).single()

      if (existingProject) {
        form.setError("slug", {
          message: "This slug is already taken. Please choose another one.",
        })
        throw new Error("Slug already taken")
      }

      // Parse the OpenAPI file (JSON or YAML)
      const { content: parsedContent, error: parseError } = await parseOpenAPIFile(file)

      if (parseError) {
        toast({
          variant: "destructive",
          title: "Invalid OpenAPI specification",
          description: parseError,
        })
        throw new Error(parseError)
      }

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          slug: values.slug,
          description: values.description || null,
          user_id: user.id,
        })
        .select()
        .single()

      if (projectError) {
        throw projectError
      }

      // Create API spec record - store content directly in the database
      const { error: specError } = await supabase.from("api_specs").insert({
        project_id: project.id,
        file_path: file.name, // Just store the filename
        content: parsedContent,
        version: parsedContent.info?.version || "1.0.0",
        is_published: false,
      })

      if (specError) {
        // Rollback project creation
        await supabase.from("projects").delete().eq("id", project.id)
        throw specError
      }

      // Create default customization
      await supabase.from("customizations").insert({
        project_id: project.id,
        theme: "light",
      })

      // Create default access control
      await supabase.from("access_controls").insert({
        project_id: project.id,
        is_password_protected: false,
      })

      toast({
        title: "Project created",
        description: "Your API documentation project has been created successfully.",
      })

      router.refresh()
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: error.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Project"
        text="Create a new API documentation project by uploading your OpenAPI specification."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Enter basic information about your API documentation project.</CardDescription>
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
                      This will be used in your documentation URL: https://{field.value || "[slug]"}.dragnDoc.com
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
              <CardTitle>OpenAPI Specification</CardTitle>
              <CardDescription>Upload your OpenAPI specification file (JSON or YAML format).</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileChange={handleFileChange} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <DragonButton variant="outline" asChild type="button">
                <Link href="/dashboard">Cancel</Link>
              </DragonButton>
              <DragonButton type="submit" variant="gradient" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </DragonButton>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </DashboardShell>
  )
}
