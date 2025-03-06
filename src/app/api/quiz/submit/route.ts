import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Создаем отдельный клиент для этого запроса
const prisma = new PrismaClient()

// Константа с размером скидки для удобного изменения
const DISCOUNT_PERCENT = 5

// Функция для генерации случайного промокода
function generatePromoCode(name: string): string {
  // Создаем основу промокода из имени клиента (первые 3 символа)
  const prefix = name.slice(0, 3).toUpperCase()
  
  // Добавляем временную метку (последние 3 цифры от timestamp)
  const timestamp = Date.now().toString().slice(-3)
  
  // Добавляем случайные буквы (2 символа)
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randChar1 = randomChars.charAt(Math.floor(Math.random() * randomChars.length))
  const randChar2 = randomChars.charAt(Math.floor(Math.random() * randomChars.length))
  
  // Объединяем все части и добавляем процент скидки в конце
  return `${prefix}${timestamp}${randChar1}${randChar2}${DISCOUNT_PERCENT}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Обязательные поля
    const { name, phone, answers } = body
    
    if (!name || !phone || !answers) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      )
    }
    
    // Проверяем, есть ли уже ответы с таким телефоном
    const existingResponse = await prisma.quizResponse.findFirst({
      where: {
        OR: [
          { phone },
          { email: body.email || undefined } // Проверяем email только если он указан
        ]
      }
    })
    
    if (existingResponse) {
      // Если есть существующий ответ, возвращаем его промокод
      const existingPromo = await prisma.promoCode.findUnique({
        where: { quizResponseId: existingResponse.id }
      })
      
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message: 'Вы уже проходили квиз ранее',
        promoCode: existingPromo?.code,
        responseId: existingResponse.id
      })
    }
    
    // Начинаем транзакцию для создания ответа и промокода
    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      // Создаем новую запись ответа на квиз
      const quizResponse = await tx.quizResponse.create({
        data: {
          name,
          phone,
          email: body.email || null,
          answers, // Сохраняем ответы в JSON
          completed: true,
          status: 'new'
        }
      })
      
      // Генерируем промокод
      const code = generatePromoCode(name)
      
      // Создаем промокод в базе данных
      const promoCode = await tx.promoCode.create({
        data: {
          code,
          discountPercent: DISCOUNT_PERCENT,
          isActive: true,
          // Устанавливаем срок действия на 30 дней от текущей даты
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          quizResponseId: quizResponse.id
        }
      })
      
      return { quizResponse, promoCode }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ответы успешно сохранены',
      responseId: result.quizResponse.id,
      promoCode: result.promoCode.code
    })
    
  } catch (error) {
    console.error('Error submitting quiz answers:', error)
    return NextResponse.json(
      { 
        error: 'Ошибка при сохранении ответов', 
        details: error instanceof Error ? error.message : 'Неизвестная ошибка' 
      },
      { status: 500 }
    )
  } finally {
    // Закрываем соединение
    await prisma.$disconnect()
  }
} 