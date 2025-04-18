import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsHeader } from "@/components/docs/docs-header"
import { EndpointCard } from "@/components/docs/endpoint-card"
import { parseOpenAPISpec, getOperationMethods } from "@/lib/openapi-parser"
import { sampleOpenAPI } from "@/lib/sample-openapi"

interface DemoEndpointPageProps {
  params: {
    path: string[]
  }
}

export default function DemoEndpointPage({ params }: DemoEndpointPageProps) {
  const { path } = params
  const spec = parseOpenAPISpec(sampleOpenAPI)

  if (!spec) {
    return <div>Error loading demo documentation</div>
  }

  // The last element in the path array is the HTTP method
  const method = path[path.length - 1]
  // The rest of the path array is the actual path
  const apiPath = `/${path.slice(0, -1).join("/")}`

  // Find the path in the spec
  const pathItem = spec.paths[apiPath]

  if (!pathItem) {
    notFound()
  }

  // Find the operation for the specified method
  const operations = getOperationMethods(pathItem)
  const operation = operations.find((op) => op.method.toLowerCase() === method.toLowerCase())

  if (!operation) {
    notFound()
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
                <Link href="/demo">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Demo
                </Link>
              </Button>
              <div className="rounded-md bg-blue-100 px-4 py-2 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Demo Documentation
              </div>
            </div>

            <div className="space-y-6">
              <EndpointCard
                path={apiPath}
                method={operation.method}
                operation={operation.operation}
                servers={spec.servers}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
