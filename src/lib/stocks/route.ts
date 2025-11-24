import { NextResponse } from 'next/server';
import { getAllStocks, getStockBySymbol } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (symbol) {
    const stock = getStockBySymbol(symbol);
    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }
    return NextResponse.json(stock);
  }

  const stocks = getAllStocks();
  return NextResponse.json(stocks);
} 