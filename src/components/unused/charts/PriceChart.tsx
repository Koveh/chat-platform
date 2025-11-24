'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Stock } from '@/lib/types/index';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface PriceChartProps {
  stock: Stock;
}

// Генерируем моковые данные для графика цены
const generatePriceData = (stock: Stock, days: number = 180) => {
  const data = [];
  const startPrice = stock.price - (stock.price * 0.2); // Начинаем с цены на 20% ниже текущей
  const volatility = 0.01; // Волатильность
  
  let currentPrice = startPrice;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Случайное изменение цены
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = currentPrice + change;
    
    // Добавляем тренд вверх к текущей цене
    const trend = (stock.price - startPrice) / days;
    currentPrice += trend;
    
    // Объем торгов (случайный)
    const volume = Math.floor(Math.random() * 10000000) + 5000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      volume: volume
    });
  }
  
  return data;
};

export function PriceChart({ stock }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '5Y'>('6M');
  const [curveType, setCurveType] = useState<'curved' | 'linear'>('linear');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['price']);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<any>(null);
  const [currentPoint, setCurrentPoint] = useState<any>(null);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [maSettings, setMaSettings] = useState({
    ma1: 20,
    ma2: 50,
    ma3: 200
  });
  
  // Генерируем данные в зависимости от выбранного таймфрейма
  const getDaysForTimeframe = () => {
    switch (timeframe) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case '5Y': return 1825;
      default: return 180;
    }
  };
  
  const priceData = generatePriceData(stock, getDaysForTimeframe());
  
  // Добавляем скользящие средние
  const addMovingAverages = (data: any[]) => {
    const ma1 = calculateMA(maSettings.ma1, data);
    const ma2 = calculateMA(maSettings.ma2, data);
    const ma3 = calculateMA(maSettings.ma3, data);
    
    return data.map((item, index) => ({
      ...item,
      [`ma${maSettings.ma1}`]: ma1[index],
      [`ma${maSettings.ma2}`]: ma2[index],
      [`ma${maSettings.ma3}`]: ma3[index]
    }));
  };
  
  const calculateMA = (days: number, data: any[]) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < days - 1) {
        result.push(undefined);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < days; j++) {
        sum += data[i - j].price;
      }
      result.push(parseFloat((sum / days).toFixed(2)));
    }
    return result;
  };
  
  const dataWithMA = addMovingAverages(priceData);
  
  // Создаем стабильную копию данных для предотвращения ререндеринга и анимаций
  const [stableData, setStableData] = useState<any[]>([]);
  
  // Используем useMemo для кэширования данных и предотвращения ререндеринга
  const memoizedData = useMemo(() => {
    return dataWithMA;
  }, [timeframe, maSettings.ma1, maSettings.ma2, maSettings.ma3, curveType, showVolume]);
  
  useEffect(() => {
    setStableData(memoizedData);
  }, [memoizedData]);
  
  // Форматирование для тултипа
  const formatTooltip = (value: number) => {
    return `${value.toFixed(2)} ${stock.currency}`;
  };
  
  // Форматирование для объема
  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  
  // Обработчики для сравнения точек
  const handleMouseDown = (data: any) => {
    if (!data || !data.activePayload) return;
    setStartPoint(data.activePayload[0].payload);
    setComparisonMode(true);
  };
  
  const handleMouseMove = (data: any) => {
    if (!comparisonMode || !data || !data.activePayload) return;
    setCurrentPoint(data.activePayload[0].payload);
  };
  
  const handleMouseUp = () => {
    setComparisonMode(false);
  };
  
  // Создаем стабильные обработчики событий ПОСЛЕ их объявления
  const memoizedHandleMouseDown = useMemo(() => handleMouseDown, []);
  const memoizedHandleMouseMove = useMemo(() => handleMouseMove, [comparisonMode]);
  const memoizedHandleMouseUp = useMemo(() => handleMouseUp, []);
  
  // Расчет разницы между точками
  const calculateDifference = () => {
    if (!startPoint || !currentPoint) return null;
    
    const startPrice = startPoint.price;
    const currentPrice = currentPoint.price;
    const absoluteDiff = currentPrice - startPrice;
    const percentDiff = (absoluteDiff / startPrice) * 100;
    
    return {
      absoluteDiff: absoluteDiff.toFixed(2),
      percentDiff: percentDiff.toFixed(2),
      isPositive: absoluteDiff >= 0
    };
  };
  
  const difference = calculateDifference();
  
  // Переключение индикаторов
  const toggleIndicator = (indicator: string) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };
  
  // Обновление настроек MA
  const updateMASetting = (maKey: 'ma1' | 'ma2' | 'ma3', value: number) => {
    setMaSettings(prev => ({
      ...prev,
      [maKey]: value
    }));
  };
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">График цены {stock.symbol}</h3>
        <div className="flex space-x-1">
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '1M' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('1M')}
          >
            1M
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '3M' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('3M')}
          >
            3M
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '6M' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('6M')}
          >
            6M
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '1Y' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('1Y')}
          >
            1Y
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '5Y' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('5Y')}
          >
            5Y
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch 
              id="curve-type" 
              checked={curveType === 'curved'} 
              onCheckedChange={(checked: boolean) => setCurveType(checked ? 'curved' : 'linear')}
            />
            <Label htmlFor="curve-type">Кривая</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-volume" 
              checked={showVolume} 
              onCheckedChange={setShowVolume}
            />
            <Label htmlFor="show-volume">Объем</Label>
          </div>
        </div>
      </div>
      
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs">MA {maSettings.ma1}</Label>
            <Switch 
              id="ma1" 
              checked={selectedIndicators.includes(`ma${maSettings.ma1}`)} 
              onCheckedChange={() => toggleIndicator(`ma${maSettings.ma1}`)}
              className="scale-75"
            />
          </div>
          <Slider 
            value={[maSettings.ma1]} 
            min={5} 
            max={50} 
            step={1} 
            onValueChange={(value: number[]) => updateMASetting('ma1', value[0])}
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs">MA {maSettings.ma2}</Label>
            <Switch 
              id="ma2" 
              checked={selectedIndicators.includes(`ma${maSettings.ma2}`)} 
              onCheckedChange={() => toggleIndicator(`ma${maSettings.ma2}`)}
              className="scale-75"
            />
          </div>
          <Slider 
            value={[maSettings.ma2]} 
            min={20} 
            max={100} 
            step={5} 
            onValueChange={(value: number[]) => updateMASetting('ma2', value[0])}
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs">MA {maSettings.ma3}</Label>
            <Switch 
              id="ma3" 
              checked={selectedIndicators.includes(`ma${maSettings.ma3}`)} 
              onCheckedChange={() => toggleIndicator(`ma${maSettings.ma3}`)}
              className="scale-75"
            />
          </div>
          <Slider 
            value={[maSettings.ma3]} 
            min={100} 
            max={300} 
            step={10} 
            onValueChange={(value: number[]) => updateMASetting('ma3', value[0])}
            className="h-2"
          />
        </div>
      </div>
      
      {difference && (
        <div className={`mb-4 p-2 rounded ${difference.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Изменение</span>
            <span className={`text-sm font-bold ${difference.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {difference.isPositive ? '+' : ''}{difference.absoluteDiff} {stock.currency} ({difference.isPositive ? '+' : ''}{difference.percentDiff}%)
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>От: {startPoint?.date}</span>
            <span>До: {currentPoint?.date}</span>
          </div>
        </div>
      )}
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={stableData.length > 0 ? stableData : memoizedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseDown={memoizedHandleMouseDown}
            onMouseMove={memoizedHandleMouseMove}
            onMouseUp={memoizedHandleMouseUp}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
              }}
              minTickGap={30}
            />
            <YAxis 
              yAxisId="left"
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            {showVolume && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickFormatter={formatVolume}
              />
            )}
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <Tooltip 
              formatter={(value, name: string) => {
                if (name === 'Цена') return formatTooltip(value as number);
                if (name === 'Объем') return formatVolume(value as number);
                if (typeof name === 'string' && name.startsWith('MA')) return formatTooltip(value as number);
                return value;
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
              }}
              isAnimationActive={false}
            />
            
            {startPoint && currentPoint && (
              <ReferenceArea 
                x1={startPoint.date} 
                x2={currentPoint.date} 
                strokeOpacity={0.3} 
                fill={startPoint.price <= currentPoint.price ? "#10b981" : "#ef4444"} 
                fillOpacity={0.2} 
                yAxisId="left"
              />
            )}
            
            {showVolume && (
              <Bar 
                dataKey="volume" 
                yAxisId="right" 
                fill="url(#colorVolume)" 
                name="Объем" 
                barSize={20}
                opacity={0.5}
                isAnimationActive={false}
              />
            )}
            
            <Area 
              type={curveType === 'curved' ? "monotone" : "linear"} 
              dataKey="price" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              name="Цена"
              yAxisId="left"
              isAnimationActive={false}
            />
            
            {selectedIndicators.includes(`ma${maSettings.ma1}`) && (
              <Line 
                type={curveType === 'curved' ? "monotone" : "linear"} 
                dataKey={`ma${maSettings.ma1}`} 
                stroke="#10b981" 
                dot={false} 
                name={`MA${maSettings.ma1}`}
                strokeWidth={1.5}
                yAxisId="left"
                isAnimationActive={false}
              />
            )}
            
            {selectedIndicators.includes(`ma${maSettings.ma2}`) && (
              <Line 
                type={curveType === 'curved' ? "monotone" : "linear"} 
                dataKey={`ma${maSettings.ma2}`} 
                stroke="#f59e0b" 
                dot={false} 
                name={`MA${maSettings.ma2}`}
                strokeWidth={1.5}
                yAxisId="left"
                isAnimationActive={false}
              />
            )}
            
            {selectedIndicators.includes(`ma${maSettings.ma3}`) && (
              <Line 
                type={curveType === 'curved' ? "monotone" : "linear"} 
                dataKey={`ma${maSettings.ma3}`} 
                stroke="#8b5cf6" 
                dot={false} 
                name={`MA${maSettings.ma3}`}
                strokeWidth={1.5}
                yAxisId="left"
                isAnimationActive={false}
              />
            )}
            
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Нажмите и удерживайте на графике для сравнения точек
      </div>
    </div>
  );
} 