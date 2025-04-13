import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'shiraishihirocom@gmail.com'
  
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user) {
    console.log('ユーザーが見つかりました:')
    console.log(JSON.stringify(user, null, 2))
  } else {
    console.log('ユーザーが見つかりませんでした')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 