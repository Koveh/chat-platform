'use client';

import React from 'react';
import { Stock } from '@/lib/types/index';
import { CardContainer } from '@/components/ui/card-container';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, ComposedChart } from 'recharts';

interface CashFlowVsEarningsCardProps {
  stock: Stock;
}

export function CashFlowVsEarningsCard({ stock }: CashFlowVsEarningsCardProps) {
  // Временные данные для демонстрации (в реальном приложении должны приходить из API)
  const cashFlowData = [
    { year: '2018', earnings: 312, freeCashFlow: 280, fcfToEarnings: 0.9 },
    { year: '2019', earnings: 862, freeCashFlow: 968, fcfToEarnings: 1.12 },
    { year: '2020', earnings: 721, freeCashFlow: 2792, fcfToEarnings: 3.87 },
    { year: '2021', earnings: 5519, freeCashFlow: 3458, fcfToEarnings: 0.63 },
    { year: '2022', earnings: 12583, freeCashFlow: 7582, fcfToEarnings: 0.6 },
    { year: '2023', earnings: 15082, freeCashFlow: 4358, fcfToEarnings: 0.29 },
  ];

  // Функция для форматирования чисел в миллионах/миллиардах
  const formatValue = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value}`;
  };

  // Функция для форматирования соотношения FCF/Earnings
  const formatRatio = (value: number) => {
    return value.toFixed(2);
  };

  // Функция для определения цвета соотношения FCF/Earnings
  const getRatioColor = (value: number) => {
    if (value >= 1.2) return '#10b981'; // Зеленый (очень хорошо)
    if (value >= 0.8) return '#22c55e'; // Светло-зеленый (хорошо)
    if (value >= 0.5) return '#f59e0b'; // Оранжевый (средне)
    return '#ef4444'; // Красный (плохо)
  };

  // Расчет средних значений
  const avgEarnings = cashFlowData.reduce((sum, item) => sum + item.earnings, 0) / cashFlowData.length;
  const avgFreeCashFlow = cashFlowData.reduce((sum, item) => sum + item.freeCashFlow, 0) / cashFlowData.length;
  const avgRatio = cashFlowData.reduce((sum, item) => sum + item.fcfToEarnings, 0) / cashFlowData.length;

  return (
    <CardContainer title="Анализ свободного денежного потока и прибыли">
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Средняя чистая прибыль</h4>
          <p className="text-lg font-bold">{formatValue(avgEarnings)}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Средний FCF</h4>
          <p className="text-lg font-bold">{formatValue(avgFreeCashFlow)}</p>
        </div>
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${getRatioColor(avgRatio)}15` }}>
          <h4 className="text-sm font-medium mb-1">Среднее соотношение</h4>
          <p className="text-lg font-bold" style={{ color: getRatioColor(avgRatio) }}>{formatRatio(avgRatio)}</p>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={cashFlowData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatValue}
              domain={[0, 'auto']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={formatRatio}
              domain={[0, 'auto']}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Чистая прибыль' || name === 'Свободный денежный поток') {
                  return [formatValue(value as number), name];
                }
                return [formatRatio(value as number), name];
              }}
            />
            <Legend />
            <Bar 
              dataKey="earnings" 
              name="Чистая прибыль" 
              fill="#3b82f6" 
              yAxisId="left"
              barSize={20}
            />
            <Bar 
              dataKey="freeCashFlow" 
              name="Свободный денежный поток" 
              fill="#10b981" 
              yAxisId="left"
              barSize={20}
            />
            <Line 
              type="monotone" 
              dataKey="fcfToEarnings" 
              name="FCF/Earnings" 
              stroke="#f59e0b" 
              yAxisId="right"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Что показывает этот график?</h4>
          <p className="text-sm text-gray-600">
            График сравнивает чистую прибыль (синие столбцы) и свободный денежный поток (зеленые столбцы) компании {stock.name} за последние годы. 
            Оранжевая линия показывает соотношение FCF/Earnings, которое является важным индикатором качества прибыли.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Интерпретация соотношения FCF/Earnings</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-green-50 rounded">
              <span className="font-medium text-green-700">{'>'} 1.0</span>: Отличное качество прибыли. FCF превышает чистую прибыль.
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <span className="font-medium text-yellow-700">0.5 - 1.0</span>: Хорошее качество прибыли. FCF составляет значительную часть прибыли.
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <span className="font-medium text-orange-700">0.3 - 0.5</span>: Среднее качество прибыли. Возможны проблемы с конвертацией прибыли в денежный поток.
            </div>
            <div className="p-2 bg-red-50 rounded">
              <span className="font-medium text-red-700">{'<'} 0.3</span>: Низкое качество прибыли. Компания не конвертирует прибыль в денежный поток.
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <p>
            <span className="font-medium">Вывод:</span> За последние годы у {stock.name} наблюдается {avgRatio >= 0.8 ? 'хорошее' : avgRatio >= 0.5 ? 'среднее' : 'низкое'} соотношение FCF/Earnings 
            со средним значением {formatRatio(avgRatio)}. {
              avgRatio >= 0.8 
                ? 'Это указывает на высокое качество прибыли и эффективную конвертацию бухгалтерской прибыли в реальный денежный поток.' 
                : avgRatio >= 0.5 
                  ? 'Это указывает на приемлемое качество прибыли, но есть возможности для улучшения.' 
                  : 'Это может указывать на проблемы с качеством прибыли и требует дальнейшего анализа.'
            }
          </p>
        </div>
      </div>
    </CardContainer>
  );
} 