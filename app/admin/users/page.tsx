"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, UserPlus, Shield, Trash2, PencilLine } from "lucide-react"
import Link from "next/link"

type User = {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          name: "山田 太郎",
          email: "yamada@example.com",
          role: "student",
          createdAt: "2025-01-15",
        },
        {
          id: "2",
          name: "佐藤 花子",
          email: "sato@example.com",
          role: "student",
          createdAt: "2025-01-20",
        },
        {
          id: "3",
          name: "鈴木 先生",
          email: "suzuki@example.com",
          role: "teacher",
          createdAt: "2024-12-01",
        },
        {
          id: "4",
          name: "田中 管理者",
          email: "tanaka@example.com",
          role: "admin",
          createdAt: "2024-11-10",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">管理者</Badge>
      case "teacher":
        return <Badge className="bg-blue-500">教員</Badge>
      case "student":
        return <Badge>学生</Badge>
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">👥 ユーザー管理</h1>
            <Link href="/admin/users/new">
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                新規ユーザー
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ユーザー一覧</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="名前またはメールで検索"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">全て</TabsTrigger>
                  <TabsTrigger value="students">学生</TabsTrigger>
                  <TabsTrigger value="teachers">教員</TabsTrigger>
                  <TabsTrigger value="admins">管理者</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>名前</TableHead>
                          <TableHead>メールアドレス</TableHead>
                          <TableHead>ロール</TableHead>
                          <TableHead>登録日</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" title="編集">
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="削除">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                {user.role !== "admin" && (
                                  <Button variant="ghost" size="icon" title="管理者に昇格">
                                    <Shield className="h-4 w-4 text-purple-500" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="students">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>メールアドレス</TableHead>
                        <TableHead>登録日</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter((user) => user.role === "student")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" title="編集">
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="削除">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="teachers">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>メールアドレス</TableHead>
                        <TableHead>登録日</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter((user) => user.role === "teacher")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" title="編集">
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="削除">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="admins">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>メールアドレス</TableHead>
                        <TableHead>登録日</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter((user) => user.role === "admin")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" title="編集">
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="削除">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
