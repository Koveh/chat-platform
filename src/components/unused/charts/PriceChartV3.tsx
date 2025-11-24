'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ComposedChart,
  Line,
  ReferenceLine
} from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CardContainer } from '@/components/ui/card-container';
import { Button } from '@/components/ui/button';
import { MetricExplanation } from '@/components/MetricExplanation';

interface PriceChartV3Props {
  stock: Stock;
}

interface HistoricalDataPoint {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  upperBand?: number;
  middleBand?: number;
  lowerBand?: number;
  rsi?: number;
  fib0?: number;
  fib236?: number;
  fib382?: number;
  fib500?: number;
  fib618?: number;
  fib786?: number;
  fib1000?: number;
}

interface DrawingLine {
  id: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  color: string;
}

export function PriceChartV3({ stock }: PriceChartV3Props) {
  const [timeframe, setTimeframe] = useState<'1mo' | '3mo' | '6mo' | '1y'>('3mo');
  const [priceData, setPriceData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBollingerBands, setShowBollingerBands] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [showFibonacci, setShowFibonacci] = useState<boolean>(false);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [drawingLines, setDrawingLines] = useState<DrawingLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);
  
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Загрузка данных из Yahoo Finance API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Загружаем больше данных для более точного расчета индикаторов
        const dataRange = timeframe === '1mo' ? '3mo' : 
                         timeframe === '3mo' ? '6mo' : 
                         timeframe === '6mo' ? '1y' : '2y';
        
        const response = await fetch(`/api/yahoo-finance?symbol=${stock.symbol}&range=${dataRange}&interval=1d`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (!data.historicalData || data.historicalData.length === 0) {
          throw new Error('No historical data available');
        }
        
        // Фильтруем данные по выбранному таймфрейму для отображения
        const filteredData = filterDataByTimeframe(data.historicalData, timeframe);
        setPriceData(data.historicalData); // Сохраняем все данные для расчетов
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch price data');
        setPriceData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [stock.symbol, timeframe]);
  
  // Фильтруем данные по выбранному таймфрейму
  const filterDataByTimeframe = (data: HistoricalDataPoint[], displayTimeframe: string) => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch (displayTimeframe) {
      case '1mo': startDate.setMonth(now.getMonth() - 1); break;
      case '3mo': startDate.setMonth(now.getMonth() - 3); break;
      case '6mo': startDate.setMonth(now.getMonth() - 6); break;
      case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
      default: startDate.setMonth(now.getMonth() - 3);
    }
    
    return data.filter(item => new Date(item.date) >= startDate);
  };
  
  // Расчет скользящих средних
  const calculateMA = (days: number, data: HistoricalDataPoint[]) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < days - 1) {
        result.push(undefined);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < days; j++) {
        sum += data[i - j].close;
      }
      result.push(parseFloat((sum / days).toFixed(2)));
    }
    return result;
  };
  
  // Расчет полос Боллинджера (20-периодная MA и 2 стандартных отклонения)
  const calculateBollingerBands = (data: HistoricalDataPoint[]) => {
    const period = 20;
    const multiplier = 2;
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push({
          middleBand: undefined,
          upperBand: undefined,
          lowerBand: undefined
        });
        continue;
      }
      
      // Расчет средней
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const ma = sum / period;
      
      // Расчет стандартного отклонения
      let squaredDiffSum = 0;
      for (let j = 0; j < period; j++) {
        const diff = data[i - j].close - ma;
        squaredDiffSum += diff * diff;
      }
      const stdDev = Math.sqrt(squaredDiffSum / period);
      
      result.push({
        middleBand: parseFloat(ma.toFixed(2)),
        upperBand: parseFloat((ma + multiplier * stdDev).toFixed(2)),
        lowerBand: parseFloat((ma - multiplier * stdDev).toFixed(2))
      });
    }
    
    return result;
  };
  
  // Расчет RSI (Relative Strength Index)
  const calculateRSI = (data: HistoricalDataPoint[]) => {
    const period = 14; // Стандартный период для RSI
    const result = [];
    
    // Для первых N точек RSI не определен
    for (let i = 0; i < period; i++) {
      result.push(undefined);
    }
    
    for (let i = period; i < data.length; i++) {
      let gains = 0;
      let losses = 0;
      
      // Рассчитываем средние приросты и убытки за период
      for (let j = i - period + 1; j <= i; j++) {
        const change = data[j].close - data[j - 1].close;
        if (change >= 0) {
          gains += change;
        } else {
          losses -= change; // Преобразуем в положительное число
        }
      }
      
      const avgGain = gains / period;
      const avgLoss = losses / period;
      
      if (avgLoss === 0) {
        // Если нет убытков, RSI = 100
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        result.push(parseFloat(rsi.toFixed(2)));
      }
    }
    
    return result;
  };
  
  // Расчет уровней Фибоначчи
  const calculateFibonacciLevels = (data: HistoricalDataPoint[]) => {
    if (data.length === 0) return [];
    
    // Находим максимум и минимум за период
    let highestPrice = -Infinity;
    let lowestPrice = Infinity;
    let highestIndex = 0;
    let lowestIndex = 0;
    
    data.forEach((point, index) => {
      if (point.high > highestPrice) {
        highestPrice = point.high;
        highestIndex = index;
      }
      if (point.low < lowestPrice) {
        lowestPrice = point.low;
        lowestIndex = index;
      }
    });
    
    // Определяем направление тренда (восходящий или нисходящий)
    const isUptrend = highestIndex > lowestIndex;
    
    // Рассчитываем уровни Фибоначчи
    const diff = Math.abs(highestPrice - lowestPrice);
    const fib0 = isUptrend ? lowestPrice : highestPrice;
    const fib1000 = isUptrend ? highestPrice : lowestPrice;
    
    // Для восходящего тренда: от минимума к максимуму
    // Для нисходящего тренда: от максимума к минимуму
    const fibLevels = {
      fib0: fib0,
      fib236: isUptrend ? fib0 + (diff * 0.236) : fib0 - (diff * 0.236),
      fib382: isUptrend ? fib0 + (diff * 0.382) : fib0 - (diff * 0.382),
      fib500: isUptrend ? fib0 + (diff * 0.5) : fib0 - (diff * 0.5),
      fib618: isUptrend ? fib0 + (diff * 0.618) : fib0 - (diff * 0.618),
      fib786: isUptrend ? fib0 + (diff * 0.786) : fib0 - (diff * 0.786),
      fib1000: fib1000
    };
    
    // Добавляем константные значения для всех точек данных
    return data.map(point => ({
      ...point,
      ...fibLevels
    }));
  };
  
  // Обработанные данные с индикаторами
  const processedData = useMemo(() => {
    if (priceData.length === 0) return [];
    
    // Добавляем скользящие средние
    const ma20 = calculateMA(20, priceData);
    const ma50 = calculateMA(50, priceData);
    
    // Добавляем полосы Боллинджера
    const bollingerBands = calculateBollingerBands(priceData);
    
    // Расчет RSI
    const rsi = calculateRSI(priceData);
    
    // Расчет уровней Фибоначчи
    const fibonacciLevels = calculateFibonacciLevels(priceData);
    
    // Объединяем все данные
    const allProcessedData = priceData.map((point, index) => ({
      ...point,
      ma20: ma20[index],
      ma50: ma50[index],
      ...(bollingerBands[index] || {}),
      rsi: rsi[index],
      ...(fibonacciLevels[index] || {})
    }));
    
    // Фильтруем данные для отображения
    return filterDataByTimeframe(allProcessedData, timeframe);
  }, [priceData, timeframe]);
  
  // Проверяем наличие данных для индикаторов
  const hasBollingerData = processedData.length > 0 && processedData[0].upperBand !== undefined;
  const hasRSIData = processedData.length > 0 && processedData[0].rsi !== undefined;
  const hasFibonacciData = processedData.length > 0 && processedData[0].fib0 !== undefined;
  
  // Форматирование для тултипа
  const formatTooltip = (value: number) => {
    return `${value.toFixed(2)} ${stock.currency}`;
  };
  
  // Обработчики для рисования линий
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawingMode || !chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newLine: DrawingLine = {
      id: Date.now().toString(),
      startPoint: { x, y },
      endPoint: { x, y },
      color: '#ff0000' // Красный цвет по умолчанию
    };
    
    setCurrentLine(newLine);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingMode || !currentLine || !chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentLine({
      ...currentLine,
      endPoint: { x, y }
    });
  };
  
  const handleMouseUp = () => {
    if (!isDrawingMode || !currentLine) return;
    
    setDrawingLines([...drawingLines, currentLine]);
    setCurrentLine(null);
  };
  
  const clearDrawings = () => {
    setDrawingLines([]);
  };
  
  if (loading) {
    return (
      <CardContainer title="Технический анализ">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Загрузка данных...</p>
          </div>
        </div>
      </CardContainer>
    );
  }
  
  if (error) {
    return (
      <CardContainer title="Технический анализ">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Ошибка загрузки данных: {error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </CardContainer>
    );
  }
  
  return (
    <CardContainer title="Технический анализ">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1">
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '1mo' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('1mo')}
          >
            1M
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '3mo' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('3mo')}
          >
            3M
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '6mo' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('6mo')}
          >
            6M
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '1y' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('1y')}
          >
            1Y
          </button>
        </div>
        
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-bollinger" 
              checked={showBollingerBands} 
              onCheckedChange={setShowBollingerBands}
            />
            <Label htmlFor="show-bollinger" className="flex items-center space-x-1">
              <span>Боллинджер</span>
              <MetricExplanation metricKey="bollinger" iconOnly={true} />
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-rsi" 
              checked={showRSI} 
              onCheckedChange={setShowRSI}
            />
            <Label htmlFor="show-rsi" className="flex items-center space-x-1">
              <span>RSI</span>
              <MetricExplanation metricKey="rsi" iconOnly={true} />
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-fibonacci" 
              checked={showFibonacci} 
              onCheckedChange={setShowFibonacci}
            />
            <Label htmlFor="show-fibonacci" className="flex items-center space-x-1">
              <span>Фибоначчи</span>
              <MetricExplanation metricKey="fibonacci" iconOnly={true} />
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="drawing-mode" 
              checked={isDrawingMode} 
              onCheckedChange={setIsDrawingMode}
            />
            <Label htmlFor="drawing-mode">Рисование</Label>
          </div>
          
          {drawingLines.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearDrawings}
              className="text-xs"
            >
              Очистить
            </Button>
          )}
        </div>
      </div>
      
      <div 
        className="h-80 relative" 
        ref={chartRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={processedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPriceV3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            {showRSI && (
              <YAxis 
                yAxisId="rsi"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
                tickCount={5}
                label={{ value: 'RSI', angle: 90, position: 'insideRight', offset: 0, fill: '#ec4899', fontSize: 12 }}
              />
            )}
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <Tooltip 
              formatter={(value, name: string) => {
                if (name === 'Цена') return formatTooltip(value as number);
                if (name === 'MA20') return formatTooltip(value as number);
                if (name === 'MA50') return formatTooltip(value as number);
                if (name === 'Верхняя полоса') return formatTooltip(value as number);
                if (name === 'Средняя полоса') return formatTooltip(value as number);
                if (name === 'Нижняя полоса') return formatTooltip(value as number);
                if (name === 'RSI') return `${value}`;
                return value;
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
              }}
              isAnimationActive={false}
            />
            
            <Area 
              type="linear" 
              dataKey="close" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorPriceV3)" 
              name="Цена"
              isAnimationActive={false}
            />
            
            <Line 
              type="linear" 
              dataKey="ma20" 
              stroke="#10b981" 
              dot={false} 
              name="MA20"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            
            <Line 
              type="linear" 
              dataKey="ma50" 
              stroke="#f59e0b" 
              dot={false} 
              name="MA50"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            
            {showBollingerBands && hasBollingerData && (
              <>
                {/* Заливка между верхней и нижней полосами */}
                <Area
                  type="linear"
                  dataKey="upperBand"
                  stroke="none"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                  isAnimationActive={false}
                />
                <Area
                  type="linear"
                  dataKey="lowerBand"
                  stroke="none"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                  isAnimationActive={false}
                />
                
                {/* Полосы Боллинджера */}
                <Line 
                  type="linear" 
                  dataKey="upperBand" 
                  stroke="#8b5cf6" 
                  dot={false} 
                  name="Верхняя полоса"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  isAnimationActive={false}
                />
                <Line 
                  type="linear" 
                  dataKey="middleBand" 
                  stroke="#8b5cf6" 
                  dot={false} 
                  name="Средняя полоса"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line 
                  type="linear" 
                  dataKey="lowerBand" 
                  stroke="#8b5cf6" 
                  dot={false} 
                  name="Нижняя полоса"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  isAnimationActive={false}
                />
              </>
            )}
            
            {/* RSI индикатор */}
            {showRSI && hasRSIData && (
              <>
                {/* Линии перекупленности/перепроданности */}
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} yAxisId="rsi" />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} yAxisId="rsi" />
                
                {/* RSI линия */}
                <Line 
                  type="linear" 
                  dataKey="rsi" 
                  stroke="#ec4899" 
                  dot={false} 
                  name="RSI"
                  strokeWidth={2}
                  isAnimationActive={false}
                  yAxisId="rsi"
                />
              </>
            )}
            
            {/* Уровни Фибоначчи */}
            {showFibonacci && hasFibonacciData && (
              <>
                {/* Цвета для уровней Фибоначчи */}
                <defs>
                  <linearGradient id="fibGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="23.6%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="38.2%" stopColor="#ec4899" stopOpacity={0.1} />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="61.8%" stopColor="#f59e0b" stopOpacity={0.1} />
                    <stop offset="78.6%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                
                {/* Заливка между уровнями Фибоначчи */}
                <Area
                  type="linear"
                  dataKey="fib0"
                  stroke="none"
                  fill="url(#fibGradient)"
                  fillOpacity={0.8}
                  isAnimationActive={false}
                />
                
                {/* Линии уровней Фибоначчи */}
                <ReferenceLine 
                  y={processedData[0]?.fib0} 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '0%', 
                    position: 'insideRight', 
                    fill: '#6366f1', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
                <ReferenceLine 
                  y={processedData[0]?.fib236} 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '23.6%', 
                    position: 'insideRight', 
                    fill: '#8b5cf6', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
                <ReferenceLine 
                  y={processedData[0]?.fib382} 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '38.2%', 
                    position: 'insideRight', 
                    fill: '#ec4899', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
                <ReferenceLine 
                  y={processedData[0]?.fib500} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '50%', 
                    position: 'insideRight', 
                    fill: '#ef4444', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
                <ReferenceLine 
                  y={processedData[0]?.fib618} 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '61.8%', 
                    position: 'insideRight', 
                    fill: '#f59e0b', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
                <ReferenceLine 
                  y={processedData[0]?.fib786} 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '78.6%', 
                    position: 'insideRight', 
                    fill: '#10b981', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
                <ReferenceLine 
                  y={processedData[0]?.fib1000} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: '100%', 
                    position: 'insideRight', 
                    fill: '#3b82f6', 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} 
                />
              </>
            )}
            
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Отображение нарисованных линий */}
        {drawingLines.map((line) => (
          <svg
            key={line.id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <line
              x1={line.startPoint.x}
              y1={line.startPoint.y}
              x2={line.endPoint.x}
              y2={line.endPoint.y}
              stroke={line.color}
              strokeWidth={2}
            />
          </svg>
        ))}
        
        {/* Отображение текущей рисуемой линии */}
        {currentLine && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <line
              x1={currentLine.startPoint.x}
              y1={currentLine.startPoint.y}
              x2={currentLine.endPoint.x}
              y2={currentLine.endPoint.y}
              stroke={currentLine.color}
              strokeWidth={2}
            />
          </svg>
        )}
      </div>
      
      {/* Компактная информация о RSI */}
      {showRSI && hasRSIData && (
        <div className="mt-2 flex items-center gap-4 text-xs">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#ef4444"}}></span>
            <span>Перекупленность (70+)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#10b981"}}></span>
            <span>Перепроданность (30-)</span>
          </div>
        </div>
      )}
      
      {/* Компактная легенда для уровней Фибоначчи */}
      {showFibonacci && hasFibonacciData && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#6366f1"}}></span>
            <span>0%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#8b5cf6"}}></span>
            <span>23.6%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#ec4899"}}></span>
            <span>38.2%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#ef4444"}}></span>
            <span>50%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#f59e0b"}}></span>
            <span>61.8%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#10b981"}}></span>
            <span>78.6%</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: "#3b82f6"}}></span>
            <span>100%</span>
          </div>
        </div>
      )}
      
      <div className="mt-2 text-xs text-muted-foreground">
        {isDrawingMode 
          ? "Нажмите и перетащите для рисования линии тренда" 
          : "Включите режим рисования для добавления линий тренда"}
      </div>
    </CardContainer>
  );
} 