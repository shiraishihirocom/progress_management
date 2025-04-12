"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, Upload } from "lucide-react"

export default function StudentRegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [studentNumber, setStudentNumber] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!name || !email) {
      setError("氏名とメールアドレスは必須です")
      return
    }

    if (!email.includes("@")) {
      setError("有効なメールアドレスを入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      // 実際のAPIが実装されたら、ここでデータを送信する
      // 現在はモック処理
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
      setError("")
      toast({
        title: "学生を登録しました",
        description: "学生が正常に登録されました。",
        variant: "default",
      })

      // 成功したら入力をクリア
      setName("")
      setEmail("")
      setStudentNumber("")
    } catch (err) {
      console.error(err)
      setError("通信エラーが発生しました")
      toast({
        title: "エラー",
        description: "登録に失敗しました。",
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
              <CardTitle className="text-2xl">👥 学生登録</CardTitle>
              <CardDescription>新しい学生を登録します。必要な情報を入力してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">氏名（必須）</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：山田 太郎" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス（必須）</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="例：student@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentNumber">学籍番号（任意）</Label>
                <Input
                  id="studentNumber"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="例：123456"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "登録中..." : "学生を追加する"}
              </Button>

              {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>登録完了</AlertTitle>
                  <AlertDescription>学生が正常に登録されました。</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>エラー</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">CSV一括登録</h3>
                    <p className="text-sm text-muted-foreground">複数の学生を一度に登録できます</p>
                  </div>
                  <Button variant="outline" disabled className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    CSVをアップロード（開発中）
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
