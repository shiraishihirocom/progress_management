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
    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard")
    } else if (session?.user?.role === "teacher") {
      router.push("/dashboard/teacher")
    } else if (session?.user?.role === "student") {
      router.push("/dashboard/student")
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
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                  {session.user?.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              {session.user?.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">管理者ダッシュボード</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={session.user?.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}>
                  ダッシュボード
                </Link>
              </DropdownMenuItem>
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
