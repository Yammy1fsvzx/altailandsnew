import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Создаем контактную информацию
    const contact = await prisma.contact.create({
      data: {
        phone: '+7 (999) 123-45-67',
        email: 'info@altailands.ru',
        address: 'г. Барнаул, ул. Ленина, 1',
        whatsapp: JSON.stringify({ enabled: true, username: '79991234567' }),
        telegram: JSON.stringify({ enabled: true, username: 'altailands' }),
        vk: JSON.stringify({ enabled: true, username: 'altailands' }),
        work_hours: JSON.stringify({
          monday_friday: '9:00 - 18:00',
          saturday_sunday: '10:00 - 16:00'
        })
      }
    })
    console.log('✅ Контактная информация создана')

    // Создаем земельные участки
    const landPlot1 = await prisma.landPlot.create({
      data: {
        title: 'Участок у озера',
        description: 'Живописный участок с видом на озеро. Идеально подходит для строительства дома или базы отдыха.',
        cadastralNumbers: ['22:61:051234:123'],
        area: 1500,
        price: 2500000,
        pricePerMeter: 1667,
        region: 'Алтайский край',
        location: 'Первомайский район, с. Березовка',
        landCategory: 'СХ',
        permittedUse: ['ЛПХ', 'ИЖС'],
        status: 'AVAILABLE',
        features: ['Вид на озеро', 'Ровный участок', 'Круглогодичный подъезд'],
        utilities: JSON.stringify({
          electricity: true,
          water: true,
          gas: false,
          sewage: false
        })
      }
    })

    const landPlot2 = await prisma.landPlot.create({
      data: {
        title: 'Участок в горах',
        description: 'Уникальный участок в предгорьях Алтая. Прекрасный вид на горы, чистый воздух.',
        cadastralNumbers: ['22:61:051234:124'],
        area: 2000,
        price: 3500000,
        pricePerMeter: 1750,
        region: 'Алтайский край',
        location: 'Алтайский район, с. Горное',
        landCategory: 'СХ',
        permittedUse: ['ЛПХ', 'СХ использование'],
        status: 'AVAILABLE',
        features: ['Горный вид', 'Лес рядом', 'Экологически чистый район'],
        utilities: JSON.stringify({
          electricity: true,
          water: false,
          gas: false,
          sewage: false
        })
      }
    })
    console.log('✅ Земельные участки созданы')

    // Создаем вопросы для квиза
    const questions = await prisma.quizQuestion.createMany({
      data: [
        {
          question: 'Какой тип участка вас интересует?',
          options: ['Для жилищного строительства', 'Для сельского хозяйства', 'Для коммерческого использования'],
          order: 1,
          isActive: true
        },
        {
          question: 'Какая площадь участка вам необходима?',
          options: ['До 10 соток', '10-20 соток', 'Более 20 соток'],
          order: 2,
          isActive: true
        },
        {
          question: 'Какой бюджет вы рассматриваете?',
          options: ['До 1 млн', '1-3 млн', 'Более 3 млн'],
          order: 3,
          isActive: true
        }
      ]
    })
    console.log('✅ Вопросы для квиза созданы')

    console.log('🎉 База данных успешно заполнена')
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 