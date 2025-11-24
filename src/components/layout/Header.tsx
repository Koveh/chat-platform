'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAllStocks } from '@/lib/data';
import type { Stock } from '@/lib/types/index';
import { Search } from 'lucide-react';

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Загрузка списка акций один раз при монтировании компонента
  useEffect(() => {
    const stocksData = getAllStocks();
    setStocks(stocksData);
  }, []);
  
  // Обработка поиска
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const results = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results.slice(0, 5)); // Ограничиваем 5 результатами для компактности
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, stocks]);
  
  // Закрытие выпадающего списка при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Обработка выбора акции
  const handleSelectStock = (symbol: string) => {
    router.push(`/stock/${symbol}`);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };
  
  // Обработка отправки формы поиска
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/stock/${searchTerm.trim().toUpperCase()}`);
      setSearchTerm('');
      setIsDropdownOpen(false);
    }
  };
  
  // Генерация хлебных крошек
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    
    if (paths.length === 0) {
      return null;
    }
    
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          
          if (path === 'stock' && paths.length > index + 1) {
            return (
              <React.Fragment key={path}>
                <span className="mx-2">/</span>
                <Link href="/stock" className="hover:text-foreground">
                  Акции
                </Link>
              </React.Fragment>
            );
          }
          
          if (isLast) {
            const stock = stocks.find(s => s.symbol.toLowerCase() === path.toLowerCase());
            return (
              <React.Fragment key={path}>
                <span className="mx-2">/</span>
                <span className="font-medium text-foreground">
                  {stock ? stock.name : path}
                </span>
              </React.Fragment>
            );
          }
          
          return (
            <React.Fragment key={path}>
              <span className="mx-2">/</span>
              <Link href={href} className="hover:text-foreground">
                {path}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  
  return (
    <header className="border-b border-gray-100 py-4 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold">
              Koveh Analytics
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/" className="text-sm hover:text-blue-600">
                Главная
              </Link>
              <Link href="/portfolio" className="text-sm hover:text-blue-600">
                Портфель
              </Link>
              <Link href="/macro" className="text-sm hover:text-blue-600">
                Макроэкономика
              </Link>
              <Link href="/api-explorer" className="text-sm hover:text-blue-600">
                API Explorer
              </Link>
            </nav>
          </div>
          
          <div className="relative w-64">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Поиск акций..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.trim() && setIsDropdownOpen(true)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </form>
            
            {isDropdownOpen && searchResults.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              >
                {searchResults.map((stock) => (
                  <button
                    key={stock.symbol}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-center justify-between text-left"
                    onClick={() => handleSelectStock(stock.symbol)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-xs text-gray-500">{stock.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="font-medium">{stock.price} {stock.currency || 'USD'}</span>
                      <span className={`ml-2 ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {generateBreadcrumbs()}
      </div>
    </header>
  );
} 