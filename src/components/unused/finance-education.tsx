"use client";
import React from "react";
import { GraduationCap, ExternalLink, Award, Globe } from "lucide-react";
import Link from "next/link";

export function FinanceEducation() {
  const universities = [
    {
      name: "University of St. Gallen",
      country: "Швейцария",
      programs: ["Master in Banking and Finance", "Master in Finance"],
      link: "https://www.unisg.ch/",
      description: "Один из ведущих бизнес-университетов Европы с сильной финансовой программой",
      ranking: "#5 в мире по Financial Times Masters in Finance 2024"
    },
    {
      name: "Vienna University of Economics and Business (WU)",
      country: "Австрия",
      programs: ["Master in Finance and Accounting", "Master in Quantitative Finance"],
      link: "https://www.wu.ac.at/",
      description: "Крупнейший бизнес-университет Европы с современным кампусом и международной репутацией",
      ranking: "#13 в мире по QS Masters in Finance Rankings 2024"
    },
    {
      name: "Erasmus University Rotterdam",
      country: "Нидерланды",
      programs: ["MSc in Finance", "MSc in Financial Economics"],
      link: "https://www.eur.nl/",
      description: "Известен своей сильной программой по финансам и экономике",
      ranking: "#11 в мире по Financial Times Masters in Finance 2024"
    },
    {
      name: "HEC Paris",
      country: "Франция",
      programs: ["MSc in International Finance", "Master in Finance"],
      link: "https://www.hec.edu/",
      description: "Одна из лучших бизнес-школ мира с выдающейся программой по финансам",
      ranking: "#1 в мире по Financial Times Masters in Finance 2024"
    },
    {
      name: "Higher School of Economics (HSE)",
      country: "Россия",
      programs: ["Master in Financial Economics", "Master in Finance"],
      link: "https://www.hse.ru/",
      description: "Ведущий исследовательский университет с сильными программами по финансам и экономике",
      ranking: "Топ-100 по QS World University Rankings by Subject 2024: Economics & Econometrics"
    },
    {
      name: "Moscow State University (MSU)",
      country: "Россия",
      programs: ["Master in Finance and Credit", "Master in Financial Analytics"],
      link: "https://www.msu.ru/",
      description: "Старейший и один из самых престижных университетов России",
      ranking: "Топ-150 по QS World University Rankings by Subject 2024: Economics"
    },
    {
      name: "Bocconi University",
      country: "Италия",
      programs: ["MSc in Finance", "MSc in Economic and Social Sciences"],
      link: "https://www.unibocconi.eu/",
      description: "Один из лучших европейских университетов в области экономики и финансов",
      ranking: "#6 в мире по Financial Times Masters in Finance 2024"
    },
    {
      name: "Stockholm School of Economics",
      country: "Швеция",
      programs: ["MSc in Finance", "MSc in Business & Economics"],
      link: "https://www.hhs.se/",
      description: "Престижная бизнес-школа с сильной финансовой программой",
      ranking: "#18 в мире по Financial Times Masters in Finance 2024"
    }
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <Award className="h-12 w-12 text-amber-400" />
          </div>
          <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Где изучать финансы в Европе
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Рекомендуемые университеты с сильными программами по финансам и инвестициям
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {universities.map((uni, index) => (
            <Link 
              key={index} 
              href={uni.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border-0 shadow-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{uni.name}</h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{uni.country}</p>
              <p className="text-sm mb-3">{uni.description}</p>
              
              <div className="flex items-center mb-2 text-amber-600 dark:text-amber-400">
                <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs font-medium">{uni.ranking}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Программы:
                </p>
                {uni.programs.map((program, idx) => (
                  <p key={idx} className="text-sm">• {program}</p>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            href="/education" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Смотреть все рекомендуемые программы
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
} 