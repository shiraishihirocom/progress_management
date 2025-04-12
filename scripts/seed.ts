const { PrismaClient } = require("@prisma/client")
require("dotenv").config()

const prisma = new PrismaClient()

async function main() {
  // 教員アカウントの作成
  const teacherEmail = process.env.TEACHER_EMAIL
  if (!teacherEmail) {
    throw new Error("TEACHER_EMAIL is not set in .env file")
  }

  const teacher = await prisma.user.upsert({
    where: {
      email: teacherEmail,
    },
    update: {
      role: "TEACHER",
    },
    create: {
      email: teacherEmail,
      name: "教員アカウント",
      role: "TEACHER",
    },
  })

  console.log("教員アカウントが作成/更新されました:", teacher)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 