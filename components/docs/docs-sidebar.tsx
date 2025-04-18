"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Info, Server, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MethodBadge } from "@/components/docs/method-badge"
import type { OpenAPISpec } from "@/lib/openapi-parser"
import { getOperationsByTag } from "@/lib/openapi-parser"

interface DocsSidebarProps {
  spec: OpenAPISpec
  slug: string
}

export function DocsSidebar({ spec, slug }: DocsSidebarProps) {
  const pathname = usePathname()
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({})

  const toggleTag = (tag: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }))
  }

  const operationsByTag = getOperationsByTag(spec)
  const isDemo = slug === "demo"

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-1 p-4">
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            (pathname === `/docs/${slug}` || (isDemo && pathname === "/demo")) && "bg-muted font-medium",
          )}
          asChild
        >
          <Link href={isDemo ? "/demo" : `/docs/${slug}`}>
            <Info className="mr-2 h-4 w-4" />
            Introduction
          </Link>
        </Button>

        {spec.servers && spec.servers.length > 0 && (
          <Button
            variant="ghost"
            className={cn(
              "justify-start",
              (pathname === `/docs/${slug}/servers` || (isDemo && pathname === "/demo/servers")) &&
                "bg-muted font-medium",
            )}
            asChild
          >
            <Link href={isDemo ? "/demo/servers" : `/docs/${slug}/servers`}>
              <Server className="mr-2 h-4 w-4" />
              Servers
            </Link>
          </Button>
        )}

        <div className="mt-4">
          <h3 className="mb-2 px-2 text-sm font-medium">API Reference</h3>
          <div className="space-y-1">
            {Object.entries(operationsByTag).map(([tag, operations]) => {
              if (operations.length === 0) return null

              return (
                <div key={tag}>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => toggleTag(tag)}>
                    <div className="flex w-full items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      <span className="flex-1 truncate">{tag}</span>
                      {expandedTags[tag] ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </Button>
                  {expandedTags[tag] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {operations.map((op, index) => {
                        const endpointPath = isDemo
                          ? `/demo/endpoint${op.path}/${op.method}`
                          : `/docs/${slug}/paths${op.path}/${op.method}`

                        return (
                          <Button
                            key={`${op.path}-${op.method}-${index}`}
                            variant="ghost"
                            size="sm"
                            className={cn("w-full justify-start", pathname === endpointPath && "bg-muted font-medium")}
                            asChild
                          >
                            <Link href={endpointPath}>
                              <div className="flex items-center gap-2">
                                <MethodBadge method={op.method} className="h-5 min-w-[40px]" />
                                <span className="truncate">{op.operation.summary || op.path}</span>
                              </div>
                            </Link>
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
