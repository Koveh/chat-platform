"use client";

import { useEffect, useState } from 'react';
import { Stock } from '@/lib/types';
import { GlobalAIAssistant } from './GlobalAIAssistant';

interface StockAIProviderProps {
  stock: Partial<Stock>;
}

export function StockAIProvider({ stock }: StockAIProviderProps) {
  // Используем useState для хранения данных о акции
  const [currentStock, setCurrentStock] = useState<Partial<Stock> | null>(null);
  
  // При изменении props обновляем состояние
  useEffect(() => {
    setCurrentStock(stock);
    
    // Сохраняем данные о текущей акции в sessionStorage
    sessionStorage.setItem('currentStock', JSON.stringify(stock));
    
    // Создаем кастомное событие для оповещения GlobalAIAssistant
    const event = new CustomEvent('stockChanged', { detail: stock });
    window.dispatchEvent(event);
  }, [stock]);
  
  return null; // Этот компонент не рендерит ничего видимого
} 