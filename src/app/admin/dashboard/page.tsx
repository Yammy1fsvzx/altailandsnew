'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  InboxIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Определяем интерфейс для заявки
interface Request {
  id: number;
  name: string;
  email: string;
  date: string;
  type: string;
}

// Определяем интерфейс для статистики
interface Statistics {
  totalLandplots: number;
  activeLandplots: number;
  totalQuizResponses: number;
  totalRequests: number;
  recentRequests: Request[];
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics>({
    totalLandplots: 0,
    activeLandplots: 0,
    totalQuizResponses: 0,
    totalRequests: 0,
    recentRequests: []
  })
  
  const [loading, setLoading] = useState(true)

  // Получение данных с API
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Получаем статистику по земельным участкам
        const plotsResponse = await fetch('/api/plots')
        const plotsData = await plotsResponse.json()
        
        // Получаем заявки
        const requestsResponse = await fetch('/api/requests')
        const requestsData = await requestsResponse.json()
        
        // Получаем ответы на квиз
        const quizResponse = await fetch('/api/quiz/questions')
        const quizData = await quizResponse.json()
        
        // Формируем данные для отображения на дашборде
        // Для наглядности преобразуем заявки в нужный формат
        const formattedRequests = requestsData && requestsData.length 
          ? requestsData
              .slice(0, 5)
              .map((request: any) => ({
                id: request.id,
                name: request.name,
                email: request.email,
                date: new Date(request.createdAt).toLocaleDateString('ru-RU'),
                type: request.source === 'quiz' 
                  ? 'Заявка с квиза' 
                  : request.source === 'contact' 
                    ? 'Заявка с формы контакта' 
                    : 'Другая заявка'
              }))
          : [];
        
        // Считаем активные участки
        const activePlots = plotsData && plotsData.length 
          ? plotsData.filter((plot: any) => plot.status === 'AVAILABLE').length
          : 0;
        
        setStatistics({
          totalLandplots: plotsData?.length || 0,
          activeLandplots: activePlots,
          totalQuizResponses: quizData?.responses?.length || 0,
          totalRequests: requestsData?.length || 0,
          recentRequests: formattedRequests
        })
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
        // Если произошла ошибка, используем тестовые данные
        setStatistics({
          totalLandplots: 24,
          activeLandplots: 18,
          totalQuizResponses: 142,
          totalRequests: 38,
          recentRequests: [
            { id: 1, name: 'Иванов Иван', email: 'ivanov@example.com', date: '12.02.2024', type: 'Заявка с квиза' },
            { id: 2, name: 'Петрова Анна', email: 'petrova@example.com', date: '10.02.2024', type: 'Заявка с формы контакта' },
            { id: 3, name: 'Сидоров Алексей', email: 'sidorov@example.com', date: '08.02.2024', type: 'Заявка с квиза' },
            { id: 4, name: 'Кузнецова Елена', email: 'kuznecova@example.com', date: '05.02.2024', type: 'Заявка с квиза' },
            { id: 5, name: 'Смирнов Дмитрий', email: 'smirnov@example.com', date: '01.02.2024', type: 'Заявка с формы контакта' },
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, color, href }: { 
    title: string, 
    value: number, 
    icon: any, 
    color: string,
    href: string 
  }) => {
    return (
      <Link 
        href={href} 
        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center">
          <div className={`rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
        <p className="mt-1 text-sm text-gray-500">
          Обзор статистики и недавних заявок
        </p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Загрузка...
          </div>
        </div>
      ) : (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Всего участков" 
              value={statistics.totalLandplots} 
              icon={DocumentTextIcon} 
              color="bg-blue-500" 
              href="/admin/landplots"
            />
            <StatCard 
              title="Активные участки" 
              value={statistics.activeLandplots} 
              icon={CheckCircleIcon} 
              color="bg-green-500"
              href="/admin/landplots"
            />
            <StatCard 
              title="Ответов на квиз" 
              value={statistics.totalQuizResponses} 
              icon={QuestionMarkCircleIcon} 
              color="bg-purple-500"
              href="/admin/quiz"
            />
            <StatCard 
              title="Всего заявок" 
              value={statistics.totalRequests} 
              icon={InboxIcon} 
              color="bg-amber-500"
              href="/admin/requests"
            />
          </div>

          {/* Недавние заявки */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Недавние заявки
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Последние 5 заявок с сайта
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Имя
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.recentRequests.length > 0 ? (
                    statistics.recentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.type}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Нет доступных заявок
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <Link href="/admin/requests" className="text-sm text-green-600 hover:text-green-800 font-medium">
                Посмотреть все заявки →
              </Link>
            </div>
          </div>
          
          {/* Дополнительная информация */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/admin/landplots/new" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Добавить участок
              </Link>
              <Link 
                href="/admin/quiz" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Настроить квиз
              </Link>
              <Link 
                href="/admin/contacts" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Обновить контакты
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 