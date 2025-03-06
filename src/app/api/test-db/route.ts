import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Создаем новый экземпляр PrismaClient напрямую
const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('API Test: Проверка подключения к базе данных...')
    
    // Простой запрос для проверки соединения
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log('API Test: Результат тестового запроса:', result)
    
    // Также попробуем получить количество вопросов
    const questionsCount = await prisma.quizQuestion.count()
    console.log(`API Test: В базе найдено ${questionsCount} вопросов`)
    
    return NextResponse.json({ 
      success: true,
      message: 'Подключение к базе данных работает',
      questionsCount
    })
  } catch (error) {
    console.error('API Test Error:', error)
    
    // Возвращаем подробную информацию об ошибке
    return NextResponse.json(
      { 
        success: false,
        error: 'Ошибка подключения к базе данных',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  } finally {
    // Отключаемся от базы данных
    await prisma.$disconnect()
  }
} 