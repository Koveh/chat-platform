'use client';

import React, { useState, useEffect } from 'react';
import { Stock } from '@/lib/types/index';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MetricExplanation } from '@/components/MetricExplanation';

interface ExpensesChartProps {
  stock: Stock;
}

export function ExpensesChart({ stock }: ExpensesChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Определение мобильного устройства
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const { expenses } = stock.charts;
  
  const data = [
    { name: 'R & D', value: expenses.rnd, color: '#ef4444' },
    { name: 'G & A', value: expenses.ga, color: '#f59e0b' },
    { name: 'D & A', value: expenses.da, color: '#3b82f6' },
    { name: 'Налоги', value: expenses.tax, color: '#10b981' },
    { name: 'Проценты', value: expenses.interest, color: '#8b5cf6' }
  ];
  
  // Фильтруем данные, чтобы показывать только положительные значения
  const filteredData = data.filter(item => item.value > 0);
  
  // Функция для определения цвета значения (хорошее/плохое)
  const getValueColor = (value: number, companyValue: number) => {
    if (value > companyValue * 1.1) return 'text-emerald-600'; // Значительно лучше
    if (value > companyValue) return 'text-emerald-500'; // Лучше
    if (value > companyValue * 0.9) return 'text-amber-500'; // Немного хуже
    return 'text-red-500'; // Значительно хуже
  };
  
  // Кастомный тултип
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let description = '';
      
      switch(data.name) {
        case 'Налоги':
          description = 'Налоговые расходы компании (% от выручки)';
          break;
        case 'Проценты':
          description = 'Процентные расходы по долгам (% от выручки)';
          break;
        case 'R & D':
          description = 'Расходы на исследования и разработки (% от выручки)';
          break;
        case 'G & A':
          description = 'Общие и административные расходы (% от выручки)';
          break;
        case 'D & A':
          description = 'Амортизация и износ (% от выручки)';
          break;
      }
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-slate-200">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{data.value}% от выручки</p>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
      );
    }
    return null;
  };
  
  // Кастомная легенда
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
            <div className="text-xs whitespace-nowrap">{entry.value} <span className="font-medium">{entry.payload.value}%</span></div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-3`}>Операционные и другие расходы</h3>
      <div className="text-xs text-slate-500">За исключением себестоимости товаров или услуг (COGS)</div>
      <div className="text-xs text-slate-500 mb-4">Последняя отчетность за 12 месяцев (TTM) в процентах</div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isMobile ? 60 : 80}
              fill="#8884d8"
              dataKey="value"
              label={({ value }) => `${value}%`}
              isAnimationActive={false}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-1">
        <div className="p-2 rounded-lg bg-slate-100">
          <div className="text-xs text-slate-500 mb-1">Маржа по компании</div>
          {/* <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>По компании</div> */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center gap-1">
                <span className="whitespace-nowrap">Gross</span>
                <MetricExplanation metricKey="grossMargin" iconOnly={true} />
              </span>
              <span className="text-xs font-medium">{stock.financials.grossMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center gap-1">
                <span className="whitespace-nowrap">EBITDA</span>
                <MetricExplanation metricKey="ebitdaMargin" iconOnly={true} />
              </span>
              <span className="text-xs font-medium">{stock.financials.ebitdaMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center gap-1">
                <span className="whitespace-nowrap">EBIT</span>
                <MetricExplanation metricKey="ebitMargin" iconOnly={true} />
              </span>
              <span className="text-xs font-medium">{stock.financials.ebitMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center gap-1">
                <span className="whitespace-nowrap">EBT</span>
                <MetricExplanation metricKey="ebtMargin" iconOnly={true} />
              </span>
              <span className="text-xs font-medium">{stock.financials.ebtMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center gap-1">
                <span className="whitespace-nowrap">Net</span>
                <MetricExplanation metricKey="netMargin" iconOnly={true} />
              </span>
              <span className="text-xs font-medium">{stock.financials.netMargin}%</span>
            </div>
          </div>
        </div>
        
        <div className="p-2 rounded-lg bg-slate-100">
          <div className="text-xs text-slate-500 mb-1">Маржа по индустрии</div>
          {/* <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>По индустрии</div> */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs">Gross</span>
              <span className={`text-xs font-medium ${getValueColor(40.74, stock.financials.grossMargin)}`}>40.74%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">EBITDA</span>
              <span className={`text-xs font-medium ${getValueColor(11.17, stock.financials.ebitdaMargin)}`}>11.17%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">EBIT</span>
              <span className={`text-xs font-medium ${getValueColor(7.45, stock.financials.ebitMargin)}`}>7.45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">EBT</span>
              <span className={`text-xs font-medium ${getValueColor(8.72, stock.financials.ebtMargin)}`}>8.72%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Net</span>
              <span className={`text-xs font-medium ${getValueColor(7.26, stock.financials.netMargin)}`}>7.26%</span>
            </div>
          </div>
        </div>
        
        <div className="p-2 rounded-lg bg-slate-100">
          <div className="text-xs text-slate-500 mb-1">Маржа по сектору</div>
          {/* <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>По сектору</div> */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs">Gross</span>
              <span className={`text-xs font-medium ${getValueColor(41.4, stock.financials.grossMargin)}`}>41.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">EBITDA</span>
              <span className={`text-xs font-medium ${getValueColor(12.38, stock.financials.ebitdaMargin)}`}>12.38%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">EBIT</span>
              <span className={`text-xs font-medium ${getValueColor(8.78, stock.financials.ebitMargin)}`}>8.78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">EBT</span>
              <span className={`text-xs font-medium ${getValueColor(9.86, stock.financials.ebtMargin)}`}>9.86%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Net</span>
              <span className={`text-xs font-medium ${getValueColor(8.42, stock.financials.netMargin)}`}>8.42%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-slate-500 text-center">
        Все данные аналитики представлены по стране «США»
      </div>
    </div>
  );
} 