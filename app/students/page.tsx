"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Header from "@/components/header"
import { FileText } from "lucide-react"
import { getStudents, type StudentSummary } from "@/app/actions/student"

export default function StudentListPage() {
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getStudents()
        if (result.success && result.data) {
          setStudents(result.data)
        } else {
          toast.error(result.error || "学生一覧の取得に失敗しました。")
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        toast.error("学生一覧の取得に失敗しました。")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">👨‍🎓 登録学生一覧</h1>

          <Card>
            <CardContent className="p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>氏名</TableHead>
                    <TableHead>学籍番号</TableHead>
                    <TableHead>提出数</TableHead>
                    <TableHead>平均スコア</TableHead>
                    <TableHead>最終提出日</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          {[...Array(6)].map((__, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : students.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>{s.studentNumber || "-"}</TableCell>
                          <TableCell>{`${s.totalSubmissions} / ${s.totalAssignments}`}</TableCell>
                          <TableCell>
                            {s.averageScore !== null ? `${Math.round(s.averageScore)}点` : "-"}
                          </TableCell>
                          <TableCell>{s.lastSubmittedAt ? s.lastSubmittedAt : "-"}</TableCell>
                          <TableCell>
                            <Link href={`/students/${s.id}`}>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-muted flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" /> 詳細
                              </Badge>
                            </Link>
                          </TableCell>
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
