"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SubmissionStatus } from "@prisma/client"

// 提出データの型定義
export type SubmissionDetail = {
  id: string
  version: number
  assignmentId: string
  userId: string
  zipFileUrl: string
  previewImgUrl: string | null
  score: number | null
  comment: string | null
  status: SubmissionStatus
  reviewedAt: Date | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string
    email: string
    courseName: string | null
    grade: number | null
    studentNumber: number | null
  }
}

// 特定の課題の全提出を取得
export async function getSubmissionsByAssignment(assignmentId: string): Promise<{
  success: boolean
  data?: SubmissionDetail[]
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

    // 教員のみが全ての提出を閲覧可能
    if (session.user?.role !== "teacher") {
      return {
        success: false,
        error: "提出一覧を閲覧する権限がありません",
      }
    }

    // 課題が存在するか確認
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    })

    if (!assignment) {
      return {
        success: false,
        error: "指定された課題が見つかりません",
      }
    }

    // 指定された課題の全提出を取得
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: assignmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            courseName: true,
            grade: true,
            studentNumber: true,
          },
        },
      },
      orderBy: [
        { status: "asc" },
        { createdAt: "desc" },
      ],
    })

    return {
      success: true,
      data: submissions as unknown as SubmissionDetail[],
    }
  } catch (error) {
    console.error("提出データ取得エラー:", error)
    return {
      success: false,
      error: "提出データの取得に失敗しました",
    }
  }
}

// 特定の学生の特定の課題への提出を取得
export async function getStudentSubmission(
  assignmentId: string,
  studentId: string
): Promise<{
  success: boolean
  data?: SubmissionDetail
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

    // 教員または自分自身の提出のみ閲覧可能
    if (session.user?.role !== "teacher" && session.user?.id !== studentId) {
      return {
        success: false,
        error: "この提出を閲覧する権限がありません",
      }
    }

    // 提出を取得
    const submission = await prisma.submission.findFirst({
      where: {
        assignmentId: assignmentId,
        userId: studentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            courseName: true,
            grade: true,
            studentNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (!submission) {
      return {
        success: false,
        error: "指定された提出が見つかりません",
      }
    }

    return {
      success: true,
      data: submission as unknown as SubmissionDetail,
    }
  } catch (error) {
    console.error("提出データ取得エラー:", error)
    return {
      success: false,
      error: "提出データの取得に失敗しました",
    }
  }
}

// ユーザーの全提出履歴を取得
export async function getUserSubmissions(): Promise<{
  success: boolean
  data?: Array<SubmissionDetail & { assignment: { id: string; title: string; dueDate: Date } }>
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

    // ユーザーID
    const userId = session.user.id

    // ユーザーの提出履歴を取得
    const submissions = await prisma.submission.findMany({
      where: { userId: userId },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      data: submissions as unknown as Array<SubmissionDetail & { assignment: { id: string; title: string; dueDate: Date } }>,
    }
  } catch (error) {
    console.error("提出履歴取得エラー:", error)
    return {
      success: false,
      error: "提出履歴の取得に失敗しました",
    }
  }
}

// 特定の課題に対するユーザーの提出履歴を取得
export async function getAssignmentSubmissionHistory(
  assignmentId: string
): Promise<{
  success: boolean
  data?: SubmissionDetail[]
  assignmentTitle?: string
  error?: string
}> {
  try {
    console.log("getAssignmentSubmissionHistory called with ID:", assignmentId)
    
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "Authenticated" : "Not authenticated", "User:", session?.user?.id)
    
    if (!session) {
      return {
        success: false,
        error: "認証されていません",
      }
    }

    // ユーザーID
    const userId = session.user.id
    console.log("User ID from session:", userId)

    // 課題情報を取得
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { title: true },
    })
    console.log("Assignment found:", assignment ? "Yes" : "No", "Title:", assignment?.title)

    if (!assignment) {
      return {
        success: false,
        error: "指定された課題が見つかりません",
      }
    }

    // ユーザーの提出履歴を取得
    const submissions = await prisma.submission.findMany({
      where: { 
        assignmentId: assignmentId,
        userId: userId,
      },
      select: {
        id: true,
        version: true,
        status: true,
        score: true,
        comment: true,
        previewImgUrl: true,
        createdAt: true,
        updatedAt: true,
        reviewedAt: true,
        zipFileUrl: true
      },
      orderBy: { createdAt: "desc" },
    })
    console.log("Submissions found:", submissions.length, "submissions data:", JSON.stringify(submissions))

    return {
      success: true,
      data: submissions as unknown as SubmissionDetail[],
      assignmentTitle: assignment.title,
    }
  } catch (error) {
    console.error("提出履歴取得エラー:", error)
    return {
      success: false,
      error: "提出履歴の取得に失敗しました",
    }
  }
} 