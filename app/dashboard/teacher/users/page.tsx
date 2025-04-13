"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Header from "@/components/header"
import { Search, PlusCircle, Pencil, Trash2 } from "lucide-react"
import { getUsers, updateUser, createUser, deleteUser, type UserSummary } from "@/app/actions/user"
import { toast } from "sonner"
import React from "react"
import { User, Role } from "@prisma/client"

const userFormSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: z.enum(["TEACHER", "STUDENT"]),
  courseName: z.string().nullable(),
  enrollmentYear: z.number().nullable(),
  grade: z.number().nullable(),
  studentNumber: z.number().nullable(),
})

type UserFormValues = {
  name: string
  email: string
  role: "TEACHER" | "STUDENT"
  courseName: string | null
  enrollmentYear: number | null
  grade: number | null
  studentNumber: number | null
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "TEACHER" | "STUDENT">("all")
  const [users, setUsers] = useState<UserSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "STUDENT",
      courseName: null,
      enrollmentYear: null,
      grade: null,
      studentNumber: null,
    },
  })

  // ユーザー一覧の取得
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const result = await getUsers()
      if (result.success && result.data) {
        setUsers(result.data)
      } else {
        toast.error(result.error || "ユーザー一覧の取得に失敗しました")
      }
    } catch (error) {
      console.error("ユーザー一覧取得エラー:", error)
      toast.error("ユーザー一覧の取得に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  // フォームのリセット
  const resetForm = () => {
    form.reset({
      name: "",
      email: "",
      role: "STUDENT",
      courseName: null,
      enrollmentYear: null,
      grade: null,
      studentNumber: null,
    })
    setEditingUser(null)
  }

  // ダイアログを開く
  const handleOpenDialog = (user?: UserSummary) => {
    if (user) {
      setEditingUser(user)
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role,
        courseName: user.courseName,
        enrollmentYear: user.enrollmentYear,
        grade: user.grade,
        studentNumber: user.studentNumber,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  // フォームの送信
  const handleSubmit = async (data: z.infer<typeof userFormSchema>) => {
    try {
      setIsLoading(true)

      if (!data.email) {
        toast.error("メールアドレスは必須です")
        return
      }

      if (editingUser) {
        const result = await updateUser(editingUser.id, {
          ...data,
          courseName: data.courseName || null,
        })
        if (result.success) {
          toast.success("ユーザーを更新しました")
          setIsDialogOpen(false)
          setEditingUser(null)
          resetForm()
        } else {
          toast.error(result.error || "ユーザーの更新に失敗しました")
        }
      } else {
        const result = await createUser(
          {
            ...data,
            courseName: data.courseName || null,
          },
          data.role
        )
        if (result.success) {
          toast.success("ユーザーを作成しました")
          setIsDialogOpen(false)
          resetForm()
        } else {
          toast.error(result.error || "ユーザーの作成に失敗しました")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("エラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  // ユーザーの削除
  const handleDeleteUser = async (id: string) => {
    if (!confirm("このユーザーを削除してもよろしいですか？")) return

    try {
      const result = await deleteUser(id)
      if (result.success) {
        toast.success("ユーザーを削除しました")
        fetchUsers()
      } else {
        toast.error(result.error || "ユーザーの削除に失敗しました")
      }
    } catch (error) {
      console.error("エラー:", error)
      toast.error("ユーザーの削除に失敗しました")
    }
  }

  // フィルタリングされたユーザーリスト
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">👥 ユーザー管理</h1>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              新規ユーザー追加
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ユーザー一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ユーザーを検索..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select 
                  value={roleFilter} 
                  onValueChange={(value) => setRoleFilter(value as "all" | "TEACHER" | "STUDENT")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ロールでフィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="TEACHER">教員</SelectItem>
                    <SelectItem value="STUDENT">学生</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>ロール</TableHead>
                    <TableHead>コース名</TableHead>
                    <TableHead>入学年度</TableHead>
                    <TableHead>学年</TableHead>
                    <TableHead>出席番号</TableHead>
                    <TableHead>登録日</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || "-"}</TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "TEACHER"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {user.role === "TEACHER" ? "教員" : "学生"}
                        </span>
                      </TableCell>
                      <TableCell>{user.courseName || "-"}</TableCell>
                      <TableCell>{user.enrollmentYear || "-"}</TableCell>
                      <TableCell>{user.grade || "-"}</TableCell>
                      <TableCell>{user.studentNumber || "-"}</TableCell>
                      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "ユーザー編集" : "新規ユーザー追加"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ロール</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ロールを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEACHER">教員</SelectItem>
                        <SelectItem value="STUDENT">学生</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>コース名</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrollmentYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>入学年度</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学年</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>出席番号</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  キャンセル
                </Button>
                <Button type="submit">
                  {editingUser ? "更新" : "作成"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 