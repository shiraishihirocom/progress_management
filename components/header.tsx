"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import NotificationBell from "@/components/notification-bell"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const navigateToDashboard = () => {
    if (session?.user?.role === "teacher") {
      router.push("/dashboard/teacher")
    } else if (session?.user?.role === "student") {
      router.push("/dashboard/student")
    } else {
      router.push("/")
    }
  }

  return (
    <header className="w-full px-4 py-3 border-b flex justify-between items-center bg-white">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold cursor-pointer" onClick={navigateToDashboard}>
          🎓 3Dモデリング課題管理システム
        </h1>
      </div>

      {status === "loading" ? (
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      ) : session ? (
        <div className="flex items-center gap-2">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "ユーザー"} />
                  <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{session.user?.name || "ユーザー"}</p>
                <p className="text-xs text-muted-foreground">{session.user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              {session.user?.role === "teacher" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/teacher">教員ダッシュボード</Link>
                </DropdownMenuItem>
              )}
              {session.user?.role === "student" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/student">生徒ダッシュボード</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/notifications">通知一覧</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault()
                  signOut({ callbackUrl: "/login" })
                }}
              >
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button onClick={() => signIn("google")}>ログイン</Button>
      )}
    </header>
  )
}
