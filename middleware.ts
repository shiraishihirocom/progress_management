import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

// 守るべきルートのプレフィックス
const protectedTeacherPaths = ["/dashboard/teacher", "/assignments/new", "/students", "/errors"]
const protectedStudentPaths = ["/dashboard/student", "/submit", "/assignments"]

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname === '/login'
    const isDashboardPage = req.nextUrl.pathname === '/dashboard'
    const isTeacherPage = req.nextUrl.pathname.startsWith('/dashboard/teacher')
    const isStudentPage = req.nextUrl.pathname.startsWith('/dashboard/student')

    // ログインページへのアクセス
    if (isAuthPage) {
      if (isAuth) {
        // 認証済みユーザーは適切なダッシュボードにリダイレクト
        const role = token?.role as string
        if (role === 'teacher') {
          return NextResponse.redirect(new URL('/dashboard/teacher', req.url))
        } else if (role === 'student') {
          return NextResponse.redirect(new URL('/dashboard/student', req.url))
        }
      }
      return NextResponse.next()
    }

    // 未認証ユーザーの処理
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const role = token?.role as string

    // ダッシュボードページへのアクセス
    if (isDashboardPage) {
      if (role === 'teacher') {
        return NextResponse.redirect(new URL('/dashboard/teacher', req.url))
      } else if (role === 'student') {
        return NextResponse.redirect(new URL('/dashboard/student', req.url))
      }
    }

    // 教員ページへのアクセス
    if (isTeacherPage && role !== 'teacher') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 学生ページへのアクセス
    if (isStudentPage && role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/assignments/:path*",
    "/students/:path*",
    "/submit/:path*",
    "/errors/:path*",
  ],
}
