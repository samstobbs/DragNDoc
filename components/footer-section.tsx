import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import { Logo } from "@/components/logo"

export function FooterSection() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Blog
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
      <div className="container mt-6 flex flex-col items-center justify-center md:mt-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DragNDoc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
