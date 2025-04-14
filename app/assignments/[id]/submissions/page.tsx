"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { getSubmissionsByAssignment } from "@/app/actions/submission"
import { getAssignment } from "@/app/actions/assignment"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { SubmissionDetail } from "@/app/actions/submission"

export default function AssignmentSubmissionsPage() {
  const params = useParams()
  const assignmentId = params?.id as string
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([])
  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 課題情報を取得
        const assignmentResult = await getAssignment(assignmentId)
        if (assignmentResult.success && assignmentResult.data) {
          setAssignmentTitle(assignmentResult.data.title)
        } else {
          setError(assignmentResult.error || "課題の取得に失敗しました")
          toast({
            title: "エラー",
            description: assignmentResult.error || "課題の取得に失敗しました",
            variant: "destructive",
          })
        }
        
        // 提出情報を取得
        const submissionsResult = await getSubmissionsByAssignment(assignmentId)
        if (submissionsResult.success && submissionsResult.data) {
          setSubmissions(submissionsResult.data)
        } else {
          setError(submissionsResult.error || "提出データの取得に失敗しました")
          toast({
            title: "エラー",
            description: submissionsResult.error || "提出データの取得に失敗しました",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("データ取得エラー:", error)
        setError("データの取得中にエラーが発生しました")
        toast({
          title: "エラー",
          description: "データの取得中にエラーが発生しました",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [assignmentId])

  // ステータスに応じたバッジのスタイルを取得
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "REVIEWED":
        return "default"
      case "SUBMITTED":
        return "secondary"
      case "ARCHIVED":
        return "outline"
      default:
        return "destructive"
    }
  }

  // ステータスの表示テキストを取得
  const getStatusText = (status: string) => {
    switch (status) {
      case "REVIEWED":
        return "レビュー済"
      case "SUBMITTED":
        return "レビュー待ち"
      case "ARCHIVED":
        return "アーカイブ済"
      default:
        return status
    }
  }

  // 提出日時のフォーマット
  const formatSubmittedDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: ja
      })
    } catch (error) {
      return "-"
    }
  }

  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">提出一覧</h1>
            <Card>
              <CardContent className="p-6 flex justify-center items-center h-64">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">エラーが発生しました</p>
                  <p>{error}</p>
                </div>
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
            <h1 className="text-2xl font-bold">📦 提出一覧：{assignmentTitle || `課題ID ${assignmentId}`}</h1>
            <Link href={`/assignments/${assignmentId}`}>
              <Button variant="outline">課題詳細へ戻る</Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-6 overflow-x-auto">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  この課題にはまだ提出データがありません
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>学生名</TableHead>
                      <TableHead>コース</TableHead>
                      <TableHead>提出日時</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>スコア</TableHead>
                      <TableHead>プレビュー</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.user.name}
                          {submission.user.studentNumber && ` (${submission.user.studentNumber}番)`}
                        </TableCell>
                        <TableCell>{submission.user.courseName || "-"}</TableCell>
                        <TableCell>{formatSubmittedDate(submission.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(submission.status)}>
                            {getStatusText(submission.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{submission.score != null ? `${submission.score} 点` : "-"}</TableCell>
                        <TableCell>
                          {submission.previewImgUrl ? (
                            <img
                              src={submission.previewImgUrl}
                              alt="Preview"
                              className="w-16 h-16 object-cover border rounded-md"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/assignments/${assignmentId}/review?studentId=${encodeURIComponent(submission.userId)}`}
                          >
                            <Button size="sm">
                              {submission.status === "REVIEWED" ? "編集" : "レビューへ"}
                            </Button>
                          </Link>
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
