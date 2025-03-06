import Image from 'next/image'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import type { LandPlot, LandStatus } from '@/types'

interface LandPlotCardProps {
  plot: LandPlot
  viewMode: 'grid' | 'list'
  onQuickView: () => void
}

const STATUS_COLORS: Record<LandStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  SOLD: 'bg-red-100 text-red-800'
}

const STATUS_LABELS: Record<LandStatus, string> = {
  AVAILABLE: 'Доступен',
  RESERVED: 'Забронирован',
  SOLD: 'Продан'
}

export default function LandPlotCard({ plot, viewMode, onQuickView }: LandPlotCardProps) {
  const mainImage = plot.images.find(img => img.isMain) || plot.images[0]

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-shadow hover:shadow-md ${
      viewMode === 'list' ? 'flex' : ''
    }`}>
      {/* Изображение */}
      <Link 
        href={`/catalog/${plot.id}`} 
        className={`block relative ${viewMode === 'list' ? 'w-72 flex-shrink-0' : ''}`}
      >
        <div className={`relative ${viewMode === 'list' ? 'h-full' : 'aspect-[4/3]'}`}>
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={plot.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Информация */}
      <div className="p-3 sm:p-4 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link 
              href={`/catalog/${plot.id}`}
              className="text-lg font-medium text-gray-900 hover:text-primary transition-colors truncate block"
              style={{ color: 'inherit', transition: 'color 0.2s' }} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              {plot.title}
            </Link>
            <p className="mt-1 text-sm text-gray-500 truncate">
              {plot.region}, {plot.location}
            </p>
          </div>
          <button
            onClick={onQuickView}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            title="Быстрый просмотр"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 sm:mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 flex-shrink-0">Площадь:</span>
            <span className="font-medium truncate">{plot.area.toLocaleString('ru-RU')} м²</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 flex-shrink-0">Категория:</span>
            <span className="font-medium truncate">{plot.landCategory}</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {plot.price.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-gray-500">
              {plot.pricePerMeter.toLocaleString('ru-RU')} ₽/м²
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[plot.status]}`}>
            {STATUS_LABELS[plot.status]}
          </span>
        </div>
      </div>
    </div>
  )
}