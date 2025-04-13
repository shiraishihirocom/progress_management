import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: 1 },
    })

    if (!settings) {
      // デフォルト設定を返す
      return NextResponse.json({
        success: true,
        data: {
          systemName: "課題管理システム",
          systemDescription: "3DCG課題の提出・評価を管理するシステム",
          defaultCourseName: "未設定",
          availableGrades: [1, 2, 3, 4],
          enableEmailNotifications: true,
          enableAutoGrading: false,
          maxFileSize: 50,
          allowedFileTypes: [".blend", ".fbx", ".obj", ".stl"],
        },
      })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { success: false, error: "設定の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { settings } = body

    // 設定を保存
    await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: {
        systemName: settings.systemName,
        systemDescription: settings.systemDescription,
        defaultCourseName: settings.defaultCourseName,
        availableGrades: settings.availableGrades,
        enableEmailNotifications: settings.enableEmailNotifications,
        enableAutoGrading: settings.enableAutoGrading,
        maxFileSize: settings.maxFileSize,
        allowedFileTypes: settings.allowedFileTypes,
      },
      create: {
        id: 1,
        systemName: settings.systemName,
        systemDescription: settings.systemDescription,
        defaultCourseName: settings.defaultCourseName,
        availableGrades: settings.availableGrades,
        enableEmailNotifications: settings.enableEmailNotifications,
        enableAutoGrading: settings.enableAutoGrading,
        maxFileSize: settings.maxFileSize,
        allowedFileTypes: settings.allowedFileTypes,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json(
      { success: false, error: "設定の保存に失敗しました" },
      { status: 500 }
    )
  }
} 