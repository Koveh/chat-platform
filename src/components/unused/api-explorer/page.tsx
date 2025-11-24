'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiInfo } from '@/components/api-explorer/ApiInfo';
import { DatabasePreview } from '@/components/api-explorer/DatabasePreview';
import { MacroApiSection } from '@/components/api-explorer/MacroApiSection';
import { PdfReportSection } from '@/components/api-explorer/PdfReportSection';

export default function ApiExplorerPage() {
  const [activeTab, setActiveTab] = useState('yahoo-finance');
  const [apiKey, setApiKey] = useState<Record<string, string>>({
    'yahoo-finance': '',
    'alpha-vantage': '',
    'financial-modeling-prep': '',
    'iex-cloud': '',
    'quandl': '',
    'fred': '',
    'moex': '',
    'finnhub': '',
    'polygon': '',
    'tiingo': '',
    'eod-historical': '',
    'marketstack': '',
    'intrinio': '',
    'investing': '',
  });
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const handleApiKeyChange = (source: string, value: string) => {
    setApiKey(prev => ({ ...prev, [source]: value }));
  };

  const fetchData = async (source: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (useMockData) {
        // Используем моковые данные для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          'yahoo-finance': {
            symbol: symbol,
            price: 173.25,
            change: 2.15,
            changePercent: 1.26,
            volume: 52436789,
            marketCap: 2.73e12,
            pe: 28.5,
            eps: 6.08,
            dividend: 0.96,
            dividendYield: 0.55,
            source: 'Yahoo Finance (Mock Data)'
          },
          'alpha-vantage': {
            symbol: symbol,
            price: 173.30,
            change: 2.20,
            changePercent: 1.28,
            volume: 52500000,
            marketCap: 2.74e12,
            source: 'Alpha Vantage (Mock Data)'
          },
          'moex': {
            symbol: symbol === 'AAPL' ? 'SBER' : symbol,
            price: 267.45,
            change: 3.25,
            changePercent: 1.23,
            volume: 125678900,
            marketCap: 5.78e12,
            source: 'MOEX ISS API (Mock Data)'
          }
        };
        
        setResult(mockData[source as keyof typeof mockData] || { message: 'No mock data available for this source' });
      } else {
        // Реальные запросы к API
        let data;
        
        switch (source) {
          case 'yahoo-finance':
            data = await fetchYahooFinanceData(symbol);
            break;
          case 'alpha-vantage':
            if (!apiKey['alpha-vantage']) {
              throw new Error('API ключ для Alpha Vantage не указан');
            }
            data = await fetchAlphaVantageData(symbol, apiKey['alpha-vantage']);
            break;
          case 'moex':
            data = await fetchMoexData(symbol);
            break;
          case 'financial-modeling-prep':
            if (!apiKey['financial-modeling-prep']) {
              throw new Error('API ключ для Financial Modeling Prep не указан');
            }
            data = await fetchFMPData(symbol, apiKey['financial-modeling-prep']);
            break;
          default:
            throw new Error(`Реальные запросы для ${getSourceName(source)} пока не реализованы`);
        }
        
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при получении данных');
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения данных с Yahoo Finance
  const fetchYahooFinanceData = async (stockSymbol: string) => {
    // Yahoo Finance не предоставляет официальное API, поэтому используем прокси
    const response = await fetch(`/api/yahoo-finance?symbol=${stockSymbol}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении данных: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ...data,
      source: 'Yahoo Finance API'
    };
  };

  // Функция для получения данных с Alpha Vantage
  const fetchAlphaVantageData = async (stockSymbol: string, key: string) => {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${key}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении данных: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Проверяем наличие ошибки в ответе
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      throw new Error(`Ограничение API: ${data['Note']}`);
    }
    
    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      throw new Error('Данные не найдены');
    }
    
    const quote = data['Global Quote'];
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      previousClose: parseFloat(quote['08. previous close']),
      source: 'Alpha Vantage API'
    };
  };

  // Функция для получения данных с MOEX ISS API
  const fetchMoexData = async (stockSymbol: string) => {
    // Для российских акций используем MOEX ISS API
    // Если символ не российский, используем SBER как пример
    const moexSymbol = ['SBER', 'GAZP', 'LKOH', 'YNDX'].includes(stockSymbol.toUpperCase()) 
      ? stockSymbol.toUpperCase() 
      : 'SBER';
    
    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${moexSymbol}.json`);
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении данных: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.marketdata || !data.marketdata.data || data.marketdata.data.length === 0) {
      throw new Error('Данные не найдены');
    }
    
    // Находим данные для основного режима торгов (TQBR)
    const marketData = data.marketdata.data;
    const columns = data.marketdata.columns;
    
    // Создаем объект с данными
    const result: Record<string, any> = {
      symbol: moexSymbol,
      source: 'MOEX ISS API'
    };
    
    // Находим индексы нужных колонок
    const lastIndex = columns.indexOf('LAST');
    const openIndex = columns.indexOf('OPEN');
    const highIndex = columns.indexOf('HIGH');
    const lowIndex = columns.indexOf('LOW');
    const volumeIndex = columns.indexOf('VOLTODAY');
    const changeIndex = columns.indexOf('CHANGE');
    const changePercentIndex = columns.indexOf('LASTTOPREVPRICE');
    
    // Находим строку с данными для основного режима торгов
    const mainBoardData = marketData.find((row: any[]) => {
      const boardIdIndex = columns.indexOf('BOARDID');
      return boardIdIndex >= 0 && row[boardIdIndex] === 'TQBR';
    }) || marketData[0];
    
    if (lastIndex >= 0) result.price = mainBoardData[lastIndex];
    if (openIndex >= 0) result.open = mainBoardData[openIndex];
    if (highIndex >= 0) result.high = mainBoardData[highIndex];
    if (lowIndex >= 0) result.low = mainBoardData[lowIndex];
    if (volumeIndex >= 0) result.volume = mainBoardData[volumeIndex];
    if (changeIndex >= 0) result.change = mainBoardData[changeIndex];
    if (changePercentIndex >= 0) result.changePercent = mainBoardData[changePercentIndex];
    
    // Получаем дополнительную информацию о ценной бумаге
    if (data.securities && data.securities.data && data.securities.data.length > 0) {
      const securityData = data.securities.data[0];
      const secColumns = data.securities.columns;
      
      const nameIndex = secColumns.indexOf('SECNAME');
      const shortNameIndex = secColumns.indexOf('SHORTNAME');
      const lotSizeIndex = secColumns.indexOf('LOTSIZE');
      
      if (nameIndex >= 0) result.name = securityData[nameIndex];
      if (shortNameIndex >= 0) result.shortName = securityData[shortNameIndex];
      if (lotSizeIndex >= 0) result.lotSize = securityData[lotSizeIndex];
    }
    
    return result;
  };

  // Функция для получения данных с Financial Modeling Prep
  const fetchFMPData = async (stockSymbol: string, key: string) => {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${stockSymbol}?apikey=${key}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении данных: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Данные не найдены');
    }
    
    const quote = data[0];
    
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changesPercentage,
      volume: quote.volume,
      open: quote.open,
      high: quote.dayHigh,
      low: quote.dayLow,
      previousClose: quote.previousClose,
      marketCap: quote.marketCap,
      pe: quote.pe,
      eps: quote.eps,
      source: 'Financial Modeling Prep API'
    };
  };

  // Добавляем новые функции обработчики
  const handleFetchMacroData = async (params: any) => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      console.log('Fetching macro data with params:', params);
      
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Имитация данных
      const mockData = {
        source: params.source,
        indicator: params.indicator,
        country: params.country,
        data: [
          { date: '2023-01-01', value: 21.5 },
          { date: '2023-02-01', value: 21.7 },
          { date: '2023-03-01', value: 21.9 },
          { date: '2023-04-01', value: 22.1 },
          { date: '2023-05-01', value: 22.3 },
          { date: '2023-06-01', value: 22.5 },
        ]
      };
      
      setResult(mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching macro data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (params: any) => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      console.log('Generating PDF report with params:', params);
      
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Имитация URL для PDF
      const mockPdfUrl = `/api/reports/sample-${params.reportType}.pdf`;
      
      return mockPdfUrl;
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Explorer</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? 'Скрыть информацию' : 'Показать информацию об API'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowDatabase(!showDatabase)}
          >
            {showDatabase ? 'Скрыть структуру БД' : 'Показать структуру БД'}
          </Button>
          <Button 
            variant={useMockData ? "default" : "outline"} 
            onClick={() => setUseMockData(!useMockData)}
          >
            {useMockData ? 'Использовать реальные API' : 'Использовать моковые данные'}
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Исследуйте различные источники финансовых данных и сравнивайте результаты. 
        Эта страница позволяет тестировать API и просматривать полученные данные.
      </p>
      
      {showDatabase && <DatabasePreview />}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="yahoo-finance">Yahoo Finance</TabsTrigger>
          <TabsTrigger value="alpha-vantage">Alpha Vantage</TabsTrigger>
          <TabsTrigger value="financial-modeling-prep">Financial Modeling Prep</TabsTrigger>
          <TabsTrigger value="iex-cloud">IEX Cloud</TabsTrigger>
          <TabsTrigger value="quandl">Quandl</TabsTrigger>
          <TabsTrigger value="fred">FRED</TabsTrigger>
          <TabsTrigger value="moex">MOEX ISS</TabsTrigger>
          <TabsTrigger value="finnhub">Finnhub</TabsTrigger>
          <TabsTrigger value="macro">Макроэкономика</TabsTrigger>
          <TabsTrigger value="pdf-reports">PDF Отчеты</TabsTrigger>
        </TabsList>
        
        {showInfo && (
          <div className="mb-8">
            <ApiInfo source={activeTab} />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Параметры запроса</CardTitle>
                <CardDescription>
                  Настройте параметры для получения данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      API Key {activeTab !== 'yahoo-finance' && activeTab !== 'moex' && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={apiKey[activeTab]}
                      onChange={(e) => handleApiKeyChange(activeTab, e.target.value)}
                      placeholder={activeTab === 'yahoo-finance' || activeTab === 'moex' ? 'Не требуется' : 'Введите API ключ'}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeTab === 'yahoo-finance' && 'Yahoo Finance не требует API ключа для базовых запросов'}
                      {activeTab === 'moex' && 'MOEX ISS API не требует API ключа'}
                      {activeTab === 'alpha-vantage' && 'Получите бесплатный ключ на alphavantage.co'}
                      {activeTab === 'financial-modeling-prep' && 'Получите ключ на financialmodelingprep.com'}
                      {activeTab === 'iex-cloud' && 'Получите ключ на iexcloud.io'}
                    </p>
                    
                    {activeTab !== 'yahoo-finance' && activeTab !== 'moex' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getApiKeyLinks(activeTab).map((link, index) => (
                          <a 
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-100 inline-flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Символ тикера <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      placeholder="Например: AAPL, MSFT, GOOGL"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeTab === 'moex' && 'Для российских акций используйте тикеры MOEX: SBER, GAZP, LKOH'}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => fetchData(activeTab)}
                    disabled={loading || (!useMockData && activeTab !== 'yahoo-finance' && activeTab !== 'moex' && !apiKey[activeTab])}
                    className="w-full"
                  >
                    {loading ? 'Загрузка...' : 'Получить данные'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Результат запроса</CardTitle>
                <CardDescription>
                  Данные, полученные от {getSourceName(activeTab)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {error && !loading && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                    <h3 className="font-medium">Ошибка</h3>
                    <p>{error}</p>
                  </div>
                )}
                
                {result && !loading && !error && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px]">
                      <pre className="text-sm font-mono">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                    
                    {result.price && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p className="text-sm text-blue-700 font-medium">Цена</p>
                          <p className="text-2xl font-bold">{result.price} {result.currency || 'USD'}</p>
                        </div>
                        
                        <div className={`p-4 rounded-md ${result.change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className="text-sm font-medium" style={{ color: result.change >= 0 ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)' }}>
                            Изменение
                          </p>
                          <p className="text-2xl font-bold" style={{ color: result.change >= 0 ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)' }}>
                            {result.change >= 0 ? '+' : ''}{result.change} ({result.changePercent}%)
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {result && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Как это будет сохранено в базе данных:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium mb-1">raw_data:</p>
                            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-[200px]">
                              {JSON.stringify({
                                source: activeTab,
                                timestamp: new Date().toISOString(),
                                data: result
                              }, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">processed_data:</p>
                            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-[200px]">
                              {JSON.stringify({
                                price: result.price,
                                open: result.open,
                                high: result.high,
                                low: result.low,
                                volume: result.volume,
                                change: result.change,
                                changePercent: result.changePercent,
                                metrics: {
                                  pe: result.pe,
                                  eps: result.eps,
                                  dividendYield: result.dividendYield
                                }
                              }, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Источник: {result.source || getSourceName(activeTab)}
                      {activeTab !== 'yahoo-finance' && activeTab !== 'moex' && 
                        <span className="ml-2">• API Key: {maskApiKey(apiKey[activeTab])}</span>
                      }
                    </div>
                  </div>
                )}
                
                {!result && !loading && !error && (
                  <div className="flex justify-center items-center h-64 text-muted-foreground">
                    Нажмите "Получить данные" для отображения результатов
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <TabsContent value="macro">
          <MacroApiSection 
            onFetchData={handleFetchMacroData} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="pdf-reports">
          <PdfReportSection 
            onGenerateReport={handleGenerateReport} 
            loading={loading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getSourceName(source: string): string {
  const sources: Record<string, string> = {
    'yahoo-finance': 'Yahoo Finance',
    'alpha-vantage': 'Alpha Vantage',
    'financial-modeling-prep': 'Financial Modeling Prep',
    'iex-cloud': 'IEX Cloud',
    'quandl': 'Quandl',
    'fred': 'FRED',
    'moex': 'MOEX ISS API',
    'finnhub': 'Finnhub',
    'polygon': 'Polygon.io',
    'tiingo': 'Tiingo',
    'eod-historical': 'EOD Historical Data',
    'marketstack': 'Marketstack',
    'intrinio': 'Intrinio',
    'investing': 'Investing.com',
  };
  
  return sources[source] || source;
}

function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '****';
  return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}

function getApiKeyLinks(source: string): Array<{url: string, title: string}> {
  const apiKeyLinksMap: Record<string, Array<{url: string, title: string}>> = {
    'alpha-vantage': [
      { url: 'https://www.alphavantage.co/support/#api-key', title: 'Получить ключ' },
      { url: 'https://www.alphavantage.co/documentation/', title: 'Документация' },
      { url: 'https://rapidapi.com/alphavantage/api/alpha-vantage', title: 'RapidAPI' }
    ],
    'financial-modeling-prep': [
      { url: 'https://financialmodelingprep.com/developer/docs/pricing', title: 'Получить ключ' },
      { url: 'https://financialmodelingprep.com/developer/docs/', title: 'Документация' }
    ],
    'iex-cloud': [
      { url: 'https://iexcloud.io/cloud-login#/register', title: 'Получить ключ' },
      { url: 'https://iexcloud.io/docs/api/', title: 'Документация' }
    ],
    'quandl': [
      { url: 'https://www.quandl.com/sign-up', title: 'Получить ключ' },
      { url: 'https://docs.quandl.com/', title: 'Документация' }
    ],
    'fred': [
      { url: 'https://fred.stlouisfed.org/docs/api/api_key.html', title: 'Получить ключ' },
      { url: 'https://fred.stlouisfed.org/docs/api/fred/', title: 'Документация' }
    ],
    'finnhub': [
      { url: 'https://finnhub.io/register', title: 'Получить ключ' },
      { url: 'https://finnhub.io/docs/api', title: 'Документация' },
      { url: 'https://rapidapi.com/Finnhub/api/finnhub-real-time-stock-price', title: 'RapidAPI' }
    ]
  };
  
  return apiKeyLinksMap[source] || [];
} 