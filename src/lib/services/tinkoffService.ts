import { OrderBookEntry } from '@/components/charts/OrderBook';

// Интерфейс для ответа API
export interface ApiOrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

// Интерфейс для инструмента
interface Instrument {
  figi: string;
  ticker: string;
  isin: string;
  minPriceIncrement: number;
  lot: number;
  currency: string;
  name: string;
  type: string;
}

// Интерфейс для ответа API при поиске инструмента
interface SearchInstrumentResponse {
  payload: {
    instruments: Instrument[];
  };
  status: string;
  trackingId: string;
}

// Интерфейс для элемента стакана заявок
interface OrderbookItem {
  price: number;
  quantity: number;
}

// Интерфейс для ответа API при получении стакана заявок
interface OrderbookResponse {
  payload: {
    figi: string;
    depth: number;
    bids: OrderbookItem[];
    asks: OrderbookItem[];
    tradeStatus: string;
    minPriceIncrement: number;
    faceValue: number;
    lastPrice: number;
    closePrice: number;
    limitUp: number;
    limitDown: number;
  };
  status: string;
  trackingId: string;
}

// Класс для работы с API Тинькофф Инвестиций через fetch
export class TinkoffService {
  private token: string;
  private apiUrl: string;
  private static instance: TinkoffService;

  private constructor(token: string, apiUrl: string = 'https://api-invest.tinkoff.ru/openapi') {
    this.token = token;
    this.apiUrl = apiUrl;
  }

  // Паттерн Singleton для создания единственного экземпляра сервиса
  public static getInstance(token: string, apiUrl?: string): TinkoffService {
    if (!TinkoffService.instance) {
      TinkoffService.instance = new TinkoffService(token, apiUrl);
    }
    return TinkoffService.instance;
  }

  // Вспомогательный метод для выполнения запросов к API
  private async makeRequest<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Метод для поиска инструмента по тикеру
  public async searchInstrumentByTicker(ticker: string): Promise<Instrument | null> {
    try {
      const response = await this.makeRequest<SearchInstrumentResponse>(`/market/search/by-ticker?ticker=${ticker}`);
      
      if (response.payload.instruments.length === 0) {
        return null;
      }
      
      return response.payload.instruments[0];
    } catch (error) {
      console.error('Error searching instrument:', error);
      throw new Error(`Не удалось найти инструмент с тикером ${ticker}`);
    }
  }

  // Метод для получения стакана заявок по FIGI
  public async getOrderBookByFigi(figi: string, depth: number = 20): Promise<ApiOrderBook> {
    try {
      const response = await this.makeRequest<OrderbookResponse>(`/market/orderbook?figi=${figi}&depth=${depth}`);
      
      return {
        bids: response.payload.bids.map(bid => ({ 
          price: bid.price, 
          volume: bid.quantity 
        })),
        asks: response.payload.asks.map(ask => ({ 
          price: ask.price, 
          volume: ask.quantity 
        }))
      };
    } catch (error) {
      console.error('Error getting orderbook:', error);
      throw new Error('Не удалось получить данные стакана заявок');
    }
  }

  // Метод для получения стакана заявок по тикеру
  public async getOrderBookByTicker(ticker: string, depth: number = 20): Promise<ApiOrderBook> {
    try {
      const instrument = await this.searchInstrumentByTicker(ticker);
      
      if (!instrument) {
        throw new Error(`Инструмент с тикером ${ticker} не найден`);
      }
      
      return this.getOrderBookByFigi(instrument.figi, depth);
    } catch (error) {
      console.error('Error getting orderbook by ticker:', error);
      throw new Error(`Не удалось получить данные стакана заявок для ${ticker}`);
    }
  }

  // Метод для подписки на обновления стакана заявок
  public subscribeToOrderBook(
    figi: string, 
    depth: number = 20, 
    callback: (orderbook: ApiOrderBook) => void
  ): () => void {
    try {
      // Подписываемся на обновления стакана
      const unsubscribe = this.api.orderbook({ figi, depth }, (orderbook: ApiOrderbookResponse) => {
        // Преобразуем данные в нужный формат
        const formattedOrderbook: ApiOrderBook = {
          bids: orderbook.bids.map((bid: ApiOrderbookItem) => ({ price: bid.price, volume: bid.quantity })),
          asks: orderbook.asks.map((ask: ApiOrderbookItem) => ({ price: ask.price, volume: ask.quantity }))
        };
        
        // Вызываем колбэк с обновленными данными
        callback(formattedOrderbook);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to orderbook:', error);
      throw new Error('Не удалось подписаться на обновления стакана заявок');
    }
  }

  // Метод для получения информации о портфеле
  public async getPortfolio() {
    try {
      return await this.api.portfolio();
    } catch (error) {
      console.error('Error getting portfolio:', error);
      throw new Error('Не удалось получить данные о портфеле');
    }
  }

  // Метод для получения исторических свечей
  public async getCandles(figi: string, from: Date, to: Date, interval: string = '1min') {
    try {
      return await this.api.candlesGet({ figi, from, to, interval });
    } catch (error) {
      console.error('Error getting candles:', error);
      throw new Error('Не удалось получить исторические данные');
    }
  }
} 