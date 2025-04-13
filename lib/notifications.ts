import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// NotificationTypeの型定義
type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

// 定数として列挙型の値を定義
export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
}: {
  userId: string
  title: string
  message: string
  type?: NotificationType
}) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  })
}

export async function markNotificationAsRead(id: string) {
  return await prisma.notification.update({
    where: { id },
    data: { read: true },
  })
}

export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
}

export async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUnreadNotificationsCount(userId: string) {
  return await prisma.notification.count({
    where: { userId, read: false },
  })
}
