"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Clock, FileText, ChevronRight, AlertCircle } from "lucide-react"
import { getUserSubmissions } from "@/app/actions/submission"
import { toast } from "@/components/ui/use-toast"

// 提出課題の型定義
interface SubmittedAssignment {
  id: string
  assignmentId: string
  assignmentTitle: string
  submittedAt: Date
  status: string
  score: number | null
  previewImgUrl?: string | null
  dueDate: Date
}

export default function StudentSubmissionHistoryPage() {
  const { data: session, status: sessionStatus } = useSession()
  const [loading, setLoading] = useState(true)
  const [submittedAssignments, setSubmittedAssignments] = useState<SubmittedAssignment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // セッションがロード中の場合は待機
    if (sessionStatus === "loading") return;
    
    const fetchSubmissionHistory = async () => {
      try {
        setLoading(true)
        const result = await getUserSubmissions()
        
        if (result.success && result.data) {
          // APIレスポンスを適切な形式に変換
          const formattedSubmissions: SubmittedAssignment[] = result.data.map(submission => ({
            id: submission.id,
            assignmentId: submission.assignmentId,
            assignmentTitle: submission.assignment.title,
            submittedAt: new Date(submission.createdAt),
            status: submission.status,
            score: submission.score,
            previewImgUrl: submission.previewImgUrl,
            dueDate: new Date(submission.assignment.dueDate)
          }))
          
          setSubmittedAssignments(formattedSubmissions)
        } else {
          setError(result.error || "提出履歴の取得に失敗しました")
          toast({
            title: "エラー",
            description: result.error || "提出履歴の取得に失敗しました",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("提出履歴の取得エラー:", error)
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

    fetchSubmissionHistory()
  }, [sessionStatus])

  // ステータスに応じたバッジを取得
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="secondary">レビュー待ち</Badge>
      case "REVIEWED":
        return <Badge variant="default">レビュー済</Badge>
      case "ARCHIVED":
        return <Badge variant="outline">アーカイブ済</Badge>
      default:
        return <Badge>不明</Badge>
    }
  }
  
  // エラー表示
  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">📋 提出履歴一覧</h1>
              <Link href="/dashboard/student">
                <Button variant="outline">ダッシュボードに戻る</Button>
              </Link>
            </div>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                <h2 className="text-lg font-semibold">エラーが発生しました</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">📋 提出履歴一覧</h1>
            <Link href="/dashboard/student">
              <Button variant="outline">ダッシュボードに戻る</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">あなたの提出履歴</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : submittedAssignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>課題名</TableHead>
                      <TableHead>提出日時</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>スコア</TableHead>
                      <TableHead>期限</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submittedAssignments.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.assignmentTitle}</TableCell>
                        <TableCell>
                          {format(submission.submittedAt, "yyyy年MM月dd日", { locale: ja })}
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>{submission.score !== null ? `${submission.score} 点` : "-"}</TableCell>
                        <TableCell>
                          {format(submission.dueDate, "yyyy年MM月dd日", { locale: ja })}
                        </TableCell>
                        <TableCell>
                          <Link href={`/assignments/${submission.assignmentId}/history`}>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              履歴を見る <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  提出履歴がありません
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 