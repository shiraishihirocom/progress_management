import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // 教員メールアドレスの場合
        if (user.email === process.env.TEACHER_EMAIL) {
          token.role = "teacher"
        } else {
          // 学生かどうかを確認
          const student = await prisma.student.findUnique({
            where: { email: user.email! },
          })
          token.role = student ? "student" : "unauthorized"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore - 型定義を拡張
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // 教員メールアドレスの場合は許可
        if (user.email === process.env.TEACHER_EMAIL) {
          return true
        }

        // 学生として登録されているか確認
        const student = await prisma.student.findUnique({
          where: { email: user.email! },
        })

        // 学生として登録されていない場合は拒否
        if (!student) {
          return false
        }

        // アカウントの紐付けを確認
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: student.id,
            provider: account?.provider,
          },
        })

        // アカウントが紐付けられていない場合は紐付けを許可
        if (!existingAccount) {
          return true
        }

        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  session: {
    strategy: "jwt",
  },
}
