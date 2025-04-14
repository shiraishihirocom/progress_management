"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AssignmentStatus, AssignmentType } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export type AssignmentInput = {
  title: string
  description?: string
  dueDate: string | Date
  year: number
  type?: AssignmentType
  category?: string
  tags?: string[]
  evaluationCriteria?: string
  maxScore?: number
  passingScore?: number
  isGroupAssignment?: boolean
  maxGroupSize?: number
  minGroupSize?: number
  isPublic?: boolean
  publishedAt?: string | Date | null
  status?: AssignmentStatus
}

export type AssignmentDetail = AssignmentInput & {
  id: string
  createdById: string | null
  createdAt: Date
  updatedAt: Date
}

// 課題を作成する
export async function createAssignment(data: AssignmentInput): Promise<{
  success: boolean
  data?: AssignmentDetail
  error?: string
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return {
        success: false,
        error: "認証されていません",
      }
    }

    if (session.user?.role !== "teacher") {
      return {
        success: false,
        error: "教員のみが課題を作成できます",
      }
    }

    // 必須フィールドの検証
    if (!data.title || !data.dueDate || !data.year) {
      return {
        success: false,
        error: "課題名、提出期限、年度は必須です",
      }
    }

    // 現在のユーザーIDを取得
    const userId = session.user.id

    // データベースに課題を作成
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: new Date(data.dueDate),
        year: data.year,
        type: data.type || "REPORT",
        category: data.category || null,
        tags: data.tags || [],
        evaluationCriteria: data.evaluationCriteria || null,
        maxScore: data.maxScore || null,
        passingScore: data.passingScore || null,
        isGroupAssignment: data.isGroupAssignment || false,
        maxGroupSize: data.maxGroupSize || null,
        minGroupSize: data.minGroupSize || null,
        isPublic: data.isPublic || false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        status: data.status || "DRAFT",
        createdById: userId,
      },
    })

    // キャッシュを再検証
    revalidatePath("/assignments")
    revalidatePath("/dashboard/teacher")

    return {
      success: true,
      data: assignment as unknown as AssignmentDetail,
    }
  } catch (error) {
    console.error("課題作成エラー:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "課題の作成に失敗しました",
    }
  }
}

// 課題一覧を取得する
export async function getAssignments(): Promise<{
  success: boolean
  data?: AssignmentDetail[]
  error?: string
}> {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: [{ status: "asc" }, { dueDate: "desc" }],
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return {
      success: true,
      data: assignments as unknown as AssignmentDetail[],
    }
  } catch (error) {
    console.error("課題一覧取得エラー:", error)
    return {
      success: false,
      error: "課題一覧の取得に失敗しました",
    }
  }
}

// 特定の課題を取得する
export async function getAssignment(id: string): Promise<{
  success: boolean
  data?: AssignmentDetail
  error?: string
}> {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
    })

    if (!assignment) {
      return {
        success: false,
        error: "指定された課題が見つかりません",
      }
    }

    return {
      success: true,
      data: assignment as unknown as AssignmentDetail,
    }
  } catch (error) {
    console.error("課題取得エラー:", error)
    return {
      success: false,
      error: "課題の取得に失敗しました",
    }
  }
}

// 課題を更新する
export async function updateAssignment(
  id: string,
  data: Partial<AssignmentInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    // セッションの検証
    const session = await getServerSession(authOptions)
    if (!session) {
      return {
        success: false,
        error: "認証されていません",
      }
    }

    if (session.user?.role !== "teacher") {
      return {
        success: false,
        error: "教員のみが課題を更新できます",
      }
    }

    const assignment = await prisma.assignment.findUnique({ where: { id } })
    if (!assignment) {
      return {
        success: false,
        error: "指定された課題が見つかりません",
      }
    }

    // 日付フィールドの処理
    const updateData: any = { ...data }
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate)
    }
    if (data.publishedAt) {
      updateData.publishedAt = new Date(data.publishedAt)
    }

    await prisma.assignment.update({
      where: { id },
      data: updateData,
    })

    // キャッシュを再検証
    revalidatePath("/assignments")
    revalidatePath(`/assignments/${id}`)
    revalidatePath("/dashboard/teacher")

    return { success: true }
  } catch (error) {
    console.error("課題更新エラー:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "課題の更新に失敗しました",
    }
  }
}

// 課題を削除する
export async function deleteAssignment(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // セッションの検証
    const session = await getServerSession(authOptions)
    if (!session) {
      return {
        success: false,
        error: "認証されていません",
      }
    }

    if (session.user?.role !== "teacher") {
      return {
        success: false,
        error: "教員のみが課題を削除できます",
      }
    }

    const assignment = await prisma.assignment.findUnique({ where: { id } })
    if (!assignment) {
      return {
        success: false,
        error: "指定された課題が見つかりません",
      }
    }

    await prisma.assignment.delete({ where: { id } })

    // キャッシュを再検証
    revalidatePath("/assignments")
    revalidatePath("/dashboard/teacher")

    return { success: true }
  } catch (error) {
    console.error("課題削除エラー:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "課題の削除に失敗しました",
    }
  }
} 