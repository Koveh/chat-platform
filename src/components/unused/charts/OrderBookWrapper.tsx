'use client';

import dynamic from 'next/dynamic';
import { CardContainer } from '@/components/ui/card-container';

// Динамический импорт OrderBook для использования только на клиенте
const OrderBook = dynamic(() => import('./OrderBook').then(mod => ({ default: mod.OrderBook })), {
  ssr: false,
  loading: () => (
    <CardContainer title="Стакан заявок">
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Загрузка компонента...</p>
        </div>
      </div>
    </CardContainer>
  )
});

// Тип для пропсов OrderBook
interface OrderBookWrapperProps {
  stock: {
    symbol?: string;
    price?: number;
    currency?: string;
  };
  apiType?: 'tinkoff' | 'moex' | 'mock';
  apiKey?: string;
  apiUrl?: string;
  updateInterval?: number;
}

// Обертка, которая будет рендериться на сервере, а затем загружать OrderBook на клиенте
export function OrderBookWrapper(props: OrderBookWrapperProps) {
  return <OrderBook {...props} />;
} 