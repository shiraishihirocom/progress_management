import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== ユーザー情報 ===')
  const users = await prisma.user.findMany()
  console.log(JSON.stringify(users, null, 2))

  console.log('\n=== アカウント情報 ===')
  const accounts = await prisma.account.findMany({
    include: {
      user: true
    }
  })
  console.log(JSON.stringify(accounts, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 