"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { PlusCircle, Users, FileText, AlertTriangle, BarChart3, Settings, List } from "lucide-react"

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">📋 教員ダッシュボード</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 課題作成 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">新しい課題を作成</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  課題タイトル・説明・締切日を入力し、課題を新規作成します。
                </p>
                <div className="mt-auto">
                  <Link href="/assignments/new">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">課題作成ページへ</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 課題一覧 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">課題一覧</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  作成した全ての課題を確認・編集・管理できます。
                </p>
                <div className="mt-auto">
                  <Link href="/assignments">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">課題一覧ページへ</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* エラー集計 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h2 className="text-lg font-semibold">提出エラーを確認</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">提出ファイルの不備や構成ミスをまとめて確認できます。</p>
                <div className="mt-auto">
                  <Link href="/errors/2025課題ID仮">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      エラー集計ページへ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 学生一覧 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">学生一覧と成績確認</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">提出履歴・スコア・進捗を学生ごとに確認できます。</p>
                <div className="mt-auto">
                  <Link href="/students">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      学生一覧ページへ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* システム統計 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">システム統計</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  システム全体の利用状況や統計情報を確認できます。
                </p>
                <div className="mt-auto">
                  <Link href="/dashboard/teacher/statistics">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      統計ページへ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* ユーザー管理 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">ユーザー管理</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  学生・教員のアカウント作成、編集、ロール変更を行います。
                </p>
                <div className="mt-auto">
                  <Link href="/dashboard/teacher/users">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      ユーザー管理ページへ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* システム設定 */}
            <Card>
              <CardContent className="p-6 flex flex-col h-[200px]">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">システム設定</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  システムの設定や環境設定を管理します。
                </p>
                <div className="mt-auto">
                  <Link href="/dashboard/teacher/settings">
                    <Button className="w-full bg-black text-white hover:bg-gray-800" variant="outline">
                      設定ページへ
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
