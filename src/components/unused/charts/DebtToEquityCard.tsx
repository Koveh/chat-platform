'use client';

import React from 'react';
import { Stock } from '@/lib/types/index';
import { CardContainer } from '@/components/ui/card-container';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Progress } from '@/components/ui/progress';

interface DebtToEquityCardProps {
  stock: Stock;
}

export function DebtToEquityCard({ stock }: DebtToEquityCardProps) {
  // Временные данные для демонстрации (в реальном приложении должны приходить из API)
  const debtData = [
    { year: '2018', debtToEquity: 2.32, longTermDebt: 11.0, totalEquity: 4.7 },
    { year: '2019', debtToEquity: 1.79, longTermDebt: 11.6, totalEquity: 6.5 },
    { year: '2020', debtToEquity: 0.60, longTermDebt: 9.6, totalEquity: 16.0 },
    { year: '2021', debtToEquity: 0.31, longTermDebt: 6.8, totalEquity: 22.0 },
    { year: '2022', debtToEquity: 0.12, longTermDebt: 3.6, totalEquity: 30.2 },
    { year: '2023', debtToEquity: 0.09, longTermDebt: 2.8, totalEquity: 31.0 },
  ];

  // Данные о среднем соотношении долга к капиталу в секторе
  const sectorAvgDebtToEquity = 0.45;

  // Функция для форматирования чисел в миллиардах
  const formatValue = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(1)}B`;
  };

  // Функция для форматирования соотношения долга к капиталу
  const formatRatio = (value: number) => {
    return value.toFixed(2);
  };

  // Функция для определения цвета соотношения долга к капиталу
  const getDebtToEquityColor = (value: number) => {
    if (value <= 0.3) return '#10b981'; // Зеленый (очень хорошо)
    if (value <= 0.6) return '#22c55e'; // Светло-зеленый (хорошо)
    if (value <= 1.0) return '#f59e0b'; // Оранжевый (средне)
    if (value <= 1.5) return '#f97316'; // Темно-оранжевый (плохо)
    return '#ef4444'; // Красный (очень плохо)
  };

  // Текущее соотношение долга к капиталу (последнее значение)
  const currentDebtToEquity = debtData[debtData.length - 1].debtToEquity;
  
  // Изменение соотношения долга к капиталу за последний год
  const debtToEquityChange = debtData[debtData.length - 1].debtToEquity - debtData[debtData.length - 2].debtToEquity;
  
  // Процент изменения
  const debtToEquityChangePercent = (debtToEquityChange / debtData[debtData.length - 2].debtToEquity) * 100;

  return (
    <CardContainer title="Анализ соотношения долга к капиталу">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Текущее соотношение долга к капиталу</h4>
          <div className="flex items-end">
            <p className="text-lg font-bold" style={{ color: getDebtToEquityColor(currentDebtToEquity) }}>
              {formatRatio(currentDebtToEquity)}
            </p>
            <span className={`ml-2 text-xs ${debtToEquityChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
              {debtToEquityChange < 0 ? '↓' : '↑'} {Math.abs(debtToEquityChangePercent).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Среднее по сектору</h4>
          <div className="flex items-end">
            <p className="text-lg font-bold" style={{ color: getDebtToEquityColor(sectorAvgDebtToEquity) }}>
              {formatRatio(sectorAvgDebtToEquity)}
            </p>
            <span className={`ml-2 text-xs ${currentDebtToEquity < sectorAvgDebtToEquity ? 'text-green-500' : 'text-red-500'}`}>
              {currentDebtToEquity < sectorAvgDebtToEquity ? 'Лучше среднего' : 'Хуже среднего'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Сравнение с рекомендуемыми значениями</h4>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full" 
            style={{ 
              width: `${Math.min(currentDebtToEquity * 33.3, 100)}%`,
              backgroundColor: getDebtToEquityColor(currentDebtToEquity)
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0.0 (Отлично)</span>
          <span>1.0 (Нормально)</span>
          <span>2.0+ (Рискованно)</span>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={debtData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatRatio}
              domain={[0, 'auto']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={formatValue}
              domain={[0, 'auto']}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Долг/Капитал') {
                  return [formatRatio(value as number), name];
                }
                return [formatValue(value as number), name];
              }}
            />
            <Legend />
            <ReferenceLine y={sectorAvgDebtToEquity} yAxisId="left" stroke="#8884d8" strokeDasharray="3 3" label={{ value: 'Среднее по сектору', position: 'insideBottomRight', fill: '#8884d8' }} />
            <Line 
              type="monotone" 
              dataKey="debtToEquity" 
              name="Долг/Капитал" 
              stroke="#f59e0b" 
              yAxisId="left"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="longTermDebt" 
              name="Долгосрочный долг" 
              stroke="#ef4444" 
              yAxisId="right"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="totalEquity" 
              name="Собственный капитал" 
              stroke="#10b981" 
              yAxisId="right"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Что показывает этот график?</h4>
          <p className="text-sm text-gray-600">
            График отображает динамику соотношения долга к капиталу (оранжевая линия), долгосрочного долга (красная линия) и собственного капитала (зеленая линия) компании {stock.name} за последние годы.
            Фиолетовая пунктирная линия показывает среднее значение соотношения долга к капиталу в секторе {stock.sector}.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Интерпретация соотношения долга к капиталу</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-green-50 rounded">
              <span className="font-medium text-green-700">{'<'} 0.3</span>: Очень низкий уровень долга. Консервативная финансовая политика.
            </div>
            <div className="p-2 bg-green-50 rounded">
              <span className="font-medium text-green-700">0.3 - 0.6</span>: Низкий уровень долга. Хороший баланс между долгом и капиталом.
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <span className="font-medium text-yellow-700">0.6 - 1.0</span>: Средний уровень долга. Приемлемый для большинства компаний.
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <span className="font-medium text-orange-700">1.0 - 1.5</span>: Высокий уровень долга. Может указывать на финансовые риски.
            </div>
            <div className="p-2 bg-red-50 rounded" style={{ gridColumn: 'span 2' }}>
              <span className="font-medium text-red-700">{'>'} 1.5</span>: Очень высокий уровень долга. Значительные финансовые риски.
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <p>
            <span className="font-medium">Вывод:</span> У компании {stock.name} {
              currentDebtToEquity <= 0.3 
                ? 'очень низкий уровень долга по отношению к капиталу' 
                : currentDebtToEquity <= 0.6 
                  ? 'низкий уровень долга по отношению к капиталу' 
                  : currentDebtToEquity <= 1.0 
                    ? 'средний уровень долга по отношению к капиталу' 
                    : currentDebtToEquity <= 1.5 
                      ? 'высокий уровень долга по отношению к капиталу' 
                      : 'очень высокий уровень долга по отношению к капиталу'
            } ({formatRatio(currentDebtToEquity)}), что {
              currentDebtToEquity < sectorAvgDebtToEquity 
                ? `ниже среднего значения по сектору (${formatRatio(sectorAvgDebtToEquity)})` 
                : `выше среднего значения по сектору (${formatRatio(sectorAvgDebtToEquity)})`
            }. {
              debtToEquityChange < 0 
                ? 'За последний год этот показатель улучшился, что указывает на укрепление финансового положения компании.' 
                : 'За последний год этот показатель ухудшился, что может указывать на увеличение финансовых рисков.'
            }
          </p>
        </div>
      </div>
    </CardContainer>
  );
} 