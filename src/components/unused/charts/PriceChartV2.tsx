'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { CardContainer } from '@/components/ui/card-container';
import { MetricExplanation } from '@/components/MetricExplanation';
import { InfoIcon } from 'lucide-react';

interface PriceChartV2Props {
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
  ma200?: number;
}

export function PriceChartV2({ stock }: PriceChartV2Props) {
  const [timeframe, setTimeframe] = useState<'1mo' | '3mo' | '6mo' | '1y' | '5y'>('6mo');
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<HistoricalDataPoint[]>([]);
  
  // Загрузка данных из Yahoo Finance API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Для расчета MA нам нужно больше данных, чем выбранный таймфрейм
        // Используем больший таймфрейм для загрузки данных
        const dataTimeframe = getDataTimeframeForMA(timeframe, maSettings.ma3);
        
        const response = await fetch(`/api/yahoo-finance?symbol=${stock.symbol}&range=${dataTimeframe}&interval=1d`);
        
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
        setPriceData(data.historicalData); // Сохраняем все данные для расчета MA
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch price data');
        setPriceData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [stock.symbol, timeframe, maSettings.ma3]);
  
  // Определяем таймфрейм для загрузки данных с учетом MA
  const getDataTimeframeForMA = (displayTimeframe: string, maxMA: number) => {
    // Для расчета MA нам нужно примерно maxMA дней до начала отображаемого периода
    // Преобразуем maxMA в месяцы (примерно 22 торговых дня в месяце)
    const additionalMonths = Math.ceil(maxMA / 22);
    
    switch (displayTimeframe) {
      case '1mo': return additionalMonths > 12 ? '5y' : additionalMonths > 6 ? '2y' : additionalMonths > 3 ? '1y' : '6mo';
      case '3mo': return additionalMonths > 12 ? '5y' : additionalMonths > 6 ? '2y' : '1y';
      case '6mo': return additionalMonths > 12 ? '5y' : '2y';
      case '1y': return additionalMonths > 24 ? '5y' : '3y';
      case '5y': return '5y';
      default: return '2y';
    }
  };
  
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
      case '5y': startDate.setFullYear(now.getFullYear() - 5); break;
      default: startDate.setMonth(now.getMonth() - 6);
    }
    
    return data.filter(item => new Date(item.date) >= startDate);
  };
  
  // Добавляем скользящие средние
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
  
  // Данные для отображения (фильтрованные по таймфрейму)
  const displayData = useMemo(() => {
    return filterDataByTimeframe(priceData, timeframe);
  }, [priceData, timeframe]);
  
  // Обработанные данные с индикаторами
  const processedData = useMemo(() => {
    if (priceData.length === 0) return [];
    
    // Добавляем скользящие средние ко всем данным
    const ma20 = calculateMA(maSettings.ma1, priceData);
    const ma50 = calculateMA(maSettings.ma2, priceData);
    const ma200 = calculateMA(maSettings.ma3, priceData);
    
    let processedAllData = priceData.map((point, index) => ({
      ...point,
      [`ma${maSettings.ma1}`]: ma20[index],
      [`ma${maSettings.ma2}`]: ma50[index],
      [`ma${maSettings.ma3}`]: ma200[index]
    }));
    
    // Фильтруем данные для отображения
    let processedDisplayData = filterDataByTimeframe(processedAllData, timeframe);
    
    return processedDisplayData;
  }, [priceData, timeframe, maSettings.ma1, maSettings.ma2, maSettings.ma3]);
  
  // Автоматически включаем индикаторы при загрузке
  useEffect(() => {
    // Включаем MA по умолчанию
    const defaultIndicators = ['price'];
    if (!selectedIndicators.includes(`ma${maSettings.ma1}`)) {
      defaultIndicators.push(`ma${maSettings.ma1}`);
    }
    if (!selectedIndicators.includes(`ma${maSettings.ma2}`)) {
      defaultIndicators.push(`ma${maSettings.ma2}`);
    }
    setSelectedIndicators(defaultIndicators);
  }, []);
  
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
  
  // Расчет разницы между точками
  const calculateDifference = () => {
    if (!startPoint || !currentPoint) return null;
    
    const startPrice = startPoint.close;
    const currentPrice = currentPoint.close;
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
  
  if (loading) {
    return (
      <CardContainer title="График цены (Yahoo Finance)">
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
      <CardContainer title="График цены (Yahoo Finance)">
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
    <CardContainer title="График цены (Yahoo Finance)">
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
          <button 
            className={`px-3 py-1 text-xs rounded-full transition-all ${timeframe === '5y' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('5y')}
          >
            5Y
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-volume-v2" 
              checked={showVolume} 
              onCheckedChange={setShowVolume}
            />
            <Label htmlFor="show-volume-v2">Объем</Label>
          </div>
        </div>
      </div>
      
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center space-x-1">
              <Label className="text-xs">MA {maSettings.ma1}</Label>
              <MetricExplanation metricKey="movingAverage" iconOnly={true} />
            </div>
            <Switch 
              id="ma1-v2" 
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
            <div className="flex items-center space-x-1">
              <Label className="text-xs">MA {maSettings.ma2}</Label>
              <MetricExplanation metricKey="movingAverage" iconOnly={true} />
            </div>
            <Switch 
              id="ma2-v2" 
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
            <div className="flex items-center space-x-1">
              <Label className="text-xs">MA {maSettings.ma3}</Label>
              <MetricExplanation metricKey="movingAverage" iconOnly={true} />
            </div>
            <Switch 
              id="ma3-v2" 
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
            data={processedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <defs>
              <linearGradient id="colorPriceV2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVolumeV2" x1="0" y1="0" x2="0" y2="1">
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
                fill={startPoint.close <= currentPoint.close ? "#10b981" : "#ef4444"} 
                fillOpacity={0.2} 
                yAxisId="left"
              />
            )}
            
            {showVolume && (
              <Bar 
                dataKey="volume" 
                yAxisId="right" 
                fill="url(#colorVolumeV2)" 
                name="Объем" 
                barSize={20}
                opacity={0.5}
                isAnimationActive={false}
              />
            )}
            
            <Area 
              type="linear" 
              dataKey="close" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorPriceV2)" 
              name="Цена"
              yAxisId="left"
              isAnimationActive={false}
            />
            
            {selectedIndicators.includes(`ma${maSettings.ma1}`) && (
              <Line 
                type="monotone" 
                dataKey={`ma${maSettings.ma1}`} 
                stroke="#10b981" 
                dot={false} 
                name={`MA${maSettings.ma1}`}
                strokeWidth={2}
                activeDot={{ r: 4, fill: "#10b981", stroke: "#fff" }}
                yAxisId="left"
                isAnimationActive={false}
              />
            )}
            
            {selectedIndicators.includes(`ma${maSettings.ma2}`) && (
              <Line 
                type="monotone" 
                dataKey={`ma${maSettings.ma2}`} 
                stroke="#f59e0b" 
                dot={false} 
                name={`MA${maSettings.ma2}`}
                strokeWidth={2}
                activeDot={{ r: 4, fill: "#f59e0b", stroke: "#fff" }}
                yAxisId="left"
                isAnimationActive={false}
              />
            )}
            
            {selectedIndicators.includes(`ma${maSettings.ma3}`) && (
              <Line 
                type="monotone" 
                dataKey={`ma${maSettings.ma3}`} 
                stroke="#8b5cf6" 
                dot={false} 
                name={`MA${maSettings.ma3}`}
                strokeWidth={2}
                activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#fff" }}
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

      {/* Документация по объему */}
      {showVolume && (
        <div className="mt-4 p-4 bg-teal-50 rounded-lg">
          <h4 className="font-medium mb-2">Объем торгов</h4>
        </div>
      )}
    </CardContainer>
  );
} 