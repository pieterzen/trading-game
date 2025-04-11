'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameSession, Item, TradingPost, defaultGameSession } from './types';

interface GameContextType {
  gameSession: GameSession;
  startGame: () => void;
  resetGame: () => void;
  endGame: () => void;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  addTradingPost: (post: TradingPost) => void;
  updateTradingPost: (post: TradingPost) => void;
  removeTradingPost: (postId: string) => void;
  updateInventory: (postId: string, itemId: string, quantity: number) => void;
  updateCurrency: (postId: string, amount: number) => void;
  calculatePrice: (postId: string, itemId: string) => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameSession, setGameSession] = useState<GameSession>(() => {
    // Try to load from localStorage on initial render (client-side only)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gameSession');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert string dates back to Date objects
          if (parsed.startTime) parsed.startTime = new Date(parsed.startTime);
          if (parsed.endTime) parsed.endTime = new Date(parsed.endTime);
          parsed.createdAt = new Date(parsed.createdAt);
          return parsed;
        } catch (e) {
          console.error('Failed to parse saved game session:', e);
        }
      }
    }
    return defaultGameSession;
  });

  // Save to localStorage whenever gameSession changes
  useEffect(() => {
    localStorage.setItem('gameSession', JSON.stringify(gameSession));
  }, [gameSession]);

  const startGame = () => {
    setGameSession(prev => ({
      ...prev,
      startTime: new Date(),
      isActive: true,
      endTime: null,
      // Set all trading posts to active when the game starts
      tradingPosts: prev.tradingPosts.map(post => ({
        ...post,
        isActive: true
      }))
    }));
  };

  const resetGame = () => {
    setGameSession({
      ...defaultGameSession,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    });
  };

  const endGame = () => {
    setGameSession(prev => ({
      ...prev,
      endTime: new Date(),
      isActive: false,
      // Set all trading posts to inactive when the game ends
      tradingPosts: prev.tradingPosts.map(post => ({
        ...post,
        isActive: false
      }))
    }));
  };

  const addItem = (item: Item) => {
    setGameSession(prev => ({
      ...prev,
      items: [...prev.items, { ...item, id: Math.random().toString(36).substring(2, 9) }]
    }));
  };

  const updateItem = (item: Item) => {
    setGameSession(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === item.id ? item : i)
    }));
  };

  const removeItem = (itemId: string) => {
    setGameSession(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId)
    }));
  };

  const addTradingPost = (post: TradingPost) => {
    setGameSession(prev => ({
      ...prev,
      tradingPosts: [...prev.tradingPosts, {
        ...post,
        id: Math.random().toString(36).substring(2, 9),
        // Set the trading post's active state based on the game session's active state
        isActive: prev.isActive
      }]
    }));
  };

  const updateTradingPost = (post: TradingPost) => {
    setGameSession(prev => ({
      ...prev,
      tradingPosts: prev.tradingPosts.map(p => p.id === post.id ? post : p)
    }));
  };

  const removeTradingPost = (postId: string) => {
    setGameSession(prev => ({
      ...prev,
      tradingPosts: prev.tradingPosts.filter(p => p.id !== postId)
    }));
  };

  const updateInventory = (postId: string, itemId: string, quantity: number, updateCurrencyOnChange: boolean = true) => {
    setGameSession(prev => {
      // Find the item to get its name and basePrice
      const item = prev.items.find(i => i.id === itemId);
      if (!item) return prev;

      // Find the post
      const post = prev.tradingPosts.find(p => p.id === postId);
      if (!post) return prev;

      // Calculate the price of the item
      const price = Math.round(item.basePrice * ((2 - (1.5 * Math.max(0, Math.min(10, quantity)) / 10)) * 0.7 + 0.3));

      // Get the current quantity
      const currentQuantity = post.inventory[itemId]?.quantity || 0;

      // Calculate the difference in quantity
      const quantityDiff = quantity - currentQuantity;

      // Calculate the currency change (negative for buying, positive for selling)
      const currencyChange = updateCurrencyOnChange ? -quantityDiff * price : 0;

      // Calculate new currency value, ensuring it doesn't go below 0
      const newCurrency = Math.max(0, post.currency + currencyChange);

      return {
        ...prev,
        tradingPosts: prev.tradingPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              currency: newCurrency,
              inventory: {
                ...p.inventory,
                [itemId]: {
                  id: itemId,
                  name: item.name,
                  quantity: quantity,
                  basePrice: item.basePrice
                }
              }
            };
          }
          return p;
        })
      };
    });
  };

  const updateCurrency = (postId: string, amount: number) => {
    setGameSession(prev => ({
      ...prev,
      tradingPosts: prev.tradingPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            currency: amount
          };
        }
        return post;
      })
    }));
  };

  // Price fluctuation algorithm based on stock levels and currency
  const calculatePrice = (postId: string, itemId: string): number => {
    const post = gameSession.tradingPosts.find(p => p.id === postId);
    const item = gameSession.items.find(i => i.id === itemId);

    if (!post || !item) return 0;

    const inventoryItem = post.inventory[itemId];
    const stock = inventoryItem ? inventoryItem.quantity : 0;
    const basePrice = item.basePrice;

    // Get average currency across all active trading posts for comparison
    const activePosts = gameSession.tradingPosts.filter(p => p.isActive);
    const averageCurrency = activePosts.length > 0
      ? activePosts.reduce((sum, p) => sum + p.currency, 0) / activePosts.length
      : 100; // Default value if no active posts

    // Calculate stock factor: price increases as stock decreases
    // When stock is 0, stock factor is 2x
    // When stock is high (10+), stock factor approaches 0.5x
    const stockFactor = Math.max(0, Math.min(10, stock));
    const stockMultiplier = 2 - (1.5 * stockFactor / 10);

    // Calculate currency factor: price increases as currency increases
    // When currency is high compared to average, prices increase (sellers market)
    // When currency is low compared to average, prices decrease (buyers market)
    const currencyRatio = post.currency / averageCurrency;
    const currencyMultiplier = Math.max(0.75, Math.min(1.25, 0.75 + (currencyRatio * 0.5)));

    // Combine factors: stock has 70% weight, currency has 30% weight
    const combinedFactor = (stockMultiplier * 0.7) + (currencyMultiplier * 0.3);

    // Round to full numbers
    return Math.round(basePrice * combinedFactor);
  };

  const value = {
    gameSession,
    startGame,
    resetGame,
    endGame,
    addItem,
    updateItem,
    removeItem,
    addTradingPost,
    updateTradingPost,
    removeTradingPost,
    updateInventory,
    updateCurrency,
    calculatePrice
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
