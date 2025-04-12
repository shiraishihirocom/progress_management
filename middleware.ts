import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// 守るべきルートのプレフィックス
const protectedTeacherPaths = ["/dashboard/teacher", "/assignments/new", "/students", "/errors"]
const protectedStudentPaths = ["/dashboard/student", "/submit", "/assignments"]
const protectedAdminPaths = ["/admin"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req })

  // ログインしていない
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role

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
    "/dashboard/:path*", // 教員・学生両方
    "/assignments/:path*", // 学生も教員もアクセス（個別制御）
    "/students/:path*", // 教員専用
    "/errors/:path*", // 教員専用
    "/submit", // 学生専用
    "/admin/:path*", // 管理者専用
  ],
}
