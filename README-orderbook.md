# Компонент "Стакан заявок" (OrderBook)

Компонент для отображения стакана заявок (ордербука) акций и других финансовых инструментов. Позволяет визуализировать текущие заявки на покупку и продажу, показывая глубину рынка и потенциальные уровни поддержки/сопротивления.

## Возможности

- Отображение заявок на покупку и продажу с указанием цены и объема
- Визуализация объемов с помощью горизонтальных полос
- Автоматическое обновление данных с заданным интервалом
- Поддержка различных API для получения реальных данных
- Режим демонстрации с генерацией случайных данных
- Прокрутка к текущей цене при загрузке
- Кнопка для ручного обновления данных

## Использование

```tsx
import { OrderBook } from '@/components/charts/OrderBook';

// Базовое использование с демо-данными
<OrderBook stock={{ symbol: 'AAPL', price: 180.95, currency: 'USD' }} />

// Использование с API Тинькофф Инвестиций
<OrderBook 
  stock={{ symbol: 'AAPL', price: 180.95, currency: 'USD' }}
  apiType="tinkoff"
  apiKey="YOUR_API_KEY"
  updateInterval={5000} // Обновление каждые 5 секунд
/>

// Использование с API Московской Биржи
<OrderBook 
  stock={{ symbol: 'SBER', price: 270.45, currency: 'RUB' }}
  apiType="moex"
  updateInterval={10000} // Обновление каждые 10 секунд
/>
```

## Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `stock` | `object` | - | Объект с информацией об акции (обязательный) |
| `stock.symbol` | `string` | - | Символ (тикер) акции |
| `stock.price` | `number` | - | Текущая цена акции |
| `stock.currency` | `string` | 'USD' | Валюта акции |
| `apiType` | `'tinkoff' \| 'moex' \| 'mock'` | 'mock' | Тип API для получения данных |
| `apiKey` | `string` | '' | API ключ (обязателен для Tinkoff API) |
| `apiUrl` | `string` | '' | URL API (опционально) |
| `updateInterval` | `number` | 10000 | Интервал обновления данных в миллисекундах |

## Интеграция с API

### Tinkoff Invest API

Для интеграции с API Тинькофф Инвестиций необходимо:

1. Установить пакет:
   ```bash
   npm install @tinkoff/invest-openapi-js-sdk
   ```

2. Получить API ключ в личном кабинете Тинькофф Инвестиции:
   - Зайдите в [личный кабинет](https://www.tinkoff.ru/invest/)
   - Перейдите в настройки
   - Выберите "Токены доступа"
   - Создайте новый токен (можно с ограниченными правами "только для чтения")

3. Использовать компонент с указанием API ключа:
   ```tsx
   <OrderBook 
     stock={{ symbol: 'AAPL', price: 180.95 }}
     apiType="tinkoff"
     apiKey="YOUR_API_KEY"
   />
   ```

### Московская Биржа (MOEX) API

Для интеграции с API Московской Биржи:

1. Для получения данных в режиме реального времени требуется заключение договора с Московской Биржей.
2. Данные с задержкой (15-20 минут) доступны без подписки.

```tsx
<OrderBook 
  stock={{ symbol: 'SBER', price: 270.45, currency: 'RUB' }}
  apiType="moex"
/>
```

## Расширение функциональности

Компонент использует сервис `orderBookService` для получения данных. Вы можете расширить его функциональность, добавив поддержку других API:

1. Откройте файл `src/lib/services/orderBookService.ts`
2. Добавьте новый класс для работы с вашим API
3. Обновите функцию `createOrderBookService` для поддержки нового типа API
4. Обновите интерфейс `OrderBookProps` в компоненте `OrderBook.tsx`

Пример добавления поддержки нового API:

```typescript
// Класс для работы с новым API
export class NewApiOrderBookService {
  async getOrderBookByTicker(ticker: string, depth: number = 20): Promise<ApiOrderBook> {
    try {
      // Реализация запроса к API
      const response = await fetch(`https://your-api.com/orderbook?symbol=${ticker}&depth=${depth}`);
      const data = await response.json();
      
      // Преобразование данных в нужный формат
      const bids = data.bids.map(bid => ({ price: bid.price, volume: bid.quantity }));
      const asks = data.asks.map(ask => ({ price: ask.price, volume: ask.quantity }));
      
      return { bids, asks };
    } catch (error) {
      console.error('Error getting orderbook:', error);
      throw new Error('Не удалось получить данные стакана заявок');
    }
  }
}

// Обновление фабрики
export function createOrderBookService(
  type: 'tinkoff' | 'moex' | 'new-api' | 'mock',
  config?: { apiKey?: string, apiUrl?: string }
): {
  getOrderBookByTicker: (ticker: string, depth?: number) => Promise<ApiOrderBook>
} {
  switch (type) {
    // ... существующие case
    case 'new-api':
      return new NewApiOrderBookService();
    // ... остальной код
  }
}
```

## Дополнительная документация

Для получения более подробной информации об интеграции с различными API см. файл `docs/api-integration.md`. 