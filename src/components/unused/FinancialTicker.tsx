'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface FinancialIndicator {
  name: string;
  value: number;
  previousValue: number | null;
  changePercent: number | null;
  weeklyChangePercent: number | null;
  source: string;
  lastUpdated: string;
}

export function FinancialTicker() {
  const [indicators, setIndicators] = useState<FinancialIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIndicators() {
      try {
        setLoading(true);
        const response = await fetch('/api/financial-indicators');
        if (!response.ok) {
          throw new Error('Не удалось получить данные');
        }
        const data = await response.json();
        if (data.success) {
          setIndicators(data.data);
        } else {
          throw new Error(data.error || 'Неизвестная ошибка');
        }
      } catch (err) {
        console.error('Ошибка при загрузке финансовых индикаторов:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    }

    fetchIndicators();

    // Обновляем данные каждый час
    const intervalId = setInterval(fetchIndicators, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading && indicators.length === 0) {
    // Используем моковые данные во время загрузки
    const mockIndicators: FinancialIndicator[] = [
      { name: 'EURRUB', value: 102.54, previousValue: 102.32, changePercent: 0.22, weeklyChangePercent: 1.2, source: 'РБК', lastUpdated: new Date().toISOString() },
      { name: 'EURUSD', value: 1.0872, previousValue: 1.0845, changePercent: 0.25, weeklyChangePercent: 0.57, source: 'Bloomberg', lastUpdated: new Date().toISOString() },
      { name: 'EURUSD', value: 1.0870, previousValue: 1.0843, changePercent: 0.25, weeklyChangePercent: 0.55, source: 'Forex', lastUpdated: new Date().toISOString() },
      { name: 'USDRUB', value: 93.45, previousValue: 93.21, changePercent: 0.26, weeklyChangePercent: 0.43, source: 'Tinkoff', lastUpdated: new Date().toISOString() },
      { name: 'SP500', value: 5480.12, previousValue: 5461.75, changePercent: 0.34, weeklyChangePercent: 1.21, source: 'Yahoo', lastUpdated: new Date().toISOString() },
      { name: 'MOEX', value: 3345.67, previousValue: 3356.21, changePercent: -0.31, weeklyChangePercent: -0.85, source: 'РБК', lastUpdated: new Date().toISOString() },
      { name: 'BRENT', value: 82.45, previousValue: 83.12, changePercent: -0.81, weeklyChangePercent: -2.1, source: 'Yahoo', lastUpdated: new Date().toISOString() },
    ];
    return <TickerContent indicators={mockIndicators} />;
  }

  if (error && indicators.length === 0) {
    return (
      <div className="w-full bg-gray-100 py-3 px-4 text-center text-sm text-gray-700">
        Ошибка загрузки данных: {error}
      </div>
    );
  }

  return <TickerContent indicators={indicators} />;
}

function TickerContent({ indicators }: { indicators: FinancialIndicator[] }) {
  return (
    <div className="w-full bg-gray-100 overflow-hidden py-3">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ 
          x: [0, -2000], 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 30,
          ease: "linear"
        }}
      >
        {/* Показываем индикаторы дважды для бесшовной анимации */}
        {[...indicators, ...indicators].map((indicator, index) => (
          <div 
            key={`${indicator.name}-${indicator.source}-${index}`} 
            className="inline-flex items-center mr-8"
          >
            <span className="font-medium text-gray-700 mr-2">
              {indicator.name === 'EURUSD' ? `${indicator.name} (${indicator.source})` : indicator.name}
            </span>
            <span className="text-gray-900">{formatValue(indicator.value, indicator.name)}</span>
            
            {/* Дневное изменение */}
            {indicator.changePercent !== null && (
              <span 
                className={`ml-2 inline-flex items-center text-sm ${
                  indicator.changePercent > 0 
                    ? 'text-green-600' 
                    : indicator.changePercent < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}
              >
                {indicator.changePercent > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : indicator.changePercent < 0 ? (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                ) : null}
                {formatChangePercent(indicator.changePercent)}
              </span>
            )}
            
            {/* Недельное изменение */}
            {indicator.weeklyChangePercent !== null && (
              <span 
                className={`ml-2 inline-flex items-center text-xs ${
                  indicator.weeklyChangePercent > 0 
                    ? 'text-green-600' 
                    : indicator.weeklyChangePercent < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}
              >
                (нед:&nbsp;
                {indicator.weeklyChangePercent > 0 ? (
                  <ArrowUpIcon className="h-2 w-2 mr-1" />
                ) : indicator.weeklyChangePercent < 0 ? (
                  <ArrowDownIcon className="h-2 w-2 mr-1" />
                ) : null}
                {formatChangePercent(indicator.weeklyChangePercent)})
              </span>
            )}
            
            {indicator.name !== 'EURUSD' && <span className="ml-2 text-xs text-gray-500">{indicator.source}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function formatValue(value: number, name: string): string {
  // Форматируем значение в зависимости от типа индикатора
  if (name === 'EURUSD') {
    return value.toFixed(4);
  } else if (name === 'SP500' || name === 'MOEX') {
    return value.toFixed(2);
  } else if (name === 'BRENT') {
    return `$${value.toFixed(2)}`;
  } else {
    return `${value.toFixed(2)} ₽`;
  }
}

function formatChangePercent(percent: number | null): string {
  if (percent === null) return '';
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
} 