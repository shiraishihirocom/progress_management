import { prisma } from "@/lib/prisma"

type NotificationType = "info" | "success" | "warning" | "error"

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
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
