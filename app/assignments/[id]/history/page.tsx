"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye } from "lucide-react"

type SubmissionHistory = {
  version: string
  submittedAt: string
  reviewedAt: string | null
  score: number | null
  status: string
  previewImageUrl?: string
}

export default function SubmissionHistoryPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistory[]>([])
  const [assignmentTitle, setAssignmentTitle] = useState("")

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setAssignmentTitle("人体モデリング課題")
      setSubmissionHistory([
        {
          version: "v1",
          submittedAt: "2025/04/01",
          reviewedAt: null,
          score: null,
          status: "REVIEW_WAITING",
          previewImageUrl: "/placeholder.svg?height=300&width=300",
        },
        {
          version: "v2",
          submittedAt: "2025/04/03",
          reviewedAt: "2025/04/04",
          score: 72,
          status: "REVIEWED",
          previewImageUrl: "/placeholder.svg?height=300&width=300",
        },
        {
          version: "v3",
          submittedAt: "2025/04/05",
          reviewedAt: "2025/04/06",
          score: 85,
          status: "REVIEWED",
          previewImageUrl: "/placeholder.svg?height=300&width=300",
        },
        {
          version: "v4",
          submittedAt: "2025/04/07",
          reviewedAt: null,
          score: null,
          status: "ARCHIVED",
          previewImageUrl: "/placeholder.svg?height=300&width=300",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REVIEW_WAITING":
        return <Badge variant="secondary">レビュー待ち</Badge>
      case "REVIEWED":
        return <Badge variant="default">レビュー済</Badge>
      case "DRAFT":
        return <Badge variant="destructive">下書き</Badge>
      case "RE_REVIEW_REQUESTED":
        return <Badge variant="outline">再提出要</Badge>
      case "ARCHIVED":
        return <Badge variant="secondary">アーカイブ済</Badge>
      default:
        return <Badge>不明</Badge>
    }
  }

  const scoredSubmissions = submissionHistory.filter((s) => s.score !== null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">📊 提出履歴とスコア確認: {assignmentTitle}</h1>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">スコア推移グラフ</h2>
              {loading ? (
                <div className="h-64">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : scoredSubmissions.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoredSubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="version" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  スコアデータがまだありません
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">提出バージョン履歴</h2>
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
                      <TableHead>バージョン</TableHead>
                      <TableHead>状態</TableHead>
                      <TableHead>提出日時</TableHead>
                      <TableHead>レビュー日時</TableHead>
                      <TableHead>スコア</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissionHistory.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.version}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.submittedAt}</TableCell>
                        <TableCell>{item.reviewedAt || "未レビュー"}</TableCell>
                        <TableCell>{item.score !== null ? `${item.score} 点` : "-"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" /> プレビュー
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>{item.version} プレビュー</DialogTitle>
                              </DialogHeader>
                              <div className="mt-2">
                                <img
                                  src={item.previewImageUrl || "/placeholder.svg"}
                                  alt={`${item.version} プレビュー`}
                                  className="w-full rounded-md border"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
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
