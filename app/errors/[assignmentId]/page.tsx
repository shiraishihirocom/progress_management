"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"

type ErrorLog = {
  message: string
  count: number
  lastOccurredAt: string
  students: { name: string; studentNumber?: string }[]
}

export default function ErrorSummaryPage() {
  const params = useParams()
  const assignmentId = params.assignmentId as string
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [assignmentTitle, setAssignmentTitle] = useState("")

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデ���タを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setAssignmentTitle("人体モデリング課題")
      setErrors([
        {
          message: "workspace.mel が含まれていません",
          count: 3,
          lastOccurredAt: "2025-04-03",
          students: [
            { name: "山田 太郎", studentNumber: "123456" },
            { name: "鈴木 花子" },
            { name: "佐藤 一郎", studentNumber: "789012" },
          ],
        },
        {
          message: "scenes フォルダが見つかりません",
          count: 2,
          lastOccurredAt: "2025-04-02",
          students: [{ name: "高橋 次郎", studentNumber: "345678" }, { name: "田中 三郎" }],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [assignmentId])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">⚠️ 提出エラー集計: {assignmentTitle || `課題ID ${assignmentId}`}</h1>

          {loading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : errors.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                <div className="rounded-full bg-green-50 p-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">提出エラーは検出されていません</h3>
                <p className="text-muted-foreground mt-2">この課題に関連するエラーは現在ありません。</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>エラー内容</TableHead>
                      <TableHead>件数</TableHead>
                      <TableHead>最終発生</TableHead>
                      <TableHead>該当学生</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errors.map((err, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{err.message}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{err.count}件</Badge>
                        </TableCell>
                        <TableCell>{err.lastOccurredAt}</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1 text-sm">
                            {err.students.map((s, i) => (
                              <li key={i}>
                                {s.name} {s.studentNumber ? `（${s.studentNumber}）` : ""}
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
