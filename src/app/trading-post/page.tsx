'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';

export default function TradingPostSelection() {
  const { gameSession } = useGameContext();
  const { t } = useLanguage();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{t.selectPost}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {t.manageInventory}
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {gameSession.tradingPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gameSession.tradingPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h5 className="font-medium text-gray-900 mb-2">{post.name}</h5>
                <p className="text-sm text-gray-500 mb-4">{post.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">{t.currency}:</span>
                  <span className="text-sm font-medium text-yellow-600">{post.currency} coins</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.isActive ? t.gameActive : t.gameInactive}
                  </span>
                </div>
                <Link 
                  href={`/trading-post/${post.id}`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t.manageCurrency}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No trading posts available.</p>
            <Link 
              href="/admin/trading-posts"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Trading Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
