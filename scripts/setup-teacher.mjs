import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const teacherEmail = process.env.TEACHER_EMAIL

  if (!teacherEmail) {
    console.error('TEACHER_EMAIL is not set in environment variables')
    process.exit(1)
  }

  try {
    // ユーザーが存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: teacherEmail },
    })

    if (existingUser) {
      // 既存のユーザーを教員に更新
      await prisma.user.update({
        where: { email: teacherEmail },
        data: { role: 'TEACHER' },
      })
      console.log(`Updated existing user ${teacherEmail} to TEACHER role`)
    } else {
      // 新しい教員ユーザーを作成
      await prisma.user.create({
        data: {
          email: teacherEmail,
          role: 'TEACHER',
          name: 'Teacher',
        },
      })
      console.log(`Created new teacher user: ${teacherEmail}`)
    }
  } catch (error) {
    console.error('Error setting up teacher account:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 