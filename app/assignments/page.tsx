"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Calendar, Users, Clock, Trash2 } from "lucide-react"
import { getAssignments, deleteAssignment } from "@/app/actions/assignment"
import { AssignmentDetail } from "@/app/actions/assignment"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssignmentsPage() {
  const { data: session } = useSession()
  const [assignments, setAssignments] = useState<AssignmentDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isTeacher = session?.user?.role === "teacher"
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [statusTab, setStatusTab] = useState<string>("active")

  // 年度一覧を取得（重複なし）
  const years = Array.from(
    new Set(assignments.map(assignment => assignment.year.toString()))
  ).sort((a, b) => parseInt(b) - parseInt(a)) // 降順（新しい年度が先）

  // 実際のデータベースから課題を取得
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await getAssignments()
        if (result.success && result.data) {
          setAssignments(result.data)
        } else {
          console.error("課題取得エラー:", result.error)
        }
      } catch (error) {
        console.error("課題フェッチエラー:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  // 課題削除処理
  const handleDeleteAssignment = async (id: string) => {
    try {
      const result = await deleteAssignment(id)
      if (result.success) {
        // 削除成功時は課題リストから削除して表示を更新
        setAssignments(assignments.filter(assignment => assignment.id !== id))
        toast({
          title: "課題が削除されました",
          description: "課題を正常に削除しました。",
          variant: "default",
        })
      } else {
        toast({
          title: "削除失敗",
          description: result.error || "課題の削除に失敗しました。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("課題削除エラー:", error)
      toast({
        title: "削除失敗",
        description: "課題の削除中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  // 年度とステータスでフィルタリングされた課題リスト
  const getFilteredAssignments = (status: string) => {
    return assignments.filter(assignment => {
      // ステータスによるフィルタリング
      const statusMatch = assignment.status === status
      
      // 年度によるフィルタリング（"all"の場合はフィルタリングしない）
      const yearMatch = selectedYear === "all" || assignment.year.toString() === selectedYear
      
      return statusMatch && yearMatch
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">課題一覧</h1>
            {isTeacher && (
              <Link href="/assignments/new">
                <Button>新しい課題を作成</Button>
              </Link>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">年度:</span>
              <Select 
                value={selectedYear} 
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="年度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}年度</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs 
            defaultValue="active" 
            className="mb-6"
            value={statusTab}
            onValueChange={setStatusTab}
          >
            <TabsList>
              <TabsTrigger value="active">進行中</TabsTrigger>
              <TabsTrigger value="closed">終了</TabsTrigger>
              {isTeacher && <TabsTrigger value="draft">下書き</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredAssignments("PUBLISHED").map(assignment => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    isTeacher={isTeacher}
                    onDelete={handleDeleteAssignment} 
                  />
                ))}
                {getFilteredAssignments("PUBLISHED").length === 0 && (
                  <div className="col-span-3 text-center py-10 text-muted-foreground">
                    {selectedYear === "all" 
                      ? "進行中の課題はありません" 
                      : `${selectedYear}年度の進行中の課題はありません`}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="closed" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredAssignments("CLOSED").map(assignment => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    isTeacher={isTeacher} 
                    onDelete={handleDeleteAssignment}
                  />
                ))}
                {getFilteredAssignments("CLOSED").length === 0 && (
                  <div className="col-span-3 text-center py-10 text-muted-foreground">
                    {selectedYear === "all" 
                      ? "終了した課題はありません" 
                      : `${selectedYear}年度の終了した課題はありません`}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {isTeacher && (
              <TabsContent value="draft" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredAssignments("DRAFT").map(assignment => (
                    <AssignmentCard 
                      key={assignment.id} 
                      assignment={assignment} 
                      isTeacher={isTeacher} 
                      onDelete={handleDeleteAssignment}
                    />
                  ))}
                  {getFilteredAssignments("DRAFT").length === 0 && (
                    <div className="col-span-3 text-center py-10 text-muted-foreground">
                      {selectedYear === "all" 
                        ? "下書き状態の課題はありません" 
                        : `${selectedYear}年度の下書き状態の課題はありません`}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function AssignmentCard({ 
  assignment, 
  isTeacher,
  onDelete
}: { 
  assignment: AssignmentDetail, 
  isTeacher: boolean,
  onDelete: (id: string) => Promise<void>
}) {
  const dueDate = new Date(assignment.dueDate)
  const formattedDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dueDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {assignment.title}
        </CardTitle>
        <CardDescription>
          {assignment.description}
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            {assignment.year}年度
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span>提出期限: {formattedDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <span>状態: {getStatusText(assignment.status)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/assignments/${assignment.id}`}>詳細を見る</Link>
        </Button>
        <div className="flex gap-2">
          {isTeacher && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>課題を削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    この操作は元に戻せません。課題「{assignment.title}」を削除してもよろしいですか？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(assignment.id)}>
                    削除する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {isTeacher ? (
            <Button asChild>
              <Link href={`/assignments/${assignment.id}/submissions`}>提出確認</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/assignments/${assignment.id}`}>課題ページへ</Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// ステータスの表示テキストを取得
function getStatusText(status: string | undefined): string {
  if (!status) return "不明";
  
  switch (status) {
    case "DRAFT":
      return "下書き";
    case "PUBLISHED":
      return "公開中";
    case "CLOSED":
      return "締切済み";
    case "ARCHIVED":
      return "アーカイブ済み";
    default:
      return status;
  }
} 