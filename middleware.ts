import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const path = request.nextUrl.pathname
  
  // デバッグ情報
  console.log('Path:', path)
  console.log('Token:', JSON.stringify(token))
  console.log('Is Authenticated:', isAuth)
  console.log('Role:', token?.role)
  
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
  
  // 教員向けページアクセスチェック
  if (protectedTeacherPaths.some(p => path.startsWith(p))) {
    console.log('Protected teacher path check:', path)
    console.log('User role:', role)
    if (role !== 'teacher') {
      console.log('Access denied, redirecting to dashboard')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  // 学生向けページアクセスチェック
  if (protectedStudentPaths.some(p => path.startsWith(p) && !path.startsWith("/assignments/new"))) {
    console.log('Protected student path check:', path)
    console.log('User role:', role)
    if (role !== 'student') {
      console.log('Access denied, redirecting to dashboard')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  // デフォルト: アクセスを許可
  console.log('Access granted')
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
