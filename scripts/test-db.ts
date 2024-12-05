import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT current_database(), current_schema()`
    console.log('Database connection successful:', result)
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('Test user created:', user)

    // Count total users
    const userCount = await prisma.user.count()
    console.log('Total users:', userCount)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
