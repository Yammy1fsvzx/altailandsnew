"use client";

import { useState } from 'react'
import { IMaskInput } from 'react-imask'

interface PlotInquiryFormProps {
  plotId: string
  plotTitle: string
}

export default function PlotInquiryForm({ plotId, plotTitle }: PlotInquiryFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Валидация
    if (!phone) {
      setError('Пожалуйста, укажите номер телефона')
      return
    }
    
    try {
      setIsSubmitting(true)
      setError('')
      
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          message,
          plotId,
          source: `Страница участка: ${plotTitle}`
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка при отправке формы')
      }
      
      // Сброс формы и показ сообщения об успехе
      setName('')
      setPhone('')
      setMessage('')
      setIsSuccess(true)
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
      
    } catch (error: any) {
      setError(error.message || 'Произошла ошибка при отправке формы')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-white ring-1 ring-green-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-4 md:mb-6">
        Получить больше информации
      </h3>
      
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">Спасибо за вашу заявку!</p>
          <p className="text-green-700 mt-1">Мы свяжемся с вами в ближайшее время.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Иван Иванов"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Ваш телефон *
            </label>
            <IMaskInput
              mask="+7 (000) 000-00-00"
              value={phone}
              unmask={false}
              onAccept={(value: any) => setPhone(value)}
              placeholder="+7 (___) ___-__-__"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              id="phone"
              name="phone"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Ваш вопрос
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Хочу узнать подробнее об этом участке"
            ></textarea>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium text-center rounded-lg transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      )}
    </div>
  )
} 