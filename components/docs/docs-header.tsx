import Link from "next/link"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"

interface DocsHeaderProps {
  projectName: string
  projectSlug: string
}

export function DocsHeader({ projectName, projectSlug }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/docs/${projectSlug}`} className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="ml-2 font-medium">{projectName}</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
