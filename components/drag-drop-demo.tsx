"use client"

import type React from "react"

import { useState } from "react"
import { DragContainer } from "@/components/ui/drag-container"
import { DragHandle } from "@/components/ui/drag-handle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EndpointItem = {
  id: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
}

export function DragDropDemo() {
  const [endpoints, setEndpoints] = useState<EndpointItem[]>([
    { id: "1", method: "GET", path: "/pets", description: "List all pets" },
    { id: "2", method: "POST", path: "/pets", description: "Create a pet" },
    { id: "3", method: "GET", path: "/pets/{petId}", description: "Info for a specific pet" },
    { id: "4", method: "PUT", path: "/pets/{petId}", description: "Update a pet" },
    { id: "5", method: "DELETE", path: "/pets/{petId}", description: "Delete a pet" },
  ])

  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItem(id)
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDrop = (targetId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("text/plain")

    if (draggedId === targetId) return

    const draggedIndex = endpoints.findIndex((item) => item.id === draggedId)
    const targetIndex = endpoints.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newEndpoints = [...endpoints]
    const [removed] = newEndpoints.splice(draggedIndex, 1)
    newEndpoints.splice(targetIndex, 0, removed)

    setEndpoints(newEndpoints)
    setDraggedItem(null)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500"
      case "POST":
        return "bg-blue-500"
      case "PUT":
        return "bg-amber-500"
      case "DELETE":
        return "bg-red-500"
      case "PATCH":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Drag & Drop API Endpoints</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {endpoints.map((endpoint) => (
          <DragContainer
            key={endpoint.id}
            className="p-4 cursor-move"
            isDragActive={draggedItem === endpoint.id}
            onDrop={handleDrop(endpoint.id)}
          >
            <div className="flex items-center gap-3">
              <DragHandle onDragStart={handleDragStart(endpoint.id)} onDragEnd={handleDragEnd} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full ${getMethodColor(endpoint.method)} px-2 py-1 text-xs text-white`}>
                    {endpoint.method}
                  </div>
                  <span className="font-mono text-sm">{endpoint.path}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
              </div>
            </div>
          </DragContainer>
        ))}
      </CardContent>
    </Card>
  )
}
