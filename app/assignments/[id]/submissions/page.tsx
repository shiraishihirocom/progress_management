"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

type SubmissionItem = {
  studentId: string
  studentName: string
  studentEmail: string
  submittedAt?: string
  score?: number
  status: "未提出" | "レビュー待ち" | "レビュー済"
  previewImageUrl?: string
}

export default function AssignmentSubmissionsPage() {
  const { id: assignmentId } = useParams()
  const [data, setData] = useState<SubmissionItem[]>([])
  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setAssignmentTitle("人体モデリング課題")
      setData([
        {
          studentId: "1",
          studentName: "山田 太郎",
          studentEmail: "yamada@example.com",
          submittedAt: "2025/04/10",
          status: "レビュー待ち",
          previewImageUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          studentId: "2",
          studentName: "佐藤 花子",
          studentEmail: "sato@example.com",
          submittedAt: "2025/04/08",
          score: 85,
          status: "レビュー済",
          previewImageUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          studentId: "3",
          studentName: "鈴木 一郎",
          studentEmail: "suzuki@example.com",
          status: "未提出",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [assignmentId])

  const badgeVariant = (status: string) => {
    switch (status) {
      case "レビュー済":
        return "default"
      case "レビュー待ち":
        return "secondary"
      case "未提出":
      default:
        return "destructive"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">📦 提出一覧：{assignmentTitle || `課題ID ${assignmentId}`}</h1>

          <Card>
            <CardContent className="p-6 overflow-x-auto">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>学生名</TableHead>
                      <TableHead>提出日時</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>スコア</TableHead>
                      <TableHead>プレビュー</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.studentName}</TableCell>
                        <TableCell>{item.submittedAt || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>{item.score != null ? `${item.score} 点` : "-"}</TableCell>
                        <TableCell>
                          {item.previewImageUrl ? (
                            <img
                              src={item.previewImageUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="w-16 h-16 object-cover border rounded-md"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {item.status === "レビュー待ち" || item.status === "レビュー済" ? (
                            <Link
                              href={`/assignments/${assignmentId}/review?studentEmail=${encodeURIComponent(item.studentEmail)}&studentName=${encodeURIComponent(item.studentName)}`}
                            >
                              <Button size="sm">{item.status === "レビュー済" ? "編集" : "レビューへ"}</Button>
                            </Link>
                          ) : (
                            <Button size="sm" disabled variant="outline">
                              なし
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
