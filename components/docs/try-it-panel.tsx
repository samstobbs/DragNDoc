"use client"

import { useState } from "react"
import { Check, Copy, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MethodBadge } from "@/components/docs/method-badge"
import { cn } from "@/lib/utils"

interface TryItPanelProps {
  method: string
  path: string
  servers?: { url: string; description?: string }[]
  parameters?: any[]
  requestBody?: any
  responses?: Record<string, any>
}

export function TryItPanel({ method, path, servers = [], parameters = [], requestBody, responses }: TryItPanelProps) {
  const [selectedServer, setSelectedServer] = useState(servers[0]?.url || "https://api.example.com")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  // Group parameters by type
  const pathParams = parameters.filter((param) => param.in === "path")
  const queryParams = parameters.filter((param) => param.in === "query")
  const headerParams = parameters.filter((param) => param.in === "header")

  // Generate a sample request body if available
  const generateSampleBody = () => {
    if (!requestBody?.content) return ""

    // Try to find JSON content type
    const contentType =
      requestBody.content["application/json"] ||
      requestBody.content["application/x-www-form-urlencoded"] ||
      Object.values(requestBody.content)[0]

    if (!contentType?.schema) return ""

    // Generate a sample based on the schema
    const generateSample = (schema: any): any => {
      if (schema.example) return schema.example

      if (schema.type === "object") {
        const result: Record<string, any> = {}
        if (schema.properties) {
          Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
            result[key] = generateSample(prop)
          })
        }
        return result
      }

      if (schema.type === "array") {
        return [generateSample(schema.items)]
      }

      // Default values based on type
      switch (schema.type) {
        case "string":
          return schema.format === "date-time" ? new Date().toISOString() : "string"
        case "number":
        case "integer":
          return 0
        case "boolean":
          return false
        default:
          return null
      }
    }

    const sample = generateSample(contentType.schema)
    return JSON.stringify(sample, null, 2)
  }

  const [requestBodyContent, setRequestBodyContent] = useState(generateSampleBody())

  // Replace path parameters in the URL
  const getResolvedPath = () => {
    let resolvedPath = path
    pathParams.forEach((param) => {
      const value = formValues[param.name] || `{${param.name}}`
      resolvedPath = resolvedPath.replace(`{${param.name}}`, value)
    })
    return resolvedPath
  }

  // Build the full URL with query parameters
  const getFullUrl = () => {
    const baseUrl = selectedServer.endsWith("/") ? selectedServer.slice(0, -1) : selectedServer
    const resolvedPath = getResolvedPath().startsWith("/") ? getResolvedPath() : `/${getResolvedPath()}`

    const url = new URL(`${baseUrl}${resolvedPath}`)

    // Add query parameters
    queryParams.forEach((param) => {
      const value = formValues[param.name]
      if (value) {
        url.searchParams.append(param.name, value)
      }
    })

    return url.toString()
  }

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendRequest = async () => {
    setLoading(true)
    setResponse(null)

    try {
      const url = getFullUrl()
      const options: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
        },
      }

      // Add header parameters
      const headers = new Headers(options.headers as HeadersInit)
      headerParams.forEach((param) => {
        const value = formValues[param.name]
        if (value) {
          headers.append(param.name, value)
        }
      })
      options.headers = headers

      // Add request body for methods that support it
      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && requestBodyContent) {
        options.body = requestBodyContent
      }

      // Simulate a response instead of making an actual request
      // In a real implementation, you would use fetch(url, options)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get a sample response from the spec
      const successResponse = responses && Object.entries(responses).find(([code]) => code.startsWith("2"))

      if (successResponse) {
        const [code, responseObj] = successResponse
        const contentType =
          responseObj.content && (responseObj.content["application/json"] || Object.values(responseObj.content)[0])

        let responseBody = {}
        if (contentType?.schema) {
          // Use example if available
          if (contentType.example) {
            responseBody = contentType.example
          } else if (contentType.schema.example) {
            responseBody = contentType.schema.example
          }
          // Otherwise could generate a sample based on the schema
        }

        setResponse({
          status: Number.parseInt(code, 10),
          statusText: code === "200" ? "OK" : "Success",
          headers: {
            "content-type": "application/json",
          },
          body: responseBody,
        })
      } else {
        // Default response if no success response is defined
        setResponse({
          status: 200,
          statusText: "OK",
          headers: {
            "content-type": "application/json",
          },
          body: { message: "Success" },
        })
      }
    } catch (error) {
      console.error("Error sending request:", error)
      setResponse({
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "content-type": "application/json",
        },
        body: { error: "Failed to send request" },
      })
    } finally {
      setLoading(false)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(getFullUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MethodBadge method={method} />
          Try It
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="server">Server</Label>
          <Select value={selectedServer} onValueChange={setSelectedServer}>
            <SelectTrigger id="server">
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {servers.length > 0 ? (
                servers.map((server, index) => (
                  <SelectItem key={index} value={server.url}>
                    {server.url} {server.description ? `(${server.description})` : ""}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="https://api.example.com">https://api.example.com (Default)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input value={getFullUrl()} readOnly className="pr-10" />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={copyUrl}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy URL</span>
            </Button>
          </div>
          <Button onClick={handleSendRequest} disabled={loading}>
            {loading ? "Sending..." : "Send"}
            {!loading && <Play className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <Tabs defaultValue="params" className="mt-6">
          <TabsList>
            <TabsTrigger value="params">Parameters</TabsTrigger>
            {requestBody && <TabsTrigger value="body">Body</TabsTrigger>}
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="params" className="space-y-4">
            {pathParams.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Path Parameters</h3>
                <div className="space-y-2">
                  {pathParams.map((param) => (
                    <div key={param.name} className="grid gap-1.5">
                      <Label htmlFor={`path-${param.name}`}>
                        {param.name}
                        {param.required && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id={`path-${param.name}`}
                        placeholder={param.description || param.name}
                        value={formValues[param.name] || ""}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                      />
                      {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {queryParams.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Query Parameters</h3>
                <div className="space-y-2">
                  {queryParams.map((param) => (
                    <div key={param.name} className="grid gap-1.5">
                      <Label htmlFor={`query-${param.name}`}>
                        {param.name}
                        {param.required && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id={`query-${param.name}`}
                        placeholder={param.description || param.name}
                        value={formValues[param.name] || ""}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                      />
                      {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pathParams.length === 0 && queryParams.length === 0 && (
              <p className="text-sm text-muted-foreground">No parameters for this endpoint.</p>
            )}
          </TabsContent>

          {requestBody && (
            <TabsContent value="body">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="request-body">Request Body</Label>
                  <div className="text-xs text-muted-foreground">
                    {Object.keys(requestBody.content || {}).join(", ") || "application/json"}
                  </div>
                </div>
                <Textarea
                  id="request-body"
                  className="font-mono"
                  rows={10}
                  value={requestBodyContent}
                  onChange={(e) => setRequestBodyContent(e.target.value)}
                />
              </div>
            </TabsContent>
          )}

          <TabsContent value="headers">
            <div className="space-y-2">
              {headerParams.length > 0 ? (
                <div className="space-y-2">
                  {headerParams.map((param) => (
                    <div key={param.name} className="grid gap-1.5">
                      <Label htmlFor={`header-${param.name}`}>
                        {param.name}
                        {param.required && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id={`header-${param.name}`}
                        placeholder={param.description || param.name}
                        value={formValues[param.name] || ""}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                      />
                      {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No header parameters for this endpoint.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {response && (
        <CardFooter className="flex flex-col items-start">
          <div className="mb-2 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Response</h3>
              <div
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  response.status >= 200 && response.status < 300
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : response.status >= 400
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                )}
              >
                {response.status} {response.statusText}
              </div>
            </div>
          </div>
          <div className="w-full overflow-auto rounded-md bg-muted p-4">
            <pre className="text-sm">
              <code>{JSON.stringify(response.body, null, 2)}</code>
            </pre>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
