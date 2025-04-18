"use client"

import { useState, useCallback } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MethodBadge } from "@/components/docs/method-badge"
import { ParametersTable } from "@/components/docs/parameters-table"
import { ResponsesTable } from "@/components/docs/responses-table"
import { SchemaViewer } from "@/components/docs/schema-viewer"
import { TryItPanel } from "@/components/docs/try-it-panel"
import type { OpenAPIOperation } from "@/lib/openapi-parser"

interface EndpointDetailProps {
  path: string
  method: string
  operation: OpenAPIOperation
  servers?: { url: string }[]
}

export function EndpointDetail({ path, method, operation, servers }: EndpointDetailProps) {
  // Track which element is being copied
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = useCallback(
    (text: string, id: string) => {
      if (copiedId) return // Prevent multiple clicks

      navigator.clipboard.writeText(text)
      setCopiedId(id)

      // Clear the copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    },
    [copiedId],
  )

  const renderCurlExample = useCallback(() => {
    let curlCommand = `curl -X ${method.toUpperCase()}`

    // Add headers
    if (operation.parameters?.some((p) => p.in === "header")) {
      operation.parameters
        .filter((p) => p.in === "header")
        .forEach((p) => {
          curlCommand += ` \\\n  -H "${p.name}: value"`
        })
    }

    // Add content type if there's a request body
    if (operation.requestBody) {
      curlCommand += ` \\\n  -H "Content-Type: application/json"`
    }

    // Add auth if specified
    curlCommand += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN"`

    // Add request body if needed
    if (operation.requestBody?.content?.["application/json"]) {
      const example = operation.requestBody.content["application/json"].example
      if (example) {
        curlCommand += ` \\\n  -d '${JSON.stringify(example, null, 2)}'`
      } else {
        curlCommand += ` \\\n  -d '{}'`
      }
    }

    // Add URL
    const baseUrl = servers && servers.length > 0 ? servers[0].url : "https://api.example.com"
    curlCommand += ` \\\n  "${baseUrl}${path}"`

    return curlCommand
  }, [method, operation, path, servers])

  return (
    <div className="space-y-8">
      {/* Endpoint Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <MethodBadge method={method} size="lg" />
          <h1 className="text-2xl font-bold font-mono">{path}</h1>
        </div>
        {operation.summary && <p className="text-lg text-muted-foreground">{operation.summary}</p>}
        {operation.description && (
          <div className="prose max-w-none dark:prose-invert">
            <p>{operation.description}</p>
          </div>
        )}
      </div>

      {/* Request Example */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Request</h2>
        <div className="rounded-md border bg-muted/40">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <MethodBadge method={method} />
              <span className="font-mono text-sm">{path}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => copyToClipboard(`${method.toUpperCase()} ${path}`, "path")}
            >
              {copiedId === "path" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedId === "path" ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="p-4">
            <Tabs defaultValue="curl">
              <TabsList className="mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl" className="mt-0">
                <div className="relative">
                  <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">{renderCurlExample()}</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 gap-1 text-xs"
                    onClick={() => copyToClipboard(renderCurlExample(), "curl")}
                  >
                    {copiedId === "curl" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="js" className="mt-0">
                <div className="relative">
                  <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                    {`// Using fetch
const response = await fetch("${servers && servers.length > 0 ? servers[0].url : "https://api.example.com"}${path}", {
  method: "${method.toUpperCase()}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
  }${
    operation.requestBody?.content?.["application/json"]
      ? `,
  body: JSON.stringify(${JSON.stringify(operation.requestBody.content["application/json"].example || {}, null, 2)})`
      : ""
  }
});

const data = await response.json();
console.log(data);`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 gap-1 text-xs"
                    onClick={() =>
                      copyToClipboard(
                        `// Using fetch
const response = await fetch("${servers && servers.length > 0 ? servers[0].url : "https://api.example.com"}${path}", {
  method: "${method.toUpperCase()}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
  }${
    operation.requestBody?.content?.["application/json"]
      ? `,
  body: JSON.stringify(${JSON.stringify(operation.requestBody.content["application/json"].example || {}, null, 2)})`
      : ""
  }
});

const data = await response.json();
console.log(data);`,
                        "js",
                      )
                    }
                  >
                    {copiedId === "js" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="python" className="mt-0">
                <div className="relative">
                  <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                    {`import requests

url = "${servers && servers.length > 0 ? servers[0].url : "https://api.example.com"}${path}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}${
                      operation.requestBody?.content?.["application/json"]
                        ? `
payload = ${JSON.stringify(operation.requestBody.content["application/json"].example || {}, null, 2)}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)`
                        : `

response = requests.${method.toLowerCase()}(url, headers=headers)`
                    }
data = response.json()
print(data)`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 gap-1 text-xs"
                    onClick={() =>
                      copyToClipboard(
                        `import requests

url = "${servers && servers.length > 0 ? servers[0].url : "https://api.example.com"}${path}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}${
                          operation.requestBody?.content?.["application/json"]
                            ? `
payload = ${JSON.stringify(operation.requestBody.content["application/json"].example || {}, null, 2)}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)`
                            : `

response = requests.${method.toLowerCase()}(url, headers=headers)`
                        }
data = response.json()
print(data)`,
                        "python",
                      )
                    }
                  >
                    {copiedId === "python" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="parameters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          {operation.requestBody && <TabsTrigger value="request">Request Body</TabsTrigger>}
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="try">Try It</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-4">
          {operation.parameters && operation.parameters.length > 0 ? (
            <ParametersTable parameters={operation.parameters} />
          ) : (
            <div className="rounded-md border p-4 text-center text-muted-foreground">
              No parameters required for this endpoint.
            </div>
          )}
        </TabsContent>

        {operation.requestBody && (
          <TabsContent value="request" className="space-y-4">
            {operation.requestBody.description && (
              <p className="text-muted-foreground">{operation.requestBody.description}</p>
            )}
            {Object.entries(operation.requestBody.content || {}).map(([contentType, content]) => (
              <div key={contentType} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{contentType}</span>
                  {operation.requestBody.required && (
                    <span className="rounded-md bg-destructive/10 text-destructive px-2 py-1 text-xs font-medium">
                      Required
                    </span>
                  )}
                </div>
                {content.schema && <SchemaViewer schema={content.schema} />}
                {content.example && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Example:</h4>
                    <div className="relative">
                      <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                        {JSON.stringify(content.example, null, 2)}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-8 gap-1 text-xs"
                        onClick={() =>
                          copyToClipboard(JSON.stringify(content.example, null, 2), `example-${contentType}`)
                        }
                      >
                        {copiedId === `example-${contentType}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        )}

        <TabsContent value="responses" className="space-y-4">
          <ResponsesTable responses={operation.responses} />
        </TabsContent>

        <TabsContent value="try" className="space-y-4">
          <TryItPanel path={path} method={method} operation={operation} servers={servers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
