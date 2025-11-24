import { type ClassValue, clsx } from "clsx"; import { twMerge } from "tailwind-merge"; export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

/**
 * Форматирует число как денежную сумму в долларах
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Форматирует большие числа с суффиксами (K, M, B, T)
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

/**
 * Форматирует процент
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
