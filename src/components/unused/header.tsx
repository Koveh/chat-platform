"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { User, Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

// Имитация проверки авторизации (в реальном приложении будет использоваться контекст или хук)
const useAuth = () => {
  // Для демонстрации: проверяем наличие куки или localStorage
  const isAuthenticated = typeof window !== 'undefined' && 
    (localStorage.getItem('isAuthenticated') === 'true');
  
  return { isAuthenticated };
};

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { name: "Акции", href: "/stock" },
    { name: "Макро", href: "/macro" },
    { name: "Портфель", href: "/portfolio" },
    { name: "Стратегии", href: "/strategies" },
    { name: "Документы", href: "/search" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.trim().toUpperCase()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Koveh<span className="text-stone-400 ml-0.5">Analytics</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-auto px-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск акций (например, AAPL)"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </form>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Профиль</span>
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 