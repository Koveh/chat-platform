import { Stock } from './types/index';

export const appleStock: Stock = {
  symbol: 'AAPL',
  name: 'Apple Inc',
  price: 133,
  change: 2.64,
  changePercent: 2.02,
  currency: 'USD',
  sector: 'Electronic Technology',
  industry: 'Telecommunications Equipment',
  
  financials: {
    // Цена
    priceToEarnings: 35.23,
    priceToSales: 7.66,
    priceToBook: 34.01,
    priceToOperatingCashFlow: 25.33,
    priceToCashFlow: 28.08,
    
    // Стоимость
    marketCap: 2252.29e9,
    enterpriseValue: 2328.32e9,
    evToEBITDA: 27.34,
    evToSales: 7.92,
    evToEBIT: 31.36,
    
    // Дивиденды
    dividendPerShare: 0.84,
    dividendYield: 0.63,
    dividendPayout: 22.14,
    fcfYield: 3.56,
    
    // Рентабельность
    returnOnAssets: 18.41,
    returnOnEquity: 82.09,
    returnOnCapitalEmployed: 32.28,
    returnOnInvestedCapital: 35.44,
    returnOnSales: 25.24,
    
    // Маржинальность
    grossMargin: 38.78,
    ebitdaMargin: 28.95,
    ebitMargin: 25.24,
    ebtMargin: 25.41,
    netMargin: 21.73,
    
    // Долг
    debtToAssets: 0.81,
    debtToEquity: 4.35,
    operatingCashFlowToDebt: 79.36,
    financialLeverage: 4.46,
    interestCoverageRatio: 27.24,
    
    // Ликвидность
    currentRatio: 1.16,
    quickRatio: 1.02,
    cashRatio: 27.18,
    assetTurnover: 0.85,
    fixedAssetTurnover: 7.85,
    
    // Рост
    revenueGrowth5y: 7.36,
    revenueGrowth10y: 8.46,
    ebitGrowth5y: 4.94,
    ebitGrowth10y: 4.84,
    netIncomeGrowth5y: 8.57,
    netIncomeGrowth10y: 6.75,
    epsGrowth5y: 15.23,
    epsGrowth10y: 12.22,
    freeCashFlowGrowth5y: 11.08,
    freeCashFlowGrowth10y: 6.36,
    
    // Оценка
    altmanZScore: 6.33,
    piotroskiFScore: 8
  },
  
  charts: {
    revenue: [294135, 274515, 260174, 265595, 233715, 215639, 229234, 182795, 170910, 156508],
    grossProfit: [114067, 106055, 101839, 104956, 88186, 84462, 87252, 70537, 66186, 63813],
    ebitda: [85159, 81344, 77344, 81801, 69348, 64121, 66713, 53483, 51630, 48999],
    ebit: [74253, 70898, 66288, 70898, 59531, 55256, 57411, 45687, 43987, 41733],
    ebt: [74752, 71649, 67091, 71649, 59531, 55256, 57411, 45687, 43987, 41733],
    netIncome: [63930, 59531, 57411, 59531, 48999, 45687, 43987, 39510, 37037, 33790],
    expenses: {
      rnd: 30.29,
      ga: 31.66,
      da: 16.97,
      tax: 16.84,
      interest: 4.24
    }
  },
  
  sectorComparison: {
    medianPE: 75.5,
    fairPrice: 161.423,
    companies: 223
  },
  
  countryComparison: {
    medianPE: 38,
    companies: 3463
  },
  
  funnel: {
    totalRevenue: 294135,
    grossProfit: 114067,
    ebitda: 85159,
    ebit: 74253,
    ebt: 74752,
    netIncome: 63930
  },
  
  // Баланс
  balanceSheet: {
    years: ['2023', '2022', '2021', '2020', '2019'],
    assets: {
      current: {
        cash: 29965000000,
        shortTermInvestments: 31590000000,
        accountsReceivable: 60932000000,
        inventory: 6331000000,
        otherCurrentAssets: 16443000000,
        totalCurrent: 113671000000
      },
      nonCurrent: {
        propertyPlantEquipment: 42519000000,
        goodwill: 0,
        intangibleAssets: 1249000000,
        longTermInvestments: 100500000000,
        otherNonCurrentAssets: 95391000000,
        totalNonCurrent: 239659000000
      },
      totalAssets: 353330000000
    },
    liabilities: {
      current: {
        accountsPayable: 62611000000,
        shortTermDebt: 13193000000,
        currentPortionLTD: 0,
        otherCurrentLiabilities: 60845000000,
        totalCurrent: 136649000000
      },
      nonCurrent: {
        longTermDebt: 95281000000,
        deferredTaxLiabilities: 0,
        otherNonCurrentLiabilities: 49848000000,
        totalNonCurrent: 145129000000
      },
      totalLiabilities: 281778000000
    },
    equity: {
      commonStock: 64849000000,
      retainedEarnings: 6309000000,
      treasuryStock: 0,
      otherEquity: 394000000,
      totalEquity: 71552000000
    }
  },
  
  // Структура собственности
  ownership: {
    institutional: {
      percentage: 61.3,
      holders: [
        {
          name: 'Vanguard Group Inc.',
          shares: 1347000000,
          value: 234042750000,
          percentage: 8.6,
          change: 0.2
        },
        {
          name: 'BlackRock Inc.',
          shares: 1080000000,
          value: 187650000000,
          percentage: 6.9,
          change: 0.1
        },
        {
          name: 'Berkshire Hathaway Inc.',
          shares: 915000000,
          value: 158981250000,
          percentage: 5.8,
          change: -0.3
        },
        {
          name: 'State Street Corporation',
          shares: 595000000,
          value: 103381250000,
          percentage: 3.8,
          change: -0.1
        },
        {
          name: 'FMR LLC',
          shares: 350000000,
          value: 60812500000,
          percentage: 2.2,
          change: 0.1
        }
      ]
    },
    insiders: {
      percentage: 0.7,
      holders: [
        {
          name: 'Tim Cook',
          position: 'Chief Executive Officer',
          shares: 3280000,
          value: 569900000,
          percentage: 0.021,
          change: 0.001
        },
        {
          name: 'Luca Maestri',
          position: 'Chief Financial Officer',
          shares: 110000,
          value: 19112500,
          percentage: 0.0007,
          change: 0.0001
        },
        {
          name: 'Jeff Williams',
          position: 'Chief Operating Officer',
          shares: 189000,
          value: 32838750,
          percentage: 0.0012,
          change: -0.0001
        },
        {
          name: 'Katherine Adams',
          position: 'General Counsel',
          shares: 75000,
          value: 13031250,
          percentage: 0.0005,
          change: 0.0
        },
        {
          name: "Deirdre O'Brien",
          position: 'Senior Vice President, Retail + People',
          shares: 136000,
          value: 23630000,
          percentage: 0.0009,
          change: 0.0001
        }
      ]
    },
    public: 32.0,
    treasury: 6.0,
    sharesOutstanding: 15634000000,
    asOfDate: '30.09.2023'
  },
  severity: 'low'
};

export const microsoftStock: Stock = {
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  price: 342.88,
  change: 1.23,
  changePercent: 0.36,
  currency: 'USD',
  sector: 'Technology Services',
  industry: 'Software',
  
  financials: {
    // Цена
    priceToEarnings: 37.12,
    priceToSales: 12.33,
    priceToBook: 14.56,
    priceToOperatingCashFlow: 28.45,
    priceToCashFlow: 30.12,
    
    // Стоимость
    marketCap: 2550.32e9,
    enterpriseValue: 2498.76e9,
    evToEBITDA: 25.67,
    evToSales: 12.08,
    evToEBIT: 28.45,
    
    // Дивиденды
    dividendPerShare: 2.72,
    dividendYield: 0.79,
    dividendPayout: 29.34,
    fcfYield: 2.78,
    
    // Рентабельность
    returnOnAssets: 15.67,
    returnOnEquity: 39.45,
    returnOnCapitalEmployed: 28.56,
    returnOnInvestedCapital: 30.12,
    returnOnSales: 33.23,
    
    // Маржинальность
    grossMargin: 68.34,
    ebitdaMargin: 47.12,
    ebitMargin: 42.45,
    ebtMargin: 41.89,
    netMargin: 33.23,
    
    // Долг
    debtToAssets: 0.45,
    debtToEquity: 0.87,
    operatingCashFlowToDebt: 156.78,
    financialLeverage: 2.34,
    interestCoverageRatio: 45.67,
    
    // Ликвидность
    currentRatio: 1.78,
    quickRatio: 1.65,
    cashRatio: 45.67,
    assetTurnover: 0.56,
    fixedAssetTurnover: 5.67,
    
    // Рост
    revenueGrowth5y: 12.45,
    revenueGrowth10y: 9.87,
    ebitGrowth5y: 15.67,
    ebitGrowth10y: 12.34,
    netIncomeGrowth5y: 16.78,
    netIncomeGrowth10y: 13.45,
    epsGrowth5y: 18.34,
    epsGrowth10y: 15.67,
    freeCashFlowGrowth5y: 14.56,
    freeCashFlowGrowth10y: 11.23,
    
    // Оценка
    altmanZScore: 7.45,
    piotroskiFScore: 9
  },
  
  charts: {
    revenue: [198270, 168088, 143015, 125843, 110360, 96571, 91154, 86833, 77849, 73723],
    grossProfit: [135572, 115856, 96937, 82933, 71924, 62310, 58374, 55147, 49968, 47852],
    ebitda: [93453, 80040, 65124, 53394, 45458, 38695, 36474, 33514, 29989, 28640],
    ebit: [84123, 71751, 57067, 45679, 38695, 32985, 30756, 27759, 24341, 22841],
    ebt: [83067, 70756, 56152, 44677, 37420, 31941, 29634, 26497, 22074, 20343],
    netIncome: [65878, 56220, 44281, 35058, 30267, 25489, 20539, 16798, 12193, 16425],
    expenses: {
      rnd: 24.56,
      ga: 18.34,
      da: 9.89,
      tax: 20.67,
      interest: 1.34
    }
  },
  
  sectorComparison: {
    medianPE: 42.3,
    fairPrice: 378.56,
    companies: 187
  },
  
  countryComparison: {
    medianPE: 38,
    companies: 3463
  },
  
  funnel: {
    totalRevenue: 198270,
    grossProfit: 135572,
    ebitda: 93453,
    ebit: 84123,
    ebt: 83067,
    netIncome: 65878
  },
  
  logo: '/logos/microsoft.svg',
  volume: 25600000,
  pe: 32.5,
  eps: 10.37,
  dividend: 3.00,
  dividendYield: 0.89,
  beta: 0.93,
  high52: 366.78,
  low52: 242.71,
  averageVolume: 27800000,
  description: 'Microsoft Corporation разрабатывает, лицензирует и поддерживает программное обеспечение, услуги, устройства и решения по всему миру. Компания работает в трех сегментах: Productivity and Business Processes, Intelligent Cloud и More Personal Computing. Microsoft была основана в 1975 году и базируется в Редмонде, штат Вашингтон.',
  country: 'США',
  employees: 221000,
  ceo: 'Сатья Наделла',
  founded: 1975,
  website: 'https://www.microsoft.com',
  headquarters: 'Редмонд, Вашингтон, США',
  revenue: [211915000000, 198270000000, 168088000000, 143015000000, 125843000000],
  revenueGrowth: [6.88, 17.96, 17.53, 13.65, 14.29],
  profit: [72361000000, 67430000000, 61271000000, 44281000000, 39240000000],
  profitGrowth: [7.31, 10.05, 38.37, 12.85, 21.65],
  profitMargin: [34.15, 34.01, 36.45, 30.96, 31.18],
  expenses: {
    'Исследования и разработка': 27155000000,
    'Продажи и маркетинг': 21825000000,
    'Общие и административные': 6265000000,
    'Прочие расходы': 3125000000
  },
  revenueEstimates: [235000000000, 258000000000, 282000000000, 305000000000],
  profitEstimates: [82000000000, 90000000000, 98000000000, 106000000000],
  analystRating: 4.5,
  analystCount: 38,
  priceTargetLow: 290,
  priceTargetAvg: 370,
  priceTargetHigh: 425,
  news: [
    {
      title: 'Microsoft инвестирует $10 млрд в OpenAI',
      date: '15.01.2023',
      source: 'TechCrunch',
      url: 'https://techcrunch.com',
      sentiment: 'positive'
    },
    {
      title: 'Выручка облачного бизнеса Azure выросла на 30%',
      date: '25.07.2023',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
      sentiment: 'positive'
    },
    {
      title: 'Microsoft представила новые функции ИИ для Office',
      date: '16.05.2023',
      source: 'The Verge',
      url: 'https://theverge.com',
      sentiment: 'positive'
    },
    {
      title: 'Регуляторы ЕС проверяют сделку Microsoft и Activision',
      date: '10.04.2023',
      source: 'Reuters',
      url: 'https://reuters.com',
      sentiment: 'negative'
    },
    {
      title: 'Microsoft сокращает 10,000 сотрудников',
      date: '18.01.2023',
      source: 'Wall Street Journal',
      url: 'https://wsj.com',
      sentiment: 'negative'
    }
  ],
  financialRatios: {
    pe: 32.5,
    forwardPe: 29.1,
    peg: 1.8,
    ps: 11.85,
    pb: 11.2,
    enterpriseValue: 2480000000000,
    evToRevenue: 11.7,
    evToEbitda: 24.3,
    roe: 38.1,
    roa: 18.6,
    debtToEquity: 42.1,
    currentRatio: 1.66,
    quickRatio: 1.53,
    operatingMargin: 42.1,
    netMargin: 34.15,
    returnOnAssets: 18.6,
    returnOnEquity: 38.1,
    fcfMargin: 32.8
  },
  sectorPeers: [
    {
      symbol: 'AAPL',
      name: 'Apple',
      price: 173.75,
      change: 1.25,
      changePercent: 0.72,
      marketCap: 2730000000000,
      pe: 28.7
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet',
      price: 125.3,
      change: 1.05,
      changePercent: 0.84,
      marketCap: 1580000000000,
      pe: 24.1
    },
    {
      symbol: 'AMZN',
      name: 'Amazon',
      price: 127.12,
      change: -0.56,
      changePercent: -0.44,
      marketCap: 1300000000000,
      pe: 98.2
    },
    {
      symbol: 'META',
      name: 'Meta Platforms',
      price: 301.26,
      change: 4.35,
      changePercent: 1.46,
      marketCap: 775000000000,
      pe: 26.3
    },
    {
      symbol: 'ORCL',
      name: 'Oracle',
      price: 116.24,
      change: 0.87,
      changePercent: 0.75,
      marketCap: 320000000000,
      pe: 38.1
    }
  ],
  countryPeers: [
    {
      symbol: 'AAPL',
      name: 'Apple',
      price: 173.75,
      change: 1.25,
      changePercent: 0.72,
      marketCap: 2730000000000,
      pe: 28.7
    },
    {
      symbol: 'AMZN',
      name: 'Amazon',
      price: 127.12,
      change: -0.56,
      changePercent: -0.44,
      marketCap: 1300000000000,
      pe: 98.2
    },
    {
      symbol: 'TSLA',
      name: 'Tesla',
      price: 238.83,
      change: 5.76,
      changePercent: 2.47,
      marketCap: 758000000000,
      pe: 68.4
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase',
      price: 145.44,
      change: -0.98,
      changePercent: -0.67,
      marketCap: 421000000000,
      pe: 10.8
    },
    {
      symbol: 'V',
      name: 'Visa',
      price: 235.32,
      change: 1.12,
      changePercent: 0.48,
      marketCap: 480000000000,
      pe: 29.6
    }
  ],
  severity: 'low',
  balanceSheet: {
    years: ['2023', '2022', '2021'],
    assets: {
      current: {
        cash: 34704000000,
        shortTermInvestments: 85000000000,
        accountsReceivable: 44261000000,
        inventory: 3742000000,
        otherCurrentAssets: 16924000000,
        totalCurrent: 184631000000
      },
      nonCurrent: {
        propertyPlantEquipment: 84051000000,
        goodwill: 67500000000,
        intangibleAssets: 11841000000,
        longTermInvestments: 5551000000,
        otherNonCurrentAssets: 2784000000,
        totalNonCurrent: 171727000000
      },
      totalAssets: 356358000000
    },
    liabilities: {
      current: {
        accountsPayable: 15150000000,
        shortTermDebt: 5748000000,
        currentPortionLTD: 3500000000,
        otherCurrentLiabilities: 65555000000,
        totalCurrent: 89953000000
      },
      nonCurrent: {
        longTermDebt: 41990000000,
        deferredTaxLiabilities: 339000000,
        otherNonCurrentLiabilities: 48076000000,
        totalNonCurrent: 90405000000
      },
      totalLiabilities: 180358000000
    },
    equity: {
      commonStock: 83946000000,
      retainedEarnings: 91490000000,
      treasuryStock: 0,
      otherEquity: 564000000,
      totalEquity: 176000000000
    }
  },
  ownership: {
    institutional: {
      percentage: 72.5,
      holders: [
        {
          name: 'Vanguard Group Inc.',
          shares: 653000000,
          value: 220200000000,
          percentage: 8.8,
          change: 0.3
        },
        {
          name: 'BlackRock Inc.',
          shares: 518000000,
          value: 174700000000,
          percentage: 7.0,
          change: 0.1
        },
        {
          name: 'State Street Corporation',
          shares: 312000000,
          value: 105200000000,
          percentage: 4.2,
          change: -0.1
        },
        {
          name: 'FMR LLC',
          shares: 198000000,
          value: 66800000000,
          percentage: 2.7,
          change: 0.2
        },
        {
          name: 'Geode Capital Management LLC',
          shares: 148000000,
          value: 49900000000,
          percentage: 2.0,
          change: 0.1
        }
      ]
    },
    insiders: {
      percentage: 3.8,
      holders: [
        {
          name: 'Satya Nadella',
          position: 'Chief Executive Officer',
          shares: 1392000,
          value: 469200000,
          percentage: 0.019,
          change: 0.002
        },
        {
          name: 'Bradford L. Smith',
          position: 'President',
          shares: 732000,
          value: 246800000,
          percentage: 0.010,
          change: -0.001
        },
        {
          name: 'Amy Hood',
          position: 'Chief Financial Officer',
          shares: 523000,
          value: 176400000,
          percentage: 0.007,
          change: 0.0
        },
        {
          name: 'Judson Althoff',
          position: 'Executive Vice President',
          shares: 324000,
          value: 109300000,
          percentage: 0.004,
          change: 0.001
        },
        {
          name: 'Christopher C. Capossela',
          position: 'Chief Marketing Officer',
          shares: 267000,
          value: 90000000,
          percentage: 0.004,
          change: 0.0
        }
      ]
    },
    public: 16.7,
    treasury: 7.0,
    sharesOutstanding: 7430000000,
    asOfDate: '30.06.2023'
  }
};

export const googleStock: Stock = {
  symbol: 'GOOGL',
  name: 'Alphabet Inc',
  price: 138.45,
  change: -0.87,
  changePercent: -0.63,
  currency: 'USD',
  sector: 'Technology Services',
  industry: 'Internet Software/Services',
  
  financials: {
    // Цена
    priceToEarnings: 25.67,
    priceToSales: 5.89,
    priceToBook: 6.34,
    priceToOperatingCashFlow: 18.45,
    priceToCashFlow: 20.12,
    
    // Стоимость
    marketCap: 1750.45e9,
    enterpriseValue: 1650.78e9,
    evToEBITDA: 15.67,
    evToSales: 5.56,
    evToEBIT: 18.34,
    
    // Дивиденды
    dividendPerShare: 0,
    dividendYield: 0,
    dividendPayout: 0,
    fcfYield: 4.56,
    
    // Рентабельность
    returnOnAssets: 12.34,
    returnOnEquity: 25.67,
    returnOnCapitalEmployed: 22.45,
    returnOnInvestedCapital: 24.56,
    returnOnSales: 22.89,
    
    // Маржинальность
    grossMargin: 56.78,
    ebitdaMargin: 35.67,
    ebitMargin: 30.45,
    ebtMargin: 29.78,
    netMargin: 22.89,
    
    // Долг
    debtToAssets: 0.23,
    debtToEquity: 0.45,
    operatingCashFlowToDebt: 234.56,
    financialLeverage: 1.67,
    interestCoverageRatio: 78.45,
    
    // Ликвидность
    currentRatio: 2.45,
    quickRatio: 2.34,
    cashRatio: 67.89,
    assetTurnover: 0.67,
    fixedAssetTurnover: 4.56,
    
    // Рост
    revenueGrowth5y: 18.67,
    revenueGrowth10y: 15.45,
    ebitGrowth5y: 20.34,
    ebitGrowth10y: 16.78,
    netIncomeGrowth5y: 19.45,
    netIncomeGrowth10y: 15.67,
    epsGrowth5y: 21.34,
    epsGrowth10y: 17.89,
    freeCashFlowGrowth5y: 18.45,
    freeCashFlowGrowth10y: 14.56,
    
    // Оценка
    altmanZScore: 8.56,
    piotroskiFScore: 8
  },
  
  charts: {
    revenue: [282836, 257637, 182527, 161857, 136819, 110855, 90272, 74989, 66001, 55519],
    grossProfit: [160563, 146698, 97795, 89961, 75433, 59624, 47207, 38642, 37963, 31914],
    ebitda: [100830, 91499, 54999, 47765, 36546, 29331, 23716, 19360, 19912, 16496],
    ebit: [86534, 78714, 41224, 35045, 26178, 20621, 16496, 13155, 13982, 11244],
    ebt: [84152, 76033, 39625, 34913, 24150, 19478, 15826, 12326, 14136, 10737],
    netIncome: [64696, 59972, 30736, 26492, 19478, 16348, 12662, 9737, 11358, 8505],
    expenses: {
      rnd: 16.78,
      ga: 25.45,
      da: 14.23,
      tax: 22.89,
      interest: 1.34
    }
  },
  
  sectorComparison: {
    medianPE: 42.3,
    fairPrice: 156.78,
    companies: 187
  },
  
  countryComparison: {
    medianPE: 38,
    companies: 3463
  },
  
  funnel: {
    totalRevenue: 282836,
    grossProfit: 160563,
    ebitda: 100830,
    ebit: 86534,
    ebt: 84152,
    netIncome: 64696
  }
};

export const amazonStock: Stock = {
  symbol: 'AMZN',
  name: 'Amazon.com Inc',
  price: 178.75,
  change: 2.34,
  changePercent: 1.32,
  currency: 'USD',
  sector: 'Retail Trade',
  industry: 'Internet Retail',
  
  financials: {
    // Цена
    priceToEarnings: 62.45,
    priceToSales: 2.78,
    priceToBook: 8.45,
    priceToOperatingCashFlow: 22.34,
    priceToCashFlow: 25.67,
    
    // Стоимость
    marketCap: 1850.67e9,
    enterpriseValue: 1890.34e9,
    evToEBITDA: 20.45,
    evToSales: 2.84,
    evToEBIT: 25.67,
    
    // Дивиденды
    dividendPerShare: 0,
    dividendYield: 0,
    dividendPayout: 0,
    fcfYield: 3.45,
    
    // Рентабельность
    returnOnAssets: 5.67,
    returnOnEquity: 14.56,
    returnOnCapitalEmployed: 10.23,
    returnOnInvestedCapital: 12.45,
    returnOnSales: 4.56,
    
    // Маржинальность
    grossMargin: 45.67,
    ebitdaMargin: 13.89,
    ebitMargin: 11.23,
    ebtMargin: 10.45,
    netMargin: 4.56,
    
    // Долг
    debtToAssets: 0.56,
    debtToEquity: 1.23,
    operatingCashFlowToDebt: 78.45,
    financialLeverage: 2.56,
    interestCoverageRatio: 15.67,
    
    // Ликвидность
    currentRatio: 1.34,
    quickRatio: 1.12,
    cashRatio: 34.56,
    assetTurnover: 1.23,
    fixedAssetTurnover: 3.45,
    
    // Рост
    revenueGrowth5y: 25.67,
    revenueGrowth10y: 22.45,
    ebitGrowth5y: 30.12,
    ebitGrowth10y: 25.67,
    netIncomeGrowth5y: 35.67,
    netIncomeGrowth10y: 28.45,
    epsGrowth5y: 38.45,
    epsGrowth10y: 30.12,
    freeCashFlowGrowth5y: 28.45,
    freeCashFlowGrowth10y: 23.67,
    
    // Оценка
    altmanZScore: 5.67,
    piotroskiFScore: 7
  },
  
  charts: {
    revenue: [513983, 469822, 386064, 280522, 232887, 177866, 135987, 107006, 88988, 74452],
    grossProfit: [234782, 213554, 152757, 114986, 93731, 65932, 47722, 35355, 29189, 24509],
    ebitda: [71466, 54512, 59293, 35332, 25899, 16132, 12302, 8294, 6234, 5475],
    ebit: [57789, 41999, 48151, 27505, 20759, 12421, 9283, 6225, 4180, 3033],
    ebt: [53674, 38151, 45216, 24865, 19334, 10762, 8124, 5125, 3860, 2655],
    netIncome: [23203, 33364, 21331, 11588, 10073, 3033, 2371, 596, 274, -241],
    expenses: {
      rnd: 14.56,
      ga: 32.45,
      da: 13.67,
      tax: 18.45,
      interest: 2.34
    }
  },
  
  sectorComparison: {
    medianPE: 35.6,
    fairPrice: 198.45,
    companies: 156
  },
  
  countryComparison: {
    medianPE: 38,
    companies: 3463
  },
  
  funnel: {
    totalRevenue: 513983,
    grossProfit: 234782,
    ebitda: 71466,
    ebit: 57789,
    ebt: 53674,
    netIncome: 23203
  }
};

export const teslaStock: Stock = {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  price: 245.67,
  change: -5.67,
  changePercent: -2.26,
  currency: 'USD',
  sector: 'Consumer Durables',
  industry: 'Motor Vehicles',
  
  financials: {
    // Цена
    priceToEarnings: 78.45,
    priceToSales: 8.67,
    priceToBook: 12.34,
    priceToOperatingCashFlow: 45.67,
    priceToCashFlow: 50.12,
    
    // Стоимость
    marketCap: 780.45e9,
    enterpriseValue: 760.78e9,
    evToEBITDA: 40.12,
    evToSales: 8.45,
    evToEBIT: 45.67,
    
    // Дивиденды
    dividendPerShare: 0,
    dividendYield: 0,
    dividendPayout: 0,
    fcfYield: 1.23,
    
    // Рентабельность
    returnOnAssets: 8.45,
    returnOnEquity: 15.67,
    returnOnCapitalEmployed: 12.34,
    returnOnInvestedCapital: 14.56,
    returnOnSales: 11.23,
    
    // Маржинальность
    grossMargin: 23.45,
    ebitdaMargin: 21.34,
    ebitMargin: 18.67,
    ebtMargin: 17.89,
    netMargin: 11.23,
    
    // Долг
    debtToAssets: 0.34,
    debtToEquity: 0.67,
    operatingCashFlowToDebt: 156.78,
    financialLeverage: 1.89,
    interestCoverageRatio: 45.67,
    
    // Ликвидность
    currentRatio: 1.89,
    quickRatio: 1.56,
    cashRatio: 56.78,
    assetTurnover: 0.78,
    fixedAssetTurnover: 2.34,
    
    // Рост
    revenueGrowth5y: 45.67,
    revenueGrowth10y: 40.12,
    ebitGrowth5y: 50.23,
    ebitGrowth10y: 45.67,
    netIncomeGrowth5y: 55.67,
    netIncomeGrowth10y: 48.45,
    epsGrowth5y: 60.12,
    epsGrowth10y: 52.34,
    freeCashFlowGrowth5y: 48.45,
    freeCashFlowGrowth10y: 42.67,
    
    // Оценка
    altmanZScore: 6.78,
    piotroskiFScore: 7
  },
  
  charts: {
    revenue: [96773, 81462, 53823, 31536, 24578, 21461, 11759, 7000, 4046, 2013],
    grossProfit: [22732, 20853, 13606, 6982, 4042, 4046, 2222, 1599, 881, 456],
    ebitda: [20638, 16775, 9434, 4999, 2349, 2312, 1116, 213, -294, -400],
    ebit: [18056, 14402, 7333, 4069, 1632, 1580, 667, -67, -403, -455],
    ebt: [17352, 13656, 6937, 3523, 1201, 1193, 454, -123, -412, -454],
    netIncome: [10856, 12583, 5519, 2696, 862, 721, -675, -889, -294, -396],
    expenses: {
      rnd: 6.78,
      ga: 12.34,
      da: 13.45,
      tax: 18.67,
      interest: 1.23
    }
  },
  
  sectorComparison: {
    medianPE: 25.6,
    fairPrice: 178.45,
    companies: 87
  },
  
  countryComparison: {
    medianPE: 38,
    companies: 3463
  },
  
  funnel: {
    totalRevenue: 96773,
    grossProfit: 22732,
    ebitda: 20638,
    ebit: 18056,
    ebt: 17352,
    netIncome: 10856
  }
};

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  const stocks = getAllStocks();
  return stocks.find(stock => stock.symbol.toUpperCase() === symbol.toUpperCase());
};

export const getAllStocks = (): Stock[] => {
  return [appleStock, microsoftStock, googleStock, amazonStock, teslaStock];
}; 