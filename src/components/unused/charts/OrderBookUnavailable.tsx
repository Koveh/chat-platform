'use client';

import React from 'react';
import { CardContainer } from '@/components/ui/card-container';
import { MetricExplanation } from '@/components/MetricExplanation';

interface OrderBookUnavailableProps {
  symbol: string;
  apiType: string;
}

export function OrderBookUnavailable({ symbol, apiType }: OrderBookUnavailableProps) {
  return (
    <CardContainer 
      title={
        <div className="flex items-center space-x-1">
          <span>Стакан заявок</span>
          <MetricExplanation metricKey="orderBook" iconOnly={true} />
        </div>
      }
    >
      <div className="h-80 flex items-center justify-center backdrop-blur-sm bg-white/30 rounded-lg">
        <div className="text-center p-6 max-w-md">
          <div className="mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Тикер {symbol} недоступен в {apiType}</h3>
          <p className="text-gray-500 mb-4">
            К сожалению, данные стакана заявок для этого тикера недоступны через выбранный API. 
            Это может быть связано с тем, что инструмент не торгуется на соответствующей бирже или 
            API не предоставляет данные для этого инструмента.
          </p>
          <div className="text-sm text-blue-600 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="font-medium mb-1">💡 Совет от AI-ассистента:</p>
            <p>Попробуйте использовать другой API для получения данных стакана заявок. 
            Для российских акций рекомендуется Tinkoff API или MOEX API, 
            для международных - Finnhub или IEX Cloud.</p>
          </div>
        </div>
      </div>
    </CardContainer>
  );
} 