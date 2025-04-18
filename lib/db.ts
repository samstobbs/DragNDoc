// This is a placeholder for the database schema
// In a real application, you would use Prisma or another ORM

export type User = {
  id: string
  email: string
  name: string | null
  planTier: "free" | "pro" | "enterprise"
  createdAt: Date
  updatedAt: Date
}

export type Project = {
  id: string
  name: string
  slug: string
  description: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type ApiSpec = {
  id: string
  projectId: string
  version: string
  filePath: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export type Customization = {
  id: string
  projectId: string
  logoUrl: string | null
  primaryColor: string | null
  theme: "light" | "dark" | "system"
  createdAt: Date
  updatedAt: Date
}
