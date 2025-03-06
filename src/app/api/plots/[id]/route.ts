import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/uploadFile'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Получаем данные земельного участка по ID
    const plot = await prisma.landPlot.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        attachments: true
      }
    })
    
    if (!plot) {
      return NextResponse.json(
        { error: 'Участок не найден' },
        { status: 404 }
      )
    }
    
    // Выводим информацию о кадастровом номере для отладки
    console.log(`Plot ${id} cadastral number:`, plot.cadastralNumbers || 'not set')
    
    // Также получаем похожие участки из той же локации
    const similarPlots = await prisma.landPlot.findMany({
      where: {
        id: { not: id },
        isVisible: true,
        location: plot.location,
        OR: [
          { landCategory: plot.landCategory },
          { area: { gte: plot.area * 0.7, lte: plot.area * 1.3 } }
        ]
      },
      include: {
        images: {
          take: 1
        }
      },
      take: 4,
    })
    
    console.log(`Found ${similarPlots.length} similar plots for ${id}`)
    
    return NextResponse.json({
      plot,
      similarPlots
    })
    
  } catch (error) {
    console.error('Error fetching land plot:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const formData = await request.formData()
    const data = JSON.parse(formData.get('data') as string)

    // Обновляем основные данные участка
    const landPlot = await prisma.landPlot.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        area: data.area,
        price: data.price,
        region: data.region,
        location: data.location,
        landCategory: data.landCategory,
        permittedUse: [data.permittedUse],
        status: data.status,
        features: data.features,
        utilities: data.utilities,
        pricePerMeter: Math.round(data.price / data.area)
      }
    })

    // Обрабатываем новые изображения
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
              isMain: order === 1,
              landPlotId: landPlot.id
            }
          })
        )
      }
    }
    await Promise.all(imagePromises)

    // Обрабатываем новые документы
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
    console.error('Error updating land plot:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении участка' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Удаляем участок и все связанные данные
    await prisma.landPlot.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Error deleting land plot:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении участка' },
      { status: 500 }
    )
  }
} 