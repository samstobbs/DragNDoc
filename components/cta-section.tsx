import Link from "next/link"
import { DragonButton } from "@/components/ui/dragon-button"

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to get started?</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Join thousands of developers who are already using DragNDoc to create beautiful API documentation.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <DragonButton asChild variant="gradient" size="lg" glow>
              <Link href="/register">Start Free Trial</Link>
            </DragonButton>
            <DragonButton asChild variant="outline" size="lg">
              <Link href="/demo">View Demo</Link>
            </DragonButton>
          </div>
        </div>
      </div>
    </section>
  )
}
