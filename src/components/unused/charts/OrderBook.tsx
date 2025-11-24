'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CardContainer } from '@/components/ui/card-container';
import { MetricExplanation } from '@/components/MetricExplanation';
import { createOrderBookService } from '@/lib/services/orderBookService';
import { OrderBookUnavailable } from './OrderBookUnavailable';

// Используем только необходимые свойства из Stock
interface OrderBookProps {
  stock: {
    symbol?: string;
    price?: number;
    currency?: string;
  };
  apiType?: 'tinkoff' | 'moex' | 'mock';
  apiKey?: string;
  apiUrl?: string;
  updateInterval?: number; // Интервал обновления в миллисекундах
}

export interface OrderBookEntry {
  price: number;
  volume: number;
}

export function OrderBook({ 
  stock, 
  apiType = 'mock', 
  apiKey = '', 
  apiUrl = '', 
  updateInterval = 10000 // По умолчанию обновляем каждые 10 секунд
}: OrderBookProps) {
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tickerUnavailable, setTickerUnavailable] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Создаем сервис для получения данных стакана заявок
  const orderBookService = createOrderBookService(apiType, { apiKey, apiUrl });
  
  // Функция для загрузки данных стакана заявок
  const loadOrderBookData = async () => {
    if (!stock.symbol) {
      setError('Символ акции не указан');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Получаем данные стакана заявок через сервис
      const { bids, asks } = await orderBookService.getOrderBookByTicker(stock.symbol, 100);
      
      setBuyOrders(bids);
      setSellOrders(asks);
      setError(null);
      setTickerUnavailable(false);
    } catch (err: any) {
      console.error('Error loading order book data:', err);
      
      // Проверяем, связана ли ошибка с недоступностью тикера
      if (
        err.message.includes('не найден') || 
        err.message.includes('not found') || 
        err.message.includes('недоступен') ||
        err.message.includes('unavailable')
      ) {
        setTickerUnavailable(true);
      } else {
        setError('Не удалось загрузить данные стакана');
      }
      
      // Если произошла ошибка, генерируем тестовые данные
      const currentPrice = stock.price || 100;
      
      // Генерируем случайные заявки на покупку (ниже текущей цены)
      const generatedBuyOrders: OrderBookEntry[] = [];
      for (let i = 0; i < 100; i++) {
        const priceDiff = (Math.random() * 5 + 0.01) * (i / 10 + 1);
        const price = parseFloat((currentPrice - priceDiff).toFixed(2));
        if (price <= 0) continue;
        
        // Объем заявки - случайное число, логарифмически распределенное
        const volume = Math.floor(Math.exp(Math.random() * 7) * 10);
        
        generatedBuyOrders.push({ price, volume });
      }
      
      // Сортируем заявки на покупку по убыванию цены (самые высокие сверху)
      generatedBuyOrders.sort((a, b) => b.price - a.price);
      
      // Генерируем случайные заявки на продажу (выше текущей цены)
      const generatedSellOrders: OrderBookEntry[] = [];
      for (let i = 0; i < 100; i++) {
        const priceDiff = (Math.random() * 5 + 0.01) * (i / 10 + 1);
        const price = parseFloat((currentPrice + priceDiff).toFixed(2));
        
        // Объем заявки - случайное число, логарифмически распределенное
        const volume = Math.floor(Math.exp(Math.random() * 7) * 10);
        
        generatedSellOrders.push({ price, volume });
      }
      
      // Сортируем заявки на продажу по возрастанию цены (самые низкие сверху)
      generatedSellOrders.sort((a, b) => a.price - b.price);
      
      setBuyOrders(generatedBuyOrders);
      setSellOrders(generatedSellOrders);
    } finally {
      setLoading(false);
    }
  };
  
  // Загружаем данные при монтировании компонента и при изменении символа акции
  useEffect(() => {
    loadOrderBookData();
    
    // Настраиваем интервал для периодического обновления данных
    if (updateInterval > 0) {
      intervalRef.current = setInterval(loadOrderBookData, updateInterval);
    }
    
    // Очищаем интервал при размонтировании компонента
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stock.symbol, apiType, apiKey, apiUrl, updateInterval]);
  
  // Прокрутка к середине стакана при загрузке
  useEffect(() => {
    if (!loading && containerRef.current) {
      // Прокручиваем к середине контейнера
      const container = containerRef.current;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }
  }, [loading]);
  
  // Если тикер недоступен, показываем компонент OrderBookUnavailable
  if (tickerUnavailable) {
    return <OrderBookUnavailable symbol={stock.symbol || ''} apiType={apiType} />;
  }
  
  // Функция для определения ширины полосы объема (логарифмическая шкала)
  const getVolumeBarWidth = (volume: number) => {
    // Используем логарифмическую шкалу для более наглядного отображения
    const maxWidth = 100; // Максимальная ширина в процентах
    const minVolume = 10; // Минимальный объем для отображения
    const maxVolume = 10000; // Максимальный объем для отображения
    
    if (volume <= minVolume) return 5; // Минимальная ширина
    if (volume >= maxVolume) return maxWidth; // Максимальная ширина
    
    // Логарифмическая шкала
    const logMin = Math.log(minVolume);
    const logMax = Math.log(maxVolume);
    const scale = (Math.log(volume) - logMin) / (logMax - logMin);
    
    return 5 + scale * (maxWidth - 5);
  };
  
  // Форматирование числа с разделителями тысяч
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  if (loading) {
    return (
      <CardContainer title="Стакан заявок">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Загрузка данных...</p>
          </div>
        </div>
      </CardContainer>
    );
  }
  
  if (error) {
    return (
      <CardContainer title="Стакан заявок">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </CardContainer>
    );
  }
  
  return (
    <CardContainer 
      title={
        <div className="flex items-center space-x-1">
          <span>Стакан заявок</span>
          <MetricExplanation metricKey="orderBook" iconOnly={true} />
        </div>
      }
    >
      <div className="flex justify-between items-center mb-2 text-xs font-medium">
        <div className="w-1/3 text-center text-green-600">Покупка</div>
        <div className="w-1/3 text-center">Объем</div>
        <div className="w-1/3 text-center text-red-600">Продажа</div>
      </div>
      
      <div 
        ref={containerRef}
        className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <div className="min-h-full">
          {/* Заявки на продажу (сверху) */}
          {sellOrders.map((order, index) => (
            <div key={`sell-${index}`} className="flex items-center py-1 text-xs border-b border-gray-100">
              <div className="w-1/3"></div>
              <div className="w-1/3 flex justify-center">
                <div className="relative w-full h-5 flex items-center justify-center">
                  <div 
                    className="absolute right-0 h-4 bg-red-100" 
                    style={{ width: `${getVolumeBarWidth(order.volume)}%` }}
                  ></div>
                  <span className="relative z-10">{formatNumber(order.volume)}</span>
                </div>
              </div>
              <div className="w-1/3 text-right pr-2 font-medium text-red-600">{order.price.toFixed(2)}</div>
            </div>
          ))}
          
          {/* Разделитель - текущая цена */}
          <div className="py-2 bg-blue-50 flex justify-center items-center text-sm font-bold text-blue-600 border-y border-blue-200">
            Текущая цена: {stock.price?.toFixed(2) || 'N/A'} {stock.currency || 'USD'}
          </div>
          
          {/* Заявки на покупку (снизу) */}
          {buyOrders.map((order, index) => (
            <div key={`buy-${index}`} className="flex items-center py-1 text-xs border-b border-gray-100">
              <div className="w-1/3 text-left pl-2 font-medium text-green-600">{order.price.toFixed(2)}</div>
              <div className="w-1/3 flex justify-center">
                <div className="relative w-full h-5 flex items-center justify-center">
                  <div 
                    className="absolute left-0 h-4 bg-green-100" 
                    style={{ width: `${getVolumeBarWidth(order.volume)}%` }}
                  ></div>
                  <span className="relative z-10">{formatNumber(order.volume)}</span>
                </div>
              </div>
              <div className="w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {apiType === 'mock' 
          ? 'Демонстрационные данные стакана' 
          : 'Данные стакана обновляются в реальном времени'}
      </div>
      
      {/* Кнопка для ручного обновления данных */}
      <div className="mt-2 flex justify-center">
        <button 
          onClick={loadOrderBookData}
          className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
        >
          Обновить данные
        </button>
      </div>
    </CardContainer>
  );
} 