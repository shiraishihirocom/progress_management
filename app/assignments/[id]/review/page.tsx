"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Review = {
  score: number
  comment: string
  reviewedAt: string
}

export default function ReviewPage() {
  const params = useParams()
  const assignmentId = params?.id as string

  // 仮：studentEmail はクエリパラメータ経由で渡される前提
  const searchParams = useSearchParams()
  const studentEmail = searchParams?.get("studentEmail") || ""
  const studentName = searchParams?.get("studentName") || "学生"

  const [score, setScore] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [previewImageUrl, setPreviewImageUrl] = useState("/placeholder.svg?height=400&width=600")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      // 実際のAPIが実装されたら、ここでデータを取得する
      // 現在はモックデータを使用
      setTimeout(() => {
        setAssignmentTitle("人体モデリング課題")

        // 既存レビューがあるかチェック（モック）
        const existingReview =
          Math.random() > 0.5
            ? {
                score: 75,
                comment: "良い出来ですが、もう少し細部の作り込みが必要です。",
                reviewedAt: "2025-04-10T00:00:00.000Z",
              }
            : null

        if (existingReview) {
          setScore(existingReview.score)
          setComment(existingReview.comment)
          setIsEditing(true)
        }

        setLoading(false)
      }, 1000)
    }

    if (assignmentId && studentEmail) fetchData()
  }, [assignmentId, studentEmail])

  const handleSubmit = async () => {
    if (!comment.trim() || score < 0 || score > 100) {
      toast({
        title: "入力エラー",
        description: "コメントを入力し、スコアは0〜100の範囲で設定してください。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 実際のAPIが実装されたら、ここでデータを送信する
      // 現在はモック処理
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitted(true)
      toast({
        title: isEditing ? "レビューを更新しました" : "レビューを完了しました",
        description: "学生に通知されます。",
        variant: "default",
      })
    } catch (error) {
      console.error("レビュー送信エラー:", error)
      toast({
        title: "エラー",
        description: "レビューの送信に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <>
              <Skeleton className="h-8 w-3/4" />
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">📝 レビュー入力: {assignmentTitle}</h1>
              <div className="text-lg font-medium">学生: {studentName}</div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">提出されたプレビュー画像</h2>
                    <img
                      src={previewImageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full max-w-2xl border rounded-md"
                    />
                  </div>

                  <a
                    href="https://drive.google.com/drive/folders/sample"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Google DriveでMayaフォルダを開く
                  </a>

                  <div className="space-y-2">
                    <Label htmlFor="comment" className="text-base font-semibold">
                      レビューコメント
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="コメントを入力してください"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score" className="text-base font-semibold">
                      スコア（0〜100点）
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="score"
                        type="number"
                        min={0}
                        max={100}
                        value={score}
                        onChange={(e) => setScore(Number.parseInt(e.target.value, 10) || 0)}
                        className="w-24"
                      />
                      <span className="text-lg font-medium">{score} 点</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!comment.trim() || score < 0 || score > 100 || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "送信中..." : isEditing ? "レビューを更新する" : "レビューを確定する"}
                  </Button>

                  {submitted && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertTitle>レビューが{isEditing ? "更新" : "完了"}しました</AlertTitle>
                      <AlertDescription>この提出物はロックされ、学生に通知されます。</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
