"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  titleClassName?: string;
}

export function CardContainer({ 
  children, 
  className, 
  title,
  titleClassName
}: CardContainerProps) {
  return (
    <div className={cn(
      "mb-6 p-4 bg-slate-50 rounded-lg", 
      "border-none shadow-none",
      className
    )}>
      {title && (
        <h3 className={cn(
          "text-lg font-medium mb-3",
          titleClassName
        )}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
} 