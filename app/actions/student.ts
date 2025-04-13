"use server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export type StudentSummary = {
  id: string
  name: string
  email: string
  role: Role
  enrollmentYear: number | null
  grade: number | null
  studentNumber: number | null
  courseName: string | null
  createdAt: Date
  updatedAt: Date
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
        role: "STUDENT",
      },
      orderBy: [
        { grade: "asc" },
        { studentNumber: "asc" },
      ],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        courseName: true,
        grade: true,
        studentNumber: true,
        enrollmentYear: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // 課題の総数を取得
    const totalAssignments = await prisma.assignment.count()

    // 学生データを整形
    const studentSummaries: StudentSummary[] = students.map((student) => {
      return {
        id: student.id,
        name: student.name ?? '',
        email: student.email ?? '',
        role: student.role,
        enrollmentYear: student.enrollmentYear,
        grade: student.grade,
        studentNumber: student.studentNumber,
        courseName: student.courseName,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        totalSubmissions: 0,
        totalAssignments,
        averageScore: null,
        lastSubmittedAt: null,
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