"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MethodBadge } from "@/components/docs/method-badge"
import { TryItPanel } from "@/components/docs/try-it-panel"
import { ParametersTable } from "@/components/docs/parameters-table"
import { ResponsesTable } from "@/components/docs/responses-table"
import { SchemaViewer } from "@/components/docs/schema-viewer"
import type { OpenAPIOperation } from "@/lib/openapi-parser"

interface EndpointCardProps {
  path: string
  method: string
  operation: OpenAPIOperation
  servers?: { url: string }[]
}

export function EndpointCard({ path, method, operation, servers }: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MethodBadge method={method} />
            <div>
              <CardTitle className="font-mono text-base">{path}</CardTitle>
              {operation.summary && <CardDescription>{operation.summary}</CardDescription>}
            </div>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {operation.description && <p className="mb-4 text-sm text-muted-foreground">{operation.description}</p>}

          <Tabs defaultValue="parameters">
            <TabsList>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              {operation.requestBody && <TabsTrigger value="request">Request Body</TabsTrigger>}
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="try">Try It</TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="py-4">
              {operation.parameters && operation.parameters.length > 0 ? (
                <ParametersTable parameters={operation.parameters} />
              ) : (
                <p className="text-sm text-muted-foreground">No parameters</p>
              )}
            </TabsContent>

            {operation.requestBody && (
              <TabsContent value="request" className="py-4">
                <div className="space-y-4">
                  {operation.requestBody.description && (
                    <p className="text-sm text-muted-foreground">{operation.requestBody.description}</p>
                  )}
                  {Object.entries(operation.requestBody.content || {}).map(([contentType, content]) => (
                    <div key={contentType}>
                      <h4 className="mb-2 text-sm font-medium">{contentType}</h4>
                      {content.schema && <SchemaViewer schema={content.schema} />}
                      {content.example && (
                        <div className="mt-4">
                          <h5 className="mb-2 text-sm font-medium">Example:</h5>
                          <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                            {JSON.stringify(content.example, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="responses" className="py-4">
              <ResponsesTable responses={operation.responses} />
            </TabsContent>

            <TabsContent value="try" className="py-4">
              <TryItPanel path={path} method={method} operation={operation} servers={servers} />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}
