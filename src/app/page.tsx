'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import {
  ArrowRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import ScrollAnimation from '@/components/common/ScrollAnimation'
import InlineQuiz from '@/components/InlineQuiz'
import LatestPlots from '@/components/LatestPlots'

export default function Home() {
  return (
    <>
      <Header />
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[90vh] hero-background overflow-hidden p-4">
            {/* Улучшенный градиентный фон - цвета Алтайской природы */}
            <div className="absolute bg-green-800 inset-0 bg-gradient-to-b from-blue-900/40 via-green-800/30 to-green-700/40"></div>
            
            {/* Декоративные элементы - топографический паттерн для земельной тематики */}
            <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: 'url("/images/pattern-topo.svg")' }}></div>
            
            {/* Анимированные декоративные элементы */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Горы Алтая на заднем плане */}
              <div className="absolute bottom-0 left-0 w-full h-[40%] opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
                  <path d="M0,300 L200,180 L350,100 L500,200 L650,120 L800,220 L950,80 L1100,180 L1200,120 L1200,300 L0,300 Z" fill="#ffffff" />
                </svg>
              </div>
              
              {/* Алтайские кедры */}
              <div className="absolute bottom-[15%] left-[5%] w-10 h-20 md:w-16 md:h-32 opacity-20">
                <svg className="w-full h-full animate-pulse" viewBox="0 0 24 48" fill="#ffffff">
                  <path d="M12,0 L18,12 L15,12 L20,24 L17,24 L22,36 L12,36 L12,48 L12,36 L2,36 L7,24 L4,24 L9,12 L6,12 Z" />
                </svg>
              </div>
              <div className="absolute bottom-[18%] left-[15%] w-8 h-16 md:w-12 md:h-24 opacity-15">
                <svg className="w-full h-full animate-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 24 48" fill="#ffffff">
                  <path d="M12,0 L18,12 L15,12 L20,24 L17,24 L22,36 L12,36 L12,48 L12,36 L2,36 L7,24 L4,24 L9,12 L6,12 Z" />
                </svg>
              </div>
              <div className="absolute bottom-[20%] right-[10%] w-10 h-20 md:w-16 md:h-32 opacity-20">
                <svg className="w-full h-full animate-pulse" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 48" fill="#ffffff">
                  <path d="M12,0 L18,12 L15,12 L20,24 L17,24 L22,36 L12,36 L12,48 L12,36 L2,36 L7,24 L4,24 L9,12 L6,12 Z" />
                </svg>
              </div>
              

              
              {/* Реки Алтая */}
              <div className="absolute top-[40%] left-0 w-full h-20 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  <path d="M0,50 C200,20 400,70 600,40 C800,10 1000,60 1200,30" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5,5" className="animate-float" style={{ animationDuration: '15s' }} />
                </svg>
              </div>
              
              {/* Анимированные частицы - звезды алтайского неба */}
              <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white rounded-full opacity-30 animate-float"></div>
              <div className="absolute top-[30%] left-[20%] w-1 h-1 bg-white rounded-full opacity-20 animate-float" style={{ animationDelay: '0.7s' }}></div>
              <div className="absolute top-[15%] left-[40%] w-1.5 h-1.5 bg-white rounded-full opacity-25 animate-float" style={{ animationDelay: '1.3s' }}></div>
              <div className="absolute top-[25%] right-[30%] w-2 h-2 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-[10%] right-[20%] w-1 h-1 bg-white rounded-full opacity-20 animate-float" style={{ animationDelay: '1.1s' }}></div>
              <div className="absolute top-[35%] right-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-25 animate-float" style={{ animationDelay: '0.9s' }}></div>
            </div>
            
            <div className="relative h-full flex flex-col justify-center my-20 md:my-40">
              <div className="max-w-7xl mx-auto px-4 py-10 md:py-20">
                <ScrollAnimation>
                  <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12 relative">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-md">
                      <span className="inline-block relative">
                        Найдите свой <span className="text-primary">уникальный</span> участок
                      </span>
                      <br />
                      <span className="inline-block">в живописном Алтае</span>
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 drop-shadow">
                    Более 50 участков для строительства коттеджных поселков, апарт-отелей, туристических баз и жилых комплексов.
                    </p>
                    
                    {/* Декоративная линия */}
                    <div className="w-20 h-1 bg-primary/70 mx-auto mb-8 rounded-full"></div>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation>
                  <div className="max-w-3xl mx-auto">
                    {/* Кнопки действий */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto">
                      <Link
                        href="/catalog"
                        className="flex items-center justify-center text-lg font-medium py-5 px-5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg w-full sm:w-[320px] transition-colors duration-200"
                      >
                        <span>Выбрать участок</span>
                        <ArrowRightIcon className="w-5 h-5 ml-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/contacts"
                        className="flex items-center justify-center text-lg font-medium py-5 px-5 rounded-xl bg-[#2e764a] hover:bg-[#45855d] text-white shadow-lg w-full sm:w-[320px] transition-colors duration-200"
                      >
                        <PhoneIcon className="w-5 h-5 mr-3" />
                        <span>Получить консультацию</span>
                      </Link>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Статистика */}
                <ScrollAnimation>
                  <div className="max-w-4xl mx-auto mt-10 md:mt-16">
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                      <div className="text-center bg-white/5 backdrop-blur-sm py-4 px-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl hover:shadow-white/5 group">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1 transition-colors">10+</div>
                        <div className="text-xs md:text-sm text-gray-300">Лет на рынке земли</div>
                      </div>
                      <div className="text-center bg-white/5 backdrop-blur-sm py-4 px-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl hover:shadow-white/5 group">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1 transition-colors">150+</div>
                        <div className="text-xs md:text-sm text-gray-300">Проданных участков</div>
                      </div>
                      <div className="text-center bg-white/5 backdrop-blur-sm py-4 px-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl hover:shadow-white/5 group">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1 transition-colors">50+</div>
                        <div className="text-xs md:text-sm text-gray-300">Участков в продаже</div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>

            {/* Новый современный разделитель внизу - стилизованный под алтайские горы */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
              <div className="relative">
                {/* Первый слой - горы на заднем плане */}
                <svg 
                  className="relative block w-full h-[30px] md:h-[70px]" 
                  viewBox="0 0 1200 120" 
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M0,0 L150,40 L350,10 L500,50 L650,20 L800,60 L950,30 L1100,70 L1200,40 L1200,120 L0,120 Z" 
                    className="fill-white opacity-20"
                  ></path>
                </svg>
                
                {/* Второй слой - горы на переднем плане */}
                <svg 
                  className="absolute bottom-0 left-0 w-full h-[20px] md:h-[50px]" 
                  viewBox="0 0 1200 120" 
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M0,0 L200,50 L400,15 L600,40 L800,10 L1000,50 L1200,20 L1200,120 L0,120 Z" 
                    className="fill-white"
                  ></path>
                </svg>
              </div>
            </div>
          </section>

          {/* Квиз */}
          <section className="py-10 md:py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/altai-pattern.svg')] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
            <div className="max-w-7xl mx-auto px-4 relative">
              <ScrollAnimation>
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                  {/* <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Найдите свой идеальный участок на Алтае</h2> */}
                </div>
                <InlineQuiz />
              </ScrollAnimation>
            </div>
          </section>

          {/* Популярные предложения */}
          <section className="py-16 md:py-24 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4">
              <ScrollAnimation>
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Лучшие предложения</h2>
                    <p className="text-xl text-gray-600">Самые живописные участки этого месяца</p>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                  </div>
                  <Link 
                    href="/catalog"
                    className="btn-primary hidden md:inline-flex items-center gap-2 group bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-all"
                  >
                    <span>Все участки</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollAnimation>

              <ScrollAnimation>
                <LatestPlots />
              </ScrollAnimation>

              <div className="text-center mt-12 md:hidden">
                <Link 
                  href="/catalog"
                  className="btn-primary inline-flex items-center gap-2 group bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-all"
                >
                  <span>Все участки</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      <Footer />
    </>
  )
}