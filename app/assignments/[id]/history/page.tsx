"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface SubmissionHistory {
  id: string
  submittedAt: Date
  status: string
  score: number | null
  feedback: string | null
  previewImageUrl?: string
}

export default function SubmissionHistoryPage() {
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(true)
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistory[]>([])
  const [assignmentTitle, setAssignmentTitle] = useState("")

  useEffect(() => {
    // TODO: APIから提出履歴を取得
    setAssignmentTitle("プログラミング基礎 第1回")
    setSubmissionHistory([
      {
        id: "v1",
        submittedAt: new Date("2025-04-01"),
        status: "REVIEW_WAITING",
        score: null,
        feedback: null,
        previewImageUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "v2",
        submittedAt: new Date("2025-04-03"),
        status: "REVIEWED",
        score: 72,
        feedback: null,
        previewImageUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "v3",
        submittedAt: new Date("2025-04-05"),
        status: "REVIEWED",
        score: 85,
        feedback: null,
        previewImageUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "v4",
        submittedAt: new Date("2025-04-07"),
        status: "ARCHIVED",
        score: null,
        feedback: null,
        previewImageUrl: "/placeholder.svg?height=300&width=300",
      },
    ])
    setLoading(false)
  }, [])

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
                      <XAxis
                        dataKey="id"
                        tickFormatter={(str) => {
                          const date = new Date(str)
                          return format(date, "MMM d", { locale: ja })
                        }}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        labelFormatter={(value) => {
                          const date = new Date(value)
                          return format(date, "MMM d, yyyy", { locale: ja })
                        }}
                      />
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
                      <TableHead>スコア</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissionHistory.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{format(item.submittedAt, "MMM d, yyyy", { locale: ja })}</TableCell>
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
                                <DialogTitle>{item.id} プレビュー</DialogTitle>
                              </DialogHeader>
                              <div className="mt-2">
                                <img
                                  src={item.previewImageUrl}
                                  alt={`${item.id} プレビュー`}
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
