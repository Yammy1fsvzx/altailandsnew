'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatArea } from '@/lib/format'
import type { LandPlot, LandStatus } from '@/types'

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

export default function LatestPlots() {
  const [plots, setPlots] = useState<LandPlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLatestPlots()
  }, [])

  async function loadLatestPlots() {
    try {
      setLoading(true)
      // Используем напрямую fetch вместо API-утилит
      const response = await fetch('/api/plots?limit=3&sort=newest')
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки участков')
      }
      
      const data = await response.json()
      
      if (data.plots && data.plots.length > 0) {
        setPlots(data.plots)
      } else {
        setError('Нет доступных участков')
      }
    } catch (error) {
      console.error('Error loading latest plots:', error)
      setError('Ошибка при загрузке участков')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(3).fill(null).map((_, index) => (
          <div key={index} className="animate-pulse bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gray-200 aspect-[4/3]"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={loadLatestPlots} 
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plots.map((plot) => (
        <div key={plot.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-shadow hover:shadow-md">
          <Link href={`/catalog/${plot.id}`} className="block relative">
            <div className="relative aspect-[4/3]">
              {plot.images && plot.images.length > 0 ? (
                <Image
                  src={plot.images[0].url}
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

          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link 
                  href={`/catalog/${plot.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors truncate block"
                >
                  {plot.title}
                </Link>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {plot.region}, {plot.location}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 flex-shrink-0">Площадь:</span>
                <span className="font-medium truncate">{formatArea(plot.area)} м²</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 flex-shrink-0">Категория:</span>
                <span className="font-medium truncate">{plot.landCategory}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatPrice(plot.price)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatPrice(plot.pricePerMeter)} ₽/м²
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[plot.status]}`}>
                {STATUS_LABELS[plot.status]}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 