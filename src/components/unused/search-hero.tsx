"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, BarChart2, PieChart, DollarSign, UserPlus, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllStocks } from "@/lib/data";
import { Stock } from "@/lib/types/index";

export function SearchHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Загрузка списка акций при монтировании компонента
  useEffect(() => {
    const stocksData = getAllStocks();
    setStocks(stocksData);
  }, []);

  // Фильтрация акций при вводе поискового запроса
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      const query = searchQuery.trim().toUpperCase();
      const filtered = stocks.filter(
        stock => 
          stock.symbol.toUpperCase().includes(query) || 
          stock.name.toUpperCase().includes(query)
      );
      setFilteredStocks(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStocks([]);
      setShowDropdown(false);
    }
  }, [searchQuery, stocks]);

  // Закрыть выпадающий список при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.trim().toUpperCase()}`);
    }
  };

  const handleStockSelect = (symbol: string) => {
    router.push(`/stock/${symbol}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const popularSearches = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
  ];

  return (
    <div className="w-full px-4 py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <Award className="h-12 w-12 text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Найдите и проанализируйте любую акцию
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Введите тикер компании для получения подробной аналитики, финансовых показателей и прогнозов
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Введите тикер акции (например, AAPL, MSFT, GOOGL)"
                className="w-full pl-12 pr-32 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 py-2 min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white flex items-center mr-1"
                disabled={!searchQuery.trim()}
              >
                Поиск
              </Button>
            </div>
            
            {/* Выпадающий список с результатами поиска */}
            {showDropdown && filteredStocks.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
              >
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    type="button"
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{stock.price} {stock.currency || 'USD'}</span>
                      <span className={`ml-2 text-sm ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="mb-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Популярные запросы:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSearchQuery(stock.symbol);
                    router.push(`/stock/${stock.symbol}`);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  {stock.symbol} - {stock.name}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <h3 className="font-medium">Технический анализ</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Графики, индикаторы и паттерны для принятия торговых решений
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                  <BarChart2 className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <h3 className="font-medium">Фундаментальный анализ</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Финансовые показатели, отчеты и оценка стоимости компаний
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                  <PieChart className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <h3 className="font-medium">Портфельный анализ</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Оптимизация портфеля, расчет рисков и доходности инвестиций
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full mr-3">
                  <DollarSign className="text-amber-600 dark:text-amber-400" size={20} />
                </div>
                <h3 className="font-medium">Макроэкономика</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Экономические показатели и их влияние на финансовые рынки
              </p>
            </div>
          </div> */}

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
              <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                <UserPlus className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Бесплатный доступ ко всем ресурсам</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Зарегистрируйтесь, чтобы получить неограниченный доступ ко всем инструментам и данным. Вы можете добавить свои API-ключи для расширенных возможностей.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button asChild>
                  <Link href="/register">
                    Зарегистрироваться
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 