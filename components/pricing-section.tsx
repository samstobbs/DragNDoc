import Link from "next/link"
import { DragonButton } from "@/components/ui/dragon-button"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Free Tier */}
          <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pt-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <DragonButton className="mt-6 w-full" variant="outline" asChild>
                <Link href="/register">Get Started</Link>
              </DragonButton>
            </div>
            <div className="flex flex-col gap-2 p-6 pt-0">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>1 project</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Subdomain hosting</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic customization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Public documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Interactive "Try It" feature</span>
              </div>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium">
              Popular
            </div>
            <div className="p-6 pt-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-muted-foreground">For professionals and small teams</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <DragonButton className="mt-6 w-full" variant="gradient" glow asChild>
                <Link href="/register?plan=pro">Get Started</Link>
              </DragonButton>
            </div>
            <div className="flex flex-col gap-2 p-6 pt-0">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>5 projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Custom domain support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Advanced customization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Password-protected docs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Multiple versions</span>
              </div>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pt-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <p className="text-muted-foreground">For large teams and organizations</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <DragonButton className="mt-6 w-full" variant="gradient-outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </DragonButton>
            </div>
            <div className="flex flex-col gap-2 p-6 pt-0">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Team collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>SSO integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Advanced security</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Dedicated support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Custom integrations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
