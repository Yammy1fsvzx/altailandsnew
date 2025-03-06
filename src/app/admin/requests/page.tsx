'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

// Определяем тип для ответов на вопросы квиза
interface QuizResponse {
  question: string;
  answer: string;
}

// Определяем тип для заявки
interface Request {
  id: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  source: 'quiz' | 'contact' | 'other';
  quizResponses?: QuizResponse[];
  status: 'new' | 'processed' | 'rejected';
  createdAt: string;
}

export default function AdminRequests() {
  // В реальном приложении здесь будут запросы к API
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [viewRequest, setViewRequest] = useState<Request | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)

  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const timer = setTimeout(() => {
      const mockData: Request[] = Array.from({ length: 25 }).map((_, index) => {
        const isQuiz = Math.random() > 0.4
        
        return {
          id: index + 1,
          name: `Клиент ${index + 1}`,
          email: `client${index + 1}@example.com`,
          phone: `+7 (999) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          message: isQuiz ? undefined : `Сообщение от клиента ${index + 1}. Интересует земельный участок.`,
          source: isQuiz ? 'quiz' : (Math.random() > 0.5 ? 'contact' : 'other'),
          quizResponses: isQuiz ? [
            { question: 'Для чего вам нужен участок?', answer: ['Для постоянного проживания', 'Для сезонного отдыха', 'Для инвестиций'][Math.floor(Math.random() * 3)] },
            { question: 'Какой бюджет вы рассматриваете?', answer: ['До 1 млн руб', '1-3 млн руб', 'Более 3 млн руб'][Math.floor(Math.random() * 3)] },
            { question: 'Предпочтительное расположение?', answer: ['Рядом с озером', 'В лесной зоне', 'Рядом с инфраструктурой'][Math.floor(Math.random() * 3)] },
          ] : undefined,
          status: ['new', 'processed', 'rejected'][Math.floor(Math.random() * 3)] as 'new' | 'processed' | 'rejected',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('ru-RU')
        }
      })
      
      setRequests(mockData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Фильтрация заявок
  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    if (filter === 'quiz') return request.source === 'quiz'
    if (filter === 'contact') return request.source === 'contact'
    if (filter === 'new') return request.status === 'new'
    if (filter === 'processed') return request.status === 'processed'
    if (filter === 'rejected') return request.status === 'rejected'
    return true
  })

  // Изменение статуса заявки
  const changeStatus = (id: number, status: 'new' | 'processed' | 'rejected') => {
    // В реальном приложении здесь будет запрос к API для изменения статуса
    setRequests(
      requests.map(request => 
        request.id === id ? { ...request, status } : request
      )
    )
  }

  // Удаление заявки
  const handleDeleteConfirm = (id: number) => {
    // В реальном приложении здесь будет запрос к API для удаления
    setRequests(requests.filter(request => request.id !== id))
    setDeleteConfirmation(null)
  }

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  // Навигация по страницам
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Вспомогательная функция для отображения иконки источника заявки
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-5 w-5 text-purple-500" />
      case 'contact':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  // Вспомогательная функция для отображения названия источника заявки
  const getSourceName = (source: string) => {
    switch (source) {
      case 'quiz':
        return 'Квиз'
      case 'contact':
        return 'Форма контакта'
      default:
        return 'Другой источник'
    }
  }

  // Вспомогательная функция для отображения статуса заявки
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Новая
          </span>
        )
      case 'processed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Обработана
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Отклонена
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление и просмотр входящих заявок с сайта
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
          {/* Фильтры */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'all'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                Все заявки
              </button>
              <button
                onClick={() => setFilter('quiz')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'quiz'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                С квиза
              </button>
              <button
                onClick={() => setFilter('contact')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'contact'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                С формы контакта
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'new'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                Новые
              </button>
              <button
                onClick={() => setFilter('processed')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'processed'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                Обработанные
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'rejected'
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                Отклоненные
              </button>
            </div>
          </div>

          {/* Таблица заявок */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {currentItems.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-gray-500">Заявок не найдено</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Клиент
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Источник
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{request.name}</div>
                            <div className="text-sm text-gray-500 flex flex-col">
                              <span className="flex items-center">
                                <EnvelopeIcon className="mr-1 h-4 w-4 text-gray-400" /> {request.email}
                              </span>
                              <span className="flex items-center">
                                <PhoneIcon className="mr-1 h-4 w-4 text-gray-400" /> {request.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getSourceIcon(request.source)}
                            <span className="ml-1 text-sm text-gray-900">
                              {getSourceName(request.source)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setViewRequest(request)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Просмотреть детали"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <div className="relative inline-block text-left">
                              <div>
                                <button
                                  type="button"
                                  className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                    request.status === 'new'
                                      ? 'text-white bg-green-600 hover:bg-green-700'
                                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                  }`}
                                  onClick={() => changeStatus(request.id, 'processed')}
                                >
                                  Обработать
                                </button>
                              </div>
                            </div>
                            {deleteConfirmation === request.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteConfirm(request.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Подтвердить удаление"
                                >
                                  <CheckCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmation(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Отменить удаление"
                                >
                                  <XCircleIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmation(request.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Удалить заявку"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Показано <span className="font-medium">{indexOfFirstItem + 1}</span> - <span className="font-medium">
                        {indexOfLastItem > filteredRequests.length ? filteredRequests.length : indexOfLastItem}
                      </span> из <span className="font-medium">{filteredRequests.length}</span> заявок
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Предыдущая</span>
                        &larr;
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Следующая</span>
                        &rarr;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Модальное окно для просмотра детальной информации о заявке */}
          {viewRequest && (
            <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setViewRequest(null)}></div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center" id="modal-title">
                          {getSourceIcon(viewRequest.source)}
                          <span className="ml-2">Заявка #{viewRequest.id} ({getSourceName(viewRequest.source)})</span>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{viewRequest.createdAt}</p>
                        
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-700">Информация о клиенте</h4>
                          <dl className="mt-2 text-sm">
                            <div className="flex py-1">
                              <dt className="w-1/3 text-gray-500">Имя:</dt>
                              <dd className="w-2/3 text-gray-900">{viewRequest.name}</dd>
                            </div>
                            <div className="flex py-1">
                              <dt className="w-1/3 text-gray-500">Email:</dt>
                              <dd className="w-2/3 text-gray-900">{viewRequest.email}</dd>
                            </div>
                            <div className="flex py-1">
                              <dt className="w-1/3 text-gray-500">Телефон:</dt>
                              <dd className="w-2/3 text-gray-900">{viewRequest.phone}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        {viewRequest.message && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700">Сообщение</h4>
                            <p className="mt-2 text-sm text-gray-900">{viewRequest.message}</p>
                          </div>
                        )}
                        
                        {viewRequest.quizResponses && viewRequest.quizResponses.length > 0 && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700">Ответы на вопросы квиза</h4>
                            <dl className="mt-2 text-sm">
                              {viewRequest.quizResponses.map((response, index) => (
                                <div key={index} className="py-2">
                                  <dt className="text-gray-500">{response.question}</dt>
                                  <dd className="mt-1 text-gray-900">{response.answer}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                        
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-700">Статус заявки</h4>
                          <div className="mt-2">
                            {getStatusBadge(viewRequest.status)}
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => {
                                changeStatus(viewRequest.id, 'new')
                                setViewRequest({...viewRequest, status: 'new'})
                              }}
                              className={`px-3 py-1 text-xs rounded-md ${
                                viewRequest.status === 'new' 
                                  ? 'bg-green-100 text-green-800 cursor-default'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              disabled={viewRequest.status === 'new'}
                            >
                              Новая
                            </button>
                            <button
                              onClick={() => {
                                changeStatus(viewRequest.id, 'processed')
                                setViewRequest({...viewRequest, status: 'processed'})
                              }}
                              className={`px-3 py-1 text-xs rounded-md ${
                                viewRequest.status === 'processed' 
                                  ? 'bg-blue-100 text-blue-800 cursor-default'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              disabled={viewRequest.status === 'processed'}
                            >
                              Обработана
                            </button>
                            <button
                              onClick={() => {
                                changeStatus(viewRequest.id, 'rejected')
                                setViewRequest({...viewRequest, status: 'rejected'})
                              }}
                              className={`px-3 py-1 text-xs rounded-md ${
                                viewRequest.status === 'rejected' 
                                  ? 'bg-red-100 text-red-800 cursor-default'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              disabled={viewRequest.status === 'rejected'}
                            >
                              Отклонена
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setViewRequest(null)}
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 