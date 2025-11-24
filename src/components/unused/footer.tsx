"use client";
import React from "react";
import Link from "next/link";
import { DollarSign, Github, Twitter, Linkedin, MessageSquare } from "lucide-react";


export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const mainLinks = [
    { name: "Акции", href: "/stock" },
    { name: "Макро", href: "/macro" },
    { name: "Портфель", href: "/portfolio" },
    { name: "API Explorer", href: "/api-explorer" },
  ];
  
  const legalLinks = [
    { name: "Условия использования", href: "/terms" },
    { name: "Политика конфиденциальности", href: "/privacy" },
    { name: "Cookies", href: "/cookies" },
  ];
  
  const socialLinks = [
    { name: "Telegram", href: "https://t.me/koveh", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/koveh-studio/", icon: <Linkedin className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="https://koveh.com" className="flex items-center">
              <span className="text-xl font-bold">Koveh<span className="text-gray-400 ml-0.25">Studio</span></span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Аналитика фондового рынка и инструменты для принятия инвестиционных решений
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Навигация</h3>
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Правовая информация</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Связаться с нами</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {currentYear} Koveh Studio. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
} 