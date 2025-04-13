-- AlterTable
ALTER TABLE "User" ALTER COLUMN "courseName" SET DEFAULT '未設定';

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "systemName" TEXT NOT NULL DEFAULT '課題管理システム',
    "systemDescription" TEXT NOT NULL DEFAULT '3DCG課題の提出・評価を管理するシステム',
    "defaultCourseName" TEXT NOT NULL DEFAULT '未設定',
    "availableGrades" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4]::INTEGER[],
    "enableEmailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "enableAutoGrading" BOOLEAN NOT NULL DEFAULT false,
    "maxFileSize" INTEGER NOT NULL DEFAULT 50,
    "allowedFileTypes" TEXT[] DEFAULT ARRAY['.blend', '.fbx', '.obj', '.stl']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);
