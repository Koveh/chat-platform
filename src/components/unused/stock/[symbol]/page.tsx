import { getStockBySymbol } from '@/lib/data';
import { StockHeader } from '@/components/stock/StockHeader';
import { PriceCard } from '@/components/stock/PriceCard';
import { ValueCard } from '@/components/stock/ValueCard';
import { DividendCard } from '@/components/stock/DividendCard';
import { SectorComparison } from '@/components/stock/SectorComparison';
import { ProfitFunnel } from '@/components/charts/ProfitFunnel';
import { ProfitFunnelV2 } from '@/components/charts/ProfitFunnelV2';
import { ExpensesChart } from '@/components/charts/ExpensesChart';
import { FinancialMetrics } from '@/components/stock/FinancialMetrics';
import { FinancialMetricsV2 } from '@/components/stock/FinancialMetricsV2';
import { YearlyFinancials } from '@/components/stock/YearlyFinancials';
import { PriceChartV2 } from '@/components/charts/PriceChartV2';
import { PriceChartV3 } from '@/components/charts/PriceChartV3';
import { OrderBookWrapper } from '@/components/charts/OrderBookWrapper';
import { FinancialChart } from '@/components/charts/FinancialChart';
import { RevenueHistoryChart } from '@/components/charts/RevenueHistoryChart';
import { PEComparison } from '@/components/stock/PEComparison';
import { BalanceSheetCard } from '@/components/stock/BalanceSheetCard';
import { OwnershipCard } from '@/components/stock/OwnershipCard';
import { VolatilityCard } from '@/components/stock/VolatilityCard';
import { SimilarCompaniesCard } from '@/components/stock/SimilarCompaniesCard';
import { CashFlowVsEarningsCard } from '@/components/charts/CashFlowVsEarningsCard';
import { DebtToEquityCard } from '@/components/charts/DebtToEquityCard';
import { CompanyInfoCard } from '@/components/stock/CompanyInfoCard';
import { FinancialReportsList } from '@/components/stock/FinancialReportsList';
import { StockAIProvider } from '@/components/ai/StockAIProvider';
import { notFound } from 'next/navigation';
import { Stock } from '@/lib/types';

interface StockPageProps {
  params: Promise<{
    symbol: string;
  }>;
}

// Адаптер для совместимости со StockAIProvider
const adaptStockForAI = (stock: any): Partial<Stock> => {
  // Создаем новый объект без проблемных свойств
  const { balanceSheet, ...rest } = stock;
  
  // Возвращаем объект без balanceSheet
  return rest;
};

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const stock = getStockBySymbol(symbol);
  
  if (!stock) {
    notFound();
  }
  
  return (
    <div className="py-6 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      <StockHeader stock={stock} />
      
      {/* Компонент для передачи данных о акции в GlobalAIAssistant */}
      <StockAIProvider stock={adaptStockForAI(stock)} />
      
      {/* График цены с данными из Yahoo Finance и уровнями Фибоначчи */}
      <div className="mb-6">
        <PriceChartV2 stock={stock} />
      </div>
      
      {/* Волатильность и сравнение с сектором и рынком */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VolatilityCard stock={stock} />
        <SectorComparison stock={stock} />
      </div> */}
      
      {/* Стакан заявок */}
      <div className="mb-6">
        <OrderBookWrapper 
          stock={stock} 
          apiType="tinkoff" 
          apiKey="t.nE5r5zRS_gysJDfZ8F9lxQlAL11-I-7HSXgB1nH075KQn58P01WeGD_LQygkpBr09FSsXTDGodz3elqnrh7AiQ" 
          updateInterval={15000} 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <PriceCard stock={stock} />
          <ValueCard stock={stock} />
          <DividendCard stock={stock} />
          <PEComparison stock={stock} />
          {stock.ownership && <OwnershipCard stock={stock} />}
        </div>
        
        <div>
          <SectorComparison stock={stock} type="sector" />
          <SectorComparison stock={stock} type="country" />
          <FinancialMetricsV2 stock={stock} />
          {stock.balanceSheet && <BalanceSheetCard stock={stock} />}
        </div>
        
        <div>
          <ProfitFunnelV2 stock={stock} />
          <ExpensesChart stock={stock} />
        </div>

  
        <VolatilityCard stock={stock} />
        <SectorComparison stock={stock} type="sector" />

      </div>

      {/* Финансовые показатели по годам */}
      <div className="mb-6">
        <YearlyFinancials stock={stock} />
      </div>

       {/* Сравнение с похожими компаниями */}
       <div className="mb-6">
        <SimilarCompaniesCard stock={stock} />
      </div>

      {/* Анализ свободного денежного потока и прибыли */}
      <div className="mt-6">
        <CashFlowVsEarningsCard stock={stock} />
      </div>

      {/* Анализ соотношения долга к капиталу */}
      <div className="mt-6">
        <DebtToEquityCard stock={stock} />
      </div>

      {/* График финансовых показателей */}
      <div className="mt-6">
        <FinancialChart stock={stock} />
      </div>
      
      {/* Историческая и прогнозируемая выручка */}
      <div className="mt-6">
        <RevenueHistoryChart stock={stock} />
      </div>
      
      {/* График для технического анализа с полосами Боллинджера и возможностью рисования */}
      <div className="mb-6">
        <PriceChartV3 stock={stock} />
      </div>
      
      {/* Ключевая информация о компании */}
      <div className="mt-6">
        <CompanyInfoCard stock={stock} />
      </div>

      {/* Список финансовых отчетов */}
      <div className="mb-6">
        <FinancialReportsList stock={stock} />
      </div>
    </div>
  );
}