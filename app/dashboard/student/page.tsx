"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Link from "next/link"
import { FileText, Clock, User, BarChart3 } from "lucide-react"

export default function StudentDashboard() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">📋 学生ダッシュボード</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 課題一覧 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">課題一覧</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  全ての課題を確認し、詳細や締め切りを確認できます。
                </p>
                <div className="mt-auto">
                  <Link href="/assignments">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">課題一覧ページへ</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 提出履歴 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">提出履歴</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  過去の提出物とフィードバックを確認できます。
                </p>
                <div className="mt-auto">
                  <Link href="/dashboard/student/history">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      提出履歴を見る
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* プロフィール設定 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">プロフィール設定</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  個人情報や通知設定を管理します。
                </p>
                <div className="mt-auto">
                  <Link href="/dashboard/student/profile">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      プロフィールを編集
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
