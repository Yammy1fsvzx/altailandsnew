"use client";

import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { FaTelegram, FaWhatsapp } from 'react-icons/fa'

interface ContactInfoProps {
  phone: string
  email?: string
  telegram?: string
  whatsapp?: string
  address?: string
}

export default function ContactInfo({ phone, email, telegram, whatsapp, address }: ContactInfoProps) {
  // Форматирование номера для ссылок
  const cleanPhone = phone.replace(/\D/g, '')
  
  return (
    <div className="bg-white ring-1 ring-green-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-4 md:mb-6">
        Связаться с нами
      </h3>
      
      <div className="space-y-4">
        {/* Телефон */}
        <div className="flex items-center">
          <PhoneIcon className="w-5 h-5 text-green-600 mr-3" />
          <a 
            href={`tel:${cleanPhone}`} 
            className="text-base text-gray-900 hover:text-green-600"
          >
            {phone}
          </a>
        </div>
        
        {/* Email */}
        {email && (
          <div className="flex items-center">
            <EnvelopeIcon className="w-5 h-5 text-green-600 mr-3" />
            <a 
              href={`mailto:${email}`} 
              className="text-base text-gray-900 hover:text-green-600"
            >
              {email}
            </a>
          </div>
        )}
        
        {/* Telegram */}
        {telegram && (
          <div className="flex items-center">
            <FaTelegram className="w-5 h-5 text-green-600 mr-3" />
            <a 
              href={`https://t.me/${telegram.replace('@', '')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-gray-900 hover:text-green-600"
            >
              {telegram}
            </a>
          </div>
        )}
        
        {/* WhatsApp */}
        {whatsapp && (
          <div className="flex items-center">
            <FaWhatsapp className="w-5 h-5 text-green-600 mr-3" />
            <a 
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-gray-900 hover:text-green-600"
            >
              {whatsapp}
            </a>
          </div>
        )}
        
        {/* Адрес */}
        {address && (
          <div className="mt-4 pt-4 border-t border-green-100">
            <div className="text-sm text-green-600 mb-2">Адрес офиса:</div>
            <div className="text-base text-gray-900">{address}</div>
          </div>
        )}
      </div>
    </div>
  )
} 