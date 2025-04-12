import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // セッションからユーザー情報を取得し、教員権限を確認
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { error: "権限がありません。教員アカウントでログインしてください。" },
        { status: 403 }
      )
    }

    // リクエストボディからデータを抽出
    const { title, description, dueDate, year } = await request.json()

    // 必須項目のバリデーション
    if (!title || !dueDate || !year) {
      return NextResponse.json(
        { error: "課題名・納期・年度は必須です" },
        { status: 400 }
      )
    }

    // Prismaを使用してデータベースに課題を登録
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        year: Number(year),
        createdById: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "課題を登録しました", assignment },
      { status: 201 }
    )
  } catch (error) {
    console.error("課題登録エラー:", error)
    return NextResponse.json(
      { error: "課題の登録に失敗しました" },
      { status: 500 }
    )
  }
} 