'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MacroApiSectionProps {
  onFetchData: (params: any) => Promise<any>;
  loading: boolean;
}

export function MacroApiSection({ onFetchData, loading }: MacroApiSectionProps) {
  const [source, setSource] = useState('fred');
  const [indicator, setIndicator] = useState('gdp');
  const [country, setCountry] = useState('usa');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-06-01');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    try {
      setError(null);
      const data = await fetch('/api/macro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source,
          indicator,
          country,
          startDate,
          endDate
        }),
      }).then(res => {
        if (!res.ok) {
          throw new Error(`Ошибка API: ${res.status}`);
        }
        return res.json();
      });
      
      setResult(data);
    } catch (err) {
      console.error('Error fetching macro data:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при получении данных');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Макроэкономические данные</CardTitle>
        <CardDescription>
          Получение макроэкономических показателей из различных источников
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Источник данных</label>
            <select
              className="w-full p-2 border rounded-md"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="fred">FRED (ФРС США)</option>
              <option value="world-bank">World Bank</option>
              <option value="imf">IMF (МВФ)</option>
              <option value="oecd">OECD</option>
              <option value="eurostat">Eurostat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Экономический показатель</label>
            <select
              className="w-full p-2 border rounded-md"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
            >
              <option value="gdp">ВВП (GDP)</option>
              <option value="unemployment">Уровень безработицы</option>
              <option value="inflation">Инфляция</option>
              <option value="interest-rate">Процентная ставка</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Страна</label>
            <select
              className="w-full p-2 border rounded-md"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="usa">США</option>
              <option value="eu">Европейский Союз</option>
              <option value="china">Китай</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Начальная дата</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Конечная дата</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleFetchData}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Загрузка данных...' : 'Получить данные'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Результаты:</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Дата</th>
                      <th className="text-left py-2 px-4">Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.data && result.data.map((item: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4">{item.date}</td>
                        <td className="py-2 px-4">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>
              Макроэкономические данные могут иметь задержку в зависимости от источника.
              Некоторые показатели обновляются ежемесячно, другие - ежеквартально.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 