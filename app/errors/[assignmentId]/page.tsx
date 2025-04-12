"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"

interface ErrorLog {
  id: string
  studentName: string
  errorMessage: string
  occurredAt: string
  status: string
}

export default function ErrorSummaryPage() {
  const params = useParams()
  const assignmentId = params?.assignmentId as string
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [assignmentTitle, setAssignmentTitle] = useState("")

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setAssignmentTitle("人体モデリング課題")
      setErrors([
        {
          id: "1",
          studentName: "山田 太郎",
          errorMessage: "workspace.mel が含まれていません",
          occurredAt: "2025-04-03",
          status: "未処理"
        },
        {
          id: "2",
          studentName: "鈴木 花子",
          errorMessage: "scenes フォルダが見つかりません",
          occurredAt: "2025-04-02",
          status: "未処理"
        },
        {
          id: "3",
          studentName: "高橋 次郎",
          errorMessage: "workspace.mel が含まれていません",
          occurredAt: "2025-04-03",
          status: "未処理"
        },
        {
          id: "4",
          studentName: "田中 三郎",
          errorMessage: "scenes フォルダが見つかりません",
          occurredAt: "2025-04-02",
          status: "未処理"
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
                        <TableCell className="font-medium">{err.errorMessage}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{i + 1}件</Badge>
                        </TableCell>
                        <TableCell>{err.occurredAt}</TableCell>
                        <TableCell>{err.studentName}</TableCell>
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
