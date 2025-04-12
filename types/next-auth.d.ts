import "next-auth"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "teacher" | "student"
    }
  }
  
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: "teacher" | "student"
  }
} 