'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ApiInfoProps {
  source: string;
}

export function ApiInfo({ source }: ApiInfoProps) {
  const apiInfo = getApiInfo(source);
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>{apiInfo.name}</span>
          {apiInfo.requiresApiKey ? (
            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              Требуется API ключ
            </span>
          ) : (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Не требуется API ключ
            </span>
          )}
          {apiInfo.delay && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Задержка: {apiInfo.delay}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {apiInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Доступные данные:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {apiInfo.availableData.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          {apiInfo.limitations && (
            <div>
              <h3 className="text-sm font-medium mb-2">Ограничения:</h3>
              <p className="text-sm text-muted-foreground">{apiInfo.limitations}</p>
            </div>
          )}
          
          {apiInfo.apiKeyInfo && (
            <div>
              <h3 className="text-sm font-medium mb-2">Получение API ключа:</h3>
              <p className="text-sm text-muted-foreground">{apiInfo.apiKeyInfo}</p>
              {apiInfo.apiKeyLinks && apiInfo.apiKeyLinks.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Ссылки для получения API ключа:</p>
                  <ul className="list-disc pl-5 text-xs space-y-1">
                    {apiInfo.apiKeyLinks.map((link: {url: string, title: string}, index: number) => (
                      <li key={index}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Пример запроса:</h3>
              <button 
                onClick={() => copyToClipboard(apiInfo.exampleRequest)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Скопировано
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Копировать код
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-xs overflow-auto">{apiInfo.exampleRequest}</pre>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <a href={apiInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Официальная документация
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ApiInfoData {
  name: string;
  description: string;
  requiresApiKey: boolean;
  delay?: string;
  availableData: string[];
  limitations?: string;
  apiKeyInfo?: string;
  apiKeyLinks?: Array<{url: string, title: string}>;
  exampleRequest: string;
  url: string;
}

function getApiInfo(source: string): ApiInfoData {
  const apiInfoMap: Record<string, ApiInfoData> = {
    'yahoo-finance': {
      name: 'Yahoo Finance',
      description: 'Yahoo Finance предоставляет обширные данные о ценах акций, финансовых показателях и новостях компаний.',
      requiresApiKey: false,
      delay: '15-20 минут',
      availableData: [
        'Исторические цены акций',
        'Основные финансовые показатели',
        'Информация о дивидендах',
        'Балансовые отчеты, отчеты о прибылях и убытках',
        'Аналитические оценки'
      ],
      limitations: 'Официальное API не предоставляется, но существуют неофициальные библиотеки, такие как yfinance для Python.',
      exampleRequest: `import yfinance as yf\n\n# Получение данных по акции Apple\nticker = yf.Ticker("AAPL")\n\n# Получение исторических данных\nhistory = ticker.history(period="1y")\n\n# Получение информации о компании\ninfo = ticker.info`,
      url: 'https://finance.yahoo.com/'
    },
    'alpha-vantage': {
      name: 'Alpha Vantage',
      description: 'Alpha Vantage предлагает бесплатный API для получения данных о акциях, форексе и криптовалютах.',
      requiresApiKey: true,
      delay: '15-20 минут',
      availableData: [
        'Исторические и текущие цены акций',
        'Технические индикаторы',
        'Фундаментальные данные',
        'Данные о форексе и криптовалютах'
      ],
      limitations: 'Бесплатный план ограничен 5 API-запросами в минуту и 500 запросами в день.',
      apiKeyInfo: 'Получите бесплатный ключ на сайте alphavantage.co, зарегистрировавшись.',
      apiKeyLinks: [
        { url: 'https://www.alphavantage.co/support/#api-key', title: 'Официальная страница получения API ключа' },
        { url: 'https://www.alphavantage.co/documentation/', title: 'Документация API' },
        { url: 'https://rapidapi.com/alphavantage/api/alpha-vantage', title: 'Alpha Vantage на RapidAPI (альтернативный способ)' }
      ],
      exampleRequest: `fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_API_KEY')\n  .then(response => response.json())\n  .then(data => console.log(data));`,
      url: 'https://www.alphavantage.co/'
    },
    'moex': {
      name: 'MOEX ISS API',
      description: 'Информационно-статистический сервер Московской биржи предоставляет доступ к данным о торгах на российском рынке.',
      requiresApiKey: false,
      delay: '15 минут',
      availableData: [
        'Исторические цены акций российских компаний',
        'Данные о торгах в режиме реального времени',
        'Информация о ценных бумагах',
        'Индексы и индикаторы',
        'Обороты торгов'
      ],
      limitations: 'Нет явных ограничений на количество запросов, но рекомендуется кэширование данных.',
      apiKeyLinks: [
        { url: 'https://www.moex.com/ru/derivatives/contractspecification.aspx', title: 'Спецификации контрактов MOEX' },
        { url: 'https://iss.moex.com/iss/reference/', title: 'Справочник по ISS API' },
        { url: 'https://github.com/WLM1ke/apimoex', title: 'Python-клиент для MOEX ISS API' }
      ],
      exampleRequest: `import requests\nimport pandas as pd\nimport apimoex\n\nwith requests.Session() as session:\n    data = apimoex.get_board_history(session, 'SBER')\n    df = pd.DataFrame(data)\n    print(df.head())`,
      url: 'https://iss.moex.com/iss/reference/'
    },
    'financial-modeling-prep': {
      name: 'Financial Modeling Prep',
      description: 'FMP предоставляет финансовые данные и API для разработчиков и инвесторов.',
      requiresApiKey: true,
      delay: '15-30 минут',
      availableData: [
        'Финансовые отчеты (до 5 лет)',
        'Профили компаний',
        'Финансовые коэффициенты',
        'Данные о дивидендах',
        'Исторические цены акций'
      ],
      limitations: 'Бесплатный план имеет ограничения по количеству запросов и доступным данным.',
      apiKeyInfo: 'Получите ключ на сайте financialmodelingprep.com, зарегистрировавшись.',
      apiKeyLinks: [
        { url: 'https://financialmodelingprep.com/developer/docs/pricing', title: 'Страница регистрации и получения API ключа' },
        { url: 'https://financialmodelingprep.com/developer/docs/', title: 'Документация API' },
        { url: 'https://rapidapi.com/financial-modeling-prep-financial-modeling-prep-default/api/financial-modeling-prep', title: 'FMP на RapidAPI (альтернативный способ)' }
      ],
      exampleRequest: `fetch('https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=YOUR_API_KEY')\n  .then(response => response.json())\n  .then(data => console.log(data));`,
      url: 'https://financialmodelingprep.com/'
    },
    'iex-cloud': {
      name: 'IEX Cloud',
      description: 'IEX Cloud предоставляет финансовые данные через API.',
      requiresApiKey: true,
      delay: '15 минут',
      availableData: [
        'Цены акций в реальном времени',
        'Исторические данные',
        'Фундаментальные данные компаний',
        'Новости и события'
      ],
      limitations: 'Бесплатный план предоставляет ограниченное количество API-кредитов в месяц.',
      apiKeyInfo: 'Получите ключ на сайте iexcloud.io, зарегистрировавшись и выбрав бесплатный план.',
      apiKeyLinks: [
        { url: 'https://iexcloud.io/cloud-login#/register', title: 'Регистрация и получение API ключа' },
        { url: 'https://iexcloud.io/docs/api/', title: 'Документация API' },
        { url: 'https://intercom.help/iexcloud/en/articles/2851957-how-to-use-the-iex-cloud-api', title: 'Руководство по использованию API' }
      ],
      exampleRequest: `fetch('https://cloud.iexapis.com/stable/stock/aapl/quote?token=YOUR_API_KEY')\n  .then(response => response.json())\n  .then(data => console.log(data));`,
      url: 'https://iexcloud.io/'
    },
    'quandl': {
      name: 'Quandl',
      description: 'Quandl предоставляет финансовые и экономические данные из различных источников.',
      requiresApiKey: true,
      delay: '1 день',
      availableData: [
        'Исторические цены акций',
        'Экономические показатели',
        'Данные о фьючерсах и опционах'
      ],
      limitations: 'Многие наборы данных требуют платной подписки, но есть и бесплатные.',
      apiKeyInfo: 'Получите ключ на сайте quandl.com, зарегистрировавшись.',
      apiKeyLinks: [
        { url: 'https://www.quandl.com/sign-up', title: 'Регистрация и получение API ключа' },
        { url: 'https://docs.quandl.com/', title: 'Документация API' },
        { url: 'https://www.quandl.com/tools/api', title: 'Инструменты API' }
      ],
      exampleRequest: `import quandl\n\n# Установите API ключ\nquandl.ApiConfig.api_key = 'YOUR_API_KEY'\n\n# Получите данные\ndata = quandl.get('WIKI/AAPL')\nprint(data.head())`,
      url: 'https://www.quandl.com/'
    },
    'fred': {
      name: 'FRED',
      description: 'База данных экономических исследований Федерального резервного банка Сент-Луиса.',
      requiresApiKey: true,
      delay: 'Несколько дней',
      availableData: [
        'Экономические показатели',
        'Процентные ставки',
        'Макроэкономические данные'
      ],
      limitations: 'Фокус на макроэкономических данных, а не на данных отдельных компаний.',
      apiKeyInfo: 'Получите ключ на сайте fred.stlouisfed.org, зарегистрировавшись.',
      apiKeyLinks: [
        { url: 'https://fred.stlouisfed.org/docs/api/api_key.html', title: 'Получение API ключа' },
        { url: 'https://fred.stlouisfed.org/docs/api/fred/', title: 'Документация API' },
        { url: 'https://research.stlouisfed.org/docs/api/fred/', title: 'Руководство разработчика' }
      ],
      exampleRequest: `import fredapi as fa\n\n# Установите API ключ\nfred = fa.Fred(api_key='YOUR_API_KEY')\n\n# Получите данные по ВВП США\ngdp = fred.get_series('GDP')\nprint(gdp.tail())`,
      url: 'https://fred.stlouisfed.org/'
    },
    'finnhub': {
      name: 'Finnhub',
      description: 'Finnhub предоставляет API для доступа к финансовым данным.',
      requiresApiKey: true,
      delay: '15 минут',
      availableData: [
        'Цены акций',
        'Финансовые отчеты',
        'Новости и настроения',
        'Данные по IPO и инсайдерским сделкам'
      ],
      limitations: 'Бесплатный план ограничен 60 API-запросами в минуту.',
      apiKeyInfo: 'Получите ключ на сайте finnhub.io, зарегистрировавшись.',
      apiKeyLinks: [
        { url: 'https://finnhub.io/register', title: 'Регистрация и получение API ключа' },
        { url: 'https://finnhub.io/docs/api', title: 'Документация API' },
        { url: 'https://rapidapi.com/Finnhub/api/finnhub-real-time-stock-price', title: 'Finnhub на RapidAPI (альтернативный способ)' }
      ],
      exampleRequest: `fetch('https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY')\n  .then(response => response.json())\n  .then(data => console.log(data));`,
      url: 'https://finnhub.io/'
    }
  };
  
  return apiInfoMap[source] || {
    name: 'Неизвестный источник',
    description: 'Информация отсутствует',
    requiresApiKey: false,
    availableData: ['Нет данных'],
    exampleRequest: '// Нет примера',
    url: '#'
  };
} 