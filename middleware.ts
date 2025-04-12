import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

// 守るべきルートのプレフィックス
const protectedTeacherPaths = ["/dashboard/teacher", "/assignments/new", "/students", "/errors"]
const protectedStudentPaths = ["/dashboard/student", "/submit", "/assignments"]
const protectedAdminPaths = ["/admin"]

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname === '/login'
    const isDashboardPage = req.nextUrl.pathname === '/dashboard'
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isTeacherPage = req.nextUrl.pathname.startsWith('/dashboard/teacher')
    const isStudentPage = req.nextUrl.pathname.startsWith('/dashboard/student')

    // ログインページへのアクセス
    if (isAuthPage) {
      if (isAuth) {
        // 認証済みユーザーは適切なダッシュボードにリダイレクト
        const role = token?.role as string
        if (role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', req.url))
        } else if (role === 'TEACHER') {
          return NextResponse.redirect(new URL('/dashboard/teacher', req.url))
        } else if (role === 'STUDENT') {
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
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      } else if (role === 'TEACHER') {
        return NextResponse.redirect(new URL('/dashboard/teacher', req.url))
      } else if (role === 'STUDENT') {
        return NextResponse.redirect(new URL('/dashboard/student', req.url))
      }
    }

    // 管理者ページへのアクセス
    if (isAdminPage && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 教員ページへのアクセス
    if (isTeacherPage && role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 学生ページへのアクセス
    if (isStudentPage && role !== 'STUDENT') {
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
    "/admin/:path*",
    "/assignments/:path*",
    "/students/:path*",
    "/submit/:path*",
    "/errors/:path*",
  ],
}
