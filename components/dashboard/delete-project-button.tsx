"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { DragonButton } from "@/components/ui/dragon-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { deleteProject } from "@/app/actions/projects"

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProject(projectId)

      if (result.success) {
        toast({
          title: "Project deleted",
          description: `${projectName} has been deleted successfully.`,
        })
        router.push("/dashboard")
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to delete project")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting project",
        description: error.message || "Something went wrong. Please try again.",
      })
      setIsDeleting(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <>
      <DragonButton variant="destructive" size="sm" type="button" onClick={() => setShowConfirmDialog(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Project
      </DragonButton>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project &quot;{projectName}&quot; and all
              of its associated data, including API specifications, customizations, and analytics.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DragonButton variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isDeleting}>
              Cancel
            </DragonButton>
            <DragonButton variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </DragonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
