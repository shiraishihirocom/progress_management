"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function SubmitPage() {
  const searchParams = useSearchParams()
  const assignmentIdParam = searchParams ? searchParams.get('assignmentId') : null
  
  const [assignmentId, setAssignmentId] = useState(assignmentIdParam || "")
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [done, setDone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // URLパラメータが変更されたらassignmentIdを更新
  useEffect(() => {
    if (assignmentIdParam) {
      setAssignmentId(assignmentIdParam)
    }
  }, [assignmentIdParam])

  const handleSubmit = async () => {
    if (!assignmentId || !zipFile || !previewImage) {
      setMessage("すべての項目を入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      // 実際のAPIが実装されたら、ここでデータを送信する
      // 現在はモック処理
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setDone(true)
      setMessage("")
      toast({
        title: "提出完了",
        description: "ファイルが正常にアップロードされました。",
        variant: "default",
      })

      // 成功したら履歴ページに遷移する
      setTimeout(() => {
        router.push(`/assignments/${assignmentId}/history`)
      }, 1500)
    } catch (error) {
      console.error("提出エラー:", error)
      setMessage(`提出に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)

      // ZIPファイルとプレビュー画像を分類
      const zipFiles = files.filter((file) => file.name.endsWith(".zip"))
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (zipFiles.length > 0) setZipFile(zipFiles[0])
      if (imageFiles.length > 0) setPreviewImage(imageFiles[0])
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">📤 課題提出画面</h1>
            {assignmentIdParam && (
              <Link href={`/assignments/${assignmentIdParam}`} className="text-sm text-blue-600 hover:underline">
                ← 課題ページに戻る
              </Link>
            )}
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentId">課題ID</Label>
                <Input
                  id="assignmentId"
                  type="text"
                  placeholder="例: a1-human-modeling"
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  disabled={!!assignmentIdParam}
                />
              </div>

              <div
                className={`border-2 ${dragActive ? "border-primary" : "border-dashed border-gray-300"} rounded-lg p-10 text-center cursor-pointer transition-colors`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const files = Array.from(e.target.files)

                      // ZIPファイルとプレビュー画像を分類
                      const zipFiles = files.filter((file) => file.name.endsWith(".zip"))
                      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

                      if (zipFiles.length > 0) setZipFile(zipFiles[0])
                      if (imageFiles.length > 0) setPreviewImage(imageFiles[0])
                    }
                  }}
                />
                <Upload className="mx-auto mb-2 w-10 h-10 text-muted-foreground" />
                <p className="text-muted-foreground">ここにドラッグ＆ドロップするかクリックして選択</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Mayaプロジェクトフォルダ（.zip）とプレビュー画像（.png/.jpg）を選択してください
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mayaプロジェクト（.zip）</Label>
                  {zipFile ? (
                    <div className="flex items-center p-2 border rounded">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm truncate">{zipFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center p-2 border rounded text-muted-foreground">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">選択されていません</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>プレビュー画像（.png/.jpg）</Label>
                  {previewImage ? (
                    <div className="flex items-center p-2 border rounded">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm truncate">{previewImage.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center p-2 border rounded text-muted-foreground">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">選択されていません</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!(assignmentId && zipFile && previewImage) || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "提出中..." : "提出する"}
              </Button>

              {message && (
                <Alert variant="destructive">
                  <AlertTitle>⚠ エラー</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {done && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>✅ 提出完了！</AlertTitle>
                  <AlertDescription>ファイルが正常にアップロードされました。履歴ページに移動します。</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2 text-sm">
              <h3 className="font-semibold">提出ファイルの注意事項</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>zipファイルの構成は「Mayaプロジェクト構成」に従ってください。</li>
                <li>プレビュー画像は jpg / png 形式で添付してください。</li>
                <li>
                  zip の中に <code>workspace.mel</code>, <code>scenes/</code>, <code>sourceimages/</code>{" "}
                  などが含まれていないとエラーになります。
                </li>
                <li>提出後は履歴ページで提出状況を確認できます。</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
