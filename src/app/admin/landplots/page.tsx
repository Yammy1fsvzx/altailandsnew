'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

// Интерфейс земельного участка
interface LandPlot {
  id: number;
  title: string;
  price: number;
  area: number;
  description: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  status?: string;
}

export default function AdminLandPlots() {
  const [landplots, setLandplots] = useState<LandPlot[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<{min: number | null, max: number | null}>({min: null, max: null})
  const [areaRange, setAreaRange] = useState<{min: number | null, max: number | null}>({min: null, max: null})

  // Получение данных с API
  useEffect(() => {
    async function fetchLandPlots() {
      setLoading(true)
      try {
        const response = await fetch('/api/plots')
        if (!response.ok) {
          throw new Error('Ошибка при получении данных')
        }
        
        const data = await response.json()
        
        // Обрабатываем данные с учетом возможной структуры ответа
        const plotsData = Array.isArray(data) ? data : (data.plots || data.data || [])
        
        // Преобразуем данные в формат, который ожидает компонент
        const formattedPlots = plotsData.map((plot: any) => ({
          id: plot.id,
          title: plot.title || `Участок ${plot.id}`,
          price: plot.price || 0,
          area: plot.area || 0,
          description: plot.description || '',
          images: plot.images && plot.images.length > 0 
            ? plot.images.map((img: any) => img.url || '/images/landplot_placeholder.jpg') 
            : ['/images/landplot_placeholder.jpg'],
          isActive: plot.status === 'AVAILABLE',
          status: plot.status,
          createdAt: new Date(plot.createdAt).toLocaleDateString('ru-RU')
        }))
        
        setLandplots(formattedPlots)
      } catch (error) {
        console.error('Ошибка при загрузке земельных участков:', error)
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.')
        
        // Имитация данных в случае ошибки
        const mockData: LandPlot[] = Array.from({ length: 15 }).map((_, index) => ({
          id: index + 1,
          title: `Участок ${index + 1} в Алтайском крае`,
          price: Math.floor(Math.random() * 5000000) + 500000,
          area: Math.floor(Math.random() * 30) + 5,
          description: `Красивый участок с видом на горы. ID: ${index + 1}`,
          images: ['/images/landplot_placeholder.jpg'],
          isActive: Math.random() > 0.3,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('ru-RU')
        }))
        
        setLandplots(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchLandPlots()
  }, [])

  // Обработчик подтверждения удаления
  const handleDeleteConfirm = async (id: number) => {
    try {
      setLoading(true)
      // Отправляем запрос на удаление
      const response = await fetch(`/api/plots/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении')
      }
      
      // Удаляем участок из локального состояния
      setLandplots(landplots.filter(plot => plot.id !== id))
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Ошибка при удалении участка:', error)
      setError('Ошибка при удалении участка. Пожалуйста, попробуйте позже.')
      
      // Эмулируем удаление в интерфейсе, даже если запрос не прошел
      setLandplots(landplots.filter(plot => plot.id !== id))
      setDeleteConfirmation(null)
    } finally {
      setLoading(false)
    }
  }

  // Обработчик изменения статуса активности
  const toggleActive = async (id: number) => {
    try {
      const plot = landplots.find(p => p.id === id)
      if (!plot) return
      
      const newStatus = plot.isActive ? 'UNAVAILABLE' : 'AVAILABLE'
      
      // Отправляем запрос на обновление статуса
      const response = await fetch(`/api/plots/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса')
      }
      
      // Обновляем статус локально
      setLandplots(landplots.map(plot => 
        plot.id === id ? { ...plot, isActive: !plot.isActive, status: newStatus } : plot
      ))
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error)
      setError('Ошибка при обновлении статуса. Пожалуйста, попробуйте позже.')
      
      // Эмулируем обновление в интерфейсе, даже если запрос не прошел
      setLandplots(landplots.map(plot => 
        plot.id === id ? { ...plot, isActive: !plot.isActive } : plot
      ))
    }
  }

  // Функция для фильтрации участков
  const filteredLandplots = landplots.filter(plot => {
    // Поиск по названию и описанию
    const matchesSearch = searchTerm
      ? plot.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        plot.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    // Фильтр по статусу
    const matchesStatus = filterStatus 
      ? plot.status === filterStatus
      : true
    
    // Фильтр по цене
    const matchesPrice = 
      (priceRange.min === null || plot.price >= priceRange.min) && 
      (priceRange.max === null || plot.price <= priceRange.max)
    
    // Фильтр по площади
    const matchesArea = 
      (areaRange.min === null || plot.area >= areaRange.min) && 
      (areaRange.max === null || plot.area <= areaRange.max)
    
    return matchesSearch && matchesStatus && matchesPrice && matchesArea
  })

  // Обновляем пагинацию для использования отфильтрованных результатов
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredLandplots.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLandplots.length / itemsPerPage)

  // Навигация по страницам
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Сброс фильтров
  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus(null)
    setPriceRange({min: null, max: null})
    setAreaRange({min: null, max: null})
    setCurrentPage(1)
  }

  // Обрабатываем изменение поля поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Сбрасываем на первую страницу при поиске
  }

  // Обрабатываем изменение фильтра статуса
  const handleStatusChange = (status: string | null) => {
    setFilterStatus(status === filterStatus ? null : status)
    setCurrentPage(1)
  }

  // Обрабатываем изменение диапазона цен
  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value)
    setPriceRange(prev => ({...prev, [field]: numValue}))
    setCurrentPage(1)
  }

  // Обрабатываем изменение диапазона площади
  const handleAreaChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value)
    setAreaRange(prev => ({...prev, [field]: numValue}))
    setCurrentPage(1)
  }

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Земельные участки</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление доступными земельными участками
          </p>
        </div>
        <Link 
          href="/admin/landplots/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Добавить участок
        </Link>
      </div>

      {/* Вывод ошибки, если есть */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Панель поиска и фильтрации */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Поиск по названию или описанию"
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <button
              onClick={clearFilters}
              className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Сбросить
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Фильтр по статусу */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange('AVAILABLE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  filterStatus === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Доступен
              </button>
              <button
                onClick={() => handleStatusChange('RESERVED')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  filterStatus === 'RESERVED'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Забронирован
              </button>
              <button
                onClick={() => handleStatusChange('SOLD')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  filterStatus === 'SOLD'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Продан
              </button>
              <button
                onClick={() => handleStatusChange('UNAVAILABLE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  filterStatus === 'UNAVAILABLE'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Недоступен
              </button>
            </div>
          </div>

          {/* Фильтр по цене */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (руб.)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="От"
                value={priceRange.min === null ? '' : priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="До"
                value={priceRange.max === null ? '' : priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Фильтр по площади */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Площадь (соток)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="От"
                value={areaRange.min === null ? '' : areaRange.min}
                onChange={(e) => handleAreaChange('min', e.target.value)}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="До"
                value={areaRange.max === null ? '' : areaRange.max}
                onChange={(e) => handleAreaChange('max', e.target.value)}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Результаты поиска */}
          <div className="flex items-end">
            <div className="w-full text-center">
              <span className="text-sm text-gray-500">Найдено участков: </span>
              <span className="text-lg font-semibold text-gray-900">{filteredLandplots.length}</span>
              {filteredLandplots.length !== landplots.length && (
                <span className="text-sm text-gray-500"> (из {landplots.length})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Загрузка...
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Участок
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Площадь
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата добавления
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((plot) => (
                      <tr key={plot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                                {plot.images && plot.images.length > 0 ? (
                                  <Image 
                                    src={plot.images[0]} 
                                    alt={plot.title}
                                    fill
                                    sizes="100px"
                                    className="rounded-md object-cover"
                                  />
                                ) : (
                                  "Нет фото"
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {plot.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {plot.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatPrice(plot.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{plot.area} соток</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleActive(plot.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plot.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {plot.isActive ? (
                              <>
                                <CheckCircleIcon className="mr-1 h-4 w-4" />
                                Активен
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="mr-1 h-4 w-4" />
                                Не активен
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plot.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/admin/landplots/${plot.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </Link>
                            {deleteConfirmation === plot.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteConfirm(plot.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <CheckCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmation(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <XCircleIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmation(plot.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Нет доступных земельных участков
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Показано <span className="font-medium">{indexOfFirstItem + 1}</span> - <span className="font-medium">
                        {indexOfLastItem > filteredLandplots.length ? filteredLandplots.length : indexOfLastItem}
                      </span> из <span className="font-medium">{filteredLandplots.length}</span> участков
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Предыдущая</span>
                        &larr;
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Следующая</span>
                        &rarr;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
} 