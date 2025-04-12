"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Assignment = {
  id: string
  title: string
  dueDate: string
  status: "未提出" | "レビュー待ち" | "完了"
  score: number | null
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setAssignments([
        {
          id: "1",
          title: "課題1：人体モデリング",
          dueDate: "2025/05/10",
          status: "未提出",
          score: null,
        },
        {
          id: "2",
          title: "課題2：小物モデリング",
          dueDate: "2025/05/17",
          status: "レビュー待ち",
          score: null,
        },
        {
          id: "3",
          title: "課題3：背景モデル",
          dueDate: "2025/05/24",
          status: "完了",
          score: 85,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "完了":
        return "default"
      case "レビュー待ち":
        return "secondary"
      case "未提出":
      default:
        return "destructive"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">🧭 現在の課題進捗</h1>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-20" />
                      <div className="pt-2">
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6 space-y-2">
                    <h2 className="text-lg font-semibold">{assignment.title}</h2>
                    <p className="text-sm text-muted-foreground">納期: {assignment.dueDate}</p>
                    <Badge variant={getBadgeVariant(assignment.status)}>{assignment.status}</Badge>
                    {assignment.score !== null && <p className="text-sm">スコア: {assignment.score} 点</p>}
                    <div className="pt-2">
                      {assignment.status === "未提出" ? (
                        <Button asChild>
                          <Link href="/submit">提出する</Link>
                        </Button>
                      ) : (
                        <Button variant="secondary" asChild>
                          <Link href={`/assignments/${assignment.id}/history`}>履歴確認</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
