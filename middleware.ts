import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// 守るべきルートのプレフィックス
const protectedTeacherPaths = ["/dashboard/teacher", "/assignments/new", "/students", "/errors"]
const protectedStudentPaths = ["/dashboard/student", "/submit", "/assignments"]
const protectedAdminPaths = ["/admin"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ログインページへのアクセスは許可
  if (pathname === "/login") {
    return NextResponse.next()
  }

  const token = await getToken({ req })

  // ログインしていない
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role

  // ルートダッシュボードへのアクセスをロールに基づいてリダイレクト
  if (pathname === "/dashboard") {
    if (role === "teacher") {
      return NextResponse.redirect(new URL("/dashboard/teacher", req.url))
    } else if (role === "student") {
      return NextResponse.redirect(new URL("/dashboard/student", req.url))
    } else if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  // 管理者ルートに admin 以外が来た場合
  if (protectedAdminPaths.some((path) => pathname.startsWith(path)) && role !== "admin") {
    const unauthorizedUrl = new URL("/unauthorized", req.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  // 教員ルートに student が来た場合
  if (protectedTeacherPaths.some((path) => pathname.startsWith(path)) && role !== "teacher") {
    const unauthorizedUrl = new URL("/unauthorized", req.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  // 学生ルートに teacher が来た場合（課題管理以外）
  if (
    protectedStudentPaths.some((path) => pathname.startsWith(path)) &&
    pathname.includes("/dashboard/student") &&
    role !== "student"
  ) {
    const unauthorizedUrl = new URL("/unauthorized", req.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/admin/:path*",
    "/assignments/:path*",
    "/students/:path*",
    "/submit/:path*",
    "/errors/:path*",
  ],
}
