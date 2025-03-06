import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

const CACHE_KEY = 'contacts:data';
const CACHE_DURATION = 24 * 60 * 60; // 24 часа в секундах

export async function GET() {
  try {
    // Пробуем получить данные из Redis
    const cachedData = await redis.get(CACHE_KEY);
    
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // Если кэша нет, получаем из БД
    const contact = await prisma.contact.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Контактная информация не найдена' },
        { status: 404 }
      );
    }

    // Форматируем данные
    const formattedContact = {
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      work_hours: contact.work_hours ? JSON.parse(contact.work_hours as string) : null,
      social_links: {
        whatsapp: contact.whatsapp ? JSON.parse(contact.whatsapp as string) : null,
        telegram: contact.telegram ? JSON.parse(contact.telegram as string) : null,
        vk: contact.vk ? JSON.parse(contact.vk as string) : null
      }
    };

    // Сохраняем в Redis
    await redis.setex(
      CACHE_KEY,
      CACHE_DURATION,
      JSON.stringify(formattedContact)
    );

    return NextResponse.json(formattedContact);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Для инициализации/обновления контактных данных
export async function POST() {
  try {
    // Удаляем все существующие контакты
    await prisma.contact.deleteMany();

    // Создаем новый контакт с дефолтными данными
    const contact = await prisma.contact.create({
      data: {
        phone: '79039991234',
        email: 'info@altailands.ru',
        address: 'г. Барнаул, ул. Ленина, 1',
        work_hours: JSON.stringify({
          monday_friday: '9:00 - 18:00',
          saturday_sunday: '10:00 - 16:00'
        }),
        whatsapp: JSON.stringify({
          enabled: true,
          username: '9039991234'
        }),
        telegram: JSON.stringify({
          enabled: true,
          username: 'altailands'
        }),
        vk: JSON.stringify({
          enabled: true,
          username: 'altailands'
        })
      }
    });

    await redis.del(CACHE_KEY);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 