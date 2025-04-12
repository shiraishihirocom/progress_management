"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import { FileText } from "lucide-react"

type StudentSummary = {
  id: string
  name: string
  studentNumber?: string
  totalSubmissions: number
  totalAssignments: number
  averageScore: number | null
  lastSubmittedAt: string | null
}

export default function StudentListPage() {
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setStudents([
        {
          id: "1",
          name: "山田 太郎",
          studentNumber: "123456",
          totalSubmissions: 3,
          totalAssignments: 5,
          averageScore: 72,
          lastSubmittedAt: "2025-04-02",
        },
        {
          id: "2",
          name: "佐藤 花子",
          studentNumber: "789012",
          totalSubmissions: 4,
          totalAssignments: 5,
          averageScore: 85,
          lastSubmittedAt: "2025-04-03",
        },
        {
          id: "3",
          name: "鈴木 一郎",
          studentNumber: "345678",
          totalSubmissions: 2,
          totalAssignments: 5,
          averageScore: 68,
          lastSubmittedAt: "2025-04-01",
        },
      ])
      setLoading(false)
    }, 1000)
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
                          <TableCell>{s.averageScore ?? "-"}</TableCell>
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
