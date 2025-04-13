import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"

type Role = "TEACHER" | "STUDENT"
type SessionRole = "teacher" | "student"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // 既存のユーザーを検索
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        })

        // 既存のユーザーが存在する場合
        if (existingUser) {
          // アカウントが既に存在する場合は、そのまま通過
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account?.provider,
            },
          })
          
          if (existingAccount) {
            return true
          }

          // アカウントが紐付けられていない場合は紐付ける
          if (account) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            })
          }
          return true
        }

        // 新規ユーザーの場合
        const role = user.email === process.env.TEACHER_EMAIL ? "TEACHER" : "STUDENT"
        
        // トランザクションを使用して、ユーザーとアカウントを同時に作成
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const newUser = await tx.user.create({
            data: {
              email: user.email!,
              name: user.name || "",
              role: role,
            },
          })

          if (account) {
            await tx.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            })
          }
        })

        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    },
    async session({ session, user, token }) {
      if (session.user && user) {
        session.user.id = user.id
        session.user.role = (user.role as Role).toLowerCase() as SessionRole
      } else if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as SessionRole
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user.role as Role).toLowerCase() as SessionRole
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}
