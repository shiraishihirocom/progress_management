const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  try {
    console.log('Checking database connection...')
    
    // 基本的な接続テスト
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Connection successful:', result)
    
    // ユーザーテーブルへのクエリ
    const userCount = await prisma.user.count()
    console.log(`User count: ${userCount}`)
    
    // 課題テーブルへのクエリ
    const assignmentCount = await prisma.assignment.count()
    console.log(`Assignment count: ${assignmentCount}`)
    
    console.log('Database check completed successfully')
  } catch (error) {
    console.error('Database connection error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 