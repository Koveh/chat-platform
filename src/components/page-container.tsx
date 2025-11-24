"use client";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-1 sm:px-2 md:px-4 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
} 