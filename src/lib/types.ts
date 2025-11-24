// Типы для портфеля
export interface PortfolioPosition {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currency: string;
  sector: string;
  country: string;
  weight: number; // Вес в портфеле в процентах
  beta: number;
  dividendYield: number;
}

export interface Bond {
  symbol: string;
  name: string;
  quantity: number;
  nominalValue: number;
  currentPrice: number; // В процентах от номинала
  currency: string;
  issuer: string;
  country: string;
  maturityDate: string;
  couponRate: number;
  couponFrequency: number; // Количество выплат в год
  yield: number; // Доходность к погашению
  rating: string;
  weight: number; // Вес в портфеле в процентах
}

export interface Derivative {
  symbol: string;
  name: string;
  type: 'option' | 'future' | 'swap' | 'other';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currency: string;
  underlying: string;
  expirationDate: string;
  strikePrice?: number; // Для опционов
  optionType?: 'call' | 'put'; // Для опционов
  weight: number; // Вес в портфеле в процентах
}

export interface Cash {
  currency: string;
  amount: number;
  weight: number; // Вес в портфеле в процентах
}

export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'dividend' | 'interest' | 'deposit' | 'withdrawal';
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  fee: number;
  total: number;
  assetType: 'stock' | 'bond' | 'derivative' | 'cash';
}

export interface PortfolioMetrics {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  beta: number;
  alpha: number;
  dividendYield: number;
  diversificationScore: number; // От 0 до 100
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface CountryAllocation {
  country: string;
  value: number;
  percentage: number;
}

export interface AssetAllocation {
  type: 'stocks' | 'bonds' | 'derivatives' | 'cash';
  value: number;
  percentage: number;
}

export interface Portfolio {
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  currency: string;
  metrics: PortfolioMetrics;
  positions: PortfolioPosition[];
  bonds: Bond[];
  derivatives: Derivative[];
  cash: Cash[];
  transactions: Transaction[];
  sectorAllocation: SectorAllocation[];
  countryAllocation: CountryAllocation[];
  assetAllocation: AssetAllocation[];
  thoughts: string[]; // Мысли и комментарии по портфелю
}

export interface Stock {
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  pe: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  beta: number;
  high52: number;
  low52: number;
  averageVolume: number;
  description: string;
  sector: string;
  industry: string;
  country: string;
  employees: number;
  ceo: string;
  founded: number;
  website: string;
  headquarters: string;
  revenue: number[];
  revenueGrowth: number[];
  profit: number[];
  profitGrowth: number[];
  profitMargin: number[];
  expenses: {
    [key: string]: number;
  };
  revenueEstimates: number[];
  profitEstimates: number[];
  analystRating: number;
  analystCount: number;
  priceTargetLow: number;
  priceTargetAvg: number;
  priceTargetHigh: number;
  news: NewsItem[];
  financialRatios: FinancialRatios;
  sectorPeers: SectorPeer[];
  countryPeers: SectorPeer[];
  severity: 'low' | 'medium' | 'high';
  balanceSheet?: BalanceSheet;
  ownership?: Ownership;
}

export interface BalanceSheet {
  years: string[];
  assets: {
    current: {
      cash: number[];
      accountsReceivable: number[];
      inventory: number[];
      otherCurrentAssets: number[];
      total: number[];
    };
    nonCurrent: {
      propertyPlantEquipment: number[];
      intangibleAssets: number[];
      otherNonCurrentAssets: number[];
      total: number[];
    };
  };
  liabilities: {
    current: {
      accountsPayable: number[];
      shortTermDebt: number[];
      otherCurrentLiabilities: number[];
      total: number[];
    };
    nonCurrent: {
      longTermDebt: number[];
      deferredTaxLiabilities: number[];
      otherNonCurrentLiabilities: number[];
      total: number[];
    };
  };
  equity: {
    commonStock: number[];
    retainedEarnings: number[];
    otherEquity: number[];
    total: number[];
  };
}

export interface InstitutionalOwner {
  name: string;
  shares: number;
  value: number;
}

export interface Insider {
  name: string;
  position: string;
  shares: number;
}

export interface Ownership {
  institutionalOwners: InstitutionalOwner[];
  insiders: Insider[];
  sharesOutstanding: number;
  publicFloat: number;
  treasuryStock: number;
}

export interface NewsItem {
  title: string;
  date: string;
  source: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface FinancialRatios {
  pe: number;
  forwardPe: number;
  peg: number;
  ps: number;
  pb: number;
  enterpriseValue: number;
  evToRevenue: number;
  evToEbitda: number;
  roe: number;
  roa: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  operatingMargin: number;
  netMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  fcfMargin: number;
}

export interface SectorPeer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  pe: number;
} 