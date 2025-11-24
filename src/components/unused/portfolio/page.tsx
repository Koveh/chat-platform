'use client';

import React, { useState } from 'react';
import { myPortfolio } from '@/lib/portfolio-data';
import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { AssetAllocationChart } from '@/components/portfolio/AssetAllocationChart';
import { SectorAllocationChart } from '@/components/portfolio/SectorAllocationChart';
import { CountryAllocationChart } from '@/components/portfolio/CountryAllocationChart';
import { PortfolioPositions } from '@/components/portfolio/PortfolioPositions';
import { PortfolioBonds } from '@/components/portfolio/PortfolioBonds';
import { PortfolioDerivatives } from '@/components/portfolio/PortfolioDerivatives';
import { PortfolioCash } from '@/components/portfolio/PortfolioCash';
import { TransactionHistory } from '@/components/portfolio/TransactionHistory';
import { PortfolioThoughts } from '@/components/portfolio/PortfolioThoughts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer } from '@/components/page-container';
export default function PortfolioPage() {
  const portfolio = myPortfolio;
  
  return (
    <PageContainer>
      <PortfolioHeader portfolio={portfolio} />
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <PortfolioSummary portfolio={portfolio} />
        </div>
        <div>
          <AssetAllocationChart portfolio={portfolio} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-8">
        <SectorAllocationChart portfolio={portfolio} />
        <CountryAllocationChart portfolio={portfolio} />
      </div>
      
      <Tabs defaultValue="positions" className="mb-8">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="positions">Акции</TabsTrigger>
          <TabsTrigger value="bonds">Облигации</TabsTrigger>
          <TabsTrigger value="derivatives">Деривативы</TabsTrigger>
          <TabsTrigger value="cash">Наличные</TabsTrigger>
          <TabsTrigger value="transactions">История</TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions">
          <PortfolioPositions portfolio={portfolio} />
        </TabsContent>
        
        <TabsContent value="bonds">
          <PortfolioBonds portfolio={portfolio} />
        </TabsContent>
        
        <TabsContent value="derivatives">
          <PortfolioDerivatives portfolio={portfolio} />
        </TabsContent>
        
        <TabsContent value="cash">
          <PortfolioCash portfolio={portfolio} />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory portfolio={portfolio} />
        </TabsContent>
      </Tabs>
      
      <PortfolioThoughts portfolio={portfolio} />
    </PageContainer>
  );
} 