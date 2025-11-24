"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";
import { redirect } from 'next/navigation';

// Имитация данных о акциях
const stocksData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.32,
    change: 1.25,
    changePercent: 0.67,
    sector: "Технологии",
    industry: "Потребительская электроника",
    marketCap: 2950000000000,
    pe: 31.2,
    dividendYield: 0.5,
    volume: 58234567
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 415.56,
    change: 3.78,
    changePercent: 0.92,
    sector: "Технологии",
    industry: "Программное обеспечение",
    marketCap: 3100000000000,
    pe: 36.8,
    dividendYield: 0.7,
    volume: 23456789
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 924.73,
    change: -12.45,
    changePercent: -1.33,
    sector: "Технологии",
    industry: "Полупроводники",
    marketCap: 2280000000000,
    pe: 68.5,
    dividendYield: 0.03,
    volume: 45678901
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 175.98,
    change: 2.34,
    changePercent: 1.35,
    sector: "Коммуникационные услуги",
    industry: "Интернет-контент и информация",
    marketCap: 2200000000000,
    pe: 25.1,
    dividendYield: 0,
    volume: 19876543
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 182.41,
    change: -0.89,
    changePercent: -0.49,
    sector: "Потребительские циклические",
    industry: "Интернет-ритейл",
    marketCap: 1900000000000,
    pe: 59.8,
    dividendYield: 0,
    volume: 32145678
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 175.34,
    change: 5.67,
    changePercent: 3.34,
    sector: "Потребительские циклические",
    industry: "Автомобили",
    marketCap: 560000000000,
    pe: 48.2,
    dividendYield: 0,
    volume: 87654321
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 487.95,
    change: 2.15,
    changePercent: 0.44,
    sector: "Коммуникационные услуги",
    industry: "Социальные сети",
    marketCap: 1250000000000,
    pe: 32.7,
    dividendYield: 0,
    volume: 15432678
  },
  {
    symbol: "BRK.B",
    name: "Berkshire Hathaway Inc.",
    price: 412.56,
    change: -1.23,
    changePercent: -0.30,
    sector: "Финансы",
    industry: "Страхование",
    marketCap: 720000000000,
    pe: 8.5,
    dividendYield: 0,
    volume: 3456789
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 198.45,
    change: 3.21,
    changePercent: 1.64,
    sector: "Финансы",
    industry: "Банки",
    marketCap: 570000000000,
    pe: 12.1,
    dividendYield: 2.3,
    volume: 9876543
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 276.89,
    change: 1.56,
    changePercent: 0.57,
    sector: "Финансы",
    industry: "Кредитные услуги",
    marketCap: 560000000000,
    pe: 30.8,
    dividendYield: 0.8,
    volume: 6543210
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 152.78,
    change: -0.45,
    changePercent: -0.29,
    sector: "Здравоохранение",
    industry: "Фармацевтика",
    marketCap: 370000000000,
    pe: 17.2,
    dividendYield: 3.1,
    volume: 5432109
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 59.87,
    change: 0.34,
    changePercent: 0.57,
    sector: "Потребительские товары первой необходимости",
    industry: "Розничная торговля",
    marketCap: 480000000000,
    pe: 31.5,
    dividendYield: 1.4,
    volume: 7654321
  }
];

export default function StocksPage() {
  redirect('/stock');
  
  const [stocks, setStocks] = useState(stocksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("marketCap");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedSector, setSelectedSector] = useState("all");

  // Получение уникальных секторов
  const sectors = ["all", ...new Set(stocksData.map(stock => stock.sector))];

  // Функция для сортировки акций
  const sortStocks = (field: string, direction: string) => {
    const sortedStocks = [...stocks].sort((a, b) => {
      if (direction === "asc") {
        return a[field as keyof typeof a] > b[field as keyof typeof b] ? 1 : -1;
      } else {
        return a[field as keyof typeof a] < b[field as keyof typeof b] ? 1 : -1;
      }
    });
    setStocks(sortedStocks);
    setSortField(field);
    setSortDirection(direction);
  };

  // Функция для фильтрации акций
  const filterStocks = () => {
    let filteredStocks = [...stocksData];
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Фильтрация по сектору
    if (selectedSector !== "all") {
      filteredStocks = filteredStocks.filter(stock => stock.sector === selectedSector);
    }
    
    // Применение текущей сортировки
    sortStocks(sortField, sortDirection);
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    let filteredStocks = [...stocksData];
    
    if (e.target.value) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(e.target.value.toLowerCase()) || 
        stock.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
    }
    
    if (selectedSector !== "all") {
      filteredStocks = filteredStocks.filter(stock => stock.sector === selectedSector);
    }
    
    // Сортировка отфильтрованных акций
    filteredStocks.sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField as keyof typeof a] > b[sortField as keyof typeof b] ? 1 : -1;
      } else {
        return a[sortField as keyof typeof a] < b[sortField as keyof typeof b] ? 1 : -1;
      }
    });
    
    setStocks(filteredStocks);
  };

  // Обработчик изменения сектора
  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(e.target.value);
    
    let filteredStocks = [...stocksData];
    
    if (searchQuery) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (e.target.value !== "all") {
      filteredStocks = filteredStocks.filter(stock => stock.sector === e.target.value);
    }
    
    // Сортировка отфильтрованных акций
    filteredStocks.sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField as keyof typeof a] > b[sortField as keyof typeof b] ? 1 : -1;
      } else {
        return a[sortField as keyof typeof a] < b[sortField as keyof typeof b] ? 1 : -1;
      }
    });
    
    setStocks(filteredStocks);
  };

  // Функция для форматирования рыночной капитализации
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap}`;
    }
  };

  // Функция для форматирования объема торгов
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `${volume}`;
    }
  };

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Список акций</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск по тикеру или названию компании"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={20} />
          <select
            value={selectedSector}
            onChange={handleSectorChange}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>
                {sector === "all" ? "Все секторы" : sector}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300 rounded-tl-xl">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("symbol", sortField === "symbol" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Тикер
                  {sortField === "symbol" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("name", sortField === "name" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Название
                  {sortField === "name" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("price", sortField === "price" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Цена
                  {sortField === "price" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("changePercent", sortField === "changePercent" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Изменение
                  {sortField === "changePercent" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("marketCap", sortField === "marketCap" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Капитализация
                  {sortField === "marketCap" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("pe", sortField === "pe" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  P/E
                  {sortField === "pe" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("dividendYield", sortField === "dividendYield" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Див. доход
                  {sortField === "dividendYield" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300 rounded-tr-xl">
                <button 
                  className="flex items-center"
                  onClick={() => sortStocks("volume", sortField === "volume" && sortDirection === "asc" ? "desc" : "asc")}
                >
                  Объем
                  {sortField === "volume" && (
                    sortDirection === "asc" ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr 
                key={stock.symbol} 
                className={`border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                  index === stocks.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                <td className="py-4 px-4">
                  <Link 
                    href={`/stock/${stock.symbol}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {stock.symbol}
                  </Link>
                </td>
                <td className="py-4 px-4">{stock.name}</td>
                <td className="py-4 px-4 font-medium">${stock.price.toFixed(2)}</td>
                <td className="py-4 px-4">
                  <div className={`flex items-center ${
                    stock.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {stock.change >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}</span>
                    <span className="ml-1">({stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)</span>
                  </div>
                </td>
                <td className="py-4 px-4">{formatMarketCap(stock.marketCap)}</td>
                <td className="py-4 px-4">{stock.pe.toFixed(1)}</td>
                <td className="py-4 px-4">{stock.dividendYield.toFixed(1)}%</td>
                <td className="py-4 px-4">{formatVolume(stock.volume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {stocks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Акции не найдены. Попробуйте изменить параметры поиска.</p>
        </div>
      )}
    </PageContainer>
  );
} 