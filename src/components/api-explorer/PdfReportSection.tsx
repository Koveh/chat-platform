'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PdfReportSectionProps {
  onGenerateReport: (params: any) => Promise<string>;
  loading: boolean;
}

export function PdfReportSection({ onGenerateReport, loading }: PdfReportSectionProps) {
  const [reportType, setReportType] = useState('stock-summary');
  const [symbol, setSymbol] = useState('AAPL');
  const [period, setPeriod] = useState('quarterly');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeFundamentals, setIncludeFundamentals] = useState(true);
  const [includeNews, setIncludeNews] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    try {
      setError(null);
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          symbol,
          period,
          includeCharts,
          includeFundamentals,
          includeNews
        }),
      }).then(res => {
        if (!res.ok) {
          throw new Error(`Ошибка API: ${res.status}`);
        }
        return res.json();
      });
      
      if (response.success && response.reportUrl) {
        setPdfUrl(response.reportUrl);
      } else {
        throw new Error('Не удалось получить URL отчета');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при генерации отчета');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Генерация PDF-отчетов</CardTitle>
        <CardDescription>
          Создание и скачивание отчетов в формате PDF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тип отчета</label>
            <select
              className="w-full p-2 border rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="stock-summary">Сводка по акции</option>
              <option value="financial-analysis">Финансовый анализ</option>
              <option value="technical-analysis">Технический анализ</option>
              <option value="portfolio-summary">Сводка по портфелю</option>
              <option value="market-overview">Обзор рынка</option>
              <option value="macro-analysis">Макроэкономический анализ</option>
            </select>
          </div>

          {reportType !== 'portfolio-summary' && reportType !== 'market-overview' && reportType !== 'macro-analysis' && (
            <div>
              <label className="block text-sm font-medium mb-1">Символ тикера</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Например: AAPL, MSFT, GOOGL"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Период</label>
            <select
              className="w-full p-2 border rounded-md"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="quarterly">Квартальный</option>
              <option value="annual">Годовой</option>
              <option value="ttm">Последние 12 месяцев (TTM)</option>
              <option value="5y">5 лет</option>
              <option value="10y">10 лет</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Включить в отчет</label>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeCharts"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeCharts" className="text-sm">Графики и диаграммы</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeFundamentals"
                checked={includeFundamentals}
                onChange={(e) => setIncludeFundamentals(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeFundamentals" className="text-sm">Фундаментальные показатели</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeNews"
                checked={includeNews}
                onChange={(e) => setIncludeNews(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeNews" className="text-sm">Новости и события</label>
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Генерация отчета...' : 'Сгенерировать PDF-отчет'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {pdfUrl && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-green-700 font-medium mb-2">Отчет успешно сгенерирован!</p>
              <div className="flex space-x-2">
                <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                >
                  Открыть PDF
                </a>
                <a 
                  href={pdfUrl} 
                  download
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                >
                  Скачать PDF
                </a>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>
              PDF-отчеты генерируются на основе данных, полученных из различных источников.
              Время генерации может занимать от нескольких секунд до минуты в зависимости от типа отчета и объема данных.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 