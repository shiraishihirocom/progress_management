-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('REPORT', 'PRESENTATION', 'TEST', 'PROJECT', 'OTHER');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "category" TEXT,
ADD COLUMN     "evaluationCriteria" TEXT,
ADD COLUMN     "isGroupAssignment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxGroupSize" INTEGER,
ADD COLUMN     "maxScore" INTEGER,
ADD COLUMN     "minGroupSize" INTEGER,
ADD COLUMN     "passingScore" INTEGER,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" "AssignmentType" NOT NULL DEFAULT 'REPORT';

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
