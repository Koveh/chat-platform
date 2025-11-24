import { NextRequest, NextResponse } from 'next/server';

// Имитация генерации PDF-отчетов
const mockReportUrls = {
  'stock-summary': '/sample-reports/stock-summary.pdf',
  'financial-analysis': '/sample-reports/financial-analysis.pdf',
  'technical-analysis': '/sample-reports/technical-analysis.pdf',
  'portfolio-summary': '/sample-reports/portfolio-summary.pdf',
  'market-overview': '/sample-reports/market-overview.pdf',
  'macro-analysis': '/sample-reports/macro-analysis.pdf',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, symbol, period, includeCharts, includeFundamentals, includeNews } = body;

    // Проверка наличия обязательных параметров
    if (!reportType) {
      return NextResponse.json(
        { error: 'Необходимо указать тип отчета' },
        { status: 400 }
      );
    }

    // Проверка наличия символа для отчетов, требующих его
    if (['stock-summary', 'financial-analysis', 'technical-analysis'].includes(reportType) && !symbol) {
      return NextResponse.json(
        { error: 'Необходимо указать символ тикера для данного типа отчета' },
        { status: 400 }
      );
    }

    // Имитация задержки генерации отчета
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Получение URL отчета из имитации
    const reportUrl = mockReportUrls[reportType as keyof typeof mockReportUrls];

    if (!reportUrl) {
      return NextResponse.json(
        { error: 'Тип отчета не поддерживается' },
        { status: 404 }
      );
    }

    // Добавление параметров к URL для имитации уникальности отчета
    const uniqueReportUrl = `${reportUrl}?symbol=${symbol || 'none'}&period=${period || 'none'}&t=${Date.now()}`;

    return NextResponse.json({
      success: true,
      reportUrl: uniqueReportUrl,
      reportType,
      generatedAt: new Date().toISOString(),
      parameters: {
        symbol,
        period,
        includeCharts,
        includeFundamentals,
        includeNews
      }
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return NextResponse.json(
      { error: 'Ошибка генерации отчета' },
      { status: 500 }
    );
  }
} 