'use client';

import React, { useState } from 'react';
import { Stock } from '@/lib/types/index';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinancialChartProps {
  stock: Stock;
}

export function FinancialChart({ stock }: FinancialChartProps) {
  // Преобразуем данные для графика
  const prepareChartData = () => {
    const { charts } = stock;
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 9 + i);
    
    return years.map((year, index) => ({
      year: year.toString(),
      revenue: charts.revenue[index],
      grossProfit: charts.grossProfit[index],
      ebitda: charts.ebitda[index],
      ebit: charts.ebit[index],
      netIncome: charts.netIncome[index],
      grossMargin: (charts.grossProfit[index] / charts.revenue[index] * 100).toFixed(1),
      ebitdaMargin: (charts.ebitda[index] / charts.revenue[index] * 100).toFixed(1),
      ebitMargin: (charts.ebit[index] / charts.revenue[index] * 100).toFixed(1),
      netMargin: (charts.netIncome[index] / charts.revenue[index] * 100).toFixed(1)
    }));
  };
  
  const chartData = prepareChartData();
  
  // Форматирование для тултипа
  const formatTooltip = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M USD`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K USD`;
    return `${value} USD`;
  };
  
  // Форматирование для маржи
  const formatMargin = (value: string) => {
    return `${value}%`;
  };
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Финансовые показатели по годам</h3>
      
      <Tabs defaultValue="absolute">
        <TabsList className="mb-4">
          <TabsTrigger value="absolute">Абсолютные значения</TabsTrigger>
          <TabsTrigger value="margins">Маржинальность</TabsTrigger>
        </TabsList>
        
        <TabsContent value="absolute" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(value) => `Год: ${value}`}
              />
              <Legend />
              <Bar dataKey="revenue" name="Выручка" fill="#3b82f6" />
              <Bar dataKey="grossProfit" name="Валовая прибыль" fill="#10b981" />
              <Bar dataKey="ebitda" name="EBITDA" fill="#8b5cf6" />
              <Bar dataKey="ebit" name="EBIT" fill="#f59e0b" />
              <Bar dataKey="netIncome" name="Чистая прибыль" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="margins" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" />
              <YAxis 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={formatMargin}
                labelFormatter={(value) => `Год: ${value}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="grossMargin" 
                name="Валовая маржа" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="ebitdaMargin" 
                name="EBITDA маржа" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="ebitMargin" 
                name="EBIT маржа" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="netMargin" 
                name="Чистая маржа" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
} 