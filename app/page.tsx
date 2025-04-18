import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DragDropDemo } from "@/components/drag-drop-demo"
import { DragonButton } from "@/components/ui/dragon-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Customize Your API Docs with <span className="dragon-text-gradient">Drag & Drop</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Rearrange endpoints, customize sections, and create the perfect documentation experience for your
                  users.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <DragDropDemo />
            </div>
          </div>
        </section>

        {/* Additional sections would go here */}
      </main>

      <footer className="w-full border-t py-6 md:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DragNDoc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <DragonButton variant="ghost" size="sm">
              Terms
            </DragonButton>
            <DragonButton variant="ghost" size="sm">
              Privacy
            </DragonButton>
          </div>
        </div>
      </footer>
    </div>
  )
}
