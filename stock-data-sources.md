# Источники данных для приложения анализа акций

В этом документе представлены различные источники данных, которые можно использовать для получения финансовой информации о компаниях и акциях. Источники разделены на бесплатные и платные с низкой стоимостью.

## Бесплатные источники данных с задержкой (подходят для долгосрочных инвесторов)

### 1. Yahoo Finance API
**Описание:** Yahoo Finance предоставляет обширные данные о ценах акций, финансовых показателях и новостях компаний.  
**Доступные данные:**
- Исторические цены акций
- Основные финансовые показатели
- Информация о дивидендах
- Балансовые отчеты, отчеты о прибылях и убытках, отчеты о движении денежных средств
- Аналитические оценки

**Задержка данных:** 15-20 минут для большинства бирж, что подходит для долгосрочных инвесторов.  
**Ограничения:** Официальное API не предоставляется, но существуют неофициальные библиотеки, такие как `yfinance` для Python.  
**Ссылка:** [Yahoo Finance](https://finance.yahoo.com/)

### 2. Alpha Vantage
**Описание:** Alpha Vantage предлагает бесплатный API для получения данных о акциях, форексе и криптовалютах.  
**Доступные данные:**
- Исторические и текущие цены акций
- Технические индикаторы
- Фундаментальные данные (балансовые отчеты, отчеты о прибылях и убытках)
- Данные о форексе и криптовалютах

**Задержка данных:** 15-20 минут, что идеально подходит для долгосрочных инвесторов.  
**Ограничения:** Бесплатный план ограничен 5 API-запросами в минуту и 500 запросами в день.  
**Ссылка:** [Alpha Vantage](https://www.alphavantage.co/)

### 3. Financial Modeling Prep (FMP)
**Описание:** FMP предоставляет финансовые данные и API для разработчиков и инвесторов.  
**Доступные данные:**
- Финансовые отчеты (до 5 лет)
- Профили компаний
- Финансовые коэффициенты
- Данные о дивидендах
- Исторические цены акций

**Задержка данных:** 15-30 минут для данных о ценах, финансовые отчеты обновляются ежеквартально.  
**Ограничения:** Бесплатный план имеет ограничения по количеству запросов и доступным данным.  
**Ссылка:** [Financial Modeling Prep](https://financialmodelingprep.com/)

### 4. IEX Cloud
**Описание:** IEX Cloud предоставляет финансовые данные через API.  
**Доступные данные:**
- Цены акций в реальном времени
- Исторические данные
- Фундаментальные данные компаний
- Новости и события

**Задержка данных:** Бесплатный план предоставляет данные с задержкой в 15 минут.  
**Ограничения:** Бесплатный план предоставляет ограниченное количество API-кредитов в месяц.  
**Ссылка:** [IEX Cloud](https://iexcloud.io/)

### 5. Quandl
**Описание:** Quandl предоставляет финансовые и экономические данные из различных источников.  
**Доступные данные:**
- Исторические цены акций
- Экономические показатели
- Данные о фьючерсах и опционах

**Задержка данных:** Большинство бесплатных наборов данных обновляются с задержкой в 1 день, что подходит для долгосрочного анализа.  
**Ограничения:** Многие наборы данных требуют платной подписки, но есть и бесплатные.  
**Ссылка:** [Quandl](https://www.quandl.com/)

### 6. FRED (Federal Reserve Economic Data)
**Описание:** База данных экономических исследований Федерального резервного банка Сент-Луиса.  
**Доступные данные:**
- Экономические показатели
- Процентные ставки
- Макроэкономические данные

**Задержка данных:** Данные обновляются по мере публикации официальной статистики, обычно с задержкой от нескольких дней до недель.  
**Ограничения:** Фокус на макроэкономических данных, а не на данных отдельных компаний.  
**Ссылка:** [FRED](https://fred.stlouisfed.org/)

### 7. Московская Биржа ISS API
**Описание:** Информационно-статистический сервер Московской биржи предоставляет доступ к данным о торгах на российском рынке.  
**Доступные данные:**
- Исторические цены акций российских компаний
- Данные о торгах в режиме реального времени
- Информация о ценных бумагах
- Индексы и индикаторы
- Обороты торгов

**Задержка данных:** Бесплатный доступ предоставляет данные с задержкой в 15 минут, что подходит для долгосрочных инвесторов.  
**Ограничения:** Нет явных ограничений на количество запросов, но рекомендуется кэширование данных.  
**Ссылка:** [MOEX ISS API](https://iss.moex.com/iss/reference/)

**Библиотеки для работы с API:**
- [apimoex](https://github.com/WLM1ke/apimoex) - Python-клиент для MOEX ISS
- [moex-api](https://github.com/timmson/moex-api) - JavaScript-клиент для MOEX ISS

### 8. Tradingview API (неофициальный)
**Описание:** Хотя Tradingview не предоставляет официальное API, существуют неофициальные библиотеки для доступа к данным.  
**Доступные данные:**
- Исторические цены акций
- Технические индикаторы
- Данные по различным биржам мира

**Задержка данных:** 15-30 минут для большинства бирж в бесплатном режиме.  
**Ограничения:** Неофициальное API может быть нестабильным и изменяться без предупреждения.  
**Ссылка:** [Tradingview](https://www.tradingview.com/)

### 9. Finnhub
**Описание:** Finnhub предоставляет API для доступа к финансовым данным.  
**Доступные данные:**
- Цены акций
- Финансовые отчеты
- Новости и настроения
- Данные по IPO и инсайдерским сделкам

**Задержка данных:** Бесплатный план предоставляет данные с задержкой в 15 минут.  
**Ограничения:** Бесплатный план ограничен 60 API-запросами в минуту.  
**Ссылка:** [Finnhub](https://finnhub.io/)

## Платные источники данных с низкой стоимостью

### 1. Polygon.io
**Описание:** Polygon предоставляет API для получения данных о акциях, форексе и криптовалютах.  
**Доступные данные:**
- Данные о ценах в реальном времени
- Исторические данные с высокой частотой
- Фундаментальные данные компаний
- Новости и события

**Задержка данных:** Базовый план предоставляет данные с задержкой в 15 минут, что подходит для долгосрочных инвесторов.  
**Стоимость:** От $29/месяц для базового плана.  
**Ссылка:** [Polygon.io](https://polygon.io/)

### 2. Tiingo
**Описание:** Tiingo предоставляет финансовые данные и аналитику.  
**Доступные данные:**
- Исторические цены акций
- Фундаментальные данные
- Новости и аналитика

**Задержка данных:** Данные предоставляются с задержкой в 15-20 минут в базовом плане.  
**Стоимость:** От $10/месяц.  
**Ссылка:** [Tiingo](https://www.tiingo.com/)

### 3. EOD Historical Data
**Описание:** EOD Historical Data предоставляет данные о ценах закрытия, фундаментальные данные и многое другое.  
**Доступные данные:**
- Исторические цены акций (EOD)
- Фундаментальные данные
- Данные о дивидендах
- Данные о сплитах
- Финансовые отчеты

**Задержка данных:** Данные обновляются в конце торгового дня, что идеально подходит для долгосрочных инвесторов.  
**Стоимость:** От $19.99/месяц.  
**Ссылка:** [EOD Historical Data](https://eodhistoricaldata.com/)

### 4. Marketstack
**Описание:** Marketstack предоставляет API для получения исторических и текущих данных о ценах акций.  
**Доступные данные:**
- Исторические цены акций
- Данные в реальном времени (с задержкой)
- Поддержка более 70 бирж по всему миру

**Задержка данных:** Базовый план предоставляет данные с задержкой в 1 час, что подходит для долгосрочных инвесторов.  
**Стоимость:** От $9.99/месяц.  
**Ссылка:** [Marketstack](https://marketstack.com/)

### 5. Intrinio
**Описание:** Intrinio предоставляет финансовые данные для разработчиков и инвесторов.  
**Доступные данные:**
- Цены акций
- Фундаментальные данные
- Финансовые отчеты
- Экономические данные

**Задержка данных:** Базовый план предоставляет данные с задержкой в 15 минут.  
**Стоимость:** От $25/месяц для индивидуальных инвесторов.  
**Ссылка:** [Intrinio](https://intrinio.com/)

### 6. Смарт-Лаб
**Описание:** Российский сервис для инвесторов с данными по российскому рынку.  
**Доступные данные:**
- Финансовые отчеты российских компаний
- Дивидендная история
- Аналитика и новости
- Данные по мультипликаторам

**Задержка данных:** Данные обновляются ежедневно, что подходит для долгосрочных инвесторов.  
**Стоимость:** От 299 руб/месяц.  
**Ссылка:** [Смарт-Лаб](https://smart-lab.ru/)

### 7. Investing.com API
**Описание:** Investing.com предоставляет API для доступа к финансовым данным.  
**Доступные данные:**
- Исторические цены акций
- Данные по форексу и криптовалютам
- Экономические показатели
- Новости и аналитика

**Задержка данных:** Базовый план предоставляет данные с задержкой в 15-20 минут.  
**Стоимость:** От $14.99/месяц.  
**Ссылка:** [Investing.com](https://www.investing.com/)

## Рекомендации по интеграции

Для нашего приложения анализа акций рекомендуется использовать комбинацию источников данных:

1. **Для базовой информации о ценах и основных показателях:**
   - Yahoo Finance API через библиотеку `yfinance` (Python) или аналогичные
   - Alpha Vantage (с учетом ограничений на запросы)
   - Для российских акций: MOEX ISS API через библиотеку `apimoex`

2. **Для фундаментальных данных и финансовых отчетов:**
   - Financial Modeling Prep (FMP)
   - EOD Historical Data (платный вариант с разумной ценой)
   - Для российских компаний: Смарт-Лаб или данные с сайтов компаний

3. **Для расширенной аналитики и специализированных данных:**
   - Polygon.io или Tiingo (платные варианты)

## Структура хранения данных в PostgreSQL

Для эффективного хранения и обработки данных о акциях рекомендуется использовать PostgreSQL с JSONB для хранения гибких структур данных. Ниже представлена предлагаемая структура базы данных:

### 1. Основные таблицы

#### Таблица `stocks`
```sql
CREATE TABLE stocks (
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
CREATE INDEX idx_stocks_sector ON stocks(sector);
```

#### Таблица `stock_data`
```sql
CREATE TABLE stock_data (
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
CREATE INDEX idx_stock_data_source ON stock_data(source);
```

#### Таблица `financial_statements`
```sql
CREATE TABLE financial_statements (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    statement_type VARCHAR(20) NOT NULL, -- 'income', 'balance', 'cash_flow'
    period_type VARCHAR(10) NOT NULL, -- 'annual', 'quarterly'
    fiscal_date DATE NOT NULL,
    raw_data JSONB NOT NULL,
    processed_data JSONB NOT NULL,
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stock_id, statement_type, period_type, fiscal_date)
);

CREATE INDEX idx_financial_statements_stock_id ON financial_statements(stock_id);
CREATE INDEX idx_financial_statements_fiscal_date ON financial_statements(fiscal_date);
```

#### Таблица `portfolio`
```sql
CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Таблица `portfolio_stocks`
```sql
CREATE TABLE portfolio_stocks (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolio(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    shares NUMERIC(15, 6) NOT NULL DEFAULT 0,
    average_price NUMERIC(15, 6) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, stock_id)
);

CREATE INDEX idx_portfolio_stocks_portfolio_id ON portfolio_stocks(portfolio_id);
CREATE INDEX idx_portfolio_stocks_stock_id ON portfolio_stocks(stock_id);
```

### 2. Пример структуры JSONB для хранения данных

#### Пример `raw_data` в таблице `stock_data`
```json
{
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
}
```

#### Пример `processed_data` в таблице `stock_data`
```json
{
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
}
```

#### Пример `raw_data` в таблице `financial_statements`
```json
{
  "source": "financial_modeling_prep",
  "timestamp": "2023-05-15T15:30:00Z",
  "data": {
    "revenue": 365817000000,
    "costOfRevenue": 212981000000,
    "grossProfit": 152836000000,
    "operatingExpenses": 43887000000,
    "operatingIncome": 108949000000,
    "netIncome": 94680000000,
    "eps": 5.89
  }
}
```

#### Пример `processed_data` в таблице `financial_statements`
```json
{
  "revenue": 365817000000,
  "costOfRevenue": 212981000000,
  "grossProfit": 152836000000,
  "grossMargin": 41.78,
  "operatingExpenses": 43887000000,
  "operatingIncome": 108949000000,
  "operatingMargin": 29.78,
  "netIncome": 94680000000,
  "netMargin": 25.88,
  "eps": 5.89,
  "growth": {
    "revenueYoY": 8.1,
    "netIncomeYoY": 5.4,
    "epsYoY": 7.2
  }
}
```

### 3. Процесс обновления данных

1. **Ежедневное обновление данных о ценах:**
   ```sql
   -- Пример запроса для вставки новых данных
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
       created_at = CURRENT_TIMESTAMP;
   ```

2. **Обновление финансовых отчетов (ежеквартально):**
   ```sql
   -- Пример запроса для вставки новых финансовых данных
   INSERT INTO financial_statements (stock_id, statement_type, period_type, fiscal_date, raw_data, processed_data, source)
   VALUES (
       (SELECT id FROM stocks WHERE symbol = 'AAPL'),
       'income',
       'quarterly',
       '2023-03-31',
       '{"source": "financial_modeling_prep", "timestamp": "2023-05-15T15:30:00Z", "data": {...}}',
       '{"revenue": 365817000000, "costOfRevenue": 212981000000, ...}',
       'financial_modeling_prep'
   )
   ON CONFLICT (stock_id, statement_type, period_type, fiscal_date)
   DO UPDATE SET
       raw_data = EXCLUDED.raw_data,
       processed_data = EXCLUDED.processed_data,
       updated_at = CURRENT_TIMESTAMP;
   ```

3. **Обновление данных портфеля:**
   ```sql
   -- Пример запроса для обновления портфеля
   UPDATE portfolio_stocks
   SET shares = 100, average_price = 145.50, updated_at = CURRENT_TIMESTAMP
   WHERE portfolio_id = 1 AND stock_id = (SELECT id FROM stocks WHERE symbol = 'AAPL');
   ```

## Пример использования MOEX ISS API

Пример получения исторических данных по акции Сбербанка (SBER) с использованием библиотеки `apimoex` для Python:

```python
import requests
import pandas as pd
import apimoex
import json
import psycopg2
from datetime import datetime

# Получение данных
with requests.Session() as session:
    data = apimoex.get_board_history(session, 'SBER')
    df = pd.DataFrame(data)
    
    # Подключение к базе данных
    conn = psycopg2.connect("dbname=stock_analytics user=postgres password=password")
    cur = conn.cursor()
    
    # Получение ID акции
    cur.execute("SELECT id FROM stocks WHERE symbol = 'SBER'")
    stock_id = cur.fetchone()[0]
    
    # Обработка и сохранение данных
    for index, row in df.iterrows():
        date = row['TRADEDATE']
        
        # Формирование JSON с исходными данными
        raw_data = {
            "source": "moex",
            "timestamp": datetime.now().isoformat(),
            "data": row.to_dict()
        }
        
        # Формирование JSON с обработанными данными
        processed_data = {
            "price": row['CLOSE'],
            "open": row['OPEN'] if 'OPEN' in row else None,
            "high": row['HIGH'] if 'HIGH' in row else None,
            "low": row['LOW'] if 'LOW' in row else None,
            "volume": row['VOLUME'],
            "value": row['VALUE']
        }
        
        # Вставка данных в базу
        cur.execute("""
            INSERT INTO stock_data (stock_id, date, raw_data, processed_data, source)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (stock_id, date, source)
            DO UPDATE SET
                raw_data = EXCLUDED.raw_data,
                processed_data = EXCLUDED.processed_data,
                created_at = CURRENT_TIMESTAMP
        """, (stock_id, date, json.dumps(raw_data), json.dumps(processed_data), 'moex'))
    
    conn.commit()
    cur.close()
    conn.close()
```

Пример получения текущих данных по акции Газпрома (GAZP) с использованием библиотеки `moex-api` для JavaScript и сохранения в PostgreSQL:

```javascript
const MoexAPI = require("moex-api");
const { Pool } = require('pg');
const moexApi = new MoexAPI();

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stock_analytics',
  password: 'password',
  port: 5432,
});

async function updateGazpromData() {
  try {
    // Получение данных от MOEX API
    const security = await moexApi.securityMarketData("GAZP");
    
    // Получение ID акции из базы данных
    const stockResult = await pool.query('SELECT id FROM stocks WHERE symbol = $1', ['GAZP']);
    const stockId = stockResult.rows[0].id;
    
    // Текущая дата
    const today = new Date().toISOString().split('T')[0];
    
    // Формирование JSON с исходными данными
    const rawData = {
      source: "moex",
      timestamp: new Date().toISOString(),
      data: security
    };
    
    // Формирование JSON с обработанными данными
    const processedData = {
      price: security.node.last,
      open: security.node.open,
      high: security.node.high,
      low: security.node.low,
      volume: security.node.voltoday,
      change: security.node.change,
      changePercent: security.node.changeprcnt
    };
    
    // Вставка данных в базу
    await pool.query(`
      INSERT INTO stock_data (stock_id, date, raw_data, processed_data, source)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (stock_id, date, source)
      DO UPDATE SET
        raw_data = EXCLUDED.raw_data,
        processed_data = EXCLUDED.processed_data,
        created_at = CURRENT_TIMESTAMP
    `, [stockId, today, JSON.stringify(rawData), JSON.stringify(processedData), 'moex']);
    
    console.log('Данные по GAZP успешно обновлены');
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  } finally {
    // Закрытие пула соединений
    await pool.end();
  }
}

updateGazpromData();
``` 