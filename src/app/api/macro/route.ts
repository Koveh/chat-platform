import { NextRequest, NextResponse } from 'next/server';

// Имитация данных макроэкономических показателей
const mockMacroData = {
  'gdp': {
    'usa': [
      { date: '2023-01-01', value: 26.13 },
      { date: '2023-02-01', value: 26.25 },
      { date: '2023-03-01', value: 26.48 },
      { date: '2023-04-01', value: 26.73 },
      { date: '2023-05-01', value: 26.89 },
      { date: '2023-06-01', value: 27.05 },
    ],
    'eu': [
      { date: '2023-01-01', value: 16.8 },
      { date: '2023-02-01', value: 16.9 },
      { date: '2023-03-01', value: 17.0 },
      { date: '2023-04-01', value: 17.1 },
      { date: '2023-05-01', value: 17.2 },
      { date: '2023-06-01', value: 17.3 },
    ],
    'china': [
      { date: '2023-01-01', value: 17.9 },
      { date: '2023-02-01', value: 18.1 },
      { date: '2023-03-01', value: 18.3 },
      { date: '2023-04-01', value: 18.5 },
      { date: '2023-05-01', value: 18.7 },
      { date: '2023-06-01', value: 18.9 },
    ],
  },
  'unemployment': {
    'usa': [
      { date: '2023-01-01', value: 3.4 },
      { date: '2023-02-01', value: 3.5 },
      { date: '2023-03-01', value: 3.5 },
      { date: '2023-04-01', value: 3.4 },
      { date: '2023-05-01', value: 3.7 },
      { date: '2023-06-01', value: 3.6 },
    ],
    'eu': [
      { date: '2023-01-01', value: 6.1 },
      { date: '2023-02-01', value: 6.0 },
      { date: '2023-03-01', value: 5.9 },
      { date: '2023-04-01', value: 5.9 },
      { date: '2023-05-01', value: 5.8 },
      { date: '2023-06-01', value: 5.8 },
    ],
    'china': [
      { date: '2023-01-01', value: 5.5 },
      { date: '2023-02-01', value: 5.3 },
      { date: '2023-03-01', value: 5.2 },
      { date: '2023-04-01', value: 5.2 },
      { date: '2023-05-01', value: 5.2 },
      { date: '2023-06-01', value: 5.1 },
    ],
  },
  'inflation': {
    'usa': [
      { date: '2023-01-01', value: 6.4 },
      { date: '2023-02-01', value: 6.0 },
      { date: '2023-03-01', value: 5.0 },
      { date: '2023-04-01', value: 4.9 },
      { date: '2023-05-01', value: 4.0 },
      { date: '2023-06-01', value: 3.0 },
    ],
    'eu': [
      { date: '2023-01-01', value: 8.6 },
      { date: '2023-02-01', value: 8.5 },
      { date: '2023-03-01', value: 6.9 },
      { date: '2023-04-01', value: 7.0 },
      { date: '2023-05-01', value: 6.1 },
      { date: '2023-06-01', value: 5.5 },
    ],
    'china': [
      { date: '2023-01-01', value: 2.1 },
      { date: '2023-02-01', value: 1.0 },
      { date: '2023-03-01', value: 0.7 },
      { date: '2023-04-01', value: 0.1 },
      { date: '2023-05-01', value: 0.2 },
      { date: '2023-06-01', value: 0.0 },
    ],
  },
  'interest-rate': {
    'usa': [
      { date: '2023-01-01', value: 4.5 },
      { date: '2023-02-01', value: 4.5 },
      { date: '2023-03-01', value: 4.75 },
      { date: '2023-04-01', value: 5.0 },
      { date: '2023-05-01', value: 5.0 },
      { date: '2023-06-01', value: 5.25 },
    ],
    'eu': [
      { date: '2023-01-01', value: 2.5 },
      { date: '2023-02-01', value: 2.5 },
      { date: '2023-03-01', value: 3.0 },
      { date: '2023-04-01', value: 3.5 },
      { date: '2023-05-01', value: 3.75 },
      { date: '2023-06-01', value: 4.0 },
    ],
    'china': [
      { date: '2023-01-01', value: 3.65 },
      { date: '2023-02-01', value: 3.65 },
      { date: '2023-03-01', value: 3.65 },
      { date: '2023-04-01', value: 3.65 },
      { date: '2023-05-01', value: 3.65 },
      { date: '2023-06-01', value: 3.55 },
    ],
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get('source');
  const indicator = searchParams.get('indicator');
  const country = searchParams.get('country');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Проверка наличия обязательных параметров
  if (!indicator || !country) {
    return NextResponse.json(
      { error: 'Необходимо указать индикатор и страну' },
      { status: 400 }
    );
  }

  // Получение данных из имитации
  let data = mockMacroData[indicator as keyof typeof mockMacroData]?.[country as keyof (typeof mockMacroData)[keyof typeof mockMacroData]];

  if (!data) {
    return NextResponse.json(
      { error: 'Данные не найдены для указанных параметров' },
      { status: 404 }
    );
  }

  // Фильтрация по датам, если указаны
  if (startDate || endDate) {
    data = data.filter((item: any) => {
      const itemDate = new Date(item.date);
      if (startDate && new Date(startDate) > itemDate) return false;
      if (endDate && new Date(endDate) < itemDate) return false;
      return true;
    });
  }

  return NextResponse.json({
    source: source || 'internal',
    indicator,
    country,
    data
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, indicator, country, startDate, endDate } = body;

    // Проверка наличия обязательных параметров
    if (!indicator || !country) {
      return NextResponse.json(
        { error: 'Необходимо указать индикатор и страну' },
        { status: 400 }
      );
    }

    // Получение данных из имитации
    let data = mockMacroData[indicator as keyof typeof mockMacroData]?.[country as keyof (typeof mockMacroData)[keyof typeof mockMacroData]];

    if (!data) {
      return NextResponse.json(
        { error: 'Данные не найдены для указанных параметров' },
        { status: 404 }
      );
    }

    // Фильтрация по датам, если указаны
    if (startDate || endDate) {
      data = data.filter((item: any) => {
        const itemDate = new Date(item.date);
        if (startDate && new Date(startDate) > itemDate) return false;
        if (endDate && new Date(endDate) < itemDate) return false;
        return true;
      });
    }

    return NextResponse.json({
      source: source || 'internal',
      indicator,
      country,
      data
    });
  } catch (error) {
    console.error('Error processing macro data request:', error);
    return NextResponse.json(
      { error: 'Ошибка обработки запроса' },
      { status: 500 }
    );
  }
} 