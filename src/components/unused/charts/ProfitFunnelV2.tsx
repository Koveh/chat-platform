'use client';

import React from 'react';
import type { Stock } from '@/lib/types/index';
import { MetricExplanation } from '@/components/MetricExplanation';
import { CardContainer } from '@/components/ui/card-container';

interface ProfitFunnelV2Props {
  stock: Stock;
}

export function ProfitFunnelV2({ stock }: ProfitFunnelV2Props) {
  const { funnel } = stock;
  
  // Расчет процентов для каждого уровня воронки
  const grossProfitPercent = (funnel.grossProfit / funnel.totalRevenue * 100).toFixed(2);
  const ebitdaPercent = (funnel.ebitda / funnel.totalRevenue * 100).toFixed(2);
  const ebitPercent = (funnel.ebit / funnel.totalRevenue * 100).toFixed(2);
  const ebtPercent = (funnel.ebt / funnel.totalRevenue * 100).toFixed(2);
  const netIncomePercent = (funnel.netIncome / funnel.totalRevenue * 100).toFixed(2);
  
  // Расчет процентов конверсии между уровнями
  const grossProfitConversion = (funnel.grossProfit / funnel.totalRevenue * 100).toFixed(2);
  const ebitdaConversion = (funnel.ebitda / funnel.grossProfit * 100).toFixed(2);
  const ebitConversion = (funnel.ebit / funnel.ebitda * 100).toFixed(2);
  const ebtConversion = (funnel.ebt / funnel.ebit * 100).toFixed(2);
  const netIncomeConversion = (funnel.netIncome / funnel.ebt * 100).toFixed(2);
  
  // Форматирование чисел
  const formatNumber = (num: number): string => {
    return Math.abs(num).toLocaleString('ru-RU');
  };
  
  // Определение минимального размера для отображения текста внутри блока
  const MIN_WIDTH_FOR_TEXT = 150; // в пикселях
  
  // Функция для определения, нужно ли отображать текст внутри блока
  const shouldShowText = (percentOfTotal: number): boolean => {
    return percentOfTotal > 15; // Если блок занимает менее 15% от общего размера, не показываем текст внутри
  };
  
  // Определение цветов для блоков
  const getBlockColor = (value: number, isNetIncome: boolean = false) => {
    if (value < 0) return 'bg-red-500 text-white'; // Красный только для отрицательных значений
    if (isNetIncome) return 'bg-green-500 text-white'; // Зеленый для положительной чистой прибыли
    
    // Для остальных положительных значений используем разные оттенки синего
    return [
      'bg-blue-500 text-white',
      'bg-blue-400 text-white',
      'bg-blue-300 text-white',
      'bg-blue-200 text-black',
      'bg-blue-100 text-black'
    ];
  };
  
  const colors = getBlockColor(1);
  const netIncomeColor = funnel.netIncome < 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
  
  // Расчет ширины блоков в процентах от общей ширины
  // Делаем воронку более выраженной, постепенно сужая блоки
  const totalWidth = 100;
  const grossProfitWidth = Math.min(90, (funnel.grossProfit / funnel.totalRevenue) * totalWidth);
  const ebitdaWidth = Math.min(80, (funnel.ebitda / funnel.totalRevenue) * totalWidth);
  const ebitWidth = Math.min(70, (funnel.ebit / funnel.totalRevenue) * totalWidth);
  const ebtWidth = Math.min(60, (funnel.ebt / funnel.totalRevenue) * totalWidth);
  const netIncomeWidth = Math.min(50, (Math.abs(funnel.netIncome) / funnel.totalRevenue) * totalWidth);
  
  return (
    <CardContainer title="Конверсия выручки в чистую прибыль">
      <div className="text-sm text-muted-foreground mb-4">Последняя отчетность за 12 месяцев (TTM) в миллионах USD</div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Воронка */}
          <div className="relative">
            {/* Total Revenue */}
            <div className={`${colors[0]} p-3 text-center rounded-t-lg mb-1`} style={{ width: '100%' }}>
              <div className="font-medium">
                <MetricExplanation metricKey="totalRevenue" type="financial">
                  Total Revenue
                </MetricExplanation>
              </div>
              <div className="text-lg font-bold">{formatNumber(funnel.totalRevenue)}</div>
              <div className="text-xs">100%</div>
            </div>
            
            {/* Gross Profit */}
            <div className="flex justify-center">
              <div 
                className={`${colors[1]} p-3 text-center mb-1 relative`} 
                style={{ width: `${grossProfitWidth}%` }}
              >
                <div className="font-medium">
                  <MetricExplanation metricKey="grossProfit" type="financial">
                    Gross Profit
                  </MetricExplanation>
                </div>
                {shouldShowText(parseFloat(grossProfitPercent)) && (
                  <>
                    <div className="text-lg font-bold">{formatNumber(funnel.grossProfit)}</div>
                    <div className="text-xs">{grossProfitPercent}% от выручки</div>
                  </>
                )}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-blue-100 px-2 py-1 rounded text-xs text-black">
                  {grossProfitConversion}%
                </div>
              </div>
            </div>
            
            {/* EBITDA */}
            <div className="flex justify-center">
              <div 
                className={`${colors[2]} p-3 text-center mb-1 relative`} 
                style={{ width: `${ebitdaWidth}%` }}
              >
                <div className="font-medium">
                  <MetricExplanation metricKey="ebitda" type="financial">
                    EBITDA
                  </MetricExplanation>
                </div>
                {shouldShowText(parseFloat(ebitdaPercent)) && (
                  <>
                    <div className="text-lg font-bold">{formatNumber(funnel.ebitda)}</div>
                    <div className="text-xs">{ebitdaPercent}% от выручки</div>
                  </>
                )}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-blue-100 px-2 py-1 rounded text-xs text-black">
                  {ebitdaConversion}%
                </div>
              </div>
            </div>
            
            {/* EBIT */}
            <div className="flex justify-center">
              <div 
                className={`${colors[3]} p-3 text-center mb-1 relative`} 
                style={{ width: `${ebitWidth}%` }}
              >
                <div className="font-medium">
                  <MetricExplanation metricKey="ebit" type="financial">
                    EBIT
                  </MetricExplanation>
                </div>
                {shouldShowText(parseFloat(ebitPercent)) && (
                  <>
                    <div className="text-lg font-bold">{formatNumber(funnel.ebit)}</div>
                    <div className="text-xs">{ebitPercent}% от выручки</div>
                  </>
                )}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-blue-100 px-2 py-1 rounded text-xs text-black">
                  {ebitConversion}%
                </div>
              </div>
            </div>
            
            {/* EBT */}
            <div className="flex justify-center">
              <div 
                className={`${colors[4]} p-3 text-center mb-1 relative`} 
                style={{ width: `${ebtWidth}%` }}
              >
                <div className="font-medium">
                  <MetricExplanation metricKey="ebt" type="financial">
                    EBT
                  </MetricExplanation>
                </div>
                {shouldShowText(parseFloat(ebtPercent)) && (
                  <>
                    <div className="text-lg font-bold">{formatNumber(funnel.ebt)}</div>
                    <div className="text-xs">{ebtPercent}% от выручки</div>
                  </>
                )}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-blue-100 px-2 py-1 rounded text-xs text-black">
                  {ebtConversion}%
                </div>
              </div>
            </div>
            
            {/* Net Income */}
            <div className="flex justify-center">
              <div 
                className={`${netIncomeColor} p-3 text-center rounded-b-lg relative`} 
                style={{ width: `${netIncomeWidth}%` }}
              >
                <div className="font-medium">
                  <MetricExplanation metricKey="netIncome" type="financial">
                    Net Income
                  </MetricExplanation>
                </div>
                {shouldShowText(parseFloat(netIncomePercent)) && (
                  <>
                    <div className="text-lg font-bold">
                      {funnel.netIncome < 0 && '-'}
                      {formatNumber(funnel.netIncome)}
                    </div>
                    <div className="text-xs">{netIncomePercent}% от выручки</div>
                  </>
                )}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-blue-100 px-2 py-1 rounded text-xs text-black">
                  {netIncomeConversion}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Легенда для маленьких блоков */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
            {!shouldShowText(parseFloat(grossProfitPercent)) && (
              <div className="p-1 bg-blue-100 rounded">
                <span className="font-medium">Gross Profit: {formatNumber(funnel.grossProfit)}</span>
              </div>
            )}
            {!shouldShowText(parseFloat(ebitdaPercent)) && (
              <div className="p-1 bg-blue-100 rounded">
                <span className="font-medium">EBITDA: {formatNumber(funnel.ebitda)}</span>
              </div>
            )}
            {!shouldShowText(parseFloat(ebitPercent)) && (
              <div className="p-1 bg-blue-100 rounded">
                <span className="font-medium">EBIT: {formatNumber(funnel.ebit)}</span>
              </div>
            )}
            {!shouldShowText(parseFloat(ebtPercent)) && (
              <div className="p-1 bg-blue-100 rounded">
                <span className="font-medium">EBT: {formatNumber(funnel.ebt)}</span>
              </div>
            )}
            {!shouldShowText(parseFloat(netIncomePercent)) && (
              <div className="p-1 bg-blue-100 rounded">
                <span className="font-medium">
                  Net Income: {funnel.netIncome < 0 && '-'}{formatNumber(funnel.netIncome)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center text-muted-foreground">
        Процентные значения справа показывают конверсию между уровнями воронки
      </div>
    </CardContainer>
  );
} 