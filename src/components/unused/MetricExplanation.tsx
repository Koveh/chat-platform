'use client';

import React, { useState, useEffect } from 'react';
import { metricExplanations, financialMetricsExplanations } from '@/lib/metric-explanations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InfoIcon } from 'lucide-react';

interface MetricExplanationProps {
  metricKey: string;
  type?: 'financial' | 'ratio';
  children?: React.ReactNode;
  iconOnly?: boolean;
}

export function MetricExplanation({ metricKey, type = 'ratio', children, iconOnly = false }: MetricExplanationProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const explanations = type === 'financial' ? financialMetricsExplanations : metricExplanations;
  const explanation = explanations[metricKey];
  
  if (!explanation) {
    return <>{children}</>;
  }
  
  // Список очевидных метрик, для которых не нужно показывать иконку
  const obviousMetrics = [
    'totalRevenue', 'grossProfit', 'ebitda', 'ebit', 'ebt', 'netIncome',
    'ROA', 'ROE', 'ROCE', 'ROIC', 'ROS'
  ];
  
  const isObvious = obviousMetrics.includes(metricKey);
  
  if (isObvious) {
    return <>{children}</>;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <span className="inline-flex items-center cursor-pointer">
            <InfoIcon className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </span>
        ) : (
          <span className="inline-flex items-center cursor-pointer group">
            {children}
            <InfoIcon className="ml-1 h-3 w-3 text-gray-400 group-hover:text-gray-600" />
          </span>
        )}
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] p-3' : 'sm:max-w-[600px]'}`}>
        <DialogHeader>
          <DialogTitle className={`${isMobile ? 'text-base' : ''}`}>{explanation.title}</DialogTitle>
        </DialogHeader>
        <div className={`space-y-3 mt-3 ${isMobile ? 'text-xs' : ''}`}>
          <div>
            <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500`}>Описание</h4>
            <p className="mt-1">{explanation.description}</p>
          </div>
          
          <div>
            <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500`}>Формула</h4>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: explanation.formula.replace(/`([^`]+)`/g, '<code>$1</code>') }} />
            </div>
          </div>
          
          {!isMobile && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Пример</h4>
              <p className="mt-1">{explanation.example}</p>
            </div>
          )}
          
          <div>
            <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500`}>Интерпретация</h4>
            <p className="mt-1">{explanation.interpretation}</p>
          </div>
          
          {explanation.goodValue && !isMobile && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Хорошие значения</h4>
              <p className="mt-1">{explanation.goodValue}</p>
            </div>
          )}
          
          {!isMobile && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Применение в анализе</h4>
              <p className="mt-1">
                Этот показатель часто используется инвесторами для {type === 'financial' ? 
                  'оценки финансового состояния компании и эффективности её операционной деятельности.' : 
                  'сравнения компаний в одной отрасли и определения относительной стоимости акций.'}
              </p>
            </div>
          )}
          
          {!isMobile && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Ограничения</h4>
              <p className="mt-1">
                {type === 'financial' ? 
                  'Следует учитывать, что финансовые показатели могут быть подвержены манипуляциям со стороны компаний и не всегда отражают реальное положение дел.' : 
                  'Мультипликаторы не учитывают многие качественные факторы и могут давать искаженную картину при сравнении компаний из разных отраслей или с разными бизнес-моделями.'}
              </p>
            </div>
          )}
          
          <div className={`p-2 ${isMobile ? 'bg-blue-50/70' : 'bg-blue-50'} rounded-md`}>
            <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-blue-700`}>Совет инвестору</h4>
            <p className={`mt-1 ${isMobile ? 'text-xs text-blue-700' : 'text-blue-600'}`}>
              {type === 'financial' ? 
                'Всегда анализируйте этот показатель в динамике за несколько лет и сравнивайте с аналогичными компаниями в отрасли.' : 
                'Используйте этот мультипликатор в комбинации с другими показателями для получения более полной картины о компании.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 