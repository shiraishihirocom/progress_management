import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const path = request.nextUrl.pathname
  
  // ログインページへのアクセス
  if (path === '/login') {
    // 認証済みユーザーは適切なダッシュボードにリダイレクト
    if (isAuth) {
      const role = token?.role
      if (role === 'teacher') {
        return NextResponse.redirect(new URL('/dashboard/teacher', request.url))
      } else if (role === 'student') {
        return NextResponse.redirect(new URL('/dashboard/student', request.url))
      }
    }
    // 未認証ユーザーはログインページを表示
    return NextResponse.next()
  }
  
  // 未認証ユーザーはログインページにリダイレクト
  if (!isAuth) {
    // クエリパラメータをクリアしてリダイレクト
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // 認証済みユーザーの処理
  const role = token?.role
  
  // ダッシュボードページへのアクセス
  if (path === '/dashboard') {
    if (role === 'teacher') {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url))
    } else if (role === 'student') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url))
    }
    return NextResponse.next()
  }
  
  // 教員ページへのアクセス
  if (path.startsWith('/dashboard/teacher') && role !== 'teacher') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // 学生ページへのアクセス
  if (path.startsWith('/dashboard/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // その他の保護されたパスへのアクセス
  const protectedTeacherPaths = ["/assignments/new", "/students", "/errors"]
  const protectedStudentPaths = ["/submit", "/assignments"]
  
  if (protectedTeacherPaths.some(p => path.startsWith(p)) && role !== 'teacher') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  if (protectedStudentPaths.some(p => path.startsWith(p)) && role !== 'student') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // デフォルト: アクセスを許可
  return NextResponse.next()
}

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
