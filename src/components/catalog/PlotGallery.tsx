"use client";

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import type { Image as ImageType } from '@/types'

interface PlotGalleryProps {
  images: ImageType[]
  title: string
}

export default function PlotGallery({ images, title }: PlotGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  
  // Проверяем, есть ли изображения
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Изображения отсутствуют</p>
      </div>
    )
  }
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }
  
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }
  
  const toggleFullscreen = () => {
    if (galleryRef.current) {
      if (!isFullscreen) {
        if (galleryRef.current.requestFullscreen) {
          galleryRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    }
  }
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])
  
  // Прокрутка миниатюр при изменении текущего индекса
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.querySelector(`[data-index="${currentIndex}"]`)
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [currentIndex])
  
  return (
    <div className="space-y-4" ref={galleryRef}>
      {/* Основное изображение */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-xl bg-gray-100">
        <Image
          src={images[currentIndex].url}
          alt={`${title} - Изображение ${currentIndex + 1}`}
          fill
          className="object-cover w-full h-full"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
        
        {/* Кнопки навигации */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Предыдущее изображение"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Следующее изображение"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        
        {/* Кнопка полноэкранного режима */}
        <button
          onClick={toggleFullscreen}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Полноэкранный режим"
        >
          <ArrowsPointingOutIcon className="w-5 h-5" />
        </button>
        
        {/* Индикатор количества изображений */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Миниатюры (только если больше 1 изображения) */}
      {images.length > 1 && (
        <div className="overflow-x-auto pb-2" ref={thumbnailsRef}>
          <div className="flex space-x-2 lg:space-x-3 min-w-full">
            {images.map((image, index) => (
              <button
                key={image.id}
                data-index={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden ${
                  index === currentIndex ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.url}
                  alt={`Миниатюра ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 