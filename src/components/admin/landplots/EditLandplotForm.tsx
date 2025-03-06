'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import ImageUploader from './ImageUploader'
import DocumentUploader from './DocumentUploader'
import TagInput from './TagInput'
import MainInfo from './MainInfo'

interface LandplotFormData {
  title: string
  description: string
  area: number
  price: number
  region: string
  location: string
  landCategory: string
  permittedUse: string
  status: string
  features: string[]
  utilities: string[]
}

interface EditLandplotFormProps {
  id: string
}

export default function EditLandplotForm({ id }: EditLandplotFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<LandplotFormData>({
    title: '',
    description: '',
    area: 0,
    price: 0,
    region: 'Алтайский край',
    location: '',
    landCategory: 'СХ',
    permittedUse: 'ЛПХ',
    status: 'AVAILABLE',
    features: [],
    utilities: []
  })
  
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [documentNames, setDocumentNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [newUtility, setNewUtility] = useState('')

  // Загрузка данных участка
  useEffect(() => {
    async function fetchLandPlot() {
      try {
        const response = await fetch(`/api/plots/${id}`)
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные участка')
        }
        const data = await response.json()
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          area: data.area || 0,
          price: data.price || 0,
          region: data.region || 'Алтайский край',
          location: data.location || '',
          landCategory: data.landCategory || 'СХ',
          permittedUse: data.permittedUse || 'ЛПХ',
          status: data.status || 'AVAILABLE',
          features: data.features || [],
          utilities: data.utilities || []
        })

        // Загрузка существующих изображений
        if (data.images && data.images.length > 0) {
          setImagePreviewUrls(data.images.map((img: any) => img.url))
        }

        // Загрузка существующих документов
        if (data.documents && data.documents.length > 0) {
          setDocumentNames(data.documents.map((doc: any) => doc.name))
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
        setError('Не удалось загрузить данные участка')
      }
    }

    fetchLandPlot()
  }, [id])

  // Обработчики изменения полей
  const handleFieldChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Обработчик загрузки изображений
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setImageFiles(prevFiles => [...prevFiles, ...newFiles])

    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrls(prevUrls => [...prevUrls, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Обработчик удаления изображения
  const handleRemoveImage = (index: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index))
  }

  // Обработчик загрузки документов
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setDocumentFiles(prevFiles => [...prevFiles, ...newFiles])
    
    const fileNames = newFiles.map(file => file.name)
    setDocumentNames(prevNames => [...prevNames, ...fileNames])
  }

  // Обработчик удаления документа
  const handleRemoveDocument = (index: number) => {
    setDocumentFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    setDocumentNames(prevNames => prevNames.filter((_, i) => i !== index))
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Валидация формы
      if (!formData.title) {
        throw new Error('Необходимо указать название участка')
      }
      if (formData.area <= 0) {
        throw new Error('Площадь участка должна быть больше нуля')
      }
      if (formData.price < 0) {
        throw new Error('Цена не может быть отрицательной')
      }

      // Создаем FormData для отправки файлов и данных
      const formDataToSend = new FormData()
      
      // Добавляем все поля формы
      formDataToSend.append('data', JSON.stringify(formData))
      
      // Добавляем изображения
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image-${index}`, file)
      })
      
      // Добавляем документы
      documentFiles.forEach((file, index) => {
        formDataToSend.append(`document-${index}`, file)
      })

      // Отправляем запрос на обновление участка
      const response = await fetch(`/api/plots/${id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Не удалось обновить участок')
      }

      // Обработка успешного ответа
      setSuccess(true)
      
      // Перенаправление на страницу участков через 2 секунды
      setTimeout(() => {
        router.push('/admin/landplots')
      }, 2000)
    } catch (err: any) {
      console.error('Ошибка при обновлении участка:', err)
      setError(err.message || 'Произошла ошибка при обновлении участка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Редактирование участка</h1>
          <p className="mt-1 text-sm text-gray-500">
            Измените информацию о земельном участке
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/landplots')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Назад к списку
        </button>
      </div>

      {/* Сообщения об ошибке и успехе */}
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

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Участок успешно обновлен! Вы будете перенаправлены на страницу участков.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Загрузка изображений */}
            <ImageUploader
              imageFiles={imageFiles}
              imagePreviewUrls={imagePreviewUrls}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />

            {/* Основная информация */}
            <MainInfo
              title={formData.title}
              description={formData.description}
              area={formData.area}
              price={formData.price}
              region={formData.region}
              location={formData.location}
              landCategory={formData.landCategory}
              permittedUse={formData.permittedUse}
              status={formData.status}
              onFieldChange={handleFieldChange}
            />

            {/* Загрузка документов */}
            <DocumentUploader
              documentFiles={documentFiles}
              documentNames={documentNames}
              onDocumentUpload={handleDocumentUpload}
              onRemoveDocument={handleRemoveDocument}
            />

            {/* Особенности участка */}
            <TagInput
              label="Особенности участка"
              tags={formData.features}
              inputValue={newFeature}
              onInputChange={setNewFeature}
              onAddTag={() => {
                if (newFeature.trim()) {
                  setFormData(prev => ({
                    ...prev,
                    features: [...prev.features, newFeature.trim()]
                  }))
                  setNewFeature('')
                }
              }}
              onRemoveTag={(index) => {
                setFormData(prev => ({
                  ...prev,
                  features: prev.features.filter((_, i) => i !== index)
                }))
              }}
              placeholder="Введите особенность и нажмите добавить"
            />

            {/* Коммуникации */}
            <TagInput
              label="Коммуникации"
              tags={formData.utilities}
              inputValue={newUtility}
              onInputChange={setNewUtility}
              onAddTag={() => {
                if (newUtility.trim()) {
                  setFormData(prev => ({
                    ...prev,
                    utilities: [...prev.utilities, newUtility.trim()]
                  }))
                  setNewUtility('')
                }
              }}
              onRemoveTag={(index) => {
                setFormData(prev => ({
                  ...prev,
                  utilities: prev.utilities.filter((_, i) => i !== index)
                }))
              }}
              placeholder="Введите коммуникацию и нажмите добавить"
              tagClassName="bg-blue-100 text-blue-800"
            />
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            onClick={() => router.push('/admin/landplots')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              loading || success ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 