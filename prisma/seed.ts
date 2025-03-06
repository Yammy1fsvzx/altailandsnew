import { PrismaClient, LandStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Очищаем базу данных
  await prisma.promoCode.deleteMany()
  await prisma.quizResponse.deleteMany()
  await prisma.quizQuestion.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.image.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.landPlot.deleteMany()
  await prisma.request.deleteMany()
  await prisma.contact.deleteMany()

  // Создаем контактную информацию
  const contact = await prisma.contact.create({
    data: {
      phone: "+7 (999) 123-45-67",
      email: "info@altailands.ru",
      address: "г. Барнаул, ул. Ленина, 1",
      whatsapp: { enabled: true, username: "altailands" },
      telegram: { enabled: true, username: "altailands" },
      vk: { enabled: true, username: "altailands" },
      work_hours: {
        monday_friday: "9:00 - 18:00",
        saturday_sunday: "10:00 - 16:00"
      }
    }
  })

  // Создаем земельные участки
  const plots = await Promise.all([
    prisma.landPlot.create({
      data: {
        title: "Живописный участок у реки",
        description: "Великолепный участок с видом на реку и горы. Идеально подходит для строительства загородного дома или базы отдыха.",
        cadastralNumbers: ["22:61:051234:123"],
        area: 1500,
        region: "Алтайский край",
        location: "с. Манжерок",
        landCategory: "Земли населенных пунктов",
        permittedUse: ["ИЖС", "ЛПХ"],
        price: 1500000,
        pricePerMeter: 1000,
        status: LandStatus.AVAILABLE,
        features: ["Вид на горы", "У реки", "Ровный участок"],
        utilities: {
          electricity: true,
          water: true,
          gas: false,
          sewage: false,
          road: "грунтовая"
        },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
              path: "/images/plots/1/1.jpg",
              order: 1,
              isMain: true
            },
            {
              url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
              path: "/images/plots/1/2.jpg",
              order: 2,
              isMain: false
            }
          ]
        },
        attachments: {
          create: [
            {
              name: "Кадастровый паспорт.pdf",
              path: "/attachments/plots/1/cadastral.pdf",
              type: "application/pdf",
              size: 1024576
            }
          ]
        }
      }
    }),
    prisma.landPlot.create({
      data: {
        title: "Участок в коттеджном поселке",
        description: "Участок в современном коттеджном поселке со всеми коммуникациями. Развитая инфраструктура, хорошие соседи.",
        cadastralNumbers: ["22:61:051234:124"],
        area: 800,
        region: "Алтайский край",
        location: "п. Чемал",
        landCategory: "Земли населенных пунктов",
        permittedUse: ["ИЖС"],
        price: 2000000,
        pricePerMeter: 2500,
        status: LandStatus.RESERVED,
        features: ["В коттеджном поселке", "Все коммуникации", "Охрана"],
        utilities: {
          electricity: true,
          water: true,
          gas: true,
          sewage: true,
          road: "асфальт"
        },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1506974210756-8e1b8985d348",
              path: "/images/plots/2/1.jpg",
              order: 1,
              isMain: true
            }
          ]
        }
      }
    })
  ])

  // Создаем заявки
  const inquiries = await Promise.all([
    prisma.inquiry.create({
      data: {
        name: "Иван Петров",
        phone: "+7 (999) 111-22-33",
        message: "Интересует рассрочка на участок",
        source: "plot_page",
        status: "new",
        plotId: plots[0].id
      }
    }),
    prisma.inquiry.create({
      data: {
        name: "Мария Иванова",
        phone: "+7 (999) 444-55-66",
        message: "Хочу узнать про коммуникации",
        source: "contact_form",
        status: "processing"
      }
    })
  ])

  // Создаем вопросы для квиза
  const questions = await Promise.all([
    prisma.quizQuestion.create({
      data: {
        question: "Какой тип участка вас интересует?",
        options: ["ИЖС", "Сельхозназначения", "Коммерческий", "Пока не определился"],
        order: 1
      }
    }),
    prisma.quizQuestion.create({
      data: {
        question: "Какая площадь участка вам нужна?",
        options: ["До 10 соток", "10-20 соток", "Более 20 соток", "Пока не определился"],
        order: 2
      }
    }),
    prisma.quizQuestion.create({
      data: {
        question: "В каком районе хотите приобрести участок?",
        options: ["Чемальский район", "Майминский район", "Алтайский район", "Рассмотрю все варианты"],
        order: 3
      }
    })
  ])

  // Создаем ответы на квиз
  const quizResponse = await prisma.quizResponse.create({
    data: {
      name: "Петр Сидоров",
      phone: "+7 (999) 777-88-99",
      email: "petr@example.com",
      answers: {
        "1": "ИЖС",
        "2": "10-20 соток",
        "3": "Чемальский район"
      },
      completed: true,
      status: "new",
      questionId: questions[2].id
    }
  })

  // Создаем промокод для ответа на квиз
  const promoCode = await prisma.promoCode.create({
    data: {
      code: "WELCOME2024",
      discountPercent: 10,
      isActive: true,
      expiresAt: new Date("2024-12-31"),
      maxUsages: 1,
      quizResponseId: quizResponse.id
    }
  })

  console.log('База данных успешно заполнена тестовыми данными!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 