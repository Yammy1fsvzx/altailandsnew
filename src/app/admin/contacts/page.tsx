'use client'

import { useState, useEffect, FormEvent } from 'react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, GlobeAltIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

// Интерфейс контактов
interface Contacts {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapLink: string;
  socialLinks: {
    vk: string;
    telegram: string;
    whatsapp: string;
  };
}

export default function AdminContacts() {
  // В реальном приложении здесь будут запросы к API
  const [contacts, setContacts] = useState<Contacts>({
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    mapLink: '',
    socialLinks: {
      vk: '',
      telegram: '',
      whatsapp: ''
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const timer = setTimeout(() => {
      setContacts({
        address: 'г. Барнаул, ул. Строителей, д. 10, офис 312',
        phone: '+7 (983) 380-3121',
        email: 'info@altailands.ru',
        workingHours: 'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00',
        mapLink: 'https://yandex.ru/maps/-/CDaDRTV5',
        socialLinks: {
          vk: 'https://vk.com/altailands',
          telegram: 'https://t.me/altailands',
          whatsapp: 'https://wa.me/79833803121'
        }
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Обработка изменений в форме
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setContacts({
        ...contacts,
        [parent]: {
          ...contacts[parent as keyof Contacts] as Record<string, string>,
          [child]: value
        }
      })
    } else {
      setContacts({
        ...contacts,
        [name]: value
      })
    }
  }

  // Обработка отправки формы
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Имитация сохранения на сервере
    setSaving(true)
    
    // В реальном приложении здесь будет запрос к API для сохранения
    setTimeout(() => {
      setSaving(false)
      setSaveSuccess(true)
      
      // Скрыть уведомление об успешном сохранении через 3 секунды
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  // Компонент для полей формы
  const FormField = ({ 
    label, 
    name, 
    value, 
    icon: Icon, 
    placeholder 
  }: { 
    label: string; 
    name: string; 
    value: string; 
    icon: any; 
    placeholder: string; 
  }) => {
    return (
      <div className="sm:col-span-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name={name}
            id={name}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Контактная информация</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление контактными данными вашей компании
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
        <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Уведомление об успешном сохранении */}
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Контактные данные успешно сохранены
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField 
                label="Адрес" 
                name="address" 
                value={contacts.address} 
                icon={MapPinIcon} 
                placeholder="Введите физический адрес компании" 
              />
              
              <FormField 
                label="Телефон" 
                name="phone" 
                value={contacts.phone} 
                icon={PhoneIcon} 
                placeholder="+7 (999) 999-9999" 
              />
              
              <FormField 
                label="Email" 
                name="email" 
                value={contacts.email} 
                icon={EnvelopeIcon} 
                placeholder="company@example.com" 
              />
              
              <FormField 
                label="Часы работы" 
                name="workingHours" 
                value={contacts.workingHours} 
                icon={GlobeAltIcon} 
                placeholder="Пн-Пт: 9:00 - 18:00" 
              />
              
              <FormField 
                label="Ссылка на карту" 
                name="mapLink" 
                value={contacts.mapLink} 
                icon={MapPinIcon} 
                placeholder="https://yandex.ru/maps/..." 
              />
              
              <div className="sm:col-span-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Социальные сети</h3>
              </div>
              
              <FormField 
                label="ВКонтакте" 
                name="socialLinks.vk" 
                value={contacts.socialLinks.vk} 
                icon={GlobeAltIcon} 
                placeholder="https://vk.com/..." 
              />
              
              <FormField 
                label="Telegram" 
                name="socialLinks.telegram" 
                value={contacts.socialLinks.telegram} 
                icon={GlobeAltIcon} 
                placeholder="https://t.me/..." 
              />
              
              <FormField 
                label="WhatsApp" 
                name="socialLinks.whatsapp" 
                value={contacts.socialLinks.whatsapp} 
                icon={GlobeAltIcon} 
                placeholder="https://wa.me/..." 
              />
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </>
              ) : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 