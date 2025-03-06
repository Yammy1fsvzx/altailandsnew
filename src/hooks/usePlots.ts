import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { LandPlot, PlotFilters } from '@/types'

interface PaginationData {
  total: number
  pages: number
  page: number
  limit: number
}

interface UsePlotsReturn {
  plots: LandPlot[]
  loading: boolean
  error: Error | null
  pagination: PaginationData
  filters: PlotFilters
  setFilters: (filters: PlotFilters) => void
  setPage: (page: number) => void
  clearFilters: () => void
  sort: string
  setSort: (sort: string) => void
}

export const usePlots = (): UsePlotsReturn => {
  const [plots, setPlots] = useState<LandPlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 12
  })
  
  const [filters, setFilters] = useState<PlotFilters>({})
  const [sort, setSort] = useState<string>('newest')
  const searchParams = useSearchParams()

  const fetchPlots = async () => {
    try {
      setLoading(true)
      
      // Формируем URL с параметрами
      const params = new URLSearchParams()
      
      // Добавляем фильтры в параметры
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })
      
      // Добавляем сортировку
      params.append('sort', sort)
      
      // Добавляем пагинацию
      params.append('page', String(pagination.page))
      params.append('limit', String(pagination.limit))

      const response = await fetch(`/api/plots?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch plots')
      
      const data = await response.json()
      setPlots(data.plots)
      setPagination(data.pagination)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Обновляем URL при изменении фильтров или сортировки
  useEffect(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })
    
    params.set('sort', sort)
    
    // Обновляем URL без использования setSearchParams
    window.history.pushState({}, '', `?${params.toString()}`)
  }, [filters, sort])

  // Загружаем данные при изменении фильтров, сортировки или страницы
  useEffect(() => {
    fetchPlots()
  }, [filters, sort, pagination.page])

  const clearFilters = () => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  return {
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
  }
} 