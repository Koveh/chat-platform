"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Если мы на главной странице, не показываем хлебные крошки
  if (pathname === "/") {
    return null;
  }
  
  // Разбиваем путь на сегменты
  const segments = pathname.split("/").filter(Boolean);
  
  // Создаем массив хлебных крошек
  const breadcrumbs = [
    { name: "Главная", href: "/" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      
      // Преобразуем сегмент пути в читаемое название
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Специальные случаи для определенных путей
      if (segment === "stocks") name = "Акции";
      if (segment === "macro") name = "Макроэкономика";
      if (segment === "portfolio") name = "Портфель";
      if (segment === "api-explorer") name = "API Explorer";
      if (segment === "login") name = "Вход";
      if (segment === "register") name = "Регистрация";
      if (segment === "profile") name = "Профиль";
      if (segment === "settings") name = "Настройки";
      if (segment === "ai") name = "AI-ассистент";
      if (segment === "search") name = "Поиск документов";
      if (segment === "deep-dive") name = "Глубокий анализ документов";
      
      return { name, href };
    }),
  ];

  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumbs">
      <ol className="flex flex-wrap items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index === 0 ? (
              <Link href={breadcrumb.href} className="text-muted-foreground hover:text-foreground flex items-center">
                <Home className="w-3.5 h-3.5 mr-1" />
                <span className="sr-only">{breadcrumb.name}</span>
              </Link>
            ) : (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-muted-foreground" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{breadcrumb.name}</span>
                ) : (
                  <Link href={breadcrumb.href} className="text-muted-foreground hover:text-foreground">
                    {breadcrumb.name}
                  </Link>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 