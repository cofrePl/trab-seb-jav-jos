import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pradera.local' },
    update: {},
    create: {
      name: 'Admin Pradera',
      email: 'admin@pradera.local',
      password,
      role: 'ADMIN'
    }
  })
  console.log('Seeded admin:', admin.email)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
