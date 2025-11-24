"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, Copy, Key, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Имитация данных пользователя
  const [user, setUser] = useState({
    email: "user@example.com",
    apiKeys: {
      'yahoo-finance': '',
      'alpha-vantage': '',
      'financial-modeling-prep': '',
      'iex-cloud': '',
      'quandl': '',
      'fred': '',
      'finnhub': '',
      'polygon': '',
      'tiingo': '',
      'eod-historical': '',
      'marketstack': '',
      'intrinio': '',
    } as Record<string, string>
  });

  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Функция для обновления API-ключа
  const updateApiKey = (provider: string, value: string) => {
    setUser(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [provider]: value
      }
    }));
  };

  // Функция для сохранения API-ключа
  const saveApiKey = async (provider: string) => {
    setSavingKey(provider);
    
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Имитация успешного сохранения
    if (provider in user.apiKeys) {
      console.log(`Сохранение API-ключа для ${provider}:`, user.apiKeys[provider]);
    }
    
    setSuccessMessage(`API-ключ для ${provider} успешно сохранен`);
    setTimeout(() => setSuccessMessage(null), 3000);
    
    setSavingKey(null);
  };

  // Функция для копирования API-ключа в буфер обмена
  const copyApiKey = (provider: string) => {
    if (provider in user.apiKeys) {
      navigator.clipboard.writeText(user.apiKeys[provider]);
      setSuccessMessage(`API-ключ для ${provider} скопирован в буфер обмена`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Функция для переключения видимости API-ключа
  const toggleApiKeyVisibility = (provider: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  // Список провайдеров API с описаниями
  const apiProviders = [
    { id: 'yahoo-finance', name: 'Yahoo Finance', description: 'Данные о акциях, ETF, опционах и криптовалютах' },
    { id: 'alpha-vantage', name: 'Alpha Vantage', description: 'Финансовые данные, технические индикаторы и экономические показатели' },
    { id: 'financial-modeling-prep', name: 'Financial Modeling Prep', description: 'Финансовая отчетность, фундаментальные данные и новости' },
    { id: 'iex-cloud', name: 'IEX Cloud', description: 'Данные о акциях, ETF, форекс и криптовалютах' },
    { id: 'quandl', name: 'Quandl', description: 'Финансовые и экономические данные из различных источников' },
    { id: 'fred', name: 'FRED', description: 'Экономические данные от Федерального резервного банка Сент-Луиса' },
    { id: 'finnhub', name: 'Finnhub', description: 'Данные о акциях, форекс и криптовалютах в реальном времени' },
    { id: 'polygon', name: 'Polygon.io', description: 'Данные о акциях, опционах и криптовалютах' },
    { id: 'tiingo', name: 'Tiingo', description: 'Исторические данные о акциях и ETF' },
    { id: 'eod-historical', name: 'EOD Historical Data', description: 'Исторические данные о акциях, ETF и индексах' },
    { id: 'marketstack', name: 'Marketstack', description: 'Данные о акциях в реальном времени и исторические данные' },
    { id: 'intrinio', name: 'Intrinio', description: 'Финансовые данные и аналитика' },
  ];

  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Профиль пользователя</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
        
        {successMessage && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="mt-1"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Настройки аккаунта</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile/change-password">
                        Изменить пароль
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile/preferences">
                        Настройки уведомлений
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">API-ключи</h2>
              <p className="text-gray-600 mb-6">
                Добавьте свои API-ключи для доступа к расширенным функциям платформы. Все ключи хранятся в зашифрованном виде и используются только для запросов к соответствующим сервисам.
              </p>
              
              <div className="space-y-6">
                {apiProviders.map((provider) => (
                  <div key={provider.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                      </div>
                      <Link 
                        href={`/api-docs#${provider.id}`} 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Документация
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <div className="relative flex-1">
                        <Input
                          type={showApiKeys[provider.id] ? "text" : "password"}
                          value={user.apiKeys[provider.id]}
                          onChange={(e) => updateApiKey(provider.id, e.target.value)}
                          placeholder={`Введите API-ключ для ${provider.name}`}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => toggleApiKeyVisibility(provider.id)}
                        >
                          {showApiKeys[provider.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      
                      {user.apiKeys[provider.id] && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => copyApiKey(provider.id)}
                          title="Копировать"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => saveApiKey(provider.id)}
                        disabled={savingKey === provider.id}
                      >
                        {savingKey === provider.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Сохранение
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Сохранить
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Key className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Безопасность API-ключей</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              Ваши API-ключи хранятся в зашифрованном виде и используются только для запросов к соответствующим сервисам. Мы не передаем ваши ключи третьим лицам и не используем их для доступа к вашим аккаунтам.
            </p>
            <p>
              Для обеспечения максимальной безопасности рекомендуем:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Использовать разные API-ключи для разных сервисов</li>
              <li>Регулярно обновлять ключи</li>
              <li>Устанавливать ограничения на использование ключей в настройках соответствующих сервисов</li>
              <li>Не передавать ключи третьим лицам</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 