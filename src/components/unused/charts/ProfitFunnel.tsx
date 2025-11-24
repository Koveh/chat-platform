'use client';

import React from 'react';
import type { Stock } from '@/lib/types/index';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';

interface ProfitFunnelProps {
  stock: Stock;
}

export function ProfitFunnel({ stock }: ProfitFunnelProps) {
  const { funnel } = stock;
  
  // Расчет процентов для каждого уровня воронки
  const grossProfitPercent = (funnel.grossProfit / funnel.totalRevenue * 100).toFixed(2);
  const ebitdaPercent = (funnel.ebitda / funnel.totalRevenue * 100).toFixed(2);
  const ebitPercent = (funnel.ebit / funnel.totalRevenue * 100).toFixed(2);
  const ebtPercent = (funnel.ebt / funnel.totalRevenue * 100).toFixed(2);
  const netIncomePercent = (funnel.netIncome / funnel.totalRevenue * 100).toFixed(2);
  
  // Форматирование чисел
  const formatNumber = (num: number): string => {
    return Math.abs(num).toLocaleString('ru-RU');
  };
  
  // Определение цвета для чистой прибыли в зависимости от значения
  const netIncomeColor = funnel.netIncome >= 0 ? '#ef4444' : '#dc2626';
  
  // Данные для воронки
  const funnelData = [
    {
      name: 'Выручка',
      value: funnel.totalRevenue || 0,
      percent: 100,
      fill: '#3b82f6'
    },
    {
      name: 'Валовая прибыль',
      value: Math.abs(funnel.grossProfit || 0),
      percent: parseFloat(grossProfitPercent) || 0,
      fill: '#10b981',
      isNegative: (funnel.grossProfit || 0) < 0
    },
    {
      name: 'EBITDA',
      value: Math.abs(funnel.ebitda || 0),
      percent: parseFloat(ebitdaPercent) || 0,
      fill: '#8b5cf6',
      isNegative: (funnel.ebitda || 0) < 0
    },
    {
      name: 'EBIT',
      value: Math.abs(funnel.ebit || 0),
      percent: parseFloat(ebitPercent) || 0,
      fill: '#f59e0b',
      isNegative: (funnel.ebit || 0) < 0
    },
    {
      name: 'EBT',
      value: Math.abs(funnel.ebt || 0),
      percent: parseFloat(ebtPercent) || 0,
      fill: '#ec4899',
      isNegative: (funnel.ebt || 0) < 0
    },
    {
      name: 'Чистая прибыль',
      value: Math.abs(funnel.netIncome || 0),
      percent: parseFloat(netIncomePercent) || 0,
      fill: netIncomeColor,
      isNegative: (funnel.netIncome || 0) < 0
    }
  ];
  
  // Кастомный тултип
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isNegative = data.isNegative;
      const sign = isNegative ? '-' : '';
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{sign}{formatNumber(data.value)} USD</p>
          <p className="text-sm text-muted-foreground">{data.percent.toFixed(2)}% от выручки</p>
        </div>
      );
    }
    return null;
  };
  
  // Кастомная форма для последнего элемента воронки (прямоугольник)
  const CustomShape = (props: any) => {
    const { x, y, width, height, index, payload, points } = props;
    
    // Проверяем, что все необходимые параметры определены
    if (x === undefined || y === undefined || width === undefined || height === undefined) {
      return null;
    }
    
    // Если это последний элемент (чистая прибыль), рисуем прямоугольник
    if (index === funnelData.length - 1) {
      return (
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={payload?.fill || '#ef4444'}
        />
      );
    }
    
    // Проверяем, что points существует и содержит необходимые элементы
    if (!points || points.length < 4 || !points.every((p: any) => p && typeof p.x === 'number' && typeof p.y === 'number')) {
      return null;
    }
    
    // Для остальных элементов используем стандартную форму трапеции
    const path = `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}L${points[2].x},${points[2].y}L${points[3].x},${points[3].y}Z`;
    
    return <path d={path} fill={payload?.fill || '#3b82f6'} />;
  };
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Конверсия выручки в чистую прибыль</h3>
      <div className="text-sm text-muted-foreground mb-4">Последняя отчетность за 12 месяцев (TTM) в миллионах USD</div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
              labelLine={false}
              shape={<CustomShape />}
            >
              <LabelList
                position="right"
                fill="#000"
                stroke="none"
                dataKey="name"
              />
              <LabelList
                position="right"
                fill="#666"
                stroke="none"
                dataKey={(entry) => `${entry.isNegative ? '-' : ''}${formatNumber(entry.value)}`}
                offset={60}
              />
              <LabelList
                position="right"
                fill="#666"
                stroke="none"
                dataKey={(entry) => `${entry.percent.toFixed(2)}%`}
                offset={140}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
        <div className="p-1 bg-blue-100 rounded">
          <span className="font-medium">Выручка</span>
        </div>
        <div className="p-1 bg-green-100 rounded">
          <span className="font-medium">Валовая прибыль</span>
        </div>
        <div className="p-1 bg-purple-100 rounded">
          <span className="font-medium">EBITDA</span>
        </div>
        <div className="p-1 bg-orange-100 rounded">
          <span className="font-medium">EBIT</span>
        </div>
        <div className="p-1 bg-pink-100 rounded">
          <span className="font-medium">EBT</span>
        </div>
        <div className={`p-1 ${funnel.netIncome >= 0 ? 'bg-red-100' : 'bg-red-200'} rounded`}>
          <span className="font-medium">Чистая прибыль</span>
          {funnel.netIncome < 0 && <span className="ml-1 text-red-600">(отрицательная)</span>}
        </div>
      </div>
    </div>
  );
} 