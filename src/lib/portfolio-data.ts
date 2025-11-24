import { Portfolio, Transaction } from './types';
import { v4 as uuidv4 } from 'uuid';

// Генерация уникальных ID для транзакций
const generateTransactionId = () => uuidv4();

// Создание моковых транзакций
const generateTransactions = (): Transaction[] => {
  return [
    {
      id: generateTransactionId(),
      date: '2023-01-15',
      type: 'buy',
      symbol: 'AAPL',
      name: 'Apple Inc',
      quantity: 10,
      price: 142.53,
      currency: 'USD',
      fee: 5.99,
      total: 1431.29,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-01-20',
      type: 'buy',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      quantity: 5,
      price: 240.22,
      currency: 'USD',
      fee: 5.99,
      total: 1207.09,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-02-05',
      type: 'buy',
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      quantity: 8,
      price: 104.78,
      currency: 'USD',
      fee: 5.99,
      total: 844.23,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-02-15',
      type: 'buy',
      symbol: 'AMZN',
      name: 'Amazon.com Inc',
      quantity: 12,
      price: 99.70,
      currency: 'USD',
      fee: 5.99,
      total: 1202.39,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-03-01',
      type: 'buy',
      symbol: 'TSLA',
      name: 'Tesla Inc',
      quantity: 6,
      price: 205.71,
      currency: 'USD',
      fee: 5.99,
      total: 1240.25,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-03-10',
      type: 'buy',
      symbol: 'US10Y',
      name: 'US Treasury 10-Year',
      quantity: 5,
      price: 98.25,
      currency: 'USD',
      fee: 2.50,
      total: 4914.75,
      assetType: 'bond'
    },
    {
      id: generateTransactionId(),
      date: '2023-03-15',
      type: 'buy',
      symbol: 'AAPL230616C170',
      name: 'AAPL Jun 16 2023 170 Call',
      quantity: 2,
      price: 3.45,
      currency: 'USD',
      fee: 1.50,
      total: 691.50,
      assetType: 'derivative'
    },
    {
      id: generateTransactionId(),
      date: '2023-04-01',
      type: 'deposit',
      symbol: 'USD',
      name: 'US Dollar',
      quantity: 5000,
      price: 1,
      currency: 'USD',
      fee: 0,
      total: 5000,
      assetType: 'cash'
    },
    {
      id: generateTransactionId(),
      date: '2023-04-15',
      type: 'dividend',
      symbol: 'AAPL',
      name: 'Apple Inc',
      quantity: 10,
      price: 0.23,
      currency: 'USD',
      fee: 0,
      total: 2.30,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-05-01',
      type: 'buy',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      quantity: 4,
      price: 277.49,
      currency: 'USD',
      fee: 5.99,
      total: 1115.95,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-05-15',
      type: 'interest',
      symbol: 'US10Y',
      name: 'US Treasury 10-Year',
      quantity: 5,
      price: 1.25,
      currency: 'USD',
      fee: 0,
      total: 6.25,
      assetType: 'bond'
    },
    {
      id: generateTransactionId(),
      date: '2023-06-01',
      type: 'sell',
      symbol: 'AAPL230616C170',
      name: 'AAPL Jun 16 2023 170 Call',
      quantity: 2,
      price: 5.78,
      currency: 'USD',
      fee: 1.50,
      total: 1154.50,
      assetType: 'derivative'
    },
    {
      id: generateTransactionId(),
      date: '2023-06-15',
      type: 'buy',
      symbol: 'META',
      name: 'Meta Platforms Inc',
      quantity: 7,
      price: 281.53,
      currency: 'USD',
      fee: 5.99,
      total: 1976.70,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-07-01',
      type: 'buy',
      symbol: 'EURCORP',
      name: 'European Corporate Bond ETF',
      quantity: 20,
      price: 105.75,
      currency: 'USD',
      fee: 7.50,
      total: 2122.50,
      assetType: 'bond'
    },
    {
      id: generateTransactionId(),
      date: '2023-07-15',
      type: 'dividend',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      quantity: 5,
      price: 0.68,
      currency: 'USD',
      fee: 0,
      total: 3.40,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-08-01',
      type: 'buy',
      symbol: 'SPY231215P400',
      name: 'SPY Dec 15 2023 400 Put',
      quantity: 1,
      price: 12.35,
      currency: 'USD',
      fee: 1.50,
      total: 1236.50,
      assetType: 'derivative'
    },
    {
      id: generateTransactionId(),
      date: '2023-08-15',
      type: 'withdrawal',
      symbol: 'USD',
      name: 'US Dollar',
      quantity: 1000,
      price: 1,
      currency: 'USD',
      fee: 0,
      total: 1000,
      assetType: 'cash'
    },
    {
      id: generateTransactionId(),
      date: '2023-09-01',
      type: 'buy',
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co',
      quantity: 8,
      price: 148.23,
      currency: 'USD',
      fee: 5.99,
      total: 1191.83,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-09-15',
      type: 'dividend',
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co',
      quantity: 8,
      price: 1.05,
      currency: 'USD',
      fee: 0,
      total: 8.40,
      assetType: 'stock'
    },
    {
      id: generateTransactionId(),
      date: '2023-10-01',
      type: 'buy',
      symbol: 'ADBE',
      name: 'Adobe Inc',
      quantity: 3,
      price: 510.87,
      currency: 'USD',
      fee: 5.99,
      total: 1538.60,
      assetType: 'stock'
    }
  ];
};

// Моковый портфель
export const myPortfolio: Portfolio = {
  name: 'Мой инвестиционный портфель',
  description: 'Долгосрочный портфель с фокусом на технологический сектор и диверсификацией через облигации и деривативы.',
  createdAt: '2023-01-01',
  lastUpdated: '2023-10-15',
  currency: 'USD',
  
  metrics: {
    totalValue: 21567.82,
    dayChange: 156.78,
    dayChangePercent: 0.73,
    totalReturn: 2345.67,
    totalReturnPercent: 12.2,
    annualizedReturn: 15.8,
    volatility: 18.5,
    sharpeRatio: 0.85,
    beta: 1.2,
    alpha: 2.5,
    dividendYield: 1.8,
    diversificationScore: 68
  },
  
  positions: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      quantity: 10,
      averagePrice: 142.53,
      currentPrice: 175.45,
      currency: 'USD',
      sector: 'Technology',
      country: 'USA',
      weight: 8.13,
      beta: 1.15,
      dividendYield: 0.5
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      quantity: 5,
      averagePrice: 240.22,
      currentPrice: 345.67,
      currency: 'USD',
      sector: 'Technology',
      country: 'USA',
      weight: 8.01,
      beta: 0.95,
      dividendYield: 0.8
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      quantity: 8,
      averagePrice: 104.78,
      currentPrice: 138.45,
      currency: 'USD',
      sector: 'Technology',
      country: 'USA',
      weight: 5.13,
      beta: 1.05,
      dividendYield: 0
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc',
      quantity: 12,
      averagePrice: 99.70,
      currentPrice: 178.75,
      currency: 'USD',
      sector: 'Consumer Cyclical',
      country: 'USA',
      weight: 9.94,
      beta: 1.25,
      dividendYield: 0
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      quantity: 6,
      averagePrice: 205.71,
      currentPrice: 245.67,
      currency: 'USD',
      sector: 'Consumer Cyclical',
      country: 'USA',
      weight: 6.83,
      beta: 1.95,
      dividendYield: 0
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      quantity: 4,
      averagePrice: 277.49,
      currentPrice: 450.78,
      currency: 'USD',
      sector: 'Technology',
      country: 'USA',
      weight: 8.36,
      beta: 1.55,
      dividendYield: 0.1
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc',
      quantity: 7,
      averagePrice: 281.53,
      currentPrice: 325.45,
      currency: 'USD',
      sector: 'Technology',
      country: 'USA',
      weight: 10.57,
      beta: 1.35,
      dividendYield: 0
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co',
      quantity: 8,
      averagePrice: 148.23,
      currentPrice: 152.67,
      currency: 'USD',
      sector: 'Financial Services',
      country: 'USA',
      weight: 5.66,
      beta: 1.1,
      dividendYield: 2.8
    },
    {
      symbol: 'ADBE',
      name: 'Adobe Inc',
      quantity: 3,
      averagePrice: 510.87,
      currentPrice: 545.23,
      currency: 'USD',
      sector: 'Technology',
      country: 'USA',
      weight: 7.59,
      beta: 1.2,
      dividendYield: 0
    }
  ],
  
  bonds: [
    {
      symbol: 'US10Y',
      name: 'US Treasury 10-Year',
      quantity: 5,
      nominalValue: 1000,
      currentPrice: 98.75, // В процентах от номинала
      currency: 'USD',
      issuer: 'US Treasury',
      country: 'USA',
      maturityDate: '2033-03-10',
      couponRate: 3.5,
      couponFrequency: 2,
      yield: 3.65,
      rating: 'AAA',
      weight: 11.45
    },
    {
      symbol: 'EURCORP',
      name: 'European Corporate Bond ETF',
      quantity: 20,
      nominalValue: 100,
      currentPrice: 106.25,
      currency: 'USD',
      issuer: 'Various',
      country: 'Europe',
      maturityDate: 'N/A',
      couponRate: 2.8,
      couponFrequency: 4,
      yield: 2.65,
      rating: 'BBB+',
      weight: 9.85
    }
  ],
  
  derivatives: [
    {
      symbol: 'SPY231215P400',
      name: 'SPY Dec 15 2023 400 Put',
      type: 'option',
      quantity: 1,
      averagePrice: 12.35,
      currentPrice: 8.75,
      currency: 'USD',
      underlying: 'SPY',
      expirationDate: '2023-12-15',
      strikePrice: 400,
      optionType: 'put',
      weight: 0.41
    }
  ],
  
  cash: [
    {
      currency: 'USD',
      amount: 4000,
      weight: 18.55
    },
    {
      currency: 'EUR',
      amount: 500,
      weight: 2.55
    }
  ],
  
  transactions: generateTransactions(),
  
  sectorAllocation: [
    { sector: 'Technology', value: 10345.67, percentage: 47.97 },
    { sector: 'Consumer Cyclical', value: 3612.34, percentage: 16.75 },
    { sector: 'Financial Services', value: 1221.36, percentage: 5.66 },
    { sector: 'Government', value: 4937.50, percentage: 22.89 },
    { sector: 'Cash', value: 4550.00, percentage: 21.10 }
  ],
  
  countryAllocation: [
    { country: 'USA', value: 15892.57, percentage: 73.69 },
    { country: 'Europe', value: 2125.00, percentage: 9.85 },
    { country: 'Cash', value: 4550.00, percentage: 21.10 }
  ],
  
  assetAllocation: [
    { type: 'stocks', value: 9955.32, percentage: 46.16 },
    { type: 'bonds', value: 7062.50, percentage: 32.75 },
    { type: 'derivatives', value: 875.00, percentage: 4.06 },
    { type: 'cash', value: 4550.00, percentage: 21.10 }
  ],
  
  thoughts: [
    'Увеличить долю европейских акций для большей географической диверсификации.',
    'Рассмотреть добавление золота или ETF на золото как хедж от инфляции.',
    'Постепенно увеличивать долю дивидендных акций для пассивного дохода.',
    'Сократить позицию в Tesla из-за высокой волатильности и переоцененности.',
    'Добавить больше защитных активов в случае рецессии в 2024 году.'
  ]
}; 