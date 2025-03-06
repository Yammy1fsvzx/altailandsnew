import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { LandStatus } from '@/types'
import { uploadFile } from '@/lib/uploadFile'

// Типы для фильтров
export interface PlotFilters {
  search?: string
  region?: string
  location?: string
  landCategory?: string
  status?: LandStatus
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Получаем параметры запроса
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'newest'
    
    // Определяем параметры сортировки на основе выбранной опции
    let orderBy: any = { createdAt: 'desc' } // по умолчанию сначала новые
    
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    
    // Фильтры
    const filters: PlotFilters = {
      search: searchParams.get('search') || undefined,
      region: searchParams.get('region') || undefined,
      location: searchParams.get('location') || undefined,
      landCategory: searchParams.get('landCategory') || undefined,
      status: (searchParams.get('status') as LandStatus) || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      areaMin: searchParams.get('areaMin') ? Number(searchParams.get('areaMin')) : undefined,
      areaMax: searchParams.get('areaMax') ? Number(searchParams.get('areaMax')) : undefined,
    }

    // Формируем условия фильтрации
    const where = {
      isVisible: true,
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { cadastralNumbers: { has: filters.search } }
        ]
      }),
      ...(filters.region && { region: filters.region }),
      ...(filters.location && { location: filters.location }),
      ...(filters.landCategory && { landCategory: filters.landCategory }),
      ...(filters.status && { status: filters.status }),
      ...(filters.priceMin && { price: { gte: filters.priceMin } }),
      ...(filters.priceMax && { price: { lte: filters.priceMax } }),
      ...(filters.areaMin && { area: { gte: filters.areaMin } }),
      ...(filters.areaMax && { area: { lte: filters.areaMax } }),
    }

    // Получаем общее количество записей
    const total = await prisma.landPlot.count({ where: where as any })

    // Получаем записи с пагинацией
    const plots = await prisma.landPlot.findMany({
      where: where as any,
      include: {
        images: {
          where: { isMain: true },
          take: 1
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      plots,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching plots:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const data = JSON.parse(formData.get('data') as string)
    
    // Создаем участок в базе данных
    const landPlot = await prisma.landPlot.create({
      data: {
        title: data.title,
        description: data.description,
        area: data.area,
        price: data.price,
        region: data.region,
        location: data.location,
        landCategory: data.landCategory,
        permittedUse: [data.permittedUse], // В базе это массив
        status: data.status,
        features: data.features,
        utilities: data.utilities,
        isVisible: true,
        pricePerMeter: Math.round(data.price / data.area) // Вычисляем цену за метр
      }
    })

    // Обрабатываем загруженные изображения
    const imagePromises = []
    let order = 0
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image-') && value instanceof File) {
        const { path, url } = await uploadFile(value, 'image')
        imagePromises.push(
          prisma.image.create({
            data: {
              url,
              path,
              order: order++,
              isMain: order === 1, // Первое изображение будет главным
              landPlotId: landPlot.id
            }
          })
        )
      }
    }
    await Promise.all(imagePromises)

    // Обрабатываем загруженные документы
    const documentPromises = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('document-') && value instanceof File) {
        const { path, url } = await uploadFile(value, 'document')
        documentPromises.push(
          prisma.attachment.create({
            data: {
              name: value.name,
              path,
              type: value.type,
              size: value.size,
              landPlotId: landPlot.id
            }
          })
        )
      }
    }
    await Promise.all(documentPromises)

    return NextResponse.json({
      success: true,
      landPlot
    })
  } catch (error) {
    console.error('Error creating land plot:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании участка' },
      { status: 500 }
    )
  }
} 