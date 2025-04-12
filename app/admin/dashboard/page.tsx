"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, FileText, Settings, Bell, BarChart3, Shield, Database, HardDrive, RefreshCw } from "lucide-react"
import Link from "next/link"

type SystemStats = {
  totalStudents: number
  totalTeachers: number
  totalAssignments: number
  totalSubmissions: number
  storageUsed: string
  lastBackup: string | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setStats({
        totalStudents: 45,
        totalTeachers: 5,
        totalAssignments: 12,
        totalSubmissions: 238,
        storageUsed: "2.4 GB",
        lastBackup: "2025-04-10 15:30:00",
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🛡️ 管理者ダッシュボード</h1>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              更新
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="users">ユーザー管理</TabsTrigger>
              <TabsTrigger value="system">システム設定</TabsTrigger>
              <TabsTrigger value="backup">バックアップ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-8 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">学生数</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.totalStudents}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">教員数</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.totalTeachers}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">課題数</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.totalAssignments}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">提出数</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.totalSubmissions}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">ストレージ使用量</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.storageUsed}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-medium">最終バックアップ</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.lastBackup || "なし"}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">クイックアクション</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Link href="/admin/users">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        ユーザー管理
                      </Button>
                    </Link>
                    <Link href="/admin/statistics">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        統計ダッシュボード
                      </Button>
                    </Link>
                    <Link href="/admin/notifications">
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="mr-2 h-4 w-4" />
                        通知管理
                      </Button>
                    </Link>
                    <Link href="/admin/settings">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        システム設定
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">システム状態</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">データベース接続</span>
                      <span className="flex items-center text-green-500">
                        <Shield className="h-4 w-4 mr-1" />
                        正常
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Google Drive API</span>
                      <span className="flex items-center text-green-500">
                        <Shield className="h-4 w-4 mr-1" />
                        正常
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">認証システム</span>
                      <span className="flex items-center text-green-500">
                        <Shield className="h-4 w-4 mr-1" />
                        正常
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">バックアップシステム</span>
                      <span className="flex items-center text-green-500">
                        <Shield className="h-4 w-4 mr-1" />
                        正常
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>ユーザー管理</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/admin/users/students">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        学生一覧管理
                      </Button>
                    </Link>
                    <Link href="/admin/users/teachers">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        教員一覧管理
                      </Button>
                    </Link>
                    <Link href="/admin/users/admins">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        管理者一覧管理
                      </Button>
                    </Link>
                    <Link href="/admin/users/import">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        一括インポート
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>システム設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/admin/settings/general">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        一般設定
                      </Button>
                    </Link>
                    <Link href="/admin/settings/google">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Google連携設定
                      </Button>
                    </Link>
                    <Link href="/admin/settings/notifications">
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="mr-2 h-4 w-4" />
                        通知設定
                      </Button>
                    </Link>
                    <Link href="/admin/settings/security">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        セキュリティ設定
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>バックアップと復元</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      手動バックアップを作成
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      バックアップから復元
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      自動バックアップ設定
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      バックアップ履歴
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
