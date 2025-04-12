"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

type StudentProfile = {
  id: string
  name: string
  studentNumber: string | null
  totalSubmissions: number
  totalAssignments: number
  averageScore: number | null
  lastSubmittedAt: string | null
  submissions: {
    assignmentId: string
    assignmentTitle: string
    status: string
    score: number | null
    reviewedAt: string | null
  }[]
}

export default function StudentProfilePage() {
  const { id } = useParams()
  const [data, setData] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setData({
        id: "1",
        name: "山田 太郎",
        studentNumber: "123456",
        totalSubmissions: 3,
        totalAssignments: 5,
        averageScore: 72,
        lastSubmittedAt: "2025-04-03",
        submissions: [
          {
            assignmentId: "a1",
            assignmentTitle: "課題1：人体モデリング",
            status: "REVIEWED",
            score: 85,
            reviewedAt: "2025-04-04",
          },
          {
            assignmentId: "a2",
            assignmentTitle: "課題2：小物モデリング",
            status: "REVIEWED",
            score: 72,
            reviewedAt: "2025-04-02",
          },
          {
            assignmentId: "a3",
            assignmentTitle: "課題3：背景モデル",
            status: "NOT_SUBMITTED",
            score: null,
            reviewedAt: null,
          },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">学生が見つかりません</h1>
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
          <h1 className="text-2xl font-bold">👤 学生プロフィール: {data.name}</h1>

          {/* 基本情報カード */}
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">氏名</p>
                <p className="font-semibold">{data.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">学籍番号</p>
                <p className="font-semibold">{data.studentNumber || "-"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">提出済課題数</p>
                <p className="font-semibold">
                  {data.totalSubmissions} / {data.totalAssignments}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">平均スコア</p>
                <p className="font-semibold">{data.averageScore ?? "-"} 点</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">最終提出日</p>
                <p className="font-semibold">{data.lastSubmittedAt ? data.lastSubmittedAt : "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* スコア推移グラフ */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">📈 スコア推移グラフ</h2>
              <div className="h-64">
                {data.submissions.filter((s) => s.score !== null).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.submissions
                        .filter((s) => s.score !== null)
                        .map((s) => ({
                          name: s.assignmentTitle,
                          score: s.score,
                        }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    スコアデータがまだありません
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 提出ステータス一覧 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">📋 課題別提出状況</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>課題名</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>スコア</TableHead>
                    <TableHead>レビュー日</TableHead>
                    <TableHead>提出一覧</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.submissions.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.assignmentTitle}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "REVIEWED"
                              ? "default"
                              : item.status === "REVIEW_WAITING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {item.status === "NOT_SUBMITTED"
                            ? "未提出"
                            : item.status === "REVIEWED"
                              ? "レビュー済"
                              : "レビュー待ち"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.score ?? "-"}</TableCell>
                      <TableCell>{item.reviewedAt ? item.reviewedAt : "-"}</TableCell>
                      <TableCell>
                        <Link href={`/assignments/${item.assignmentId}/submissions`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-muted flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> 開く
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
