export type LandStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD'

export interface Image {
  id: string
  url: string
  path: string
  order: number
  isMain: boolean
}

export interface Utility {
  available: boolean
  type?: string
  description?: string
}

export interface Utilities {
  electricity: Utility
  water: Utility
  gas: Utility
  sewerage: Utility
  internet: Utility
  road: Utility
  [key: string]: Utility
}

export interface LandPlot {
  id: string
  title: string
  description: string
  cadastralNumbers: string[]
  area: number
  region: string
  location: string
  landCategory: string
  permittedUse: string[]
  price: number
  pricePerMeter: number
  isVisible: boolean
  status: LandStatus
  features: string[]
  utilities: Utilities
  createdAt: string
  updatedAt: string
  images: Image[]
  attachments?: Array<{
    name: string
    url: string
  }>
}

export interface PlotUtilities {
  electricity?: {
    available: boolean
    description?: string
  }
  water?: {
    available: boolean
    type?: 'Центральное' | 'Скважина' | 'Колодец'
    description?: string
  }
  gas?: {
    available: boolean
    type?: 'Магистральный' | 'Баллонный'
    description?: string
  }
  sewerage?: {
    available: boolean
    type?: 'Центральная' | 'Септик'
    description?: string
  }
  internet?: {
    available: boolean
    providers?: string[]
    description?: string
  }
  road?: {
    available: boolean
    type?: 'Асфальт' | 'Щебень' | 'Грунтовая'
    description?: string
  }
}

export interface PlotFilters {
  search?: string
  region?: string
  location?: string
  landCategory?: string
  status?: LandStatus
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
} 