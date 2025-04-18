"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  ChevronDown,
  Code,
  CreditCard,
  ExternalLink,
  FileText,
  Flame,
  Github,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        // Get user profile from database
        const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

        setUser({
          ...data.user,
          profile,
        })
      }
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    const email = user.email || ""
    return email.substring(0, 2).toUpperCase()
  }

  // Get user plan tier
  const getUserPlanTier = () => {
    if (!user?.profile) return "Free"
    return user.profile.plan_tier.charAt(0).toUpperCase() + user.profile.plan_tier.slice(1)
  }

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      {/* Sidebar Header with Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-red-500 to-fuchsia-600 text-white shadow-lg">
            <Flame className="h-5 w-5 animate-flicker" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-red-500 to-fuchsia-600">
            DragNDoc
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>

          <p className="mb-1 mt-4 px-4 text-xs font-semibold text-muted-foreground">Projects</p>

          <Link
            href="/dashboard/projects"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/projects" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <FileText className="h-4 w-4" />
            All Projects
          </Link>

          <Link
            href="/dashboard/projects/new"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/projects/new" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>

          <p className="mb-1 mt-4 px-4 text-xs font-semibold text-muted-foreground">Tools</p>

          <Link
            href="/dashboard/editor"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/editor" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <Code className="h-4 w-4" />
            API Editor
          </Link>

          <Link
            href="/dashboard/documentation"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/documentation" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </Link>

          <p className="mb-1 mt-4 px-4 text-xs font-semibold text-muted-foreground">Account</p>

          <Link
            href="/dashboard/team"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/team" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Team
          </Link>

          <Link
            href="/dashboard/billing"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/billing" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </Link>

          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Help & Support */}
      <div className="border-t px-2 py-2">
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard/help"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LifeBuoy className="h-4 w-4" />
            Help & Support
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/dragnDoc/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>View our GitHub repository</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="border-t p-2">
        <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 via-red-500 to-fuchsia-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <p className="text-sm font-medium">{user?.email?.split("@")[0] || "User"}</p>
                  <p className="text-xs text-muted-foreground">{getUserPlanTier()}</p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.email || "user@example.com"}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 via-red-500 to-fuchsia-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.email?.split("@")[0] || "User"}</p>
                    <p className="text-xs text-primary">{getUserPlanTier()}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/team" className="flex w-full cursor-pointer items-center">
                <Users className="mr-2 h-4 w-4" />
                Switch Team
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing" className="flex w-full cursor-pointer items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex w-full cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="https://discord.gg/dragnDoc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full cursor-pointer items-center"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Discord
                <ExternalLink className="ml-auto h-3 w-3" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <p className="mb-2 text-xs font-semibold">Preferences</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <div className="flex items-center gap-1 rounded-md border p-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="sr-only">System</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                    <span className="sr-only">Light</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                    <span className="sr-only">Dark</span>
                  </Button>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="gradient" className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
