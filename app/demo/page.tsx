import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsHeader } from "@/components/docs/docs-header"
import { parseOpenAPISpec } from "@/lib/openapi-parser"
import { sampleOpenAPI } from "@/lib/sample-openapi"

export default function DemoPage() {
  const spec = parseOpenAPISpec(sampleOpenAPI)

  if (!spec) {
    return <div>Error loading demo documentation</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DocsHeader projectName="Demo API Documentation" projectSlug="demo" />
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r md:sticky md:block">
          <DocsSidebar spec={spec} slug="demo" />
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <div className="mb-4 flex items-center">
              <Button variant="outline" size="sm" asChild className="mr-4">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div className="rounded-md bg-blue-100 px-4 py-2 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Demo Documentation
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{spec.info.title}</h1>
                <p className="text-lg text-muted-foreground">Version {spec.info.version}</p>
              </div>

              {spec.info.description && (
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: spec.info.description }} />
                </div>
              )}

              <div className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Getting Started</h2>
                <p>
                  This is a demo documentation for the {spec.info.title} API. Use the navigation on the left to browse
                  the API endpoints.
                </p>

                {spec.servers && spec.servers.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Base URL</h3>
                    <p>The API is available at the following base URL:</p>
                    <pre className="rounded-md bg-muted p-4 overflow-auto">{spec.servers[0].url}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
