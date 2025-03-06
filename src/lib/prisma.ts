import { PrismaClient } from '@prisma/client'

// Добавляем подробное логирование для отладки
const prismaClientSingleton = () => {
  console.log('Initializing PrismaClient...')
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Проверяем, что соединение работает
prisma.$connect()
  .then(() => console.log('PrismaClient connected successfully'))
  .catch((e: Error) => console.error('PrismaClient connection error:', e))

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma