import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // If it's the root path, redirect to the dashboard
  if (path === "/") {
    return NextResponse.next()
  }

  // Check if the path starts with /dashboard
  const isAuthRequired = path.startsWith("/dashboard")

  // Get the token from the cookies
  const token = request.cookies.get("supabase-auth-token")?.value

  // If the user is not authenticated and the path requires auth, redirect to login
  if (isAuthRequired && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
