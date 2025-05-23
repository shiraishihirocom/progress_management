"use client"

import { useState, useEffect } from "react"
import { getStudents, type StudentSummary } from "@/app/actions/student"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { Search } from "lucide-react"

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      const { success, data, error } = await getStudents()
      if (success && data) {
        setStudents(data)
      }
      setIsLoading(false)
    }
    fetchStudents()
  }, [])

  // フィルタリングされた学生リスト
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = courseFilter === "all" || student.courseName === courseFilter
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
    return matchesSearch && matchesCourse && matchesGrade
  })

  // コース名の一覧を取得
  const courses = Array.from(new Set(students.map(student => student.courseName).filter(Boolean))) as string[]
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
            <h1 className="text-2xl font-bold">👥 登録学生一覧</h1>
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
                  value={courseFilter} 
                  onValueChange={setCourseFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="コースでフィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのコース</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={gradeFilter === "all" ? "all" : gradeFilter.toString()} 
                  onValueChange={(value) => setGradeFilter(value === "all" ? "all" : Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="学年でフィルタ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべての学年</SelectItem>
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
                    <TableHead>氏名</TableHead>
                    <TableHead>コース名</TableHead>
                    <TableHead>入学年度</TableHead>
                    <TableHead>学年</TableHead>
                    <TableHead>出席番号</TableHead>
                    <TableHead>提出数</TableHead>
                    <TableHead>課題数</TableHead>
                    <TableHead>平均点</TableHead>
                    <TableHead>最終提出日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.courseName === "未設定" 
                            ? "bg-gray-100 text-gray-600" 
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {student.courseName || "-"}
                        </span>
                      </TableCell>
                      <TableCell>{student.enrollmentYear || "-"}</TableCell>
                      <TableCell>{student.grade || "-"}</TableCell>
                      <TableCell>{student.studentNumber || "-"}</TableCell>
                      <TableCell>{student.totalSubmissions}</TableCell>
                      <TableCell>{student.totalAssignments}</TableCell>
                      <TableCell>
                        {student.averageScore !== null ? student.averageScore.toFixed(1) : "-"}
                      </TableCell>
                      <TableCell>{student.lastSubmittedAt || "-"}</TableCell>
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
