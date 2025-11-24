import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function DatabasePreview() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Структура хранения данных в PostgreSQL</CardTitle>
        <CardDescription>
          Пример того, как данные будут храниться в базе данных
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Таблица stocks</h3>
            <div className="bg-gray-50 p-3 rounded-md overflow-auto">
              <pre className="text-xs">
{`CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    exchange VARCHAR(50) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    country VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stocks_sector ON stocks(sector);`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Таблица stock_data</h3>
            <div className="bg-gray-50 p-3 rounded-md overflow-auto">
              <pre className="text-xs">
{`CREATE TABLE stock_data (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    raw_data JSONB NOT NULL, -- Исходные данные как получены от API
    processed_data JSONB NOT NULL, -- Обработанные и нормализованные данные
    source VARCHAR(50) NOT NULL, -- Источник данных (yahoo, alphavantage, moex и т.д.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stock_id, date, source)
);

CREATE INDEX idx_stock_data_stock_id_date ON stock_data(stock_id, date);
CREATE INDEX idx_stock_data_source ON stock_data(source);`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Пример raw_data (JSONB)</h3>
            <div className="bg-gray-50 p-3 rounded-md overflow-auto">
              <pre className="text-xs">
{`{
  "source": "yahoo_finance",
  "timestamp": "2023-05-15T15:30:00Z",
  "data": {
    "price": 150.25,
    "open": 148.30,
    "high": 151.20,
    "low": 147.80,
    "volume": 32500000,
    "previousClose": 149.10,
    "change": 1.15,
    "changePercent": 0.77
  }
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Пример processed_data (JSONB)</h3>
            <div className="bg-gray-50 p-3 rounded-md overflow-auto">
              <pre className="text-xs">
{`{
  "price": 150.25,
  "open": 148.30,
  "high": 151.20,
  "low": 147.80,
  "volume": 32500000,
  "previousClose": 149.10,
  "change": 1.15,
  "changePercent": 0.77,
  "metrics": {
    "pe": 25.3,
    "pb": 8.5,
    "ps": 7.2,
    "dividendYield": 0.5
  }
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Пример запроса для сохранения данных</h3>
            <div className="bg-gray-50 p-3 rounded-md overflow-auto">
              <pre className="text-xs">
{`-- Пример запроса для вставки новых данных
INSERT INTO stock_data (stock_id, date, raw_data, processed_data, source)
VALUES (
    (SELECT id FROM stocks WHERE symbol = 'AAPL'),
    '2023-05-15',
    '{"source": "yahoo_finance", "timestamp": "2023-05-15T15:30:00Z", "data": {...}}',
    '{"price": 150.25, "open": 148.30, "high": 151.20, "low": 147.80, ...}',
    'yahoo_finance'
)
ON CONFLICT (stock_id, date, source)
DO UPDATE SET
    raw_data = EXCLUDED.raw_data,
    processed_data = EXCLUDED.processed_data,
    created_at = CURRENT_TIMESTAMP;`}
              </pre>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>
              Данная структура позволяет эффективно хранить и обрабатывать данные из различных источников.
              JSONB формат обеспечивает гибкость при работе с разнородными данными, а индексы оптимизируют запросы.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 