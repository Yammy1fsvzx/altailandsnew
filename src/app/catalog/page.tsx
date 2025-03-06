'use client'

import { useState, Suspense } from 'react'
import { usePlots } from '@/hooks/usePlots'
import type { LandPlot, PlotFilters } from '@/types'
import LandPlotCard from '@/components/catalog/LandPlotCard'
import PlotModal from '@/components/catalog/PlotModal'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { 
  ViewColumnsIcon, 
  ListBulletIcon,
  MapIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
  CalendarIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'
import type { ReactElement } from 'react'

type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc'

interface SortOptionConfig {
  label: string;
  icon: ReactElement;
}

const SORT_OPTIONS: Record<SortOption, SortOptionConfig> = {
  newest: {
    label: 'Сначала новые',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7L12 17M12 7L8 11M12 7L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  oldest: {
    label: 'Сначала старые',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17L12 7M12 17L8 13M12 17L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  price_asc: {
    label: 'Цена по возрастанию',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8H13M4 16H17M8 4V20M8 4L4 8M8 4L12 8M16 12V20M16 20L12 16M16 20L20 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  price_desc: {
    label: 'Цена по убыванию',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8H13M4 16H17M8 20V4M8 20L4 16M8 20L12 16M16 12V4M16 4L12 8M16 4L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
}

const FILTER_LABELS: Record<string, string> = {
  search: 'Поиск',
  region: 'Регион',
  location: 'Местоположение',
  landCategory: 'Категория земель',
  status: 'Статус',
  priceMin: 'Мин. цена',
  priceMax: 'Макс. цена',
  areaMin: 'Мин. площадь',
  areaMax: 'Макс. площадь'
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Доступен',
  RESERVED: 'Бронь',
  SOLD: 'Продан'
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  )
}

function CatalogContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState<LandPlot | null>(null)

  const {
    plots,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    clearFilters,
    sort,
    setSort
  } = usePlots()

  const handleFilterChange = (key: keyof PlotFilters, value: PlotFilters[keyof PlotFilters]) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleQuickView = (plot: LandPlot) => {
    setSelectedPlot(plot)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        {/* Hero секция */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Каталог земельных участков</h1>
            <p className="text-base sm:text-lg text-gray-600">Найдено {pagination.total} вариантов для покупки</p>
          </div>
        </div>

        {/* Основной контент */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8" style={{maxWidth: '1400px'}}>
          {/* Панель управления */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 border border-gray-100">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              {/* Сортировка */}
              <div className="relative group flex-1 max-w-[260px]">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="form-select form-select-gray w-full py-2 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/20 cursor-pointer hover:bg-gray-200 transition-all appearance-none pl-10"
                >
                  {Object.entries(SORT_OPTIONS).map(([value, { label }]) => (
                    <option key={value} value={value} className="py-2">{label}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  {SORT_OPTIONS[sort as SortOption].icon}
                </div>
              </div>

              {/* Вид отображения */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-primary ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Плитка"
                >
                  <ViewColumnsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all cursor-pointer ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-primary ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Список"
                >
                  <ListBulletIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Активные фильтры */}
            {Object.keys(filters).some(key => filters[key as keyof PlotFilters]) && (
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  let displayValue = value;
                  
                  if (key === 'status') {
                    displayValue = STATUS_LABELS[value as string] || value;
                  } else if (key.includes('price')) {
                    displayValue = Number(value).toLocaleString('ru-RU') + ' ₽';
                  } else if (key.includes('area')) {
                    displayValue = Number(value).toLocaleString('ru-RU') + ' м²';
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleFilterChange(key as keyof PlotFilters, '')}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs sm:text-sm transition-colors"
                    >
                      <span>{FILTER_LABELS[key]}: {displayValue}</span>
                      <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-primary hover:text-primary-dark transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg px-2 py-1"
                >
                  Сбросить все
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Боковая панель с фильтрами */}
            <div className={`lg:w-72 xl:w-80 flex-shrink-0 transition-all duration-300 
              ${showFilters 
                ? 'fixed inset-0 z-50 bg-gray-900/20 lg:relative lg:z-auto lg:bg-transparent opacity-100 pointer-events-auto' 
                : 'fixed inset-0 z-50 bg-gray-900/20 lg:relative lg:z-auto lg:bg-transparent opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'
              }`}>
              <div className={`bg-white h-full lg:h-auto overflow-y-auto lg:overflow-visible w-[calc(100%-3rem)] max-w-sm lg:w-auto ml-auto lg:ml-0 
                transition-transform duration-300 transform lg:transform-none shadow-sm
                ${showFilters ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                rounded-l-xl lg:rounded-xl p-4 sm:p-6 border border-gray-100 lg:sticky lg:top-24`}
              >
                {/* Заголовок для мобильной версии */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Поиск */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Поиск
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Поиск по названию или кадастровому номеру..."
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="form-input form-input-with-icon w-full text-sm sm:text-base rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all group-hover:border-gray-400"
                    />
                    <div className="form-input-icon">
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Категория земель */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория земель
                  </label>
                  <select
                    value={filters.landCategory || ''}
                    onChange={(e) => handleFilterChange('landCategory', e.target.value)}
                    className="form-select form-select-white w-full text-sm sm:text-base rounded-lg transition-all cursor-pointer"
                  >
                    <option value="">Все категории</option>
                    <option value="Земли населенных пунктов">Земли населенных пунктов</option>
                    <option value="Земли сельскохозяйственного назначения">Земли сельскохозяйственного назначения</option>
                    <option value="Земли промышленности">Земли промышленности</option>
                  </select>
                </div>

                {/* Статус */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleFilterChange('status', filters.status === 'AVAILABLE' ? '' : 'AVAILABLE')}
                      className={`py-2 px-2 text-xs sm:text-sm rounded-lg text-center transition-all ${
                        filters.status === 'AVAILABLE' 
                          ? 'bg-green-500 text-white shadow-sm ring-1 ring-green-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Доступен
                    </button>
                    <button
                      onClick={() => handleFilterChange('status', filters.status === 'RESERVED' ? '' : 'RESERVED')}
                      className={`py-2 px-2 text-xs sm:text-sm rounded-lg text-center transition-all ${
                        filters.status === 'RESERVED' 
                          ? 'bg-yellow-500 text-white shadow-sm ring-1 ring-yellow-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Бронь
                    </button>
                    <button
                      onClick={() => handleFilterChange('status', filters.status === 'SOLD' ? '' : 'SOLD')}
                      className={`py-2 px-2 text-xs sm:text-sm rounded-lg text-center transition-all ${
                        filters.status === 'SOLD' 
                          ? 'bg-red-500 text-white shadow-sm ring-1 ring-red-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Продан
                    </button>
                  </div>
                </div>

                {/* Регион */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Регион
                  </label>
                  <select
                    value={filters.region || ''}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="form-select form-select-white w-full text-sm sm:text-base rounded-lg transition-all cursor-pointer"
                  >
                    <option value="">Все регионы</option>
                    <option value="Алтайский край">Алтайский край</option>
                    <option value="Республика Алтай">Республика Алтай</option>
                  </select>
                </div>

                {/* Цена */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена, ₽
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative group">
                      <input
                        type="number"
                        placeholder="От"
                        value={filters.priceMin || ''}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : '')}
                        className="form-input w-full text-sm sm:text-base rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all group-hover:border-gray-400"
                      />
                    </div>
                    <div className="relative group">
                      <input
                        type="number"
                        placeholder="До"
                        value={filters.priceMax || ''}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : '')}
                        className="form-input w-full text-sm sm:text-base rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all group-hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Площадь */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Площадь, м²
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative group">
                      <input
                        type="number"
                        placeholder="От"
                        value={filters.areaMin || ''}
                        onChange={(e) => handleFilterChange('areaMin', e.target.value ? Number(e.target.value) : '')}
                        className="form-input w-full text-sm sm:text-base rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all group-hover:border-gray-400"
                      />
                    </div>
                    <div className="relative group">
                      <input
                        type="number"
                        placeholder="До"
                        value={filters.areaMax || ''}
                        onChange={(e) => handleFilterChange('areaMax', e.target.value ? Number(e.target.value) : '')}
                        className="form-input w-full text-sm sm:text-base rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all group-hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Плавающая кнопка фильтров для мобильных устройств */}
            <button
              onClick={() => setShowFilters(true)}
              className="fixed right-4 bottom-4 z-40 lg:hidden bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors bg-[#16a34a]"
            >
              <FunnelIcon className="w-6 h-6" />
            </button>

            {/* Список участков */}
            <div className="flex-1">
              <div className={`grid gap-4 sm:gap-6 min-h-[300px] transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {loading ? (
                  // Скелетон с тем же количеством элементов, что и в текущем виде
                  Array(pagination.total ? Math.min(pagination.limit, pagination.total) : 6).fill(null).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100 opacity-70 transition-opacity duration-200">
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-3/4" />
                        <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-1/2" />
                        <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-1/3" />
                        <div className="flex gap-2 pt-2">
                          <div className="h-8 bg-gray-200 rounded-lg w-24" />
                          <div className="h-8 bg-gray-200 rounded-lg w-24" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="col-span-full">
                    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
                      <div className="max-w-md mx-auto">
                        <svg className="w-16 h-16 mx-auto text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                          Произошла ошибка
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                          {error.message}
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="btn-primary text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                        >
                          Обновить страницу
                        </button>
                      </div>
                    </div>
                  </div>
                ) : plots.length === 0 ? (
                  <div className="col-span-full">
                    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
                      <div className="max-w-md mx-auto">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                          Участки не найдены
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                          К сожалению, по вашему запросу ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="btn-primary text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                        >
                          Сбросить фильтры
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {plots.map((plot) => (
                      <div key={plot.id} className="transition-all duration-300 animate-fadeIn">
                        <LandPlotCard
                          plot={plot}
                          viewMode={viewMode}
                          onQuickView={() => handleQuickView(plot)}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Пагинация с сохранением высоты */}
              <div className="h-[68px] sm:h-[84px] flex items-center justify-center">
                {pagination.pages > 1 && (
                  <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-lg shadow-sm p-1 border border-gray-100">
                    <button
                      onClick={() => setPage(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                      className="p-1.5 sm:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
                      style={{cursor: 'pointer'}}
                    >
                      <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let pageToShow;
                      if (pagination.pages <= 5) {
                        pageToShow = i + 1;
                      } else {
                        if (pagination.page <= 3) {
                          pageToShow = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageToShow = pagination.pages - 4 + i;
                        } else {
                          pageToShow = pagination.page - 2 + i;
                        }
                      }
                      return (
                        <button
                          key={pageToShow}
                          onClick={() => setPage(pageToShow)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-sm sm:text-base font-medium transition-all ${
                            pageToShow === pagination.page
                              ? 'bg-primary text-white shadow-sm'
                              : 'hover:bg-gray-100 transition-colors'
                          }`}
                        >
                          {pageToShow}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(Math.min(pagination.pages, pagination.page + 1))}
                      disabled={pagination.page === pagination.pages}
                      className="p-1.5 sm:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Модальное окно быстрого просмотра */}
      <PlotModal
        plot={selectedPlot}
        isOpen={!!selectedPlot}
        onClose={() => setSelectedPlot(null)}
      />
    </>
  )
} 