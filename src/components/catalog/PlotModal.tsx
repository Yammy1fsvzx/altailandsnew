import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PhoneIcon, InformationCircleIcon, MapIcon, MapPinIcon, CheckIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import type { LandPlot } from '@/types'
import { formatPrice, formatArea } from '@/lib/format'

interface PlotModalProps {
  plot: LandPlot | null
  isOpen: boolean
  onClose: () => void
}

const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  SOLD: 'bg-red-100 text-red-800'
}

const STATUS_LABELS = {
  AVAILABLE: 'Доступен',
  RESERVED: 'Бронь',
  SOLD: 'Продан'
}

const UTILITY_LABELS = {
  electricity: 'Электричество',
  water: 'Водоснабжение',
  gas: 'Газ',
  sewerage: 'Канализация',
  internet: 'Интернет',
  road: 'Дорога'
}

export default function PlotModal({ plot, isOpen, onClose }: PlotModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  if (!plot) return null
  
  const images = plot.images || []
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const formatUtility = (key: string, value: any) => {
    if (!value) return null;
    
    let result = '';
    
    if (typeof value === 'object') {
      if (!value.available) return null;
      
      result = UTILITY_LABELS[key as keyof typeof UTILITY_LABELS] || key;
      
      if (value.type) {
        result += `: ${value.type}`;
      }
      
      if (value.description) {
        result += ` (${value.description})`;
      }
      
      if (value.providers && value.providers.length > 0) {
        result += ` - ${value.providers.join(', ')}`;
      }
    }
    
    return result;
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-black/35" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 w-full md:w-[90%] lg:w-[80%] xl:w-[60%]">
                <div className="absolute right-0 top-0 pr-4 pt-4 z-10">
                  <button
                    type="button"
                    className="rounded-lg bg-white/80 backdrop-blur p-2 text-gray-400 hover:text-gray-500 transition-transform hover:scale-110"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Галерея изображений */}
                <div className="relative aspect-[16/9] w-full group">
                  {images.length > 0 ? (
                    <>
                      <Image
                        src={images[currentImageIndex].url}
                        alt={plot.title}
                        fill
                        className="object-cover transition-opacity duration-300"
                        priority
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 backdrop-blur text-gray-800 hover:bg-white shadow-lg transform transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeftIcon className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 backdrop-blur text-gray-800 hover:bg-white shadow-lg transform transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRightIcon className="w-6 h-6" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                  index === currentImageIndex 
                                    ? 'bg-white scale-150 shadow-sm' 
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Основная информация */}
                <div className="p-6 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center text-gray-600 text-sm md:text-base">
                        <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                        <span className="font-medium">{plot.region}, {plot.location}</span>
                      </div>

                      <Dialog.Title as="h3" className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {plot.title}
                      </Dialog.Title>

                      <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium ${STATUS_COLORS[plot.status]} border`}>
                          {STATUS_LABELS[plot.status]}
                        </span>
                        <div className="bg-gray-100 rounded-lg px-3 py-1 text-sm md:text-base">
                          <span className="text-gray-700">Категория: {plot.landCategory}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1 md:space-y-2">
                      <div className="text-2xl md:text-4xl font-extrabold text-gray-900">
                        {formatPrice(plot.price)} ₽
                      </div>
                      <div className="text-sm md:text-lg text-gray-600 bg-gray-50 rounded-lg px-2 py-1 md:px-3 md:py-1">
                        {formatPrice(Math.round(plot.price / plot.area))} ₽/м²
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    {plot.description && (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <InformationCircleIcon className="w-6 h-6" />
                          Описание участка
                        </div>
                        <div className="text-gray-600 text-lg leading-relaxed">
                          {plot.description}
                        </div>
                        {/* Блок с прикреплёнными файлами */}
                        {plot.attachments && plot.attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <div className="text-sm font-medium text-gray-700">Прикреплённые документы:</div>
                            <div className="flex flex-wrap gap-2">
                              {plot.attachments.map((file: { name: string, url: string }, index: number) => (
                                <a
                                  key={index}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {file.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-6 md:space-y-8">
                      {/* Кадастровые номера */}
                      <div className="bg-white ring-1 ring-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
                        <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Кадастровые номера</h4>
                        <div className="space-y-2 md:space-y-3">
                          {plot.cadastralNumbers?.map((number, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                              <span className="font-mono text-primary text-base md:text-lg font-semibold break-all">
                                {number}
                              </span>
                              <a 
                                href={`https://pkk.rosreestr.ru/#/search/${number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 md:gap-2 text-sm md:text-base text-primary hover:text-primary-dark transition-colors"
                              >
                                <MapIcon className="w-4 h-4 md:w-5 md:h-5" />
                                Карта Росреестра
                              </a>
                            </div>
                          )) || <span className="text-gray-500 text-base">Не указаны</span>}
                        </div>
                      </div>

                      {/* Характеристики */}
                      <div className="bg-white ring-1 ring-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
                        <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                          Характеристики участка
                        </h4>
                        
                        {/* Площадь */}
                        <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm md:text-base">Общая площадь</span>
                            <span className="font-medium text-gray-900 text-lg md:text-xl">
                              {formatArea(plot.area)} м²
                            </span>
                          </div>
                        </div>

                        {/* Особенности и коммуникации */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                          {/* Особенности */}
                          {plot.features?.length > 0 && (
                            <div className="bg-white rounded-lg p-3 md:p-4 ring-1 ring-gray-100">
                              <h5 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                                <CheckIcon className="w-5 h-5 text-green-600" />
                                Особенности
                              </h5>
                              <div className="grid gap-1 md:gap-2">
                                {plot.features.map((feature, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center gap-2 p-1.5 md:p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <CheckIcon className="w-4 h-4 text-green-500 shrink-0" />
                                    <span className="text-gray-700 text-sm md:text-base leading-snug">
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Коммуникации */}
                          {plot.utilities && (
                            <div className="bg-white rounded-lg p-3 md:p-4 ring-1 ring-gray-100">
                              <h5 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                                <CheckIcon className="w-5 h-5 text-blue-600" />
                                Коммуникации
                              </h5>
                              <div className="grid gap-1 md:gap-2">
                                {Object.entries(plot.utilities).map(([key, value]) => {
                                  const formattedUtility = formatUtility(key, value);
                                  return formattedUtility ? (
                                    <div 
                                      key={key}
                                      className="flex items-center gap-2 p-1.5 md:p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <CheckIcon className="w-4 h-4 text-blue-500 shrink-0" />
                                      <span className="text-gray-700 text-sm md:text-base leading-snug">
                                        {formattedUtility}
                                      </span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <button
                        type="button"
                        className="rounded-xl px-4 py-2 md:px-5 md:py-3 text-sm md:text-base font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] transition-all flex items-center justify-center gap-1 md:gap-2 shadow-md hover:shadow-lg"
                        onClick={() => window.location.href = `/plots/${plot.id}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <InformationCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
                        Подробнее
                      </button>
                      <button
                        type="button"
                        className="rounded-xl px-4 py-2 md:px-5 md:py-3 text-sm md:text-base font-semibold text-gray-900 bg-white ring-1 ring-gray-200 hover:ring-gray-300 transition-all flex items-center justify-center gap-1 md:gap-2 shadow-md hover:shadow-lg"
                        onClick={() => window.location.href = `/contacts`}
                        style={{ cursor: 'pointer' }}
                      >
                        <PhoneIcon className="w-4 h-4 md:w-5 md:h-5" />
                        Связаться
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
