"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Upload } from "lucide-react"
import { getAssignment } from "@/app/actions/assignment"
import { AssignmentDetail } from "@/app/actions/assignment"
import { toast } from "@/components/ui/use-toast"

// 拡張された型定義
interface ExtendedAssignmentDetail extends AssignmentDetail {
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [assignment, setAssignment] = useState<ExtendedAssignmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isTeacher = session?.user?.role === "teacher"

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setIsLoading(true)
        
        const result = await getAssignment(params.id)
        if (result.success && result.data) {
          setAssignment(result.data as ExtendedAssignmentDetail)
        } else {
          setError(result.error || "課題の取得に失敗しました")
          toast({
            title: "エラー",
            description: result.error || "課題の取得に失敗しました",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("課題データ取得エラー:", error)
        setError("課題の取得中にエラーが発生しました")
        toast({
          title: "エラー",
          description: "課題の取得中にエラーが発生しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAssignment()
  }, [params.id])

  const handleSubmitClick = () => {
    router.push(`/submit?assignmentId=${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center flex-col gap-2 py-8">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                  <h2 className="text-lg font-semibold">課題が見つかりませんでした</h2>
                  <p className="text-muted-foreground">{error || "指定されたIDの課題は存在しないか、アクセス権がありません。"}</p>
                  <Button asChild className="mt-4">
                    <Link href="/assignments">課題一覧に戻る</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // 日付フォーマット
  const formattedDueDate = new Date(assignment.dueDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const formattedCreatedAt = new Date(assignment.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // ステータスに応じたバッジの種類を決定
  const getBadgeVariant = (status: string | undefined) => {
    if (!status) return "default";
    
    switch (status) {
      case "PUBLISHED":
        return "default"
      case "CLOSED":
        return "secondary"
      case "DRAFT":
        return "outline"
      default:
        return "default"
    }
  }
  
  // ステータスの表示テキスト
  const getStatusText = (status: string | undefined) => {
    if (!status) return "不明";
    
    switch (status) {
      case "PUBLISHED":
        return "進行中"
      case "CLOSED":
        return "終了"
      case "DRAFT":
        return "下書き"
      case "ARCHIVED":
        return "アーカイブ済み"
      default:
        return status
    }
  }
  
  // 課題の添付資料と要件を解析
  const requirements = assignment.evaluationCriteria ? 
    assignment.evaluationCriteria.split('\n').filter(line => line.trim()) : []
  
  // 添付ファイル情報
  const attachments = assignment.attachments || []

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/assignments" className="text-sm text-blue-600 hover:underline">
              ← 課題一覧に戻る
            </Link>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 opacity-70" />
                        <span>提出期限: {formattedDueDate}</span>
                      </div>
                      <Badge variant={getBadgeVariant(assignment.status)}>
                        {getStatusText(assignment.status)}
                      </Badge>
                    </div>
                  </CardDescription>
                </div>
                {!isTeacher && assignment.status === "PUBLISHED" && (
                  <Button onClick={handleSubmitClick} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    課題を提出する
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">課題説明</h3>
                  <p className="text-muted-foreground">{assignment.description || "説明はありません"}</p>
                </div>
                
                {requirements.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">課題要件</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                
                {attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">添付資料</h3>
                      <ul className="space-y-1">
                        {attachments.map((attachment) => (
                          <li key={attachment.id}>
                            <Link href={attachment.fileUrl} className="text-blue-600 hover:underline">
                              {attachment.fileName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">評価基準</h3>
                  <div className="text-muted-foreground">
                    {assignment.maxScore ? (
                      <p>満点: {assignment.maxScore}点 / 合格点: {assignment.passingScore || "指定なし"}</p>
                    ) : (
                      <p>点数による評価はありません</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <div className="text-sm text-muted-foreground">
                作成日: {formattedCreatedAt}
                {assignment.createdBy?.name && ` / 作成者: ${assignment.createdBy.name}`}
              </div>
              {isTeacher && (
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/assignments/${assignment.id}/submissions`}>提出状況確認</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/assignments/${assignment.id}/edit`}>編集する</Link>
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          
          {!isTeacher && assignment.status === "PUBLISHED" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">課題提出</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">
                      課題の提出ページで作品と必要資料をアップロードしてください。
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>提出前に課題要件を必ず確認してください</li>
                      <li>一度提出しても締切前なら何度でも再提出できます</li>
                    </ul>
                  </div>
                  <Button onClick={handleSubmitClick} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    提出する
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 