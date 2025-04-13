"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { Search } from "lucide-react"
import { getStudents } from "@/app/actions/student"
import { toast } from "sonner"
import React from "react"

// 型定義
type Student = {
  id: string
  name: string | null
  email: string | null
  enrollmentYear: number | null
  grade: number | null
  studentNumber: number | null
  createdAt: Date
  updatedAt: Date
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all")
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 学生一覧の取得
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getStudents()
        if (result.success && result.data) {
          setStudents(result.data)
        } else {
          toast.error(result.error || "学生一覧の取得に失敗しました")
        }
      } catch (error) {
        console.error("学生一覧取得エラー:", error)
        toast.error("学生一覧の取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // フィルタリングされた学生リスト
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
    return matchesSearch && matchesGrade
  })

  // 学年の一覧を取得
  const grades = Array.from(new Set(students.map(student => student.grade).filter(Boolean))) as number[]

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
            <h1 className="text-2xl font-bold">👨‍🎓 登録学生一覧</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>学生一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="学生を検索..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select 
                  value={gradeFilter === "all" ? "all" : gradeFilter.toString()} 
                  onValueChange={(value) => setGradeFilter(value === "all" ? "all" : Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="学年でフィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        {grade}年生
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>入学年度</TableHead>
                    <TableHead>学年</TableHead>
                    <TableHead>出席番号</TableHead>
                    <TableHead>登録日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name || "-"}</TableCell>
                      <TableCell>{student.email || "-"}</TableCell>
                      <TableCell>{student.enrollmentYear || "-"}</TableCell>
                      <TableCell>{student.grade || "-"}</TableCell>
                      <TableCell>{student.studentNumber || "-"}</TableCell>
                      <TableCell>{student.createdAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 