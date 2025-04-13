"use server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

type UserInput = {
  name: string
  email: string
  role: Role
  enrollmentYear: number | null
  grade: number | null
  studentNumber: number | null
}

export type UserSummary = UserInput & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export async function getUsers(): Promise<{ success: boolean; data?: UserSummary[]; error?: string }> {
  try {
    const users = await prisma.user.findMany({
      orderBy: [
        { role: "asc" },
        { grade: "asc" },
        { studentNumber: "asc" },
      ],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        courseName: true,
        enrollmentYear: true,
        grade: true,
        studentNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return {
      success: true,
      data: users.map(user => ({
        ...user,
        name: user.name ?? '',
        email: user.email ?? '',
        courseName: user.courseName ?? null,
      })),
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      error: "ユーザー一覧の取得に失敗しました。",
    }
  }
}

export async function updateUser(
  id: string,
  data: Partial<UserSummary>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData = {
      name: data.name,
      email: data.email,
      role: data.role,
      enrollmentYear: data.enrollmentYear,
      grade: data.grade,
      studentNumber: data.studentNumber,
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/dashboard/teacher/users")
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: "ユーザーの更新に失敗しました。",
    }
  }
}

export async function createUser(user: UserInput, role: Role) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // メールアドレスの存在チェック
      if (!user.email) {
        throw new Error("メールアドレスは必須です")
      }

      // メールアドレスの重複チェック
      const existingUser = await tx.user.findUnique({
        where: { email: user.email },
      })

      if (existingUser) {
        throw new Error("このメールアドレスは既に使用されています")
      }

      const newUser = await tx.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: role,
          enrollmentYear: user.enrollmentYear,
          grade: user.grade,
          studentNumber: user.studentNumber,
        },
      })

      return newUser
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ユーザーの作成に失敗しました",
    }
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath("/dashboard/teacher/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      error: "ユーザーの削除に失敗しました。",
    }
  }
} 