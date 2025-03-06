'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon, 
  InboxIcon, 
  PhoneIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'

// Список страниц, которые доступны без аутентификации
const publicPages = ['/admin/auth/login', '/admin/auth/error']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Проверяем, авторизован ли пользователь для доступа к защищенным страницам
  useEffect(() => {
    if (status === 'loading') return

    const isPublicPage = publicPages.includes(pathname || '')
    
    if (!session && !isPublicPage) {
      router.push('/admin/auth/login')
    }
  }, [session, status, pathname, router])

  // Если статус загрузки сессии или страница публичная, просто отображаем содержимое
  if (status === 'loading' || publicPages.includes(pathname || '')) {
    return children
  }

  // Если нет сессии и это не публичная страница, пользователь будет перенаправлен
  if (!session) {
    return null
  }

  // Навигационные элементы админ-панели
  const navigation = [
    { name: 'Главная', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Участки', href: '/admin/landplots', icon: DocumentTextIcon },
    { name: 'Квиз', href: '/admin/quiz', icon: QuestionMarkCircleIcon },
    { name: 'Заявки', href: '/admin/requests', icon: InboxIcon },
    { name: 'Контакты', href: '/admin/contacts', icon: PhoneIcon },
  ]

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Мобильное меню */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Оверлей */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Боковая панель */}
          <div className={`
            fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-white shadow-xl transform transition ease-in-out duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-white border-b">
              <span className="text-xl font-semibold text-gray-800">AltaiLand Админ</span>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={toggleSidebar}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive 
                          ? 'bg-green-50 text-green-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon 
                        className={`mr-4 h-6 w-6 ${
                          isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`} 
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'Администратор'}</p>
                  <button
                    onClick={() => signOut({ callbackUrl: '/admin/auth/login' })}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Верхняя панель для мобильных */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 h-16 flex items-center justify-between">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="text-lg font-semibold text-gray-800">AltaiLand Админ</div>
            <div className="w-6"></div> {/* Для выравнивания заголовка по центру */}
          </div>
        </div>
        
        {/* Отступ для контента на мобильных */}
        <div className="lg:hidden h-16"></div>
      </div>

      {/* Десктопная боковая панель */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5">
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-6">
          <span className="text-xl font-bold text-gray-800">AltaiLand Админ</span>
        </div>
        <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-5">
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} 
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'Администратор'}</p>
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/auth/login' })}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Главный контент */}
      <div className="lg:pl-64">
        <main className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
} 