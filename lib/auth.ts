import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"
import type { DefaultSession } from "next-auth"

type Role = "TEACHER" | "STUDENT"
type SessionRole = Lowercase<Role>

declare module "next-auth" {
  type ExtendedUser = {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: SessionRole
  }

  type ExtendedSession = {
    user?: ExtendedUser
    expires: string
  }

  interface Session extends ExtendedSession {}

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: SessionRole
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user.role as Role).toLowerCase() as SessionRole
      }
      return session
    },
    async signIn({ user }) {
      // 教員メールアドレスの場合
      if (user.email === process.env.TEACHER_EMAIL) {
        // ユーザーが存在しない場合は作成
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              role: "TEACHER",
            },
          })
        }
        return true
      }

      // 学生の場合
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        // 新規学生として登録
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            role: "STUDENT",
          },
        })
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // ログインページへのリダイレクトを防ぐ
      if (url.includes('/login')) {
        return baseUrl
      }
      
      // 相対URLの場合はbaseUrlと結合
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // 同じオリジンのURLの場合はそのまま返す
      else if (url.startsWith(baseUrl)) {
        return url
      }
      // それ以外の場合はbaseUrlにリダイレクト
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
}
