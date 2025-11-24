"use client";
import React from "react";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Database, 
  Globe,
  Award
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <LineChart className="h-10 w-10 text-blue-500" />,
      title: "Технический анализ",
      description: "Графики, индикаторы и паттерны для принятия торговых решений"
    },
    {
      icon: <BarChart className="h-10 w-10 text-green-500" />,
      title: "Фундаментальный анализ",
      description: "Финансовые показатели, отчеты и оценка стоимости компаний"
    },
    {
      icon: <PieChart className="h-10 w-10 text-purple-500" />,
      title: "Портфельный анализ",
      description: "Оптимизация портфеля, расчет рисков и доходности инвестиций"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-red-500" />,
      title: "Скрининг акций",
      description: "Поиск акций по десяткам параметров и фильтров для выявления лучших инвестиционных возможностей"
    },
    {
      icon: <Database className="h-10 w-10 text-amber-500" />,
      title: "Макроэкономика",
      description: "Экономические показатели и их влияние на финансовые рынки"
    },
    {
      icon: <Globe className="h-10 w-10 text-cyan-500" />,
      title: "Глобальный охват",
      description: "Данные по акциям, ETF, индексам и другим инструментам со всего мира"
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <Award className="h-12 w-12 text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Почему выбирают нашу платформу
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Мы предоставляем полный набор инструментов для анализа и принятия инвестиционных решений
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-6 py-4 rounded-lg border-0 shadow-none transition-transform hover:scale-105 h-full"
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 