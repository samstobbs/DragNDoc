"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
}

export function FileUploader({ onFileChange }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File) => {
    const validTypes = ["application/json", "text/yaml", "application/x-yaml", "text/x-yaml", "text/plain"]
    const isValidType =
      validTypes.includes(file.type) ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".yaml") ||
      file.name.endsWith(".yml")

    if (!isValidType) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JSON or YAML file.",
      })
      return false
    }

    return true
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0]
        if (validateFile(droppedFile)) {
          setFile(droppedFile)
          onFileChange(droppedFile)
        } else {
          setFile(null)
          onFileChange(null)
        }
      }
    },
    [onFileChange, toast],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0]
        if (validateFile(selectedFile)) {
          setFile(selectedFile)
          onFileChange(selectedFile)
        } else {
          setFile(null)
          onFileChange(null)
        }
      }
    },
    [onFileChange, toast],
  )

  const removeFile = useCallback(() => {
    setFile(null)
    onFileChange(null)
  }, [onFileChange])

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">Drag and drop your OpenAPI file</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Supports JSON and YAML formats (.json, .yaml, .yml)
            </p>
            <label
              htmlFor="file-upload"
              className="cursor-pointer relative bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Browse Files
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept=".json,.yaml,.yml"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button type="button" onClick={removeFile} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Remove file</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
