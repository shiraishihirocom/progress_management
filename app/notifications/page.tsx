"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { CheckCircle, Bell, AlertTriangle, AlertCircle, Info, FileText } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  type: "info" | "success" | "warning" | "error"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setNotifications([
        {
          id: "1",
          title: "課題がレビューされました",
          message: "「人体モデリング課題」のレビューが完了しました。スコア: 85点",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
          type: "success",
        },
        {
          id: "2",
          title: "新しい課題が追加されました",
          message: "「背景モデリング課題」が追加されました。締切: 2025年5月15日",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2時間前
          type: "info",
        },
        {
          id: "3",
          title: "提出期限が近づいています",
          message: "「小物モデリング課題」の提出期限は明日までです。",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1日前
          type: "warning",
        },
        {
          id: "4",
          title: "提出エラーが発生しました",
          message: "「キャラクターモデリング課題」の提出でエラーが発生しました。workspace.melが見つかりません。",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2日前
          type: "error",
        },
        {
          id: "5",
          title: "システムメンテナンスのお知らせ",
          message: "2025年5月1日 午前2時から午前5時までシステムメンテナンスを実施します。",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3日前
          type: "info",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🔔 通知一覧</h1>
            {unreadCount > 0 && <Button onClick={markAllAsRead}>すべて既読にする</Button>}
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="unread">未読 {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
              <TabsTrigger value="info">お知らせ</TabsTrigger>
              <TabsTrigger value="assignments">課題関連</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>すべての通知</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>通知はありません</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg ${notification.read ? "bg-background" : "bg-muted/30 border-primary/20"}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${!notification.read && "text-primary"}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                  locale: ja,
                                })}
                              </span>
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>未読の通知</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : notifications.filter((n) => !n.read).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>未読の通知はありません</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.read)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border rounded-lg bg-muted/30 border-primary/20"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-primary">{notification.title}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: ja,
                                  })}
                                </span>
                              </div>
                              <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                            </div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>お知らせ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : notifications.filter((n) => n.type === "info").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>お知らせはありません</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => n.type === "info")
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg ${notification.read ? "bg-background" : "bg-muted/30 border-primary/20"}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-medium ${!notification.read && "text-primary"}`}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: ja,
                                  })}
                                </span>
                              </div>
                              <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                            </div>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>課題関連</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : notifications.filter((n) => n.title.includes("課題")).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>課題関連の通知はありません</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => n.title.includes("課題"))
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg ${notification.read ? "bg-background" : "bg-muted/30 border-primary/20"}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-medium ${!notification.read && "text-primary"}`}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: ja,
                                  })}
                                </span>
                              </div>
                              <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                            </div>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
