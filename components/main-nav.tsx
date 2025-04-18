import Link from "next/link"
import { Logo } from "@/components/logo"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Logo />
      </Link>
      <nav className="flex gap-6">
        <Link
          href="#features"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Pricing
        </Link>
        <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Documentation
        </Link>
      </nav>
    </div>
  )
}
