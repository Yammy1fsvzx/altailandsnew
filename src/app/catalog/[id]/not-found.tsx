import Link from 'next/link'
import { HomeIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 text-primary-600">
          <HomeIcon className="w-16 h-16 mx-auto" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Участок не найден
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Извините, запрашиваемый вами земельный участок не существует или был удален.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/catalog"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            Перейти в каталог
          </Link>
          
          <Link 
            href="/"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors text-center"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
} 