// Типы для макроэкономических факторов

export type CountryCode = 'US' | 'EU' | 'RU' | 'CN' | 'UK' | 'JP' | 'IN' | 'BR';

export type RegionBlock = 'North America' | 'Europe' | 'Asia' | 'BRICS' | 'G7' | 'NATO';

export interface Country {
  code: CountryCode;
  name: string;
  blocks: RegionBlock[];
  gdp: number; // В миллиардах долларов
  population: number; // В миллионах
  inflationRate: number;
  interestRate: number;
  unemploymentRate: number;
  debtToGDP: number;
  currencyCode: string;
  flagUrl: string;
}

export interface CountryRelation {
  sourceCountry: CountryCode;
  targetCountry: CountryCode;
  economicRelation: number; // От -10 до 10
  politicalRelation: number; // От -10 до 10
  militaryRelation: number; // От -10 до 10
  tradeVolume: number; // В миллиардах долларов
  sanctionsLevel: number; // От 0 до 10
  lastChange: Date;
  historicalData: RelationHistoryPoint[];
}

export interface RelationHistoryPoint {
  date: Date;
  economicRelation: number;
  politicalRelation: number;
  militaryRelation: number;
  tradeVolume: number;
  sanctionsLevel: number;
}

export interface Interest {
  countryCode: CountryCode;
  government: string[];
  people: string[];
  business: string[];
  leaders: string[];
}

export type MediaBias = 'Far Left' | 'Left' | 'Center Left' | 'Center' | 'Center Right' | 'Right' | 'Far Right';

export type MediaTrustworthiness = 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';

export interface MediaSource {
  id: string;
  name: string;
  country: CountryCode;
  bias: MediaBias;
  trustworthiness: MediaTrustworthiness;
  biasScore: number; // От -10 (Far Left) до 10 (Far Right)
  trustScore: number; // От 0 до 10
  logoUrl: string;
  website: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  countries: CountryCode[];
  category: 'Political' | 'Economic' | 'Military' | 'Social' | 'Environmental';
  importance: number; // От 1 до 10
  coverage: NewsCoverage[];
}

export interface NewsCoverage {
  mediaSourceId: string;
  title: string;
  content: string;
  sentiment: number; // От -10 до 10
  factualAccuracy: number; // От 0 до 10
  url: string;
  publishDate: Date;
}

export interface MacroIndicator {
  name: string;
  description: string;
  unit: string;
  data: MacroIndicatorPoint[];
}

export interface MacroIndicatorPoint {
  countryCode: CountryCode;
  date: Date;
  value: number;
} 