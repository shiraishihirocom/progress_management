import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    // ユーザーがログインしている場合、データベースに登録されているか確認
    const registeredUser = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    })

    // 登録されているユーザーのみダッシュボードにリダイレクト
    if (registeredUser) {
      if (registeredUser.role === "TEACHER") {
        redirect("/dashboard/teacher")
      } else if (registeredUser.role === "STUDENT") {
        redirect("/dashboard/student")
      }
    }
    // 登録されていない場合はホームページのままになる
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">3Dモデリング課題管理システム</h1>
          <p className="text-xl text-muted-foreground">
            専門学校における3Dモデリング課題の提出・管理を効率化するシステムです。
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
