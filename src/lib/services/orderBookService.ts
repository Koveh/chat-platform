// Сервис для получения данных стакана заявок
// Примечание: для работы с реальным API необходимо установить пакет @tinkoff/invest-openapi-js-sdk

import { OrderBookEntry } from '@/components/charts/OrderBook';
import { TinkoffService, ApiOrderBook } from './tinkoffService';

// Функция для генерации тестовых данных (используется, если API недоступен)
export function generateMockOrderBook(currentPrice: number): ApiOrderBook {
  // Генерируем случайные заявки на покупку (ниже текущей цены)
  const generatedBids: OrderBookEntry[] = [];
  for (let i = 0; i < 100; i++) {
    const priceDiff = (Math.random() * 5 + 0.01) * (i / 10 + 1);
    const price = parseFloat((currentPrice - priceDiff).toFixed(2));
    if (price <= 0) continue;
    
    // Объем заявки - случайное число, логарифмически распределенное
    const volume = Math.floor(Math.exp(Math.random() * 7) * 10);
    
    generatedBids.push({ price, volume });
  }
  
  // Сортируем заявки на покупку по убыванию цены (самые высокие сверху)
  generatedBids.sort((a, b) => b.price - a.price);
  
  // Генерируем случайные заявки на продажу (выше текущей цены)
  const generatedAsks: OrderBookEntry[] = [];
  for (let i = 0; i < 100; i++) {
    const priceDiff = (Math.random() * 5 + 0.01) * (i / 10 + 1);
    const price = parseFloat((currentPrice + priceDiff).toFixed(2));
    
    // Объем заявки - случайное число, логарифмически распределенное
    const volume = Math.floor(Math.exp(Math.random() * 7) * 10);
    
    generatedAsks.push({ price, volume });
  }
  
  // Сортируем заявки на продажу по возрастанию цены (самые низкие сверху)
  generatedAsks.sort((a, b) => a.price - b.price);
  
  return {
    bids: generatedBids,
    asks: generatedAsks
  };
}

// Класс для работы с API Московской Биржи
export class MoexOrderBookService {
  // Метод для получения стакана заявок по тикеру
  async getOrderBookByTicker(ticker: string, depth: number = 20): Promise<ApiOrderBook> {
    try {
      // В реальной реализации здесь будет запрос к API MOEX
      // const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${ticker}/orderbook.json?depth=${depth}`);
      // const data = await response.json();
      // 
      // const bids = data.orderbook.data
      //   .filter(item => item[2] === 'B') // Заявки на покупку
      //   .map(item => ({ price: item[0], volume: item[1] }));
      // 
      // const asks = data.orderbook.data
      //   .filter(item => item[2] === 'S') // Заявки на продажу
      //   .map(item => ({ price: item[0], volume: item[1] }));
      // 
      // return { bids, asks };
      
      // Заглушка для демонстрации - генерируем случайные данные
      console.log(`Getting MOEX orderbook for ticker: ${ticker} with depth: ${depth}`);
      // Используем случайную цену около 100 для демонстрации
      const mockPrice = 100 + (Math.random() * 10 - 5);
      return generateMockOrderBook(mockPrice);
    } catch (error) {
      console.error('Error getting MOEX orderbook:', error);
      throw new Error('Не удалось получить данные стакана заявок MOEX');
    }
  }
}

// Фабрика для создания сервиса в зависимости от настроек
export function createOrderBookService(type: 'tinkoff' | 'moex' | 'mock', config?: { apiKey?: string, apiUrl?: string }): {
  getOrderBookByTicker: (ticker: string, depth?: number) => Promise<ApiOrderBook>
} {
  switch (type) {
    case 'tinkoff':
      if (!config?.apiKey) {
        throw new Error('API ключ обязателен для Tinkoff API');
      }
      // Используем TinkoffService для получения данных стакана заявок
      const tinkoffService = TinkoffService.getInstance(config.apiKey, config.apiUrl);
      return {
        getOrderBookByTicker: (ticker: string, depth: number = 20) => {
          return tinkoffService.getOrderBookByTicker(ticker, depth);
        }
      };
    
    case 'moex':
      return new MoexOrderBookService();
    
    case 'mock':
    default:
      // Возвращаем объект с методом, который генерирует тестовые данные
      return {
        getOrderBookByTicker: async (ticker: string, depth: number = 20) => {
          console.log(`Generating mock orderbook for ticker: ${ticker} with depth: ${depth}`);
          // Используем случайную цену около 100 для демонстрации
          const mockPrice = 100 + (Math.random() * 10 - 5);
          return generateMockOrderBook(mockPrice);
        }
      };
  }
} 