"use client";
import React, { useState } from "react";
import { ArrowUp, ArrowDown, TrendingUp, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedStocks() {
  // Имитация данных о популярных акциях
  const [stocks, setStocks] = useState([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 187.32,
      change: 1.25,
      changePercent: 0.67,
      votes: 128,
      userVoted: false
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 415.56,
      change: 3.78,
      changePercent: 0.92,
      votes: 112,
      userVoted: false
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 924.73,
      change: -12.45,
      changePercent: -1.33,
      votes: 98,
      userVoted: false
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 175.98,
      change: 2.34,
      changePercent: 1.35,
      votes: 87,
      userVoted: false
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 182.41,
      change: -0.89,
      changePercent: -0.49,
      votes: 76,
      userVoted: false
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 175.34,
      change: 5.67,
      changePercent: 3.34,
      votes: 65,
      userVoted: false
    }
  ]);

  // Функция для голосования за акцию
  const handleVote = (symbol: string) => {
    setStocks(stocks.map(stock => {
      if (stock.symbol === symbol) {
        return {
          ...stock,
          votes: stock.userVoted ? stock.votes - 1 : stock.votes + 1,
          userVoted: !stock.userVoted
        };
      }
      return stock;
    }));
  };

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Популярные акции</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Акции, которые привлекают наибольшее внимание инвесторов
            </p>
          </div>
          <Link 
            href="/stocks" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Смотреть все акции
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300 rounded-tl-xl">Тикер</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">Название</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">Цена</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300">Изменение</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300 text-center">Голоса</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-300 rounded-tr-xl text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr 
                  key={stock.symbol} 
                  className={`border-t border-gray-100 dark:border-gray-700 ${
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
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">{stock.votes}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant={stock.userVoted ? "default" : "outline"}
                        className={`px-3 py-1 ${
                          stock.userVoted 
                            ? "bg-blue-600 text-white" 
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                        onClick={() => handleVote(stock.symbol)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {stock.userVoted ? "Проголосовано" : "Голосовать"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 py-1"
                        asChild
                      >
                        <Link href={`/stock/${stock.symbol}`}>
                          Детали
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 