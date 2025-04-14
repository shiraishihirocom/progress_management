import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// エラーハンドリング
if (process.env.NODE_ENV === "development") {
  prisma.$use(async (params, next) => {
    try {
      return await next(params)
    } catch (error) {
      console.error('Prisma Error:', error)
      throw error
    }
  })
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
