'use client';

import React from 'react';
import Link from 'next/link';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function TradingPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameSession } = useGameContext();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{t.tradingPostView}</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/trading-post" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  {t.selectPost}
                </Link>
                <Link href="/admin" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                  gameSession.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {gameSession.isActive ? t.gameActive : t.gameInactive}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
