'use client';

import React, { useMemo, useCallback } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';

// Optimized version of the trading post detail page
export default function TradingPostDetail({ params }: { params: { id: string } }) {
  const postId = params.id;
  
  const { gameSession, updateInventory, updateCurrency, calculatePrice } = useGameContext();
  const { t } = useLanguage();
  
  // Memoize the current post to prevent unnecessary recalculations
  const post = useMemo(() => 
    gameSession.tradingPosts.find(p => p.id === postId),
    [gameSession.tradingPosts, postId]
  );
  
  // Memoize the available items
  const availableItems = useMemo(() => 
    gameSession.items,
    [gameSession.items]
  );
  
  // Memoize inventory items with calculated prices
  const inventoryWithPrices = useMemo(() => {
    if (!post) return [];
    
    return Object.entries(post.inventory).map(([itemId, item]) => {
      const currentPrice = calculatePrice(post.id, itemId);
      return {
        ...item,
        currentPrice
      };
    });
  }, [post, calculatePrice]);
  
  // Memoize the currency update handler
  const handleUpdateCurrency = useCallback((amount: number) => {
    if (!post) return;
    updateCurrency(post.id, amount);
  }, [post, updateCurrency]);
  
  // Memoize the inventory update handler
  const handleUpdateInventory = useCallback((itemId: string, quantity: number) => {
    if (!post) return;
    updateInventory(post.id, itemId, quantity);
  }, [post, updateInventory]);
  
  // Early return if post not found
  if (!post) {
    return <div className="text-center py-8">{t.tradingPostView} not found.</div>;
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{post.name}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{post.description}</p>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">{t.currency}:</span>
          <div className="flex items-center">
            <button
              onClick={() => handleUpdateCurrency(Math.max(0, post.currency - 10))}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-1"
              disabled={!gameSession.isActive}
            >
              -
            </button>
            <span className="text-sm font-medium text-yellow-600 mx-2">{post.currency}</span>
            <button
              onClick={() => handleUpdateCurrency(post.currency + 10)}
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-1"
              disabled={!gameSession.isActive}
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Inventory Table - Only render when needed */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">{t.currentInventory}</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.item}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.quantity}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.basePrice}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.currentPrice}</th>
                {gameSession.isActive && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryWithPrices.length > 0 ? (
                inventoryWithPrices.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.basePrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`${item.currentPrice > item.basePrice ? 'text-green-600' : item.currentPrice < item.basePrice ? 'text-red-600' : 'text-gray-500'}`}>
                        {item.currentPrice}
                      </span>
                    </td>
                    {gameSession.isActive && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleUpdateInventory(item.id, Math.max(0, item.quantity - 1))}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleUpdateInventory(item.id, item.quantity + 1)}
                          className="text-green-600 hover:text-green-900"
                        >
                          +1
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={gameSession.isActive ? 5 : 4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{t.noItems}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
