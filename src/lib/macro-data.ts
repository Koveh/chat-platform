import { Country, CountryCode, CountryRelation, Interest, MediaSource, NewsEvent } from './macro-types';

// Основные страны
export const countries: Country[] = [
  {
    code: 'US',
    name: 'США',
    blocks: ['North America', 'G7', 'NATO'],
    gdp: 25460,
    population: 331.9,
    inflationRate: 3.7,
    interestRate: 5.5,
    unemploymentRate: 3.8,
    debtToGDP: 129,
    currencyCode: 'USD',
    flagUrl: '/flags/us.svg'
  },
  {
    code: 'EU',
    name: 'Европейский Союз',
    blocks: ['Europe', 'G7'],
    gdp: 17080,
    population: 447.7,
    inflationRate: 2.9,
    interestRate: 4.0,
    unemploymentRate: 6.5,
    debtToGDP: 90.8,
    currencyCode: 'EUR',
    flagUrl: '/flags/eu.svg'
  },
  {
    code: 'RU',
    name: 'Россия',
    blocks: ['Europe', 'Asia', 'BRICS'],
    gdp: 2240,
    population: 143.4,
    inflationRate: 7.4,
    interestRate: 13.0,
    unemploymentRate: 3.0,
    debtToGDP: 17.8,
    currencyCode: 'RUB',
    flagUrl: '/flags/ru.svg'
  },
  {
    code: 'CN',
    name: 'Китай',
    blocks: ['Asia', 'BRICS'],
    gdp: 17960,
    population: 1412,
    inflationRate: 0.7,
    interestRate: 3.45,
    unemploymentRate: 5.3,
    debtToGDP: 77.5,
    currencyCode: 'CNY',
    flagUrl: '/flags/cn.svg'
  }
];

// Отношения между странами
export const countryRelations: CountryRelation[] = [
  // США - ЕС
  {
    sourceCountry: 'US',
    targetCountry: 'EU',
    economicRelation: 8,
    politicalRelation: 7,
    militaryRelation: 9,
    tradeVolume: 1200,
    sanctionsLevel: 0,
    lastChange: new Date('2023-09-15'),
    historicalData: [
      {
        date: new Date('2023-01-15'),
        economicRelation: 7,
        politicalRelation: 6,
        militaryRelation: 8,
        tradeVolume: 1100,
        sanctionsLevel: 0
      },
      {
        date: new Date('2023-05-15'),
        economicRelation: 7.5,
        politicalRelation: 6.5,
        militaryRelation: 8.5,
        tradeVolume: 1150,
        sanctionsLevel: 0
      },
      {
        date: new Date('2023-09-15'),
        economicRelation: 8,
        politicalRelation: 7,
        militaryRelation: 9,
        tradeVolume: 1200,
        sanctionsLevel: 0
      }
    ]
  },
  // США - Россия
  {
    sourceCountry: 'US',
    targetCountry: 'RU',
    economicRelation: -8,
    politicalRelation: -9,
    militaryRelation: -7,
    tradeVolume: 28,
    sanctionsLevel: 9,
    lastChange: new Date('2023-09-15'),
    historicalData: [
      {
        date: new Date('2023-01-15'),
        economicRelation: -7,
        politicalRelation: -8,
        militaryRelation: -6,
        tradeVolume: 35,
        sanctionsLevel: 8
      },
      {
        date: new Date('2023-05-15'),
        economicRelation: -7.5,
        politicalRelation: -8.5,
        militaryRelation: -6.5,
        tradeVolume: 30,
        sanctionsLevel: 8.5
      },
      {
        date: new Date('2023-09-15'),
        economicRelation: -8,
        politicalRelation: -9,
        militaryRelation: -7,
        tradeVolume: 28,
        sanctionsLevel: 9
      }
    ]
  },
  // США - Китай
  {
    sourceCountry: 'US',
    targetCountry: 'CN',
    economicRelation: -3,
    politicalRelation: -6,
    militaryRelation: -5,
    tradeVolume: 690,
    sanctionsLevel: 5,
    lastChange: new Date('2023-09-15'),
    historicalData: [
      {
        date: new Date('2023-01-15'),
        economicRelation: -2,
        politicalRelation: -5,
        militaryRelation: -4,
        tradeVolume: 710,
        sanctionsLevel: 4
      },
      {
        date: new Date('2023-05-15'),
        economicRelation: -2.5,
        politicalRelation: -5.5,
        militaryRelation: -4.5,
        tradeVolume: 700,
        sanctionsLevel: 4.5
      },
      {
        date: new Date('2023-09-15'),
        economicRelation: -3,
        politicalRelation: -6,
        militaryRelation: -5,
        tradeVolume: 690,
        sanctionsLevel: 5
      }
    ]
  },
  // ЕС - Россия
  {
    sourceCountry: 'EU',
    targetCountry: 'RU',
    economicRelation: -7,
    politicalRelation: -8,
    militaryRelation: -6,
    tradeVolume: 95,
    sanctionsLevel: 8,
    lastChange: new Date('2023-09-15'),
    historicalData: [
      {
        date: new Date('2023-01-15'),
        economicRelation: -6,
        politicalRelation: -7,
        militaryRelation: -5,
        tradeVolume: 120,
        sanctionsLevel: 7
      },
      {
        date: new Date('2023-05-15'),
        economicRelation: -6.5,
        politicalRelation: -7.5,
        militaryRelation: -5.5,
        tradeVolume: 105,
        sanctionsLevel: 7.5
      },
      {
        date: new Date('2023-09-15'),
        economicRelation: -7,
        politicalRelation: -8,
        militaryRelation: -6,
        tradeVolume: 95,
        sanctionsLevel: 8
      }
    ]
  },
  // ЕС - Китай
  {
    sourceCountry: 'EU',
    targetCountry: 'CN',
    economicRelation: 2,
    politicalRelation: -3,
    militaryRelation: -2,
    tradeVolume: 850,
    sanctionsLevel: 3,
    lastChange: new Date('2023-09-15'),
    historicalData: [
      {
        date: new Date('2023-01-15'),
        economicRelation: 3,
        politicalRelation: -2,
        militaryRelation: -1,
        tradeVolume: 870,
        sanctionsLevel: 2
      },
      {
        date: new Date('2023-05-15'),
        economicRelation: 2.5,
        politicalRelation: -2.5,
        militaryRelation: -1.5,
        tradeVolume: 860,
        sanctionsLevel: 2.5
      },
      {
        date: new Date('2023-09-15'),
        economicRelation: 2,
        politicalRelation: -3,
        militaryRelation: -2,
        tradeVolume: 850,
        sanctionsLevel: 3
      }
    ]
  },
  // Россия - Китай
  {
    sourceCountry: 'RU',
    targetCountry: 'CN',
    economicRelation: 7,
    politicalRelation: 6,
    militaryRelation: 5,
    tradeVolume: 190,
    sanctionsLevel: 0,
    lastChange: new Date('2023-09-15'),
    historicalData: [
      {
        date: new Date('2023-01-15'),
        economicRelation: 5,
        politicalRelation: 4,
        militaryRelation: 3,
        tradeVolume: 150,
        sanctionsLevel: 0
      },
      {
        date: new Date('2023-05-15'),
        economicRelation: 6,
        politicalRelation: 5,
        militaryRelation: 4,
        tradeVolume: 170,
        sanctionsLevel: 0
      },
      {
        date: new Date('2023-09-15'),
        economicRelation: 7,
        politicalRelation: 6,
        militaryRelation: 5,
        tradeVolume: 190,
        sanctionsLevel: 0
      }
    ]
  }
];

// Интересы стран
export const countryInterests: Interest[] = [
  {
    countryCode: 'US',
    government: [
      'Сохранение глобального лидерства и влияния',
      'Противодействие влиянию Китая и России',
      'Укрепление НАТО и союзов',
      'Продвижение демократии и прав человека',
      'Обеспечение энергетической безопасности'
    ],
    people: [
      'Экономическая стабильность и рост',
      'Доступное здравоохранение',
      'Снижение инфляции',
      'Безопасность и защита от терроризма',
      'Решение проблемы иммиграции'
    ],
    business: [
      'Снижение налогов и регулирования',
      'Доступ к глобальным рынкам',
      'Защита интеллектуальной собственности',
      'Стабильная рабочая сила',
      'Инвестиции в инфраструктуру'
    ],
    leaders: [
      'Укрепление внутренней поддержки',
      'Успешная внешняя политика',
      'Экономический рост',
      'Историческое наследие',
      'Переизбрание/сохранение власти'
    ]
  },
  {
    countryCode: 'EU',
    government: [
      'Единство и интеграция ЕС',
      'Энергетическая независимость',
      'Климатическая политика',
      'Экономическая стабильность',
      'Управление миграцией'
    ],
    people: [
      'Социальная защита',
      'Доступное жилье',
      'Стабильность цен',
      'Экологическая безопасность',
      'Защита от внешних угроз'
    ],
    business: [
      'Единый рынок ЕС',
      'Снижение бюрократии',
      'Доступ к квалифицированной рабочей силе',
      'Стабильная валюта',
      'Зеленые технологии и субсидии'
    ],
    leaders: [
      'Баланс национальных и общеевропейских интересов',
      'Решение кризисов (миграция, энергетика)',
      'Поддержка избирателей',
      'Противодействие популизму',
      'Сохранение влияния ЕС в мире'
    ]
  },
  {
    countryCode: 'RU',
    government: [
      'Признание статуса великой державы',
      'Многополярный мировой порядок',
      'Сфера влияния на постсоветском пространстве',
      'Противодействие расширению НАТО',
      'Экономическая независимость от Запада'
    ],
    people: [
      'Экономическая стабильность',
      'Социальные гарантии',
      'Национальная безопасность',
      'Традиционные ценности',
      'Гордость за страну'
    ],
    business: [
      'Государственная поддержка',
      'Снижение санкционного давления',
      'Доступ к технологиям',
      'Новые рынки сбыта',
      'Защита от иностранной конкуренции'
    ],
    leaders: [
      'Сохранение власти и стабильности',
      'Противостояние западному давлению',
      'Внутренняя легитимность',
      'Историческое наследие',
      'Экономическая самодостаточность'
    ]
  },
  {
    countryCode: 'CN',
    government: [
      'Территориальная целостность (Тайвань, Южно-Китайское море)',
      'Экономическое развитие и модернизация',
      'Технологическая независимость',
      'Инициатива "Один пояс, один путь"',
      'Противодействие "сдерживанию" со стороны США'
    ],
    people: [
      'Экономический рост и благосостояние',
      'Социальная стабильность',
      'Национальная гордость',
      'Экологическая безопасность',
      'Образование и возможности для детей'
    ],
    business: [
      'Государственная поддержка',
      'Доступ к глобальным рынкам',
      'Технологическое развитие',
      'Защита от санкций',
      'Стабильная внутренняя среда'
    ],
    leaders: [
      'Сохранение власти КПК',
      'Экономический рост',
      '"Китайская мечта" и национальное возрождение',
      'Международное признание',
      'Внутренняя стабильность'
    ]
  }
];

// Медиа-источники
export const mediaSources: MediaSource[] = [
  {
    id: 'reuters',
    name: 'Reuters',
    country: 'UK',
    bias: 'Center',
    trustworthiness: 'Very High',
    biasScore: 0,
    trustScore: 9,
    logoUrl: '/media/reuters.svg',
    website: 'https://www.reuters.com'
  },
  {
    id: 'bbc',
    name: 'BBC',
    country: 'UK',
    bias: 'Center Left',
    trustworthiness: 'High',
    biasScore: -1,
    trustScore: 8,
    logoUrl: '/media/bbc.svg',
    website: 'https://www.bbc.com'
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    country: 'UK',
    bias: 'Left',
    trustworthiness: 'High',
    biasScore: -3,
    trustScore: 7.5,
    logoUrl: '/media/guardian.svg',
    website: 'https://www.theguardian.com'
  },
  {
    id: 'dailymail',
    name: 'Daily Mail',
    country: 'UK',
    bias: 'Right',
    trustworthiness: 'Low',
    biasScore: 4,
    trustScore: 3,
    logoUrl: '/media/dailymail.svg',
    website: 'https://www.dailymail.co.uk'
  },
  {
    id: 'nyt',
    name: 'New York Times',
    country: 'US',
    bias: 'Center Left',
    trustworthiness: 'High',
    biasScore: -2,
    trustScore: 7.5,
    logoUrl: '/media/nyt.svg',
    website: 'https://www.nytimes.com'
  },
  {
    id: 'wsj',
    name: 'Wall Street Journal',
    country: 'US',
    bias: 'Center Right',
    trustworthiness: 'High',
    biasScore: 2,
    trustScore: 8,
    logoUrl: '/media/wsj.svg',
    website: 'https://www.wsj.com'
  },
  {
    id: 'fox',
    name: 'Fox News',
    country: 'US',
    bias: 'Right',
    trustworthiness: 'Medium',
    biasScore: 6,
    trustScore: 5,
    logoUrl: '/media/fox.svg',
    website: 'https://www.foxnews.com'
  },
  {
    id: 'cnn',
    name: 'CNN',
    country: 'US',
    bias: 'Center Left',
    trustworthiness: 'Medium',
    biasScore: -2,
    trustScore: 6,
    logoUrl: '/media/cnn.svg',
    website: 'https://www.cnn.com'
  },
  {
    id: 'rt',
    name: 'RT',
    country: 'RU',
    bias: 'Right',
    trustworthiness: 'Low',
    biasScore: 5,
    trustScore: 3,
    logoUrl: '/media/rt.svg',
    website: 'https://www.rt.com'
  },
  {
    id: 'rbc',
    name: 'РБК',
    country: 'RU',
    bias: 'Center',
    trustworthiness: 'Medium',
    biasScore: 0,
    trustScore: 6,
    logoUrl: '/media/rbc.svg',
    website: 'https://www.rbc.ru'
  },
  {
    id: 'xinhua',
    name: 'Xinhua',
    country: 'CN',
    bias: 'Center',
    trustworthiness: 'Low',
    biasScore: 0,
    trustScore: 4,
    logoUrl: '/media/xinhua.svg',
    website: 'http://www.xinhuanet.com'
  },
  {
    id: 'globaltimes',
    name: 'Global Times',
    country: 'CN',
    bias: 'Center Right',
    trustworthiness: 'Low',
    biasScore: 3,
    trustScore: 3,
    logoUrl: '/media/globaltimes.svg',
    website: 'https://www.globaltimes.cn'
  },
  {
    id: 'bild',
    name: 'Bild',
    country: 'EU',
    bias: 'Right',
    trustworthiness: 'Low',
    biasScore: 5,
    trustScore: 3,
    logoUrl: '/media/bild.svg',
    website: 'https://www.bild.de'
  },
  {
    id: 'faz',
    name: 'Frankfurter Allgemeine',
    country: 'EU',
    bias: 'Center Right',
    trustworthiness: 'High',
    biasScore: 2,
    trustScore: 8,
    logoUrl: '/media/faz.svg',
    website: 'https://www.faz.net'
  },
  {
    id: 'lemonde',
    name: 'Le Monde',
    country: 'EU',
    bias: 'Center Left',
    trustworthiness: 'High',
    biasScore: -2,
    trustScore: 8,
    logoUrl: '/media/lemonde.svg',
    website: 'https://www.lemonde.fr'
  }
];

// Новостные события
export const newsEvents: NewsEvent[] = [
  {
    id: '1',
    title: 'Торговые переговоры между США и Китаем',
    date: new Date('2023-09-10'),
    description: 'США и Китай провели новый раунд торговых переговоров, направленных на снижение напряженности и решение вопросов тарифов.',
    countries: ['US', 'CN'],
    category: 'Economic',
    importance: 8,
    coverage: [
      {
        mediaSourceId: 'reuters',
        title: 'U.S. and China hold trade talks aimed at easing tensions',
        content: 'U.S. and Chinese officials met for high-level trade talks aimed at easing tensions between the world\'s two largest economies. Both sides described the discussions as "constructive" but no major breakthroughs were announced.',
        sentiment: 0,
        factualAccuracy: 9,
        url: 'https://www.reuters.com/business/us-china-trade-talks-2023-09-10/',
        publishDate: new Date('2023-09-10')
      },
      {
        mediaSourceId: 'wsj',
        title: 'U.S.-China Trade Talks Resume Amid Ongoing Tensions',
        content: 'Trade representatives from the U.S. and China met to discuss tariff reductions and market access issues. The talks come as both countries seek to stabilize their economic relationship despite ongoing strategic competition.',
        sentiment: 1,
        factualAccuracy: 8,
        url: 'https://www.wsj.com/articles/us-china-trade-talks-2023-09-10/',
        publishDate: new Date('2023-09-10')
      },
      {
        mediaSourceId: 'globaltimes',
        title: 'China-US trade talks show Washington finally recognizing need for cooperation',
        content: 'The latest round of trade talks demonstrates that the U.S. is finally acknowledging the importance of economic cooperation with China. Chinese negotiators firmly defended China\'s core interests while showing willingness to address reasonable concerns.',
        sentiment: 4,
        factualAccuracy: 5,
        url: 'https://www.globaltimes.cn/page/202309/1298765.shtml',
        publishDate: new Date('2023-09-11')
      },
      {
        mediaSourceId: 'fox',
        title: 'Biden Administration Caves to China in Latest Trade Talks',
        content: 'The Biden administration appears to be making concessions to China in the latest round of trade talks, potentially undermining the tough stance established under the previous administration. Critics warn this could hurt American workers and businesses.',
        sentiment: -6,
        factualAccuracy: 4,
        url: 'https://www.foxnews.com/politics/biden-china-trade-talks-2023',
        publishDate: new Date('2023-09-11')
      }
    ]
  },
  {
    id: '2',
    title: 'Новые санкции ЕС против России',
    date: new Date('2023-08-25'),
    description: 'Европейский Союз ввел новый пакет санкций против России, направленных на энергетический и финансовый секторы.',
    countries: ['EU', 'RU'],
    category: 'Political',
    importance: 9,
    coverage: [
      {
        mediaSourceId: 'bbc',
        title: 'EU imposes new sanctions on Russia targeting energy and finance',
        content: 'The European Union has approved a new package of sanctions against Russia, targeting its energy exports and financial institutions. The measures aim to further pressure Moscow over its actions in Ukraine.',
        sentiment: 0,
        factualAccuracy: 9,
        url: 'https://www.bbc.com/news/world-europe-67890123',
        publishDate: new Date('2023-08-25')
      },
      {
        mediaSourceId: 'faz',
        title: 'EU verschärft Sanktionen gegen Russland',
        content: 'Die Europäische Union hat ein neues Sanktionspaket gegen Russland beschlossen, das auf den Energiesektor und Finanzinstitutionen abzielt. Die Maßnahmen sollen den wirtschaftlichen Druck auf Moskau erhöhen.',
        sentiment: 1,
        factualAccuracy: 8,
        url: 'https://www.faz.net/aktuell/politik/ausland/eu-russland-sanktionen-2023',
        publishDate: new Date('2023-08-25')
      },
      {
        mediaSourceId: 'rt',
        title: 'EU launches new round of illegal sanctions against Russia',
        content: 'The European Union has approved yet another package of illegal sanctions against Russia, continuing its economic war against the Russian people. These measures will primarily hurt European consumers and businesses while Russia continues to adapt and develop new economic partnerships.',
        sentiment: -7,
        factualAccuracy: 4,
        url: 'https://www.rt.com/russia/eu-sanctions-energy-finance-2023/',
        publishDate: new Date('2023-08-26')
      },
      {
        mediaSourceId: 'rbc',
        title: 'ЕС ввел новые санкции против российского энергетического сектора',
        content: 'Европейский союз утвердил новый пакет санкций, направленных на российский энергетический и финансовый секторы. Эксперты отмечают, что эти меры могут оказать дополнительное давление на экономику, но Россия продолжает адаптироваться к санкционному режиму.',
        sentiment: -2,
        factualAccuracy: 7,
        url: 'https://www.rbc.ru/economics/25/08/2023/sanctions-eu-russia',
        publishDate: new Date('2023-08-25')
      }
    ]
  },
  {
    id: '3',
    title: 'Китай и Россия проводят совместные военные учения',
    date: new Date('2023-07-15'),
    description: 'Китай и Россия начали масштабные совместные военные учения в Тихом океане, демонстрируя укрепление военного сотрудничества.',
    countries: ['RU', 'CN'],
    category: 'Military',
    importance: 7,
    coverage: [
      {
        mediaSourceId: 'reuters',
        title: 'China and Russia hold joint naval drills in Pacific',
        content: 'China and Russia have begun joint naval exercises in the Pacific Ocean, in what analysts see as a demonstration of strengthening military ties between the two countries amid tensions with the West.',
        sentiment: -1,
        factualAccuracy: 9,
        url: 'https://www.reuters.com/world/china-russia-naval-drills-2023-07-15/',
        publishDate: new Date('2023-07-15')
      },
      {
        mediaSourceId: 'rt',
        title: 'Russia and China demonstrate strategic partnership with joint naval exercises',
        content: 'Russian and Chinese naval forces have begun joint exercises in the Pacific, showcasing the growing strategic partnership between the two nations. The drills demonstrate the high level of military cooperation and mutual trust between Moscow and Beijing.',
        sentiment: 6,
        factualAccuracy: 7,
        url: 'https://www.rt.com/russia/china-joint-naval-exercises-2023/',
        publishDate: new Date('2023-07-15')
      },
      {
        mediaSourceId: 'xinhua',
        title: 'China-Russia joint naval exercise enhances strategic coordination',
        content: 'The joint naval exercise between China and Russia demonstrates the high level of strategic coordination between the two countries. The drills are not targeted at any third party and are conducted in accordance with international law.',
        sentiment: 5,
        factualAccuracy: 6,
        url: 'http://www.xinhuanet.com/english/2023-07/15/c_1310001.htm',
        publishDate: new Date('2023-07-15')
      },
      {
        mediaSourceId: 'nyt',
        title: 'Russia and China Hold Naval Drills as Military Alliance Deepens',
        content: 'Russia and China have launched joint naval exercises in the Pacific, signaling a deepening military alliance that challenges Western security interests. The drills come amid growing concerns about the two authoritarian powers\' expanding cooperation.',
        sentiment: -4,
        factualAccuracy: 7,
        url: 'https://www.nytimes.com/2023/07/15/world/asia/russia-china-naval-drills.html',
        publishDate: new Date('2023-07-16')
      }
    ]
  }
]; 