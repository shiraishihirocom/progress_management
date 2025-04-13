"use server"

import { prisma } from "@/lib/prisma"
import { Role, AssignmentStatus } from "@prisma/client"

export type StudentSummary = {
  id: string
  name: string
  studentNumber?: number
  grade?: number
  totalSubmissions: number
  totalAssignments: number
  averageScore: number | null
  lastSubmittedAt: string | null
}

export async function getStudents(): Promise<{ success: boolean; data?: StudentSummary[]; error?: string }> {
  try {
    // 学生一覧を取得
    const students = await prisma.user.findMany({
      where: {
        role: Role.STUDENT,
      },
      orderBy: [
        { grade: "asc" },
        { studentNumber: "asc" },
      ],
      select: {
        id: true,
        name: true,
        studentNumber: true,
        grade: true,
        submissions: {
          select: {
            score: true,
            createdAt: true,
          },
        },
      },
    })

    // 課題の総数を取得（公開済みの課題のみ）
    const totalAssignments = await prisma.assignment.count({
      where: {
        status: AssignmentStatus.PUBLISHED,
      },
    })

    // 学生データを整形
    const studentSummaries: StudentSummary[] = students.map((student) => {
      const submissions = student.submissions || []
      const scores = submissions.map((s) => s.score).filter((s): s is number => s !== null)
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      const lastSubmittedAt = submissions.length > 0
        ? submissions.reduce((latest, current) => {
            return latest.createdAt > current.createdAt ? latest : current
          }).createdAt.toISOString().split("T")[0]
        : null

      return {
        id: student.id,
        name: student.name || "未設定",
        studentNumber: student.studentNumber || undefined,
        grade: student.grade || undefined,
        totalSubmissions: submissions.length,
        totalAssignments,
        averageScore,
        lastSubmittedAt,
      }
    })

    return {
      success: true,
      data: studentSummaries,
    }
  } catch (error) {
    console.error("Error fetching students:", error)
    return {
      success: false,
      error: "学生一覧の取得に失敗しました。",
    }
  }
} 