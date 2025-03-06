import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Создаем отдельный клиент для этого запроса
const prisma = new PrismaClient()

export async function GET() {
  console.log('API: Получен запрос на загрузку вопросов квиза')
  
  try {
    // Проверяем подключение к базе данных
    console.log('API: Проверка подключения к базе данных...')
    
    try {
      // Простой запрос для проверки соединения
      await prisma.$queryRaw`SELECT 1 as connected`
      console.log('API: Соединение с базой данных установлено')
    } catch (dbError) {
      console.error('API Error: Ошибка соединения с базой данных:', dbError)
      return NextResponse.json(
        { error: 'Ошибка соединения с базой данных' },
        { status: 500 }
      )
    }
    
    // Получаем активные вопросы квиза, отсортированные по порядку
    console.log('API: Выполняем запрос на получение вопросов...')
    
    const questions = await prisma.quizQuestion.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      },
      select: {
        id: true,
        question: true,
        options: true,
        order: true
      }
    })
    
    console.log(`API: Успешно загружено ${questions.length} вопросов:`, JSON.stringify(questions))
    
    // Проверяем, есть ли вопросы
    if (questions.length === 0) {
      console.log('API: Предупреждение - в базе нет вопросов квиза')
    }
    
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('API Error: Ошибка при загрузке вопросов квиза:', error)
    
    // Возвращаем более подробную информацию об ошибке
    return NextResponse.json(
      { 
        error: 'Ошибка при загрузке вопросов квиза',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  } finally {
    // Закрываем соединение
    await prisma.$disconnect()
  }
} 