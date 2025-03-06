'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ScrollAnimation from '@/components/common/ScrollAnimation'
import { useContacts } from '@/utils/useContacts'
import { formatPhoneNumber } from '@/utils/formatters'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  UserIcon, 
  DocumentTextIcon, 
  LockClosedIcon, 
  ScaleIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function PrivacyPage() {
  const { contactInfo, loading } = useContacts()
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const sectionRefs = useRef<{ [key: number]: HTMLElement | null }>({})

  const sections = [
    {
      id: 1,
      title: "Общие положения",
      icon: <DocumentTextIcon className="w-6 h-6" />,
      content: "Настоящая политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах, использующих сервисы сайта AltaiLand."
    },
    {
      id: 2,
      title: "Собираемая информация",
      icon: <UserIcon className="w-6 h-6" />,
      content: "Мы собираем следующие типы информации:",
      list: [
        "Имя и контактные данные",
        "Электронная почта",
        "Номер телефона",
        "Информация о предпочтениях при выборе участка",
        "Техническая информация о вашем устройстве и браузере"
      ]
    },
    {
      id: 3,
      title: "Цели сбора информации",
      icon: <DocumentTextIcon className="w-6 h-6" />,
      content: "Мы используем собранную информацию для:",
      list: [
        "Предоставления вам информации об участках",
        "Обработки ваших заявок и запросов",
        "Улучшения качества наших услуг",
        "Отправки важных уведомлений и обновлений",
        "Предоставления персонализированных рекомендаций"
      ]
    },
    {
      id: 4,
      title: "Защита информации",
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      content: "Мы принимаем все необходимые меры для защиты ваших персональных данных:",
      list: [
        "Используем шифрование при передаче данных",
        "Ограничиваем доступ к персональным данным",
        "Регулярно обновляем системы безопасности",
        "Проводим аудит систем защиты данных"
      ]
    },
    {
      id: 5,
      title: "Права пользователей",
      icon: <ScaleIcon className="w-6 h-6" />,
      content: "Вы имеете право:",
      list: [
        "Получить информацию о хранящихся данных",
        "Требовать исправления неточных данных",
        "Требовать удаления ваших данных",
        "Отозвать согласие на обработку данных"
      ]
    },
    {
      id: 6,
      title: "Контакты",
      icon: <EnvelopeIcon className="w-6 h-6" />,
      content: "По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам:"
    },
    {
      id: 7,
      title: "Изменения политики",
      icon: <ClockIcon className="w-6 h-6" />,
      content: "Мы оставляем за собой право вносить изменения в политику конфиденциальности. Все изменения будут опубликованы на этой странице с указанием даты последнего обновления.",
      footer: "Последнее обновление: Март 2025"
    }
  ]
  
  // Функция для плавного скролла к разделу
  const scrollToSection = (sectionId: number) => {
    setActiveSection(sectionId)
    
    const sectionElement = sectionRefs.current[sectionId]
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      
      // Компенсация для учета высоты шапки
      setTimeout(() => {
        const yOffset = -120; // Отступ от верха (учитывая высоту шапки)
        const y = sectionElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }, 0);
    }
  }

  // Функция для установки ref элемента
  const setSectionRef = (el: HTMLElement | null, id: number) => {
    if (el) {
      sectionRefs.current[id] = el
    }
  }
  
  // Определение текущего видимого раздела при скролле
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Добавляем смещение для лучшего определения
      
      // Проверяем, какой раздел сейчас в зоне видимости
      let currentSectionId: number | null = null;
      
      Object.entries(sectionRefs.current).forEach(([id, element]) => {
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (
            scrollPosition >= offsetTop && 
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSectionId = parseInt(id);
          }
        }
      });
      
      if (currentSectionId !== null && currentSectionId !== activeSection) {
        setActiveSection(currentSectionId);
      }
    };
    
    // Добавляем слушатель события прокрутки
    window.addEventListener('scroll', handleScroll);
    
    // Вызываем функцию один раз при монтировании компонента
    handleScroll();
    
    // Удаляем слушатель при размонтировании
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Заголовок с фоном */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white"></div>
          <div className="absolute inset-0 bg-[url('/images/altai-pattern.svg')] opacity-5"></div>
          
          <div className="max-w-5xl mx-auto px-4 relative">
            <ScrollAnimation>
              <div className="text-center space-y-6">
                <div className="inline-flex justify-center items-center w-20 h-20 bg-green-50 rounded-full mb-4">
                  <LockClosedIcon className="w-10 h-10 text-green-600" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Политика конфиденциальности
                </h1>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Мы серьезно относимся к защите ваших персональных данных. 
                  В этом документе описано, как мы собираем, используем и защищаем вашу информацию.
                </p>
                
                <div className="pt-6">
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="inline-flex items-center bg-green-50 rounded-full px-4 py-2">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">Защита данных</span>
                    </div>
                    <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2">
                      <UserIcon className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-blue-700 font-medium">Конфиденциальность</span>
                    </div>
                    <div className="inline-flex items-center bg-amber-50 rounded-full px-4 py-2">
                      <ScaleIcon className="w-5 h-5 text-amber-600 mr-2" />
                      <span className="text-amber-700 font-medium">Ваши права</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Основной контент */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Навигация по секциям */}
              <div className="md:col-span-3">
                <ScrollAnimation>
                  <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                    <div className="text-lg font-semibold mb-4 text-gray-900">Содержание</div>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-green-50 text-green-700'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 ${activeSection === section.id ? 'text-green-600' : 'text-gray-400'}`}>
                              {section.icon}
                            </div>
                            <span className="text-sm">{section.title}</span>
                          </div>
                        </button>
                      ))}
                    </nav>
                  </div>
                </ScrollAnimation>
              </div>

              {/* Основной контент */}
              <div className="md:col-span-9">
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                  {sections.map((section, idx) => (
                    <ScrollAnimation key={section.id}>
                      <motion.section 
                        id={`section-${section.id}`}
                        ref={(el) => setSectionRef(el, section.id)}
                        className={`p-6 md:p-8 space-y-4 ${idx === 0 ? 'rounded-t-xl' : ''} ${
                          idx === sections.length - 1 ? 'rounded-b-xl' : ''
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <div className={`inline-flex items-center px-3 py-1 rounded-lg ${
                          activeSection === section.id 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-50 text-gray-500'
                        }`}>
                          <div className="mr-2">
                            {section.icon}
                          </div>
                          <h2 className="text-lg font-bold">
                            {section.id}. {section.title}
                          </h2>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-gray-100">
                          <p className="text-gray-600">
                            {section.content}
                          </p>
                          
                          {section.list && (
                            <ul className="mt-4 space-y-3">
                              {section.list.map((item, i) => (
                                <li key={i} className="flex items-start">
                                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                                    <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                                  </div>
                                  <span className="text-gray-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {section.id === 6 && (
                            <div className="mt-4">
                              {loading ? (
                                <div className="flex justify-center py-4">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                  {contactInfo?.email && (
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                                      <div className="mr-4 p-2 bg-blue-50 rounded-full">
                                        <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <a href={`mailto:${contactInfo.email}`} className="text-blue-600 font-medium">{contactInfo.email}</a>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {contactInfo?.phone && (
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                                      <div className="mr-4 p-2 bg-green-50 rounded-full">
                                        <PhoneIcon className="w-6 h-6 text-green-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Телефон</div>
                                        <a href={`tel:${contactInfo.phone}`} className="text-green-600 font-medium">{formatPhoneNumber(contactInfo.phone)}</a>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {contactInfo?.address && (
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg md:col-span-2">
                                      <div className="mr-4 p-2 bg-amber-50 rounded-full">
                                        <MapPinIcon className="w-6 h-6 text-amber-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Адрес</div>
                                        <div className="text-amber-600 font-medium">{contactInfo.address}</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-start p-4 bg-gray-50 rounded-lg md:col-span-2">
                                    <div className="mr-4 p-2 bg-purple-50 rounded-full">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Форма обратной связи</div>
                                      <div className="text-purple-600 font-medium">Можно оставить сообщение через форму на сайте</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {section.footer && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-400">
                                {section.footer}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.section>
                    </ScrollAnimation>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 