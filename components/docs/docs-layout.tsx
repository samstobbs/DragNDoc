"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"
import { MethodBadge } from "@/components/docs/method-badge"
import type { OpenAPISpec } from "@/lib/openapi-parser"
import { getOperationsByTag } from "@/lib/openapi-parser"

interface DocsLayoutProps {
  spec: OpenAPISpec
  projectName: string
  projectSlug: string
  children: React.ReactNode
}

export function DocsLayout({ spec, projectName, projectSlug, children }: DocsLayoutProps) {
  const pathname = usePathname()
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOperations, setFilteredOperations] = useState<any[]>([])

  // Memoize operationsByTag to prevent recalculation on every render
  const operationsByTag = useMemo(() => getOperationsByTag(spec), [spec])

  // Initialize expanded tags only once
  useEffect(() => {
    // Only run this effect if expandedTags is empty
    if (Object.keys(expandedTags).length > 0) return

    const initialExpandedTags: Record<string, boolean> = {}

    // Expand the first tag by default
    const tagKeys = Object.keys(operationsByTag)
    if (tagKeys.length > 0) {
      initialExpandedTags[tagKeys[0]] = true
    }

    // Also expand any tag that contains the active operation
    tagKeys.forEach((tag) => {
      operationsByTag[tag].forEach((op) => {
        // Check if the current path matches this operation
        // We need to handle path parameters which might be URL-encoded
        const pathSegments = op.path
          .split("/")
          .filter((segment) => segment)
          .map((segment) => encodeURIComponent(segment))

        const endpointPath = `/docs/${projectSlug}/paths/${pathSegments.join("/")}/${op.method}`

        // Check if the current path starts with this endpoint path
        // This is a more flexible check that can handle variations in URL encoding
        if (
          pathname.startsWith(endpointPath) ||
          pathname.includes(op.path.replace(/\{/g, "%7B").replace(/\}/g, "%7D"))
        ) {
          initialExpandedTags[tag] = true
        }
      })
    })

    setExpandedTags(initialExpandedTags)
  }, [operationsByTag, pathname, projectSlug]) // Removed expandedTags from dependencies

  // Handle search with debounce
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOperations([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: any[] = []

    Object.entries(operationsByTag).forEach(([tag, operations]) => {
      operations.forEach((op) => {
        const matchesPath = op.path.toLowerCase().includes(query)
        const matchesMethod = op.method.toLowerCase().includes(query)
        const matchesSummary = op.operation.summary?.toLowerCase().includes(query) || false
        const matchesDescription = op.operation.description?.toLowerCase().includes(query) || false
        const matchesTag = tag.toLowerCase().includes(query)

        if (matchesPath || matchesMethod || matchesSummary || matchesDescription || matchesTag) {
          results.push({
            ...op,
            tag,
          })
        }
      })
    })

    setFilteredOperations(results)
  }, [searchQuery, operationsByTag])

  // Memoize the toggle function to prevent recreation on every render
  const toggleTag = useCallback((tag: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }))
  }, [])

  // Helper function to encode path segments properly
  const encodePathSegment = useCallback((segment: string) => {
    // Encode the segment, preserving the curly braces for display
    return segment.replace(/\{([^}]+)\}/g, (match) => encodeURIComponent(match))
  }, [])

  // Memoize the renderOperation function
  const renderOperation = useCallback(
    (op: any, tag: string, isSearchResult = false) => {
      // Encode each path segment separately
      const encodedPathSegments = op.path
        .split("/")
        .filter((segment) => segment) // Remove empty segments
        .map(encodePathSegment)

      const endpointPath = `/docs/${projectSlug}/paths/${encodedPathSegments.join("/")}/${op.method}`

      // Check if the current path matches this operation
      const isActive =
        pathname.startsWith(endpointPath) || pathname.includes(op.path.replace(/\{/g, "%7B").replace(/\}/g, "%7D"))

      return (
        <Link
          key={`${op.path}-${op.method}`}
          href={endpointPath}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50",
            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          )}
        >
          <MethodBadge method={op.method} className="h-5 min-w-[40px]" />
          <div className="flex flex-col overflow-hidden">
            <span className="truncate font-medium">{op.operation.summary || op.path}</span>
            {isSearchResult && (
              <span className="text-xs text-muted-foreground">
                {tag} • {op.path}
              </span>
            )}
          </div>
        </Link>
      )
    },
    [pathname, projectSlug, encodePathSegment],
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
            <div className="hidden md:block">
              <span className="text-sm font-medium">{projectName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full bg-background pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://github.com/dragnDoc/docs" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View on GitHub</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="flex flex-col gap-1 p-4">
              <Link
                href={`/docs/${projectSlug}`}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50",
                  pathname === `/docs/${projectSlug}` ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Overview
              </Link>

              {spec.servers && spec.servers.length > 0 && (
                <Link
                  href={`/docs/${projectSlug}/servers`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50",
                    pathname === `/docs/${projectSlug}/servers`
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                  Servers
                </Link>
              )}

              {/* Search Results */}
              {searchQuery.trim() !== "" && filteredOperations.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 px-2 text-sm font-medium">Search Results</h3>
                  <div className="space-y-1">{filteredOperations.map((op) => renderOperation(op, op.tag, true))}</div>
                </div>
              )}

              {/* API Reference */}
              {searchQuery.trim() === "" && (
                <div className="mt-4">
                  <h3 className="mb-2 px-2 text-sm font-medium">API Reference</h3>
                  <div className="space-y-1">
                    {Object.entries(operationsByTag).map(([tag, operations]) => {
                      if (operations.length === 0) return null

                      return (
                        <div key={tag} className="space-y-1">
                          <button
                            onClick={() => toggleTag(tag)}
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50"
                          >
                            <span>{tag}</span>
                            {expandedTags[tag] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          {expandedTags[tag] && (
                            <div className="ml-2 space-y-1 border-l pl-2">
                              {operations.map((op) => renderOperation(op, tag))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-6 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
