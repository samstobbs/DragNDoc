import yaml from "js-yaml"
import { parseOpenAPISpec } from "./openapi-parser"
import type { Json } from "@/types/database.types"

export async function parseOpenAPIFile(file: File): Promise<{ content: Json; error?: string }> {
  try {
    const fileContent = await file.text()
    let parsedContent: Json

    // Check if the file is JSON or YAML based on extension
    if (file.name.endsWith(".json")) {
      try {
        parsedContent = JSON.parse(fileContent)
      } catch (e) {
        console.error("Error parsing JSON:", e)
        return { content: {}, error: "Invalid JSON format. Please check your file." }
      }
    } else if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
      try {
        parsedContent = yaml.load(fileContent) as Json
      } catch (e) {
        console.error("Error parsing YAML:", e)
        return { content: {}, error: "Invalid YAML format. Please check your file." }
      }
    } else {
      // Try to parse as JSON first, then YAML if that fails
      try {
        parsedContent = JSON.parse(fileContent)
      } catch (jsonError) {
        try {
          parsedContent = yaml.load(fileContent) as Json
        } catch (yamlError) {
          console.error("Error parsing file:", jsonError, yamlError)
          return { content: {}, error: "Could not parse file as JSON or YAML. Please check your file." }
        }
      }
    }

    // Validate that it's an OpenAPI spec
    const spec = parseOpenAPISpec(parsedContent)
    if (!spec) {
      return { content: {}, error: "Invalid OpenAPI specification. Please check your file." }
    }

    return { content: parsedContent }
  } catch (error) {
    console.error("Error processing file:", error)
    return { content: {}, error: "An error occurred while processing the file." }
  }
}
