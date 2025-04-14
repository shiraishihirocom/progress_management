import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "ログイン",
  description: "学生・教員用ログインページ",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string }
}) {
  const session = await getServerSession(authOptions)
  const error = searchParams.error
  const email = searchParams.email

  if (session) {
    // ユーザーがデータベースに登録されているか確認
    const registeredUser = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    })

    if (registeredUser) {
      // 登録済みユーザーの場合、役割に応じてダッシュボードにリダイレクト
      if (registeredUser.role === "TEACHER") {
        redirect("/dashboard/teacher")
      } else if (registeredUser.role === "STUDENT") {
        redirect("/dashboard/student")
      }
    }
    // 登録されていない場合はログインページに留まり、メッセージを表示
  }

  // エラーメッセージを取得
  let errorMessage = ""
  if (error === "not_registered") {
    errorMessage = `このメールアドレス（${email}）はシステムに登録されていません。管理者に連絡してください。`
  } else if (error === "database_error") {
    errorMessage = "システムエラーが発生しました。管理者に連絡してください。"
  } else if (error) {
    errorMessage = "ログインに失敗しました。再度お試しください。"
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            ログイン
          </h1>
          <p className="text-sm text-muted-foreground">
            学生・教員共通でこのボタンを使います。
          </p>
          {session && (
            <p className="mt-2 text-sm text-red-500">
              このアカウントはシステムに登録されていません。管理者に連絡してください。
            </p>
          )}
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </div>
        <LoginButton />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-brand underline underline-offset-4"
          >
            トップページに戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
