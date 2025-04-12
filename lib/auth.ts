import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

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
        // 教員メールアドレスの場合
        if (user.email === process.env.TEACHER_EMAIL) {
          session.user.role = "teacher"
        } else {
          // 学生かどうかを確認
          const student = await prisma.student.findUnique({
            where: { email: user.email! },
          })
          session.user.role = student ? "student" : undefined
        }
      }
      return session
    },
    async signIn({ user }) {
      // 教員メールアドレスの場合は許可
      if (user.email === process.env.TEACHER_EMAIL) {
        return true
      }

      // 学生として登録されているか確認
      const student = await prisma.student.findUnique({
        where: { email: user.email! },
      })

      // 学生として登録されていない場合は拒否
      return !!student
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
