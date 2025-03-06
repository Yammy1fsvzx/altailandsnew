'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  order: number
}

interface QuizProps {
  onComplete?: () => void
}

export default function InlineQuiz({ onComplete }: QuizProps) {
  // Константа с размером скидки для удобного изменения
  const DISCOUNT_PERCENT = 5
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)

  useEffect(() => {
    loadQuestions()
  }, [])

  // Вспомогательная функция для склонения существительных
  const pluralize = (count: number, one: string, few: string, many: string) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return one
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return few
    } else {
      return many
    }
  }

  async function loadQuestions() {
    try {
      setLoading(true)
      console.log('Компонент: Отправка запроса на загрузку вопросов')
      
      // Используем напрямую fetch вместо API-утилит
      const response = await fetch('/api/quiz/questions')
      
      console.log('Компонент: Статус ответа:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки вопросов: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Компонент: Получены данные:', data)
      
      if (data.questions && data.questions.length > 0) {
        console.log(`Компонент: Загружено ${data.questions.length} вопросов`)
        setQuestions(data.questions)
      } else {
        console.error('Компонент: Ошибка - пустой список вопросов')
        setError('Не удалось загрузить вопросы. Пустой список вопросов.')
      }
    } catch (error) {
      console.error('Компонент: Ошибка при загрузке вопросов:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке вопросов')
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(answer: string) {
    const currentQuestion = questions[currentQuestionIndex]
    
    // Сохраняем ответ
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
    
    // Переходим к следующему вопросу или показываем форму
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowForm(true)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      // Используем напрямую fetch вместо API-утилит
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          answers
        }),
      })
      
      if (!response.ok) {
        throw new Error('Ошибка отправки данных')
      }
      
      const result = await response.json()
      
      // Сохраняем промокод, если он был возвращен
      if (result.promoCode) {
        setPromoCode(result.promoCode)
      }
      
      // Проверяем, был ли ответ уже ранее
      if (result.alreadyExists) {
        setAlreadyExists(true)
      }
      
      // Показываем сообщение об успехе
      setCompleted(true)
      
      // Вызываем колбэк, если он передан
      if (onComplete) {
        onComplete()
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка при отправке данных')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg min-h-[300px]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Загрузка вопросов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg min-h-[300px] flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-lg font-medium">{error}</p>
        </div>
        <button 
          onClick={loadQuestions}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          {alreadyExists ? 'Вы уже проходили квиз ранее!' : 'Спасибо за ваши ответы!'}
        </h3>
        <p className="text-gray-600 max-w-lg mb-6">
          {alreadyExists
            ? 'Мы нашли ваши предыдущие ответы. Ваш персональный промокод по-прежнему действителен. Используйте его при оформлении заявки.'
            : 'Мы уже начали подбирать для вас идеальные земельные участки с учетом ваших пожеланий. Наш специалист свяжется с вами в ближайшее время.'}
        </p>
        
        {/* Отображение промокода */}
        {promoCode && (
          <div className="mt-4 mb-6">
            <div className="text-sm font-medium text-gray-600 mb-2">
              Ваш персональный промокод на скидку {DISCOUNT_PERCENT}%:
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 font-mono text-lg font-bold tracking-wider text-green-800 select-all">
              {promoCode}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Срок действия: 30 дней. Сообщите этот код нашему менеджеру при обращении.
            </p>
          </div>
        )}
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="p-0 sm:p-8 bg-white rounded-xl shadow-lg">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Ответьте на {questions.length} {pluralize(questions.length, 'вопрос', 'вопроса', 'вопросов')} и получите промокод на скидку {DISCOUNT_PERCENT}%
                </h3>
                <span className="text-sm font-medium text-gray-500">
                  Вопрос {currentQuestionIndex + 1} из {questions.length}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-xl font-medium text-gray-900 mb-6">{currentQuestion.question}</h4>
              
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left rounded-lg border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400 group-hover:border-green-500 flex items-center justify-center mr-3">
                        <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-green-500"></div>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8"
          >
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Отлично! Остался последний шаг
              </h3>
              <p className="text-gray-600">
                Оставьте свои контакты, чтобы получить:
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Индивидуальную подборку участков на Алтае</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Персональный промокод на скидку {DISCOUNT_PERCENT}%</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Консультацию специалиста по выбору земельного участка</span>
                </li>
              </ul>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="example@mail.ru"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Отправка...
                    </>
                  ) : `Получить подборку участков и скидку ${DISCOUNT_PERCENT}%`}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с нашей <a href="/privacy" className="text-green-600 hover:underline">политикой конфиденциальности</a>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 