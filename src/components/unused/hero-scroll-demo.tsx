"use client";
import React, { useState } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroScrollDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.toUpperCase()}`);
    }
  };

  const popularSearches = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

  return (
    <div className="flex flex-col overflow-hidden pb-[200px] pt-[50px] w-full">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Раскройте потенциал <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Фондового Рынка
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Аналитика, данные и инструменты для принятия взвешенных инвестиционных решений
            </p>
          </>
        }
      >
        <div className="relative w-full h-full">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src="/images/portfolio-koveh-com.webp"
              alt="Профессиональная аналитика"
              height={1608}
              width={1992}
              className="w-full h-auto object-cover"
              draggable={false}
              priority
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-br-2xl rounded-tl-2xl">
            <h2 className="text-2xl font-bold mb-4">Профессиональная <span className="text-blue-600 dark:text-blue-400">аналитика</span></h2>
            <p className="text-lg mb-6">Доступ к данным, которые раньше были доступны только профессионалам</p>
            
            <div className="max-w-xl">
              <form onSubmit={handleSearch} className="flex items-center mb-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Введите тикер акции (например, AAPL)"
                  />
                </div>
                <button
                  type="submit"
                  className="p-4 ml-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Анализировать
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Популярные запросы:</span>
                {popularSearches.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => {
                      router.push(`/stock/${ticker}`);
                    }}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
} 