"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2 } from "lucide-react"
import { createAssignment } from "@/app/actions/assignment"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssignmentNewPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [type, setType] = useState("REPORT")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("DRAFT")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!title || !dueDate || !year) {
      setError("課題名・納期・年度は必須です")
      return
    }

    setIsSubmitting(true)

    try {
      // サーバーアクションを直接呼び出す
      const result = await createAssignment({
        title,
        description,
        dueDate,
        year,
        type: type as any,
        category: category || undefined,
        status: status as any,
        isPublic: status === "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      })

      if (!result.success) {
        throw new Error(result.error || "課題の登録に失敗しました")
      }

      setSuccess(true)
      setError("")
      toast({
        title: "課題を登録しました",
        description: "新しい課題が正常に登録されました。",
        variant: "default",
      })

      // 成功したら入力をクリア
      setTitle("")
      setDescription("")
      setDueDate("")
      setCategory("")
      
      // 3秒後にダッシュボードにリダイレクト
      setTimeout(() => {
        router.push('/dashboard/teacher')
      }, 3000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "エラーが発生しました")
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : "課題の登録に失敗しました。",
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">📝 課題作成フォーム</CardTitle>
              <CardDescription>新しい課題を作成します。必要な情報を入力してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">課題名（必須）</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：人体モデリング課題"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">説明（任意）</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="課題の詳細な説明を入力してください"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">納期（必須）</Label>
                  <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">年度（必須）</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number.parseInt(e.target.value, 10))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">課題タイプ</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="課題タイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REPORT">レポート</SelectItem>
                      <SelectItem value="PRESENTATION">プレゼンテーション</SelectItem>
                      <SelectItem value="TEST">テスト</SelectItem>
                      <SelectItem value="PROJECT">プロジェクト</SelectItem>
                      <SelectItem value="OTHER">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ（任意）</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="例：モデリング"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">下書き</SelectItem>
                    <SelectItem value="PUBLISHED">公開</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "登録中..." : "課題を登録する"}
              </Button>

              {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>登録完了</AlertTitle>
                  <AlertDescription>課題が正常に登録されました。数秒後にダッシュボードに戻ります。</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>エラー</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
