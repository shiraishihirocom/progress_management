"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>アクセスが拒否されました</CardTitle>
            <CardDescription>
              このアカウントではシステムにアクセスできません。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                以下のいずれかの理由が考えられます：
              </p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                <li>学生として登録されていない</li>
                <li>教員アカウントではない</li>
                <li>アカウントが無効化されている</li>
              </ul>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="text-sm text-primary hover:underline"
                >
                  ログインページに戻る
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
