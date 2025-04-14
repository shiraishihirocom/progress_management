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
import { Eye, AlertCircle, Bug } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import Link from "next/link"
import { getAssignmentSubmissionHistory } from "@/app/actions/submission"
import { toast } from "@/components/ui/use-toast"

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
  const [error, setError] = useState<string | null>(null)

  const fetchSubmissionHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getAssignmentSubmissionHistory(id)
      
      if (result.success && result.data) {
        if (result.assignmentTitle) {
          setAssignmentTitle(result.assignmentTitle)
        }
        
        // データを適切な形式に変換
        const formattedHistory: SubmissionHistory[] = result.data.map(submission => ({
          id: `Ver.${submission.version || 1}`,
          submittedAt: new Date(submission.createdAt),
          status: submission.status,
          score: submission.score,
          feedback: submission.comment,
          previewImageUrl: submission.previewImgUrl || "/placeholder.svg?height=300&width=300"
        }))
        
        setSubmissionHistory(formattedHistory)
      } else {
        setError(result.error || "提出履歴の取得に失敗しました")
        toast({
          title: "エラー",
          description: result.error || "提出履歴の取得に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("提出履歴取得エラー:", error)
      setError("提出履歴の取得中にエラーが発生しました")
      toast({
        title: "エラー",
        description: "提出履歴の取得中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSubmissionHistory()
  }, [id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="secondary">レビュー待ち</Badge>
      case "REVIEWED":
        return <Badge variant="default">レビュー済</Badge>
      case "DRAFT":
        return <Badge variant="destructive">下書き</Badge>
      case "ARCHIVED":
        return <Badge variant="outline">アーカイブ済</Badge>
      default:
        return <Badge>不明</Badge>
    }
  }

  const scoredSubmissions = submissionHistory.filter((s) => s.score !== null)

  // エラー表示
  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">提出履歴詳細</h1>
              <Link href="/dashboard/student/history">
                <Button variant="outline">戻る</Button>
              </Link>
            </div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle size={20} />
                  <p>エラーが発生しました: {error}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  再読み込み
                </Button>
              </CardContent>
            </Card>
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">📊 提出履歴とスコア確認: {assignmentTitle}</h1>
            <Link href="/dashboard/student/history">
              <Button variant="outline">提出履歴一覧に戻る</Button>
            </Link>
          </div>

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
                        dataKey="submittedAt"
                        tickFormatter={(dateStr) => {
                          if (dateStr instanceof Date) {
                            return format(dateStr, "MM/dd", { locale: ja })
                          }
                          return ""
                        }}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        labelFormatter={(dateValue) => {
                          if (dateValue instanceof Date) {
                            return format(dateValue, "yyyy年MM月dd日", { locale: ja })
                          }
                          return ""
                        }}
                        formatter={(value) => [`${value} 点`, "スコア"]}
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
              ) : submissionHistory.length > 0 ? (
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
                        <TableCell>
                          {item.submittedAt instanceof Date 
                            ? format(item.submittedAt, "yyyy年MM月dd日", { locale: ja }) 
                            : "-"}
                        </TableCell>
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
                                {item.previewImageUrl ? (
                                  <img
                                    src={item.previewImageUrl}
                                    alt={`${item.id} プレビュー`}
                                    className="w-full rounded-md border"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md border">
                                    <p className="text-muted-foreground">プレビュー画像がありません</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                  <p className="text-center">この課題に対する提出履歴がありません</p>
                  <Button variant="outline" asChild>
                    <Link href={`/assignments/${id}`}>課題ページへ移動</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug panel - only visible during development */}
          <div className="border border-orange-500 p-4 m-4 rounded bg-orange-50">
            <details>
              <summary className="flex items-center gap-2 text-orange-700 font-semibold cursor-pointer">
                <Bug size={20} />
                デバッグ情報
              </summary>
              <div className="mt-2 p-2 bg-white rounded overflow-auto max-h-[400px]">
                <p className="font-bold mb-2">取得されたデータ:</p>
                <pre className="text-xs">{JSON.stringify(submissionHistory, null, 2)}</pre>
                
                <p className="font-bold mt-4 mb-2">リクエスト情報:</p>
                <ul className="text-xs space-y-1">
                  <li><strong>課題ID:</strong> {id}</li>
                  <li><strong>ローディング状態:</strong> {loading ? "読み込み中" : "完了"}</li>
                  <li><strong>エラー:</strong> {error || "なし"}</li>
                  <li><strong>課題タイトル:</strong> {assignmentTitle || "取得できていません"}</li>
                </ul>
                
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => fetchSubmissionHistory()} 
                    className="text-xs"
                  >
                    データを再取得
                  </Button>
                </div>
              </div>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
