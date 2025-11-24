import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const range = searchParams.get('range') || '1d'; // Добавляем параметр range (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y)
  const interval = searchParams.get('interval') || '1d'; // Добавляем параметр interval (1m, 5m, 15m, 30m, 60m, 1d, 1wk, 1mo)
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
  }
  
  try {
    // Используем неофициальное API Yahoo Finance с параметрами range и interval
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data from Yahoo Finance: ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Проверяем наличие ошибки в ответе
    if (data.chart.error) {
      return NextResponse.json(
        { error: data.chart.error.description }, 
        { status: 400 }
      );
    }
    
    // Проверяем наличие результатов
    if (!data.chart.result || data.chart.result.length === 0) {
      return NextResponse.json(
        { error: 'No data found for the specified symbol' }, 
        { status: 404 }
      );
    }
    
    const result = data.chart.result[0];
    const quote = result.indicators.quote[0];
    const meta = result.meta;
    const timestamps = result.timestamp;
    
    // Если запрашиваются исторические данные, возвращаем полный набор данных
    if (range !== '1d') {
      const historicalData = timestamps.map((timestamp: number, index: number) => {
        return {
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          timestamp: timestamp * 1000,
          open: quote.open[index] || null,
          high: quote.high[index] || null,
          low: quote.low[index] || null,
          close: quote.close[index] || null,
          volume: quote.volume[index] || null
        };
      }).filter((item: any) => item.close !== null); // Фильтруем записи с отсутствующими данными
      
      return NextResponse.json({
        symbol: meta.symbol,
        currency: meta.currency,
        exchangeName: meta.exchangeName,
        instrumentType: meta.instrumentType,
        historicalData
      });
    }
    
    // Получаем последние значения для текущего дня
    const lastIndex = quote.close.length - 1;
    const previousIndex = lastIndex > 0 ? lastIndex - 1 : 0;
    
    const price = quote.close[lastIndex] || meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose || quote.close[previousIndex];
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    // Формируем ответ
    const formattedData = {
      symbol: meta.symbol,
      price: price,
      open: quote.open[lastIndex] || meta.regularMarketOpen,
      high: quote.high[lastIndex] || meta.regularMarketDayHigh,
      low: quote.low[lastIndex] || meta.regularMarketDayLow,
      volume: quote.volume[lastIndex] || meta.regularMarketVolume,
      previousClose: previousClose,
      change: change,
      changePercent: changePercent,
      currency: meta.currency,
      exchangeName: meta.exchangeName,
      instrumentType: meta.instrumentType,
      timestamp: new Date(meta.regularMarketTime * 1000).toISOString()
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Yahoo Finance' }, 
      { status: 500 }
    );
  }
} 