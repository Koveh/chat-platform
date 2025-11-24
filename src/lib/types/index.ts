export interface Stock {
  symbol: string;           // Тикер акции
  name: string;             // Название компании
  price: number;            // Текущая цена
  change: number;           // Изменение цены
  changePercent: number;    // Процент изменения
  currency: string;         // Валюта
  sector: string;           // Сектор
  industry: string;         // Индустрия
  
  // Финансовые показатели
  financials: {
    // Цена
    priceToEarnings: number;        // P/E
    priceToSales: number;           // P/S
    priceToBook: number;            // P/B
    priceToOperatingCashFlow: number; // P/OCF
    priceToCashFlow: number;        // P/CF
    
    // Стоимость
    marketCap: number;              // Рыночная капитализация
    enterpriseValue: number;        // Стоимость предприятия
    evToEBITDA: number;             // EV/EBITDA
    evToSales: number;              // EV/Sales
    evToEBIT: number;               // EV/EBIT
    
    // Дивиденды
    dividendPerShare: number;       // Дивиденд на акцию
    dividendYield: number;          // Дивидендная доходность
    dividendPayout: number;         // Коэффициент выплаты дивидендов
    fcfYield: number;               // Доходность по свободному денежному потоку
    
    // Рентабельность
    returnOnAssets: number;         // ROA
    returnOnEquity: number;         // ROE
    returnOnCapitalEmployed: number; // ROCE
    returnOnInvestedCapital: number; // ROIC
    returnOnSales: number;          // ROS
    
    // Маржинальность
    grossMargin: number;            // Валовая маржа
    ebitdaMargin: number;           // Маржа EBITDA
    ebitMargin: number;             // Маржа EBIT
    ebtMargin: number;              // Маржа EBT
    netMargin: number;              // Чистая маржа
    
    // Долг
    debtToAssets: number;           // Отношение долга к активам
    debtToEquity: number;           // Отношение долга к капиталу
    operatingCashFlowToDebt: number; // OCF/Debt
    financialLeverage: number;      // Финансовый рычаг
    interestCoverageRatio: number;  // Коэффициент покрытия процентов
    
    // Ликвидность
    currentRatio: number;           // Текущий коэффициент
    quickRatio: number;             // Быстрый коэффициент
    cashRatio: number;              // Денежный коэффициент
    assetTurnover: number;          // Оборачиваемость активов
    fixedAssetTurnover: number;     // Оборачиваемость основных средств
    
    // Рост
    revenueGrowth5y: number;        // Рост выручки за 5 лет
    revenueGrowth10y: number;       // Рост выручки за 10 лет
    ebitGrowth5y: number;           // Рост EBIT за 5 лет
    ebitGrowth10y: number;          // Рост EBIT за 10 лет
    netIncomeGrowth5y: number;      // Рост чистой прибыли за 5 лет
    netIncomeGrowth10y: number;     // Рост чистой прибыли за 10 лет
    epsGrowth5y: number;            // Рост EPS за 5 лет
    epsGrowth10y: number;           // Рост EPS за 10 лет
    freeCashFlowGrowth5y: number;   // Рост свободного денежного потока за 5 лет
    freeCashFlowGrowth10y: number;  // Рост свободного денежного потока за 10 лет
    
    // Оценка
    altmanZScore: number;           // Z-счет Альтмана
    piotroskiFScore: number;        // F-счет Пиотроски
  }
  
  // Данные для графиков
  charts: {
    revenue: number[];              // Выручка по годам
    grossProfit: number[];          // Валовая прибыль по годам
    ebitda: number[];               // EBITDA по годам
    ebit: number[];                 // EBIT по годам
    ebt: number[];                  // EBT по годам
    netIncome: number[];            // Чистая прибыль по годам
    expenses: {                     // Расходы
      rnd: number;                  // R&D
      ga: number;                   // G&A
      da: number;                   // D&A
      tax: number;                  // Tax
      interest: number;             // Interest
    }
  }
  
  // Сравнение с сектором
  sectorComparison: SectorComparison;
  
  // Сравнение со страной
  countryComparison: CountryComparison;
  
  // Финансовые показатели для воронки
  funnel: {
    totalRevenue: number;           // Общая выручка
    grossProfit: number;            // Валовая прибыль
    ebitda: number;                 // EBITDA
    ebit: number;                   // EBIT
    ebt: number;                    // EBT
    netIncome: number;              // Чистая прибыль
  }
  
  // Баланс
  balanceSheet: BalanceSheet;
  
  // Структура собственности
  ownership: Ownership;
}

// Интерфейс для баланса
export interface BalanceSheet {
  // Активы
  assets: {
    // Оборотные активы
    current: {
      cash: number;                 // Денежные средства
      shortTermInvestments: number; // Краткосрочные инвестиции
      accountsReceivable: number;   // Дебиторская задолженность
      inventory: number;            // Запасы
      otherCurrentAssets: number;   // Прочие оборотные активы
      totalCurrent: number;         // Всего оборотных активов
    },
    // Внеоборотные активы
    nonCurrent: {
      propertyPlantEquipment: number; // Основные средства
      goodwill: number;             // Гудвилл
      intangibleAssets: number;     // Нематериальные активы
      longTermInvestments: number;  // Долгосрочные инвестиции
      otherNonCurrentAssets: number; // Прочие внеоборотные активы
      totalNonCurrent: number;      // Всего внеоборотных активов
    },
    totalAssets: number;            // Всего активов
  },
  
  // Обязательства
  liabilities: {
    // Краткосрочные обязательства
    current: {
      accountsPayable: number;      // Кредиторская задолженность
      shortTermDebt: number;        // Краткосрочные займы
      currentPortionLTD: number;    // Текущая часть долгосрочного долга
      otherCurrentLiabilities: number; // Прочие краткосрочные обязательства
      totalCurrent: number;         // Всего краткосрочных обязательств
    },
    // Долгосрочные обязательства
    nonCurrent: {
      longTermDebt: number;         // Долгосрочные займы
      deferredTaxLiabilities: number; // Отложенные налоговые обязательства
      otherNonCurrentLiabilities: number; // Прочие долгосрочные обязательства
      totalNonCurrent: number;      // Всего долгосрочных обязательств
    },
    totalLiabilities: number;       // Всего обязательств
  },
  
  // Капитал
  equity: {
    commonStock: number;            // Обыкновенные акции
    retainedEarnings: number;       // Нераспределенная прибыль
    treasuryStock: number;          // Выкупленные акции
    otherEquity: number;            // Прочий капитал
    totalEquity: number;            // Всего капитал
  },
  
  // Годы для данных баланса
  years: string[];                  // Годы, за которые представлены данные
}

// Интерфейс для структуры собственности
export interface Ownership {
  // Институциональные инвесторы
  institutional: {
    percentage: number;             // Процент акций у институциональных инвесторов
    holders: OwnershipHolder[];     // Список крупнейших институциональных инвесторов
  },
  // Инсайдеры
  insiders: {
    percentage: number;             // Процент акций у инсайдеров
    holders: OwnershipHolder[];     // Список крупнейших инсайдеров
  },
  // Публичные акции
  public: number;                   // Процент акций в свободном обращении
  // Выкупленные акции
  treasury: number;                 // Процент выкупленных компанией акций
  // Общее количество акций
  sharesOutstanding: number;        // Общее количество акций в обращении
  // Дата обновления данных
  asOfDate: string;                 // Дата, на которую актуальны данные
}

// Интерфейс для держателя акций
export interface OwnershipHolder {
  name: string;                     // Название организации или имя инсайдера
  position?: string;                // Должность (для инсайдеров)
  shares: number;                   // Количество акций
  value: number;                    // Стоимость пакета
  percentage: number;               // Процент от общего количества акций
  change?: number;                  // Изменение за последний отчетный период
}

export interface SectorComparison {
  medianPE: number;               // Медианный P/E по сектору
  fairPrice: number;              // Справедливая цена акции
  companies: number;              // Количество компаний в секторе
}

export interface CountryComparison {
  medianPE: number;               // Медианный P/E по стране
  companies: number;              // Количество компаний в стране
}

export interface StockMetric {
  label: string;
  value: number | string;
  unit?: string;
  description?: string;
}

export interface MetricGroup {
  title: string;
  metrics: StockMetric[];
}

export interface ComparisonData {
  min: number;
  max: number;
  median: number;
  current: number;
  fairValue?: number;
}

export interface ExpenseData {
  name: string;
  value: number;
  color: string;
}

export interface FunnelData {
  name: string;
  value: number;
  percent: number;
}

export interface GrowthData {
  year: string;
  value: number;
  projected?: boolean;
} 