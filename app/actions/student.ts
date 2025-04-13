"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export type StudentSummary = {
  id: string
  name: string
  studentNumber?: string
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
        submissions: {
          select: {
            score: true,
            submittedAt: true,
          },
        },
      },
    })

    // 課題の総数を取得
    const totalAssignments = await prisma.assignment.count()

    // 学生データを整形
    const studentSummaries: StudentSummary[] = students.map((student) => {
      const submissions = student.submissions || []
      const scores = submissions.map((s) => s.score).filter((s): s is number => s !== null)
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      const lastSubmittedAt = submissions.length > 0
        ? submissions.reduce((latest, current) => {
            return latest.submittedAt > current.submittedAt ? latest : current
          }).submittedAt.toISOString().split("T")[0]
        : null

      return {
        id: student.id,
        name: student.name,
        studentNumber: student.studentNumber || undefined,
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