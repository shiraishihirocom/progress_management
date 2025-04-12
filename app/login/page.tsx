import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"

export const metadata: Metadata = {
  title: "ログイン",
  description: "学生・教員用ログインページ",
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
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
