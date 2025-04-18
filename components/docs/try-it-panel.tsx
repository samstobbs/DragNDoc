"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OpenAPIOperation, OpenAPIParameter } from "@/lib/openapi-parser"

interface TryItPanelProps {
  path: string
  method: string
  operation: OpenAPIOperation
  servers?: { url: string }[]
}

export function TryItPanel({ path, method, operation, servers = [] }: TryItPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<{ status: number; body: any; headers: any } | null>(null)

  // Create dynamic form schema based on parameters
  const createFormSchema = () => {
    const schema: Record<string, any> = {}

    // Add path parameters
    operation.parameters?.forEach((param) => {
      if (param.required) {
        schema[param.name] = z.string().min(1, { message: `${param.name} is required` })
      } else {
        schema[param.name] = z.string().optional()
      }
    })

    // Add request body if present
    if (operation.requestBody?.content?.["application/json"]) {
      schema.requestBody = z.string().optional()
    }

    return z.object(schema)
  }

  const formSchema = createFormSchema()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setResponse(null)

    try {
      // In a real implementation, this would make an actual API call
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResponse({
        status: 200,
        body: { message: "This is a simulated response", data: values },
        headers: { "content-type": "application/json" },
      })
    } catch (error) {
      console.error("Error making request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getParametersByType = (type: string): OpenAPIParameter[] => {
    return operation.parameters?.filter((param) => param.in === type) || []
  }

  const pathParams = getParametersByType("path")
  const queryParams = getParametersByType("query")
  const headerParams = getParametersByType("header")

  const hasRequestBody = !!operation.requestBody?.content?.["application/json"]

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {servers.length > 0 && (
            <FormField
              control={form.control}
              name="server"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server</FormLabel>
                  <Select defaultValue={servers[0].url} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a server" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servers.map((server, index) => (
                        <SelectItem key={index} value={server.url}>
                          {server.url}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          {pathParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Path Parameters</h3>
              {pathParams.map((param) => (
                <FormField
                  key={param.name}
                  control={form.control}
                  name={param.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {param.name}
                        {param.required && <span className="text-red-500 ml-0.5">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={param.description || param.name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {queryParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Query Parameters</h3>
              {queryParams.map((param) => (
                <FormField
                  key={param.name}
                  control={form.control}
                  name={param.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {param.name}
                        {param.required && <span className="text-red-500 ml-0.5">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={param.description || param.name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {headerParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Header Parameters</h3>
              {headerParams.map((param) => (
                <FormField
                  key={param.name}
                  control={form.control}
                  name={param.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {param.name}
                        {param.required && <span className="text-red-500 ml-0.5">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={param.description || param.name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {hasRequestBody && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Request Body</h3>
              <FormField
                control={form.control}
                name="requestBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="{}"
                        className="font-mono"
                        rows={5}
                        {...field}
                        defaultValue={
                          operation.requestBody?.content?.["application/json"]?.example
                            ? JSON.stringify(operation.requestBody.content["application/json"].example, null, 2)
                            : "{}"
                        }
                      />
                    </FormControl>
                    <FormDescription>Enter a valid JSON object</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Request
              </>
            )}
          </Button>
        </form>
      </Form>

      {response && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium">Response</h3>
          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    response.status >= 200 && response.status < 300
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {response.status}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {response.headers["content-type"] || "application/json"}
              </span>
            </div>
            <Tabs defaultValue="pretty">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <TabsList>
                  <TabsTrigger value="pretty">Pretty</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="pretty" className="p-4">
                <pre className="whitespace-pre-wrap break-all text-sm">{JSON.stringify(response.body, null, 2)}</pre>
              </TabsContent>
              <TabsContent value="raw" className="p-4">
                <pre className="whitespace-pre-wrap break-all text-sm">{JSON.stringify(response.body)}</pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
