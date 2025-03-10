import { XCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ImageUploaderProps {
  imageFiles: File[]
  imagePreviewUrls: string[]
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
}

export default function ImageUploader({
  imageFiles,
  imagePreviewUrls,
  onImageUpload,
  onRemoveImage
}: ImageUploaderProps) {
  return (
    <>
      <div className="sm:col-span-6">
        <label className="block text-sm font-medium text-gray-700">Фотографии участка</label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
              >
                <span>Загрузить фото</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  multiple
                  accept="image/*"
                  className="sr-only" 
                  onChange={onImageUpload}
                />
              </label>
              <p className="pl-1">или перетащите сюда</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
          </div>
        </div>
      </div>

      {/* Превью загруженных изображений */}
      {imagePreviewUrls.length > 0 && (
        <div className="sm:col-span-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Загруженные изображения</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                  <Image
                    src={url}
                    alt={`Превью ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-center object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-2 right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 text-center">{index === 0 ? '(Главное фото)' : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
} 