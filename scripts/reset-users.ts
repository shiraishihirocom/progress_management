import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // アカウントを削除
  await prisma.account.deleteMany()
  console.log('アカウントを削除しました')

  // ユーザーを削除
  await prisma.user.deleteMany()
  console.log('ユーザーを削除しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 