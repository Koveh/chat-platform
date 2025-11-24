import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

interface FinancialIndicator {
  name: string;
  value: number;
  previousValue: number | null;
  changePercent: number | null;
  weeklyChangePercent: number | null;
  source: string;
  lastUpdated: string;
}

interface GroupedData {
  [key: string]: FinancialIndicator[];
}

// Создаем пул соединений с базой данных
const pool = new Pool({
  user: process.env.DB_USER || 'investmentskoveh',
  password: process.env.DB_PASSWORD || 'Daniil77Daniil',
  host: 'localhost',
  port: 5432,
  database: process.env.DB_NAME || 'investments-koveh',
});

// Обработчик GET-запроса для получения финансовых индикаторов
export async function GET(request: NextRequest) {
  try {
    // Получаем текущие данные
    const query = `
      SELECT indicator_name, value, previous_value, change_percent, source, last_updated
      FROM financial_indicators
      ORDER BY indicator_name, last_updated DESC
    `;
    
    const result = await pool.query(query);
    
    // Получаем данные недельной давности
    const weeklyQuery = `
      SELECT indicator_name, value, source
      FROM financial_indicators
      WHERE last_updated < NOW() - INTERVAL '6 days'
      ORDER BY indicator_name, last_updated DESC
    `;
    
    const weeklyResult = await pool.query(weeklyQuery);
    
    // Создаем карту недельных данных для быстрого доступа
    const weeklyData = new Map<string, number>();
    weeklyResult.rows.forEach(row => {
      const key = `${row.indicator_name}_${row.source}`;
      weeklyData.set(key, parseFloat(row.value));
    });
    
    // Группируем данные по индикатору
    const groupedData: GroupedData = {};
    
    result.rows.forEach(row => {
      const name = row.indicator_name;
      
      if (!groupedData[name]) {
        groupedData[name] = [];
      }
      
      // Проверяем, есть ли недельные данные для этого индикатора и источника
      const weeklyKey = `${name}_${row.source}`;
      const weeklyValue = weeklyData.get(weeklyKey);
      
      let weeklyChangePercent = null;
      if (weeklyValue) {
        const currentValue = parseFloat(row.value);
        weeklyChangePercent = ((currentValue - weeklyValue) / weeklyValue) * 100;
      }
      
      groupedData[name].push({
        name,
        value: parseFloat(row.value),
        previousValue: row.previous_value ? parseFloat(row.previous_value) : null,
        changePercent: row.change_percent ? parseFloat(row.change_percent) : null,
        weeklyChangePercent,
        source: row.source,
        lastUpdated: row.last_updated
      });
    });
    
    // Преобразуем сгруппированные данные в массив
    const indicators: FinancialIndicator[] = [];
    
    Object.keys(groupedData).forEach(name => {
      // Если для индикатора есть несколько источников и это EURUSD, добавляем каждый источник
      if (name === 'EURUSD' && groupedData[name].length > 1) {
        groupedData[name].forEach((indicator: FinancialIndicator) => {
          // Добавляем только актуальные данные, не старше 1 дня
          const indicatorDate = new Date(indicator.lastUpdated);
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 1);
          
          if (indicatorDate > oneDayAgo) {
            indicators.push(indicator);
          }
        });
      } else {
        // Для остальных индикаторов берем самое свежее значение
        const latestIndicator = groupedData[name].reduce((latest: FinancialIndicator, current: FinancialIndicator) => {
          const latestDate = new Date(latest.lastUpdated);
          const currentDate = new Date(current.lastUpdated);
          return currentDate > latestDate ? current : latest;
        }, groupedData[name][0]);
        
        indicators.push(latestIndicator);
      }
    });
    
    // Возвращаем результат
    return NextResponse.json({
      success: true,
      data: indicators
    });
  } catch (error) {
    console.error('Ошибка при получении финансовых индикаторов:', error);
    
    // Возвращаем ошибку
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка при получении финансовых индикаторов',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 