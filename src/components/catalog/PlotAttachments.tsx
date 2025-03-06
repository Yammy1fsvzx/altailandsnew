"use client";

import { DocumentIcon, DocumentTextIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline'

interface Attachment {
  id: string
  name: string
  path: string
  type: string
  size: number
}

interface PlotAttachmentsProps {
  attachments: Attachment[]
}

export default function PlotAttachments({ attachments }: PlotAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null
  }
  
  // Функция для определения иконки в зависимости от типа файла
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <PhotoIcon className="w-5 h-5" />
    } else if (type.startsWith('video/')) {
      return <VideoCameraIcon className="w-5 h-5" />
    } else if (type.includes('pdf')) {
      return <DocumentTextIcon className="w-5 h-5" />
    } else {
      return <DocumentIcon className="w-5 h-5" />
    }
  }
  
  // Функция для форматирования размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Байт'
    
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i]
  }
  
  return (
    <div className="bg-white ring-1 ring-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
        Документы и файлы
      </h3>
      
      <div className="grid gap-3">
        {attachments.map((file) => (
          <a
            key={file.id}
            href={file.path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="mr-3 text-gray-600">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
} 