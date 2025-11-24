
# Схема базы данных для хранения финансовой информации об акциях

## Введение

База данных спроектирована для хранения и управления финансовой информацией о акциях с различной частотой обновления. Ключевыми принципами проектирования являются:

1. **Разделение таблиц по частоте обновления**: высокочастотные (каждую минуту), среднечастотные (каждые 10 минут или каждый час) и низкочастотные (ежедневно или реже)
2. **Использование Slowly Changing Dimension Type 2 (SCD2)** для исторических данных
3. **Хранение только запрашиваемых акций** для оптимизации использования хранилища
4. **Нормализация данных** для минимизации дублирования
5. **Многоисточниковый подход**: сбор данных из разных источников (Tinkoff, Yahoo Finance, РБК и др.)

## Основные таблицы

### Справочные таблицы

#### 1. `sources` - Источники данных

```sql
CREATE TABLE sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    priority INTEGER DEFAULT 5,  -- Приоритет источника (1 - самый высокий)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Первоначальные данные
INSERT INTO sources (name, description, website, priority) VALUES
('Yahoo Finance', 'Глобальный источник финансовой информации', 'https://finance.yahoo.com', 1),
('Tinkoff', 'Российский брокер и финансовая платформа', 'https://www.tinkoff.ru', 1),
('РБК', 'Российский бизнес-портал', 'https://www.rbc.ru', 2),
('Московская Биржа', 'Российская фондовая биржа', 'https://www.moex.com', 2),
('Bloomberg', 'Глобальный источник финансовой информации', 'https://www.bloomberg.com', 1),
('MarketWatch', 'Американский источник финансовой информации', 'https://www.marketwatch.com', 3);
```

#### 2. `sectors` - Секторы экономики

```sql
CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Первоначальные данные
INSERT INTO sectors (name) VALUES
('Technology'),
('Healthcare'),
('Consumer Cyclical'),
('Financial Services'),
('Communication Services'),
('Industrial'),
('Consumer Defensive'),
('Energy'),
('Basic Materials'),
('Real Estate'),
('Utilities'),
('Electronic Technology'),
('Finance'),
('Retail Trade');
```

#### 3. `industries` - Отрасли

```sql
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    sector_id INTEGER REFERENCES sectors(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Первоначальные данные
INSERT INTO industries (sector_id, name) VALUES
(12, 'Telecommunications Equipment'),
(12, 'Computer Hardware'),
(12, 'Electronic Components'),
(12, 'Semiconductors'),
(13, 'Investment Banks/Brokers'),
(13, 'Commercial Banks'),
(13, 'Insurance'),
(14, 'Internet Retail'),
(14, 'Department Stores'),
(14, 'Specialty Stores');
```

#### 4. `exchanges` - Биржи

```sql
CREATE TABLE exchanges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    timezone VARCHAR(50),
    trading_hours VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Первоначальные данные
INSERT INTO exchanges (name, country, timezone, trading_hours) VALUES
('NASDAQ', 'США', 'America/New_York', '9:30-16:00'),
('NYSE', 'США', 'America/New_York', '9:30-16:00'),
('MOEX', 'Россия', 'Europe/Moscow', '10:00-18:50'),
('LSE', 'Великобритания', 'Europe/London', '8:00-16:30'),
('TSE', 'Япония', 'Asia/Tokyo', '9:00-15:00'),
('HKEX', 'Гонконг', 'Asia/Hong_Kong', '9:30-16:00'),
('SSE', 'Китай', 'Asia/Shanghai', '9:30-15:00');
```

#### 5. `stocks` - Основная информация о акциях

```sql
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(20) NOT NULL,
    isin VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    sector_id INTEGER REFERENCES sectors(id),
    industry_id INTEGER REFERENCES industries(id),
    exchange_id INTEGER REFERENCES exchanges(id),
    currency VARCHAR(10) NOT NULL,
    country VARCHAR(50),
    founded_year INTEGER,
    description TEXT,
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Таблицы данных с высокой частотой обновления (каждую минуту)

#### 6. `stock_prices` - Цены акций

```sql
CREATE TABLE stock_prices (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    price DECIMAL(18, 4) NOT NULL,
    price_change DECIMAL(18, 4),
    price_change_percent DECIMAL(10, 4),
    volume BIGINT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (stock_id, source_id, timestamp)
);

-- Индексы для повышения производительности запросов
CREATE INDEX idx_stock_prices_stock_id ON stock_prices(stock_id);
CREATE INDEX idx_stock_prices_timestamp ON stock_prices(timestamp);
CREATE INDEX idx_stock_prices_stock_timestamp ON stock_prices(stock_id, timestamp);
```

#### 7. `stock_intraday` - Внутридневные данные

```sql
CREATE TABLE stock_intraday (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    open_price DECIMAL(18, 4),
    high_price DECIMAL(18, 4),
    low_price DECIMAL(18, 4),
    close_price DECIMAL(18, 4),
    volume BIGINT,
    interval_minutes INTEGER NOT NULL, -- 1, 5, 15, 30, 60
    timestamp TIMESTAMP NOT NULL,
    UNIQUE (stock_id, source_id, interval_minutes, timestamp)
);

-- Индексы
CREATE INDEX idx_stock_intraday_stock_id ON stock_intraday(stock_id);
CREATE INDEX idx_stock_intraday_timestamp ON stock_intraday(timestamp);
CREATE INDEX idx_stock_intraday_interval ON stock_intraday(interval_minutes);
```

### Таблицы данных со средней частотой обновления (10 минут, 1 час)

#### 8. `stock_metrics_hourly` - Ключевые метрики, обновляемые ежечасно

```sql
CREATE TABLE stock_metrics_hourly (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    price DECIMAL(18, 4),
    market_cap DECIMAL(24, 2),
    pe_ratio DECIMAL(16, 4),
    ps_ratio DECIMAL(16, 4),
    pb_ratio DECIMAL(16, 4),
    dividend_yield DECIMAL(10, 4),
    volume_avg_30min BIGINT,
    price_change_day DECIMAL(10, 4),
    price_change_percent_day DECIMAL(10, 4),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (stock_id, source_id, timestamp)
);

-- Индексы
CREATE INDEX idx_stock_metrics_hourly_stock_id ON stock_metrics_hourly(stock_id);
CREATE INDEX idx_stock_metrics_hourly_timestamp ON stock_metrics_hourly(timestamp);
```

#### 9. `stock_orderbook` - Стакан заявок (обновление каждые 10 минут)

```sql
CREATE TABLE stock_orderbook (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    data JSONB, -- Хранение полного стакана в JSON формате
    UNIQUE (stock_id, source_id, timestamp)
);

-- Индексы
CREATE INDEX idx_stock_orderbook_stock_id ON stock_orderbook(stock_id);
CREATE INDEX idx_stock_orderbook_timestamp ON stock_orderbook(timestamp);
```

### Таблицы данных с низкой частотой обновления (ежедневно или реже)

#### 10. `stock_daily_performance` - Ежедневные показатели эффективности

```sql
CREATE TABLE stock_daily_performance (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    open_price DECIMAL(18, 4),
    high_price DECIMAL(18, 4),
    low_price DECIMAL(18, 4),
    close_price DECIMAL(18, 4),
    adjusted_close DECIMAL(18, 4),
    volume BIGINT,
    dividend DECIMAL(18, 4),
    split_coefficient DECIMAL(10, 4),
    effective_date TIMESTAMP DEFAULT NOW(), -- Дата вступления данных в силу
    is_actual BOOLEAN DEFAULT TRUE, -- Признак актуальности записи (для SCD Type 2)
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_daily_perf_stock_id ON stock_daily_performance(stock_id);
CREATE INDEX idx_stock_daily_perf_date ON stock_daily_performance(date);
CREATE INDEX idx_stock_daily_perf_is_actual ON stock_daily_performance(is_actual);
```

#### 11. `stock_financial_ratios` - Финансовые коэффициенты

```sql
CREATE TABLE stock_financial_ratios (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    pe_ratio DECIMAL(16, 4),
    forward_pe DECIMAL(16, 4),
    ps_ratio DECIMAL(16, 4),
    pb_ratio DECIMAL(16, 4),
    p_ocf_ratio DECIMAL(16, 4), -- Price to Operating Cash Flow
    p_cf_ratio DECIMAL(16, 4), -- Price to Cash Flow
    ev_ebitda DECIMAL(16, 4),
    ev_revenue DECIMAL(16, 4),
    market_cap DECIMAL(24, 2),
    enterprise_value DECIMAL(24, 2),
    sector_median_pe DECIMAL(16, 4),
    country_median_pe DECIMAL(16, 4),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE, -- Признак актуальности записи (для SCD Type 2)
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_financial_ratios_stock_id ON stock_financial_ratios(stock_id);
CREATE INDEX idx_stock_financial_ratios_date ON stock_financial_ratios(date);
CREATE INDEX idx_stock_financial_ratios_is_actual ON stock_financial_ratios(is_actual);
```

#### 12. `stock_dividend_info` - Информация о дивидендах

```sql
CREATE TABLE stock_dividend_info (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    dividend_per_share DECIMAL(16, 4),
    dividend_payout_ratio DECIMAL(10, 4), -- в процентах
    dividend_yield DECIMAL(10, 4), -- в процентах
    fcf_yield DECIMAL(10, 4), -- в процентах
    ex_dividend_date DATE,
    payment_date DATE,
    record_date DATE,
    announcement_date DATE,
    frequency VARCHAR(20), -- Quarterly, Annual, etc.
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_dividend_info_stock_id ON stock_dividend_info(stock_id);
CREATE INDEX idx_stock_dividend_info_date ON stock_dividend_info(date);
CREATE INDEX idx_stock_dividend_info_is_actual ON stock_dividend_info(is_actual);
```

#### 13. `stock_ownership` - Структура собственности

```sql
CREATE TABLE stock_ownership (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    institutional_percent DECIMAL(10, 4),
    insider_percent DECIMAL(10, 4),
    public_percent DECIMAL(10, 4),
    treasury_percent DECIMAL(10, 4),
    shares_outstanding BIGINT,
    float_shares BIGINT,
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_ownership_stock_id ON stock_ownership(stock_id);
CREATE INDEX idx_stock_ownership_date ON stock_ownership(date);
CREATE INDEX idx_stock_ownership_is_actual ON stock_ownership(is_actual);
```

#### 14. `stock_major_holders` - Крупные держатели акций

```sql
CREATE TABLE stock_major_holders (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    holder_type VARCHAR(20) NOT NULL, -- 'institutional' или 'insider'
    holder_name VARCHAR(255) NOT NULL,
    shares BIGINT,
    percent_change DECIMAL(10, 4),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, holder_name, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_major_holders_stock_id ON stock_major_holders(stock_id);
CREATE INDEX idx_stock_major_holders_date ON stock_major_holders(date);
CREATE INDEX idx_stock_major_holders_holder_type ON stock_major_holders(holder_type);
CREATE INDEX idx_stock_major_holders_is_actual ON stock_major_holders(is_actual);
```

#### 15. `stock_profitability` - Показатели рентабельности

```sql
CREATE TABLE stock_profitability (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    roa DECIMAL(10, 4), -- Return on Assets
    roe DECIMAL(10, 4), -- Return on Equity
    roce DECIMAL(10, 4), -- Return on Capital Employed
    roic DECIMAL(10, 4), -- Return on Invested Capital
    ros DECIMAL(10, 4), -- Return on Sales
    gross_margin DECIMAL(10, 4),
    ebitda_margin DECIMAL(10, 4),
    ebit_margin DECIMAL(10, 4),
    ebt_margin DECIMAL(10, 4), -- Earnings Before Tax
    net_margin DECIMAL(10, 4),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_profitability_stock_id ON stock_profitability(stock_id);
CREATE INDEX idx_stock_profitability_date ON stock_profitability(date);
CREATE INDEX idx_stock_profitability_is_actual ON stock_profitability(is_actual);
```

#### 16. `stock_debt_metrics` - Показатели долговой нагрузки

```sql
CREATE TABLE stock_debt_metrics (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    debt_to_assets DECIMAL(10, 4),
    debt_to_equity DECIMAL(10, 4),
    ocf_to_debt DECIMAL(10, 4), -- Operating Cash Flow to Debt
    leverage DECIMAL(10, 4),
    interest_coverage DECIMAL(10, 4),
    current_ratio DECIMAL(10, 4),
    quick_ratio DECIMAL(10, 4),
    cash_ratio DECIMAL(10, 4),
    asset_turnover DECIMAL(10, 4),
    fixed_asset_turnover DECIMAL(10, 4),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_debt_metrics_stock_id ON stock_debt_metrics(stock_id);
CREATE INDEX idx_stock_debt_metrics_date ON stock_debt_metrics(date);
CREATE INDEX idx_stock_debt_metrics_is_actual ON stock_debt_metrics(is_actual);
```

#### 17. `stock_balance_sheet` - Баланс компании

```sql
CREATE TABLE stock_balance_sheet (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'annual', 'quarterly'
    period_end_date DATE NOT NULL,
    total_assets DECIMAL(24, 2),
    current_assets DECIMAL(24, 2),
    cash_and_equivalents DECIMAL(24, 2),
    short_term_investments DECIMAL(24, 2),
    accounts_receivable DECIMAL(24, 2),
    inventory DECIMAL(24, 2),
    other_current_assets DECIMAL(24, 2),
    non_current_assets DECIMAL(24, 2),
    property_plant_equipment DECIMAL(24, 2),
    goodwill DECIMAL(24, 2),
    intangible_assets DECIMAL(24, 2),
    long_term_investments DECIMAL(24, 2),
    other_non_current_assets DECIMAL(24, 2),
    total_liabilities DECIMAL(24, 2),
    current_liabilities DECIMAL(24, 2),
    accounts_payable DECIMAL(24, 2),
    short_term_debt DECIMAL(24, 2),
    current_portion_long_term_debt DECIMAL(24, 2),
    other_current_liabilities DECIMAL(24, 2),
    non_current_liabilities DECIMAL(24, 2),
    long_term_debt DECIMAL(24, 2),
    deferred_taxes DECIMAL(24, 2),
    other_non_current_liabilities DECIMAL(24, 2),
    total_equity DECIMAL(24, 2),
    common_stock DECIMAL(24, 2),
    retained_earnings DECIMAL(24, 2),
    treasury_stock DECIMAL(24, 2),
    other_equity DECIMAL(24, 2),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, period_type, period_end_date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_balance_sheet_stock_id ON stock_balance_sheet(stock_id);
CREATE INDEX idx_stock_balance_sheet_date ON stock_balance_sheet(date);
CREATE INDEX idx_stock_balance_sheet_period_type ON stock_balance_sheet(period_type);
CREATE INDEX idx_stock_balance_sheet_is_actual ON stock_balance_sheet(is_actual);
```

#### 18. `stock_income_statement` - Отчет о прибылях и убытках

```sql
CREATE TABLE stock_income_statement (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'annual', 'quarterly', 'ttm'
    period_end_date DATE NOT NULL,
    total_revenue DECIMAL(24, 2),
    cost_of_revenue DECIMAL(24, 2),
    gross_profit DECIMAL(24, 2),
    operating_expenses DECIMAL(24, 2),
    research_development DECIMAL(24, 2),
    sga_expenses DECIMAL(24, 2), -- Selling, General & Administrative
    depreciation_amortization DECIMAL(24, 2),
    operating_income DECIMAL(24, 2),
    interest_expense DECIMAL(24, 2),
    other_income_expense DECIMAL(24, 2),
    income_before_tax DECIMAL(24, 2),
    income_tax DECIMAL(24, 2),
    net_income DECIMAL(24, 2),
    ebitda DECIMAL(24, 2),
    ebit DECIMAL(24, 2),
    eps_basic DECIMAL(16, 4),
    eps_diluted DECIMAL(16, 4),
    shares_outstanding_basic BIGINT,
    shares_outstanding_diluted BIGINT,
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, period_type, period_end_date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_income_statement_stock_id ON stock_income_statement(stock_id);
CREATE INDEX idx_stock_income_statement_date ON stock_income_statement(date);
CREATE INDEX idx_stock_income_statement_period_type ON stock_income_statement(period_type);
CREATE INDEX idx_stock_income_statement_is_actual ON stock_income_statement(is_actual);
```

#### 19. `stock_cash_flow` - Отчет о движении денежных средств

```sql
CREATE TABLE stock_cash_flow (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'annual', 'quarterly', 'ttm'
    period_end_date DATE NOT NULL,
    net_income DECIMAL(24, 2),
    depreciation_amortization DECIMAL(24, 2),
    changes_in_working_capital DECIMAL(24, 2),
    other_operating_activities DECIMAL(24, 2),
    operating_cash_flow DECIMAL(24, 2),
    capital_expenditures DECIMAL(24, 2),
    investments DECIMAL(24, 2),
    other_investing_activities DECIMAL(24, 2),
    investing_cash_flow DECIMAL(24, 2),
    debt_issuance_repayment DECIMAL(24, 2),
    common_stock_issuance_repurchase DECIMAL(24, 2),
    dividends_paid DECIMAL(24, 2),
    other_financing_activities DECIMAL(24, 2),
    financing_cash_flow DECIMAL(24, 2),
    free_cash_flow DECIMAL(24, 2),
    net_change_in_cash DECIMAL(24, 2),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, period_type, period_end_date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_cash_flow_stock_id ON stock_cash_flow(stock_id);
CREATE INDEX idx_stock_cash_flow_date ON stock_cash_flow(date);
CREATE INDEX idx_stock_cash_flow_period_type ON stock_cash_flow(period_type);
CREATE INDEX idx_stock_cash_flow_is_actual ON stock_cash_flow(is_actual);
```

#### 20. `stock_volatility` - Показатели волатильности

```sql
CREATE TABLE stock_volatility (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    beta DECIMAL(10, 4),
    volatility_30d DECIMAL(10, 4),
    volatility_90d DECIMAL(10, 4),
    volatility_1y DECIMAL(10, 4),
    sector_volatility DECIMAL(10, 4),
    market_volatility DECIMAL(10, 4),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_volatility_stock_id ON stock_volatility(stock_id);
CREATE INDEX idx_stock_volatility_date ON stock_volatility(date);
CREATE INDEX idx_stock_volatility_is_actual ON stock_volatility(is_actual);
```

#### 21. `stock_employee_count` - Динамика числа сотрудников

```sql
CREATE TABLE stock_employee_count (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    year INTEGER NOT NULL,
    employee_count INTEGER,
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, year, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_employee_count_stock_id ON stock_employee_count(stock_id);
CREATE INDEX idx_stock_employee_count_year ON stock_employee_count(year);
CREATE INDEX idx_stock_employee_count_is_actual ON stock_employee_count(is_actual);
```

#### 22. `stock_technical_indicators` - Технические индикаторы

```sql
CREATE TABLE stock_technical_indicators (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    source_id INTEGER REFERENCES sources(id),
    date DATE NOT NULL,
    ma_20 DECIMAL(18, 4),
    ma_50 DECIMAL(18, 4),
    ma_200 DECIMAL(18, 4),
    rsi_14 DECIMAL(10, 4),
    bollinger_upper DECIMAL(18, 4),
    bollinger_middle DECIMAL(18, 4),
    bollinger_lower DECIMAL(18, 4),
    macd DECIMAL(10, 4),
    macd_signal DECIMAL(10, 4),
    macd_histogram DECIMAL(10, 4),
    stochastic_k DECIMAL(10, 4),
    stochastic_d DECIMAL(10, 4),
    adx DECIMAL(10, 4),
    effective_date TIMESTAMP DEFAULT NOW(),
    is_actual BOOLEAN DEFAULT TRUE,
    UNIQUE (stock_id, source_id, date, is_actual)
);

-- Индексы
CREATE INDEX idx_stock_technical_indicators_stock_id ON stock_technical_indicators(stock_id);
CREATE INDEX idx_stock_technical_indicators_date ON stock_technical_indicators(date);
CREATE INDEX idx_stock_technical_indicators_is_actual ON stock_technical_indicators(is_actual);
```

### Таблицы для отслеживания поисковых запросов

#### 23. `stock_search_history` - История поисковых запросов

```sql
CREATE TABLE stock_search_history (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    user_id INTEGER, -- Может быть NULL для анонимных пользователей
    search_term VARCHAR(255), -- То, что искал пользователь
    timestamp TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(50),
    user_agent TEXT,
    search_result_count INTEGER -- Сколько результатов было найдено
);

-- Индексы
CREATE INDEX idx_stock_search_history_stock_id ON stock_search_history(stock_id);
CREATE INDEX idx_stock_search_history_user_id ON stock_search_history(user_id);
CREATE INDEX idx_stock_search_history_timestamp ON stock_search_history(timestamp);
```

#### 24. `data_update_jobs` - Отслеживание заданий по обновлению данных

```sql
CREATE TABLE data_update_jobs (
    id BIGSERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id),
    job_type VARCHAR(50) NOT NULL, -- 'price', 'financials', 'technical', etc.
    source_id INTEGER REFERENCES sources(id),
    scheduled_time TIMESTAMP NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    error_message TEXT,
    rows_affected INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_data_update_jobs_stock_id ON data_update_jobs(stock_id);
CREATE INDEX idx_data_update_jobs_job_type ON data_update_jobs(job_type);
CREATE INDEX idx_data_update_jobs_status ON data_update_jobs(status);
CREATE INDEX idx_data_update_jobs_scheduled_time ON data_update_jobs(scheduled_time);
```

## Представления для упрощения запросов

### 1. `vw_current_stock_prices` - Текущие цены акций

```sql
CREATE VIEW vw_current_stock_prices AS
SELECT 
    s.ticker,
    s.name,
    p.price,
    p.price_change,
    p.price_change_percent,
    p.volume,
    src.name AS source,
    p.timestamp
FROM 
    stocks s
JOIN 
    (
        SELECT 
            sp.stock_id,
            sp.source_id,
            sp.price,
            sp.price_change,
            sp.price_change_percent,
            sp.volume,
            sp.timestamp,
            ROW_NUMBER() OVER(PARTITION BY sp.stock_id ORDER BY sp.timestamp DESC) AS rn
        FROM 
            stock_prices sp
    ) p ON s.id = p.stock_id AND p.rn = 1
JOIN 
    sources src ON p.source_id = src.id
WHERE 
    s.is_active = TRUE;
```

### 2. `vw_current_financial_ratios` - Текущие финансовые коэффициенты

```sql
CREATE VIEW vw_current_financial_ratios AS
SELECT 
    s.ticker,
    s.name,
    fr.pe_ratio,
    fr.ps_ratio,
    fr.pb_ratio,
    fr.p_ocf_ratio,
    fr.p_cf_ratio,
    fr.ev_ebitda,
    fr.ev_revenue,
    fr.market_cap,
    fr.enterprise_value,
    src.name AS source,
    fr.date
FROM 
    stocks s
JOIN 
    stock_financial_ratios fr ON s.id = fr.stock_id AND fr.is_actual = TRUE
JOIN 
    sources src ON fr.source_id = src.id
WHERE 
    s.is_active = TRUE;
```

### 3. `vw_stock_performance_summary` - Сводка по эффективности акций

```sql
CREATE VIEW vw_stock_performance_summary AS
SELECT 
    s.ticker,
    s.name,
    sec.name AS sector,
    ind.name AS industry,
    exch.name AS exchange,
    sp.close_price AS latest_price,
    sp.close_price - sp.open_price AS price_change,
    (sp.close_price - sp.open_price) / sp.open_price * 100 AS price_change_percent,
    fr.pe_ratio,
    fr.market_cap,
    di.dividend_yield,
    v.beta,
    v.volatility_90d,
    prof.roe,
    prof.net_margin,
    src.name AS primary_source
FROM 
    stocks s
JOIN 
    sectors sec ON s.sector_id = sec.id
JOIN 
    industries ind ON s.industry_id = ind.id
JOIN 
    exchanges exch ON s.exchange_id = exch.id
LEFT JOIN 
    (
        SELECT 
            stock_id,
            source_id,
            open_price,
            close_price,
            date,
            ROW_NUMBER() OVER(PARTITION BY stock_id ORDER BY date DESC) AS rn
        FROM 
            stock_daily_performance
        WHERE 
            is_actual = TRUE
    ) sp ON s.id = sp.stock_id AND sp.rn = 1
LEFT JOIN 
    stock_financial_ratios fr ON s.id = fr.stock_id AND fr.is_actual = TRUE
LEFT JOIN 
    stock_dividend_info di ON s.id = di.stock_id AND di.is_actual = TRUE
LEFT JOIN 
    stock_volatility v ON s.id = v.stock_id AND v.is_actual = TRUE
LEFT JOIN 
    stock_profitability prof ON s.id = prof.stock_id AND prof.is_actual = TRUE
LEFT JOIN 
    sources src ON sp.source_id = src.id
WHERE 
    s.is_active = TRUE;
```

## Рекомендации по обновлению данных

Для оптимального управления данными рекомендуется следующая стратегия обновления:

### 1. Данные высокой частоты (1 минута)
- `stock_prices`: обновление каждую минуту для активно торгуемых акций
- `stock_intraday`: обновление каждую минуту для 1-минутных интервалов, реже для более крупных интервалов

### 2. Данные средней частоты (10 минут - 1 час)
- `stock_metrics_hourly`: обновление каждый час
- `stock_orderbook`: обновление каждые 10 минут для активно торгуемых акций

### 3. Данные низкой частоты (ежедневно или реже)
- `stock_daily_performance`: обновление раз в день после закрытия биржи
- `stock_financial_ratios`: обновление раз в день
- `stock_dividend_info`: обновление при изменении данных о дивидендах
- Остальные таблицы финансовой отчетности: обновление по мере выпуска новых отчетов (ежеквартально, ежегодно)

### 4. Стратегия SCD Type 2
Для таблиц, использующих Slowly Changing Dimension Type 2 (с полями `effective_date` и `is_actual`), процесс обновления должен включать:

1. Маркировку существующей записи как неактуальной (`is_actual = FALSE`)
2. Вставку новой записи с текущими данными и `is_actual = TRUE`
3. Это позволяет сохранять историю изменений и анализировать тренды

## Предлагаемые источники данных

### Для глобальных рынков:
1. **Yahoo Finance API** - охватывает большинство мировых бирж, предоставляет котировки, финансовые показатели, балансы
2. **Alpha Vantage** - всесторонние рыночные данные, включая внутридневные
3. **Finnhub** - мировые рынки с акцентом на реальные котировки
4. **Bloomberg API** - профессиональный источник с очень широким охватом (платный)

### Для российского рынка:
1. **Московская Биржа API** - официальный источник данных по российским бумагам
2. **Tinkoff Invest API** - хороший источник с акцентом на российский рынок
3. **РБК** - финансовая и биржевая информация с российской спецификой
4. **Investing.com** - имеет хорошее покрытие российского рынка

### Для новостей:
1. **РБК** - для российских новостей
2. **Bloomberg** - для глобальных новостей
3. **MarketWatch** - для американского рынка

## Дополнительные рекомендации

1. **Оптимизация данных**:
   - Создавать партиции для таблиц с большим объемом данных (например, `stock_prices`)
   - Регулярно архивировать старые данные в отдельные таблицы
   - Использовать компрессию для исторических данных

2. **Расширение функ
