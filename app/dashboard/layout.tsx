import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { createServerSupabaseClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Dashboard | DragNDoc",
  description: "Manage your API documentation with DragNDoc",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
