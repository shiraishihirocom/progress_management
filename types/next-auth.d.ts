import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: "teacher" | "student"
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: "TEACHER" | "STUDENT"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "teacher" | "student"
  }
} 