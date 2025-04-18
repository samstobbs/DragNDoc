"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { seedSampleProject } from "@/app/actions/seed"
import { supabase } from "@/lib/supabase"

export function SampleProjectButton() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to create a sample project")
      }

      const result = await seedSampleProject(user.id)

      if (!result.success) {
        throw new Error("Failed to create sample project")
      }

      toast({
        title: "Sample project created",
        description: "A sample API project has been created for you.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create sample project",
        description: error.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} variant="outline">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create Sample Project
        </>
      )}
    </Button>
  )
}
