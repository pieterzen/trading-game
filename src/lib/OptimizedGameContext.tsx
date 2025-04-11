'use client';

import React, { useMemo, useCallback } from 'react';
import { useGameContext } from '@/lib/GameContext';

// Optimized version of the GameContext with memoization
export function useOptimizedGameContext() {
  const context = useGameContext();

  // Memoize the price calculation function to prevent unnecessary recalculations
  const calculatePriceOptimized = useCallback((postId: string, itemId: string): number => {
    return context.calculatePrice(postId, itemId);
  }, [context.gameSession.tradingPosts, context.gameSession.items, context.calculatePrice]);

  // Memoize active trading posts
  const activeTradingPosts = useMemo(() =>
    context.gameSession.tradingPosts.filter(p => p.isActive),
    [context.gameSession.tradingPosts]
  );

  // Memoize total currency in the game
  const totalCurrency = useMemo(() =>
    context.gameSession.tradingPosts.reduce((sum, post) => sum + post.currency, 0),
    [context.gameSession.tradingPosts]
  );

  // Memoize total inventory across all posts
  const totalInventory = useMemo(() => {
    const result: Record<string, { id: string, name: string, totalQuantity: number, basePrice: number }> = {};
    context.gameSession.items.forEach(item => {
      result[item.id] = {
        id: item.id,
        name: item.name,
        totalQuantity: 0,
        basePrice: item.basePrice
      };
    });

    context.gameSession.tradingPosts.forEach(post => {
      // Check if post.inventory exists before using Object.entries
      if (post.inventory) {
        Object.entries(post.inventory).forEach(([itemId, item]) => {
          if (result[itemId]) {
            result[itemId].totalQuantity += item.quantity;
          }
        });
      }
    });

    return Object.values(result);
  }, [context.gameSession.tradingPosts, context.gameSession.items]);

  return {
    ...context,
    calculatePriceOptimized,
    activeTradingPosts,
    totalCurrency,
    totalInventory
  };
}
