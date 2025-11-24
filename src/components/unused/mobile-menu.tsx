"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, User, BarChart2, LineChart, BookOpen, Home, LogIn, UserPlus, Settings, Search, DollarSign, PieChart, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Имитация проверки авторизации (в реальном приложении будет использоваться контекст или хук)
const useAuth = () => {
  // Для демонстрации: проверяем наличие куки или localStorage
  const isAuthenticated = typeof window !== 'undefined' && 
    (localStorage.getItem('isAuthenticated') === 'true');
  
  return { isAuthenticated };
};

export function MobileMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { name: "Акции", href: "/stocks", icon: <BarChart2 className="mr-2 h-5 w-5" /> },
    { name: "Макро", href: "/macro", icon: <LineChart className="mr-2 h-5 w-5" /> },
    { name: "Портфель", href: "/portfolio", icon: <PieChart className="mr-2 h-5 w-5" /> },
    { name: "AI-ассистент", href: "/ai", icon: <Bot className="mr-2 h-5 w-5" /> },
  ];

  const profileItems = [
    { name: "Профиль", href: "/profile", icon: <User className="mr-2 h-5 w-5" /> },
    { name: "Настройки", href: "/settings", icon: <Settings className="mr-2 h-5 w-5" /> },
  ];

  const footerItems = [
    { name: "API Explorer", href: "/api-explorer", icon: <DollarSign className="mr-2 h-5 w-5" /> },
  ];

  const authItems = [
    { name: "Войти", href: "/login", icon: <LogIn className="mr-2 h-5 w-5" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.trim().toUpperCase()}`);
      // Закрыть меню после поиска
      const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
      if (closeButton) closeButton.click();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-left">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Koveh <span className="text-gray-500">Analytics</span></span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск акций (например, AAPL)"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-3 py-1 text-xs"
            >
              Поиск
            </Button>
          </div>
        </form>

        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 mb-2 text-sm text-gray-500 dark:text-gray-400">Аккаунт</p>
              <div className="space-y-2">
                {profileItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {authItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="px-3 mb-2 text-sm text-gray-500 dark:text-gray-400">Дополнительно</p>
            <div className="space-y-2">
              {footerItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 