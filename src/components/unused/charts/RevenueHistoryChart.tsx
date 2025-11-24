'use client';

import React from 'react';
import type { Stock } from '@/lib/types/index';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface RevenueHistoryChartProps {
  stock: Stock;
}

export function RevenueHistoryChart({ stock }: RevenueHistoryChartProps) {
  // Получаем данные о выручке из stock.charts.revenue
  const revenueData = stock.charts.revenue;
  const grossProfitData = stock.charts.grossProfit;
  const ebitdaData = stock.charts.ebitda;
  const ebitData = stock.charts.ebit;
  const ebtData = stock.charts.ebt;
  const netIncomeData = stock.charts.netIncome;
  
  // Создаем массив лет для оси X (последние 10 лет + 3 года прогноза)
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9; // 10 лет истории
  const endYear = currentYear + 3; // 3 года прогноза
  
  // Создаем данные для графика
  const chartData = [];
  
  // Исторические данные (10 лет)
  for (let i = 0; i < 10; i++) {
    const year = startYear + i;
    chartData.push({
      year,
      totalRevenue: revenueData[9 - i] || 0,
      grossProfit: grossProfitData[9 - i] || 0,
      ebitda: ebitdaData[9 - i] || 0,
      ebit: ebitData[9 - i] || 0,
      ebt: ebtData[9 - i] || 0,
      netIncome: netIncomeData[9 - i] || 0,
      isProjection: false
    });
  }
  
  // Прогнозные данные (3 года)
  // Используем простую модель роста на основе среднего роста за последние 3 года
  const calculateGrowthRate = (data: number[]) => {
    if (data.length < 4) return 1.05; // Дефолтный рост 5%
    
    const lastYearGrowth = data[0] / data[1];
    const prevYearGrowth = data[1] / data[2];
    const thirdYearGrowth = data[2] / data[3];
    
    return (lastYearGrowth + prevYearGrowth + thirdYearGrowth) / 3;
  };
  
  const revenueGrowthRate = calculateGrowthRate(revenueData);
  const grossProfitGrowthRate = calculateGrowthRate(grossProfitData);
  const ebitdaGrowthRate = calculateGrowthRate(ebitdaData);
  const ebitGrowthRate = calculateGrowthRate(ebitData);
  const ebtGrowthRate = calculateGrowthRate(ebtData);
  const netIncomeGrowthRate = calculateGrowthRate(netIncomeData);
  
  // Добавляем прогнозные данные
  for (let i = 0; i < 3; i++) {
    const year = currentYear + 1 + i;
    const prevYearIndex: number = chartData.length - 1;
    
    chartData.push({
      year,
      totalRevenue: Math.round(chartData[prevYearIndex].totalRevenue * revenueGrowthRate),
      grossProfit: Math.round(chartData[prevYearIndex].grossProfit * grossProfitGrowthRate),
      ebitda: Math.round(chartData[prevYearIndex].ebitda * ebitdaGrowthRate),
      ebit: Math.round(chartData[prevYearIndex].ebit * ebitGrowthRate),
      ebt: Math.round(chartData[prevYearIndex].ebt * ebtGrowthRate),
      netIncome: Math.round(chartData[prevYearIndex].netIncome * netIncomeGrowthRate),
      isProjection: true
    });
  }
  
  // Форматирование чисел для тултипа
  const formatNumber = (value: number) => {
    return value.toLocaleString('ru-RU');
  };
  
  // Кастомный тултип
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isProjection = payload[0].payload.isProjection;
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">
            {label} {isProjection && '(прогноз)'}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} млн USD
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Историческая и прогнозируемая выручка</h3>
      <div className="text-sm text-muted-foreground mb-4">Годовая отчетность в миллионах USD</div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorGrossProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorEBITDA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorEBIT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorEBT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorNetIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Вертикальная линия, разделяющая историю и прогноз */}
            <ReferenceLine x={currentYear} stroke="#666" strokeDasharray="3 3" label={{ value: 'Прогноз', position: 'top', fill: '#666' }} />
            
            <Area 
              type="monotone" 
              dataKey="totalRevenue" 
              name="Total Revenue" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="grossProfit" 
              name="Gross Profit" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorGrossProfit)" 
            />
            <Area 
              type="monotone" 
              dataKey="ebitda" 
              name="EBITDA" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorEBITDA)" 
            />
            <Area 
              type="monotone" 
              dataKey="ebit" 
              name="EBIT" 
              stroke="#f59e0b" 
              fillOpacity={1} 
              fill="url(#colorEBIT)" 
            />
            <Area 
              type="monotone" 
              dataKey="ebt" 
              name="EBT" 
              stroke="#ec4899" 
              fillOpacity={1} 
              fill="url(#colorEBT)" 
            />
            <Area 
              type="monotone" 
              dataKey="netIncome" 
              name="Net Income" 
              stroke="#60a5fa" 
              fillOpacity={1} 
              fill="url(#colorNetIncome)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 