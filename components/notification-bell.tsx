"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  type: "info" | "success" | "warning" | "error"
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      // 実際のAPIが実装されたら、ここでデータを取得する
      // 現在はモックデータを使用
      setTimeout(() => {
        setNotifications([
          {
            id: "1",
            title: "課題がレビューされました",
            message: "「人体モデリング課題」のレビューが完了しました。",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
            type: "success",
          },
          {
            id: "2",
            title: "新しい課題が追加されました",
            message: "「背景モデリング課題」が追加されました。",
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
        ])
        setLoading(false)
      }, 1000)
    }
  }, [session])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      case "info":
      default:
        return "ℹ️"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>通知</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              すべて既読にする
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">読み込み中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">通知はありません</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${notification.read ? "opacity-70" : "font-medium"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center w-full">
                <span className="mr-2">{getNotificationIcon(notification.type)}</span>
                <span className="flex-1">{notification.title}</span>
                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <p className="text-sm text-muted-foreground mt-1 ml-6">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ja })}
              </p>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/notifications" className="w-full text-center text-sm cursor-pointer">
            すべての通知を見る
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
