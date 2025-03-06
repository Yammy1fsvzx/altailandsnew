import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { MapPinIcon, CurrencyRupeeIcon, HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import PlotGallery from '@/components/catalog/PlotGallery'
import PlotAttachments from '@/components/catalog/PlotAttachments'
import ContactInfo from '@/components/catalog/ContactInfo'
import PlotInquiryForm from '@/components/catalog/PlotInquiryForm'
import PlotSchemaMeta from '@/components/catalog/PlotSchemaMeta'
import { formatPrice, formatArea } from '@/lib/format'
import type { LandPlot, LandStatus } from '@/types'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

const STATUS_LABELS = {
  AVAILABLE: 'Доступен',
  RESERVED: 'Бронь',
  SOLD: 'Продан'
}

const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  SOLD: 'bg-red-100 text-red-800'
}

const UTILITY_LABELS = {
  electricity: 'Электричество',
  water: 'Водоснабжение',
  gas: 'Газ',
  sewerage: 'Канализация',
  internet: 'Интернет',
  road: 'Дорога'
}

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Правильная обработка параметров - ожидаем params перед использованием
  const resolvedParams = await params
  const id = String(resolvedParams?.id || '')
  
  if (!id) {
    return {
      title: 'Участок не найден',
      description: 'Информация о земельном участке не найдена'
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/plots/${id}`)
    const data = await response.json()
    
    if (!response.ok) {
      return {
        title: 'Участок не найден',
        description: 'Информация о земельном участке не найдена'
      }
    }
    
    const plot = data.plot
    
    return {
      title: plot.title,
      description: `${plot.area} м² - ${plot.region}, ${plot.location}. ${plot.description.substring(0, 150)}...`,
      openGraph: {
        images: plot.images && plot.images.length > 0
          ? [{ url: plot.images[0].url, width: 1200, height: 630 }]
          : []
      }
    }
  } catch (error) {
    return {
      title: 'Земельный участок',
      description: 'Подробная информация о земельном участке'
    }
  }
}

async function getPlotData(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/plots/${id}`, { 
      next: { revalidate: 3600 } // Кеширование на 1 час
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching plot data:', error)
    return null
  }
}

async function getContactInfo() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/contacts`, { 
      next: { revalidate: 86400 } // Кеширование на 24 часа
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return null
  }
}

export default async function PlotPage({ params }: PageProps) {
  // Правильная обработка параметров - ожидаем params перед использованием
  const resolvedParams = await params
  const id = String(resolvedParams?.id || '')
  
  if (!id) {
    notFound()
  }

  const data = await getPlotData(id)

  if (!data || !data.plot) {
    notFound()
  }
  
  const { plot, similarPlots } = data
  const contactData = await getContactInfo()
  
  // Отладочный вывод для проверки данных
  console.log('Plot data:', JSON.stringify({
    id: plot.id,
    cadastralNumber: plot.cadastralNumber,
    similarPlots: similarPlots?.length || 0
  }))
  
  console.log('Contact data:', JSON.stringify({
    whatsapp: contactData?.social_links?.whatsapp,
    telegram: contactData?.social_links?.telegram
  }))
  
  // Подготовка данных для whatsapp
  const whatsappNumber = contactData?.social_links?.whatsapp?.enabled && 
                         contactData?.social_links?.whatsapp?.username || '';

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12" style={{ marginTop: '100px' }}>
        {/* Микроразметка Schema.org */}
        <PlotSchemaMeta plot={plot} />
        
        {/* Навигационные хлебные крошки */}
        <div className="mb-6 text-base text-gray-600 space-x-2">
          <a href="/" className="hover:text-green-600">Главная</a>
          <span>&gt;</span>
          <a href="/catalog" className="hover:text-green-600">Каталог участков</a>
          <span>&gt;</span>
          <span className="text-green-700">{plot.title}</span>
        </div>
        
        {/* Заголовок и статус */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">
            {plot.title}
          </h1>
          
          <div className={`inline-flex px-3 py-1 rounded-full text-base font-medium ${STATUS_COLORS[plot.status as keyof typeof STATUS_COLORS]}`}>
            {STATUS_LABELS[plot.status as keyof typeof STATUS_LABELS]}
          </div>
        </div>
        
        {/* Краткая информация */}
        <div className="flex flex-wrap gap-4 mb-8 bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center text-base text-gray-700">
            <MapPinIcon className="w-5 h-5 mr-1.5 text-green-600" />
            <span>{plot.region}, {plot.location}</span>
          </div>
          <div className="flex items-center text-base text-gray-700">
            <HomeIcon className="w-5 h-5 mr-1.5 text-green-600" />
            <span>{formatArea(plot.area)} м²</span>
          </div>
          <div className="flex items-center text-base text-gray-700">
            <ArrowPathIcon className="w-5 h-5 mr-1.5 text-green-600" />
            <span>Обновлено: {new Date(plot.updatedAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация (галерея и описание) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Галерея изображений */}
            <PlotGallery images={plot.images} title={plot.title} />
            
            {/* Цена */}
            <div className="bg-white ring-1 ring-green-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl text-green-700 mb-1">Стоимость участка</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                    {formatPrice(plot.price)}
                  </div>
                  <div className="text-base text-gray-500 mt-1">
                    {formatPrice(plot.pricePerMeter)} за м²
                  </div>
                </div>
                
                {plot.status === 'AVAILABLE' && (
                  <a 
                    href={`tel:${contactData?.phone?.replace(/\D/g, '')}`}
                    className="hidden md:block py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium text-center rounded-lg transition-colors"
                  >
                    Забронировать
                  </a>
                )}
              </div>
            </div>
            
            {/* Блок с основными характеристиками (для быстрого просмотра) */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white ring-1 ring-green-100 rounded-lg p-4 shadow-sm">
                <div className="text-green-600 mb-2">Категория земель</div>
                <div className="font-medium">{plot.landCategory || 'Не указана'}</div>
              </div>
            </div>
            
            {/* Описание участка */}
            <div className="bg-white ring-1 ring-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
                Описание
              </h2>
              <div className="prose max-w-none">
                {plot.description.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Характеристики */}
            <div className="bg-white ring-1 ring-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
                Характеристики участка
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Основные характеристики */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-base text-gray-600 mb-1">Площадь участка</div>
                    <div className="text-lg font-medium">{formatArea(plot.area)} м²</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-base text-gray-600 mb-1">Категория земель</div>
                    <div className="font-medium">{plot.landCategory}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-base text-gray-600 mb-1">Кадастровый номер</div>
                    <div className="text-lg font-medium">
                      {Array.isArray(plot.cadastralNumbers) && plot.cadastralNumbers.length > 0 ? (
                        plot.cadastralNumbers.map((number: string, index: number) => (
                          <span key={number || index}>
                            <a 
                              href={`https://pkk.rosreestr.ru/#/search/${number}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 hover:underline"
                            >
                              {number}
                            </a>
                            {index < plot.cadastralNumbers.length - 1 && <span>, </span>}
                          </span>
                        ))
                      ) : plot.cadastralNumber ? (
                        <a 
                          href={`https://pkk.rosreestr.ru/#/search/${plot.cadastralNumber}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 hover:underline"
                        >
                          {plot.cadastralNumber}
                        </a>
                      ) : (
                        <span>Не указан</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Дополнительные характеристики */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-base text-gray-600 mb-1">Вид разрешенного использования</div>
                    <div className="font-medium">
                      {Array.isArray(plot.permittedUse) ? plot.permittedUse.join(', ') : plot.permittedUse || 'Не указан'}
                    </div>
                  </div>
                  
                  {plot.features && plot.features.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-base text-gray-600 mb-1">Особенности участка</div>
                      <div className="font-medium">
                        <ul className="list-disc list-inside">
                          {plot.features.map((feature: string, index: number) => (
                            <li key={index} className="text-gray-700">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Коммуникации */}
            <div className="bg-white ring-1 ring-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
                Коммуникации
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(plot.utilities).map(([key, value]) => {
                  if (!value) return null;
                  
                  const utility = value as any;
                  if (!utility.available) return null;
                  
                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-base text-gray-600 mb-1">{UTILITY_LABELS[key as keyof typeof UTILITY_LABELS]}</div>
                      <div className="font-medium flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
                        {utility.type && <span>{utility.type}</span>}
                        {!utility.type && <span>Доступно</span>}
                      </div>
                      {utility.description && (
                        <div className="text-xs text-gray-500 mt-1">{utility.description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Прикрепленные файлы */}
            {plot.attachments && plot.attachments.length > 0 && (
              <PlotAttachments attachments={plot.attachments} />
            )}
          </div>
          
          {/* Боковая информация (контакты и похожие участки) */}
          <div className="space-y-8">
            {/* Контактная информация */}
            {contactData && (
              <ContactInfo 
                phone={contactData.phone} 
                email={contactData.email}
                telegram={contactData.social_links?.telegram?.username}
                whatsapp={whatsappNumber}
                address={contactData.address}
              />
            )}
            
            {/* Форма быстрой заявки */}
            <PlotInquiryForm plotId={plot.id} plotTitle={plot.title} />
            
            {/* Похожие участки */}
            {similarPlots && similarPlots.length > 0 ? (
              <div className="bg-white ring-1 ring-green-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
                <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-4 md:mb-6">
                  Похожие участки
                </h3>
                
                <div className="space-y-4">
                  {similarPlots.map((similarPlot: LandPlot) => (
                    <a 
                      key={similarPlot.id} 
                      href={`/catalog/${similarPlot.id}`}
                      className="group block"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          {similarPlot.images && similarPlot.images.length > 0 ? (
                            <Image
                              src={similarPlot.images[0].url}
                              alt={similarPlot.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                            {similarPlot.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatArea(similarPlot.area)} м² • {similarPlot.location}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatPrice(similarPlot.price)}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white ring-1 ring-green-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
                <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-4 md:mb-6">
                  Похожие участки
                </h3>
                <p className="text-gray-600">К сожалению, похожих участков сейчас нет в наличии.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Кнопка возврата к каталогу */}
        <div className="mt-12 text-center">
          <a
            href="/catalog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Вернуться к каталогу участков
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
} 