import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Проверяем наличие обязательных полей
    if (!body.phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен для заполнения' },
        { status: 400 }
      )
    }
    
    // Создаем новую заявку в базе данных
    const inquiry = await prisma.inquiry.create({
      data: {
        name: body.name || 'Не указано',
        phone: body.phone,
        message: body.message || '',
        source: body.source || 'Страница участка',
        plotId: body.plotId
      }
    })
    
    // Тут потенциально можно добавить отправку уведомлений
    // администраторам через email или telegram
    
    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id
    })
    
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 