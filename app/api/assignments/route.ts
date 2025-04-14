import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createAssignment, getAssignments } from "@/app/actions/assignment"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: "認証されていません" },
      { status: 401 }
    )
  }
  
  const result = await getAssignments()
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    )
  }
  
  return NextResponse.json(result.data)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: "認証されていません" },
      { status: 401 }
    )
  }
  
  if (session.user?.role !== "teacher") {
    return NextResponse.json(
      { error: "教員のみが課題を作成できます" },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json()
    
    // 必須フィールドの検証
    if (!body.title || !body.dueDate || !body.year) {
      return NextResponse.json(
        { error: "課題名、提出期限、年度は必須です" },
        { status: 400 }
      )
    }
    
    const result = await createAssignment({
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      year: body.year,
      type: body.type,
      category: body.category,
      tags: body.tags,
      evaluationCriteria: body.evaluationCriteria,
      maxScore: body.maxScore,
      passingScore: body.passingScore,
      isGroupAssignment: body.isGroupAssignment,
      maxGroupSize: body.maxGroupSize,
      minGroupSize: body.minGroupSize,
      isPublic: body.isPublic,
      publishedAt: body.publishedAt,
      status: body.status || "DRAFT"
    })
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error("課題作成API エラー:", error)
    return NextResponse.json(
      { error: "課題の作成に失敗しました" },
      { status: 500 }
    )
  }
} 