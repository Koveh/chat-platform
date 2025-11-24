"use client";
import React, { useState, useRef, useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, X, Move, ArrowUp, ArrowDown, Filter, Search, Calendar, Clock, DollarSign, Info, Edit, Settings, Save, Download } from "lucide-react";

// Типы инструментов
type InstrumentType = "stock" | "bond" | "option" | "future";

// Типы опционов
type OptionType = "call" | "put";

// Интерфейс для инструмента
interface Instrument {
  id: string;
  type: InstrumentType;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  // Дополнительные поля для опционов
  optionType?: OptionType;
  strike?: number;
  expiry?: string;
  // Дополнительные поля для фьючерсов
  deliveryDate?: string;
  contractSize?: number;
}

// Интерфейс для временной линии
interface Timeline {
  id: string;
  name: string;
  date: Date;
  instruments: Instrument[];
}

// Интерфейс для результата расчета стратегии
interface StrategyResult {
  totalCost: number;
  potentialProfit: number;
  maxLoss: number;
  breakEvenPoints: number[];
  riskRewardRatio: number;
}

// Интерфейс для сохраненной стратегии
interface SavedStrategy {
  id: string;
  name: string;
  description: string;
  timelines: Timeline[];
  createdAt: Date;
}

// Имитация данных инструментов
const mockInstruments: Instrument[] = [
  {
    id: "stock-1",
    type: "stock",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.32,
    change: 1.25,
    changePercent: 0.67,
  },
  {
    id: "stock-2",
    type: "stock",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 415.56,
    change: 3.78,
    changePercent: 0.92,
  },
  {
    id: "bond-1",
    type: "bond",
    symbol: "T-10Y",
    name: "US 10-Year Treasury",
    price: 98.75,
    change: -0.15,
    changePercent: -0.15,
  },
  {
    id: "option-1",
    type: "option",
    symbol: "AAPL230616C180",
    name: "AAPL Call 180",
    price: 7.85,
    change: 0.35,
    changePercent: 4.67,
    optionType: "call",
    strike: 180,
    expiry: "2023-06-16",
  },
  {
    id: "option-2",
    type: "option",
    symbol: "AAPL230616P170",
    name: "AAPL Put 170",
    price: 2.15,
    change: -0.45,
    changePercent: -17.31,
    optionType: "put",
    strike: 170,
    expiry: "2023-06-16",
  },
  {
    id: "future-1",
    type: "future",
    symbol: "ES-M23",
    name: "E-mini S&P 500 June 2023",
    price: 4285.75,
    change: 12.25,
    changePercent: 0.29,
    deliveryDate: "2023-06-16",
    contractSize: 50,
  },
];

export default function DerivativesPage() {
  // Состояние для выбранного типа инструмента
  const [selectedInstrumentType, setSelectedInstrumentType] = useState<InstrumentType | "all">("all");
  
  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState("");
  
  // Состояние для временных линий
  const [timelines, setTimelines] = useState<Timeline[]>([
    {
      id: "timeline-1",
      name: "Сегодня",
      date: new Date(),
      instruments: [],
    },
    {
      id: "timeline-2",
      name: "Через 30 дней",
      date: new Date(new Date().setDate(new Date().getDate() + 30)),
      instruments: [],
    },
  ]);
  
  // Состояние для отфильтрованных инструментов
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>(mockInstruments);
  
  // Состояние для перетаскивания
  const [draggedInstrument, setDraggedInstrument] = useState<Instrument | null>(null);
  
  // Состояние для выбранного инструмента для просмотра деталей
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  
  // Состояние для результата расчета стратегии
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  
  // Состояние для редактирования временной линии
  const [editingTimeline, setEditingTimeline] = useState<Timeline | null>(null);
  const [editTimelineName, setEditTimelineName] = useState("");
  const [editTimelineDate, setEditTimelineDate] = useState("");
  
  // Состояние для сохранения стратегии
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [strategyName, setStrategyName] = useState("");
  const [strategyDescription, setStrategyDescription] = useState("");
  
  // Состояние для загрузки стратегии
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  
  // Ссылка на контейнер рабочей области
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  // Функция для фильтрации инструментов
  useEffect(() => {
    let filtered = mockInstruments;
    
    // Фильтрация по типу
    if (selectedInstrumentType !== "all") {
      filtered = filtered.filter(instrument => instrument.type === selectedInstrumentType);
    }
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter(instrument => 
        instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredInstruments(filtered);
  }, [selectedInstrumentType, searchQuery]);
  
  // Загрузка сохраненных стратегий при монтировании компонента
  useEffect(() => {
    const loadSavedStrategies = () => {
      const savedStrategiesJson = localStorage.getItem('savedStrategies');
      if (savedStrategiesJson) {
        try {
          // Преобразуем даты из строк обратно в объекты Date
          const parsed = JSON.parse(savedStrategiesJson);
          const strategies = parsed.map((strategy: any) => ({
            ...strategy,
            createdAt: new Date(strategy.createdAt),
            timelines: strategy.timelines.map((timeline: any) => ({
              ...timeline,
              date: new Date(timeline.date)
            }))
          }));
          setSavedStrategies(strategies);
        } catch (error) {
          console.error('Ошибка при загрузке сохраненных стратегий:', error);
        }
      }
    };
    
    loadSavedStrategies();
  }, []);
  
  // Функция для добавления новой временной линии
  const addTimeline = () => {
    const lastTimeline = timelines[timelines.length - 1];
    const newDate = new Date(lastTimeline.date);
    newDate.setDate(newDate.getDate() + 30); // По умолчанию +30 дней от последней
    
    const newTimeline: Timeline = {
      id: `timeline-${timelines.length + 1}`,
      name: `Через ${(timelines.length) * 30} дней`,
      date: newDate,
      instruments: [],
    };
    
    setTimelines([...timelines, newTimeline]);
  };
  
  // Функция для удаления временной линии
  const removeTimeline = (id: string) => {
    setTimelines(timelines.filter(timeline => timeline.id !== id));
  };
  
  // Функция для начала перетаскивания
  const handleDragStart = (instrument: Instrument) => {
    setDraggedInstrument(instrument);
  };
  
  // Функция для завершения перетаскивания
  const handleDrop = (timelineId: string) => {
    if (draggedInstrument) {
      // Добавляем инструмент в выбранную временную линию
      setTimelines(timelines.map(timeline => {
        if (timeline.id === timelineId) {
          // Создаем копию инструмента с уникальным ID для этой временной линии
          const instrumentCopy = {
            ...draggedInstrument,
            id: `${draggedInstrument.id}-${Date.now()}`, // Уникальный ID
          };
          return {
            ...timeline,
            instruments: [...timeline.instruments, instrumentCopy],
          };
        }
        return timeline;
      }));
      
      setDraggedInstrument(null);
    }
  };
  
  // Функция для удаления инструмента из временной линии
  const removeInstrumentFromTimeline = (timelineId: string, instrumentId: string) => {
    setTimelines(timelines.map(timeline => {
      if (timeline.id === timelineId) {
        return {
          ...timeline,
          instruments: timeline.instruments.filter(instrument => instrument.id !== instrumentId),
        };
      }
      return timeline;
    }));
  };
  
  // Функция для отображения деталей инструмента
  const showInstrumentDetails = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
  };
  
  // Функция для начала редактирования временной линии
  const startEditingTimeline = (timeline: Timeline) => {
    setEditingTimeline(timeline);
    setEditTimelineName(timeline.name);
    setEditTimelineDate(timeline.date.toISOString().split('T')[0]); // Формат YYYY-MM-DD
  };
  
  // Функция для сохранения изменений временной линии
  const saveTimelineChanges = () => {
    if (editingTimeline) {
      setTimelines(timelines.map(timeline => {
        if (timeline.id === editingTimeline.id) {
          return {
            ...timeline,
            name: editTimelineName,
            date: new Date(editTimelineDate),
          };
        }
        return timeline;
      }));
      
      setEditingTimeline(null);
    }
  };
  
  // Функция для сохранения стратегии
  const saveStrategy = () => {
    if (!strategyName) {
      alert('Пожалуйста, введите название стратегии');
      return;
    }
    
    const newStrategy: SavedStrategy = {
      id: `strategy-${Date.now()}`,
      name: strategyName,
      description: strategyDescription,
      timelines: [...timelines],
      createdAt: new Date()
    };
    
    const updatedStrategies = [...savedStrategies, newStrategy];
    setSavedStrategies(updatedStrategies);
    
    // Сохраняем в localStorage
    localStorage.setItem('savedStrategies', JSON.stringify(updatedStrategies));
    
    // Закрываем диалог
    setIsSaveDialogOpen(false);
    setStrategyName('');
    setStrategyDescription('');
    
    alert('Стратегия успешно сохранена!');
  };
  
  // Функция для загрузки стратегии
  const loadStrategy = (strategy: SavedStrategy) => {
    setTimelines(strategy.timelines);
    setIsLoadDialogOpen(false);
    
    // Сбрасываем результаты расчета
    setStrategyResult(null);
  };
  
  // Функция для удаления сохраненной стратегии
  const deleteStrategy = (strategyId: string) => {
    const updatedStrategies = savedStrategies.filter(strategy => strategy.id !== strategyId);
    setSavedStrategies(updatedStrategies);
    
    // Обновляем localStorage
    localStorage.setItem('savedStrategies', JSON.stringify(updatedStrategies));
  };
  
  // Функция для расчета стоимости стратегии
  const calculateStrategyValue = () => {
    // Проверяем, есть ли инструменты в стратегии
    const hasInstruments = timelines.some(timeline => timeline.instruments.length > 0);
    
    if (!hasInstruments) {
      alert("Добавьте инструменты в стратегию для расчета");
      return;
    }
    
    // Здесь будет логика расчета стоимости стратегии
    // Пока используем заглушку с примерными данными
    
    // Подсчитываем общую стоимость инструментов
    let totalCost = 0;
    timelines.forEach(timeline => {
      timeline.instruments.forEach(instrument => {
        if (instrument.type === 'option') {
          // Для опционов учитываем тип (для put опционов стоимость отрицательная)
          if (instrument.optionType === 'call') {
            totalCost += instrument.price;
          } else {
            totalCost -= instrument.price;
          }
        } else if (instrument.type === 'stock') {
          totalCost += instrument.price;
        } else if (instrument.type === 'future') {
          // Для фьючерсов учитываем размер контракта
          totalCost += instrument.price * (instrument.contractSize || 1);
        }
      });
    });
    
    // Рассчитываем примерные значения для других показателей
    const potentialProfit = totalCost * 1.5; // Примерная потенциальная прибыль
    const maxLoss = totalCost * 0.5; // Примерный максимальный убыток
    const breakEvenPoints = [totalCost * 0.9, totalCost * 1.1]; // Примерные точки безубыточности
    const riskRewardRatio = potentialProfit / maxLoss; // Соотношение риск/доходность
    
    // Устанавливаем результат расчета
    setStrategyResult({
      totalCost,
      potentialProfit,
      maxLoss,
      breakEvenPoints,
      riskRewardRatio,
    });
  };
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Конструктор стратегий: опционы и форварды</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Левая панель с инструментами */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Инструменты</CardTitle>
                <CardDescription>Выберите инструменты для вашей стратегии</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Фильтры */}
                  <div className="space-y-2">
                    <Label htmlFor="instrument-type">Тип инструмента</Label>
                    <Tabs defaultValue="all" onValueChange={(value) => setSelectedInstrumentType(value as InstrumentType | "all")}>
                      <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger value="all">Все</TabsTrigger>
                        <TabsTrigger value="stock">Акции</TabsTrigger>
                        <TabsTrigger value="bond">Облигации</TabsTrigger>
                        <TabsTrigger value="option">Опционы</TabsTrigger>
                        <TabsTrigger value="future">Фьючерсы</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  {/* Поиск */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск инструментов..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Список инструментов */}
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Символ</TableHead>
                          <TableHead>Цена</TableHead>
                          <TableHead>Изм. %</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInstruments.map((instrument) => (
                          <TableRow 
                            key={instrument.id}
                            draggable
                            onDragStart={() => handleDragStart(instrument)}
                            className="cursor-move hover:bg-muted"
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{instrument.symbol}</span>
                                <span className="text-xs text-muted-foreground">{instrument.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{instrument.price.toFixed(2)}</TableCell>
                            <TableCell className={instrument.changePercent >= 0 ? "text-green-600" : "text-red-600"}>
                              {instrument.changePercent >= 0 ? "+" : ""}{instrument.changePercent.toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => showInstrumentDetails(instrument)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Правая панель с рабочей областью */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Рабочая область</CardTitle>
                  <CardDescription>Перетащите инструменты на временные линии</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsLoadDialogOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Загрузить
                  </Button>
                  <Button variant="outline" onClick={() => setIsSaveDialogOpen(true)}>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить
                  </Button>
                  <Button variant="outline" onClick={() => addTimeline()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить линию
                  </Button>
                  <Button onClick={calculateStrategyValue}>Рассчитать стратегию</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div ref={workspaceRef} className="min-h-[600px] border rounded-md p-4 bg-slate-50 relative">
                  {/* Временные линии */}
                  <div className="space-y-6">
                    {timelines.map((timeline) => (
                      <div 
                        key={timeline.id}
                        className="border rounded-md p-4 bg-white"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(timeline.id)}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">{timeline.name}</h3>
                            <span className="text-sm text-muted-foreground">
                              {timeline.date.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => startEditingTimeline(timeline)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {timelines.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeTimeline(timeline.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Инструменты на временной линии */}
                        <div className="flex flex-wrap gap-2">
                          {timeline.instruments.length === 0 ? (
                            <div className="w-full text-center py-8 text-muted-foreground">
                              Перетащите инструменты сюда
                            </div>
                          ) : (
                            timeline.instruments.map((instrument) => (
                              <div 
                                key={instrument.id}
                                className={`
                                  flex items-center gap-2 p-2 rounded-md border
                                  ${instrument.type === 'stock' ? 'bg-blue-50 border-blue-200' : ''}
                                  ${instrument.type === 'bond' ? 'bg-green-50 border-green-200' : ''}
                                  ${instrument.type === 'option' ? 'bg-purple-50 border-purple-200' : ''}
                                  ${instrument.type === 'future' ? 'bg-amber-50 border-amber-200' : ''}
                                `}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{instrument.symbol}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {instrument.price.toFixed(2)} ({instrument.changePercent >= 0 ? "+" : ""}{instrument.changePercent.toFixed(2)}%)
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => showInstrumentDetails(instrument)}
                                  >
                                    <Info className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeInstrumentFromTimeline(timeline.id, instrument.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Результаты расчета стратегии */}
                  {strategyResult && (
                    <div className="mt-6 border rounded-md p-4 bg-white">
                      <h3 className="font-medium text-lg mb-4">Результаты расчета стратегии</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="border rounded-md p-3 bg-blue-50">
                          <div className="text-sm text-muted-foreground">Общая стоимость</div>
                          <div className="text-xl font-medium">{strategyResult.totalCost.toFixed(2)}</div>
                        </div>
                        
                        <div className="border rounded-md p-3 bg-green-50">
                          <div className="text-sm text-muted-foreground">Потенциальная прибыль</div>
                          <div className="text-xl font-medium text-green-600">+{strategyResult.potentialProfit.toFixed(2)}</div>
                        </div>
                        
                        <div className="border rounded-md p-3 bg-red-50">
                          <div className="text-sm text-muted-foreground">Максимальный убыток</div>
                          <div className="text-xl font-medium text-red-600">-{strategyResult.maxLoss.toFixed(2)}</div>
                        </div>
                        
                        <div className="border rounded-md p-3 bg-purple-50">
                          <div className="text-sm text-muted-foreground">Точки безубыточности</div>
                          <div className="text-xl font-medium">
                            {strategyResult.breakEvenPoints.map((point, index) => (
                              <span key={index}>
                                {point.toFixed(2)}
                                {index < strategyResult.breakEvenPoints.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-3 bg-amber-50">
                          <div className="text-sm text-muted-foreground">Соотношение риск/доходность</div>
                          <div className="text-xl font-medium">{strategyResult.riskRewardRatio.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Примечание: Это примерный расчет на основе текущих данных. Фактические результаты могут отличаться в зависимости от рыночных условий.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Диалог с деталями инструмента */}
        <Dialog open={!!selectedInstrument} onOpenChange={(open) => !open && setSelectedInstrument(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedInstrument?.name} ({selectedInstrument?.symbol})
              </DialogTitle>
              <DialogDescription>
                Детальная информация об инструменте
              </DialogDescription>
            </DialogHeader>
            
            {selectedInstrument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Тип</Label>
                    <div className="font-medium mt-1">
                      {selectedInstrument.type === 'stock' && 'Акция'}
                      {selectedInstrument.type === 'bond' && 'Облигация'}
                      {selectedInstrument.type === 'option' && 'Опцион'}
                      {selectedInstrument.type === 'future' && 'Фьючерс'}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Цена</Label>
                    <div className="font-medium mt-1">
                      {selectedInstrument.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Изменение</Label>
                    <div className={`font-medium mt-1 ${selectedInstrument.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {selectedInstrument.change.toFixed(2)} ({selectedInstrument.changePercent >= 0 ? "+" : ""}{selectedInstrument.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  
                  {/* Дополнительные поля для опционов */}
                  {selectedInstrument.type === 'option' && (
                    <>
                      <div>
                        <Label>Тип опциона</Label>
                        <div className="font-medium mt-1">
                          {selectedInstrument.optionType === 'call' ? 'Call (покупка)' : 'Put (продажа)'}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Цена страйк</Label>
                        <div className="font-medium mt-1">
                          {selectedInstrument.strike?.toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Дата экспирации</Label>
                        <div className="font-medium mt-1">
                          {selectedInstrument.expiry}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Дополнительные поля для фьючерсов */}
                  {selectedInstrument.type === 'future' && (
                    <>
                      <div>
                        <Label>Дата поставки</Label>
                        <div className="font-medium mt-1">
                          {selectedInstrument.deliveryDate}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Размер контракта</Label>
                        <div className="font-medium mt-1">
                          {selectedInstrument.contractSize}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      handleDragStart(selectedInstrument);
                      setSelectedInstrument(null);
                    }}
                  >
                    Добавить в стратегию
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Диалог редактирования временной линии */}
        <Dialog open={!!editingTimeline} onOpenChange={(open) => !open && setEditingTimeline(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Редактирование временной линии</DialogTitle>
              <DialogDescription>
                Измените параметры временной линии
              </DialogDescription>
            </DialogHeader>
            
            {editingTimeline && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline-name">Название</Label>
                  <Input
                    id="timeline-name"
                    value={editTimelineName}
                    onChange={(e) => setEditTimelineName(e.target.value)}
                    placeholder="Введите название временной линии"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline-date">Дата</Label>
                  <Input
                    id="timeline-date"
                    type="date"
                    value={editTimelineDate}
                    onChange={(e) => setEditTimelineDate(e.target.value)}
                  />
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingTimeline(null)}>Отмена</Button>
                  <Button onClick={saveTimelineChanges}>Сохранить</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Диалог сохранения стратегии */}
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Сохранение стратегии</DialogTitle>
              <DialogDescription>
                Сохраните текущую стратегию для последующего использования
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy-name">Название стратегии</Label>
                <Input
                  id="strategy-name"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="Введите название стратегии"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategy-description">Описание (опционально)</Label>
                <Input
                  id="strategy-description"
                  value={strategyDescription}
                  onChange={(e) => setStrategyDescription(e.target.value)}
                  placeholder="Введите описание стратегии"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Отмена</Button>
                <Button onClick={saveStrategy}>Сохранить</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Диалог загрузки стратегии */}
        <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Загрузка стратегии</DialogTitle>
              <DialogDescription>
                Выберите сохраненную стратегию для загрузки
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {savedStrategies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  У вас пока нет сохраненных стратегий
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {savedStrategies.map((strategy) => (
                    <div 
                      key={strategy.id}
                      className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                      onClick={() => loadStrategy(strategy)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{strategy.name}</h4>
                          {strategy.description && (
                            <p className="text-sm text-muted-foreground">{strategy.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Создано: {strategy.createdAt.toLocaleDateString()} {strategy.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStrategy(strategy.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLoadDialogOpen(false)}>Отмена</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}