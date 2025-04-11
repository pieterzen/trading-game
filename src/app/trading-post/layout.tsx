'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Building2 } from 'lucide-react';

export default function TradingPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameSession } = useGameContext();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex h-16 items-center gap-4 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">{t.tradingPostView || 'Trading Posts'}</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {/* Game status badge removed */}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

