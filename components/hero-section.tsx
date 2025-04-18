import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DragonButton } from "@/components/ui/dragon-button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Modern <span className="dragon-text-gradient">OpenAPI Documentation</span> with Drag & Drop Simplicity
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Upload your OpenAPI spec and create beautiful, customizable documentation in seconds. Drag, drop, and
                design your perfect API docs.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <DragonButton asChild variant="gradient" size="lg" glow>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </DragonButton>
              <DragonButton asChild variant="outline" size="lg">
                <Link href="/demo">View Demo</Link>
              </DragonButton>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[400px] rounded-lg border bg-background p-4 shadow-lg">
              <div className="flex items-center gap-2 border-b pb-4">
                <div className="h-5 w-5 rounded-full bg-primary animate-fire-pulse"></div>
                <span className="font-medium">petstore-api.yaml</span>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">GET</div>
                    <span className="font-mono text-sm">/pets</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">List all pets</p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">POST</div>
                    <span className="font-mono text-sm">/pets</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Create a pet</p>
                </div>
                <div className="drag-indicator drag-indicator-active p-4 animate-drag-indicator">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">GET</div>
                    <span className="font-mono text-sm">/pets/{"{petId}"}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Info for a specific pet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
