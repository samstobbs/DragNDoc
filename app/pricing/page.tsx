import { Header } from "@/components/header"
import { PricingSection } from "@/components/pricing-section"
import { FAQ } from "@/components/faq"
import { CTASection } from "@/components/cta-section"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-16 lg:py-24">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Simple, <span className="dragon-text-gradient">transparent</span> pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Choose the plan that's right for you and your team. All plans include a 14-day free trial.
            </p>
          </div>
        </div>

        <PricingSection />

        <FAQ />

        <CTASection />
      </main>

      <footer className="w-full border-t py-6 md:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DragNDoc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
