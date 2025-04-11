'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ref,
  onValue,
  set,
  update,
  remove
} from 'firebase/database';
import { database, callFunction } from './firebase';
import { GameSession } from './types';

// Note: Emulator connections are handled in firebase.ts

// Define the context interface
interface FirebaseContextType {
  // Game session operations
  saveGameSession: (gameSession: GameSession) => Promise<void>;
  loadGameSession: () => Promise<GameSession | null>;
  listenToGameSession: (callback: (gameSession: GameSession | null) => void) => () => void;

  // Trading post operations
  updateTradingPost: (postId: string, data: any) => Promise<void>;
  updateTradingPostCurrency: (postId: string, currency: number) => Promise<void>;
  updateTradingPostInventory: (postId: string, itemId: string, quantity: number) => Promise<void>;

  // Item operations
  updateItem: (itemId: string, data: any) => Promise<void>;

  // Loading state
  loading: boolean;
  error: string | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Create a provider component
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase when the component mounts
  useEffect(() => {
    // Check if Firebase is initialized
    try {
      const gameSessionRef = ref(database, 'gameSession');
      onValue(gameSessionRef, () => {
        setLoading(false);
      }, (error) => {
        setError(error.message);
        setLoading(false);
      });
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Save the entire game session
  const saveGameSession = async (gameSession: GameSession): Promise<void> => {
    try {
      const gameSessionRef = ref(database, 'gameSession');
      await set(gameSessionRef, gameSession);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Load the game session
  const loadGameSession = async (): Promise<GameSession | null> => {
    return new Promise((resolve, reject) => {
      const gameSessionRef = ref(database, 'gameSession');
      onValue(gameSessionRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      }, (error) => {
        setError(error.message);
        reject(error);
      }, { onlyOnce: true });
    });
  };

  // Listen to game session changes
  const listenToGameSession = (callback: (gameSession: GameSession | null) => void): (() => void) => {
    const gameSessionRef = ref(database, 'gameSession');
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      setError(error.message);
    });

    return unsubscribe;
  };

  // Update a trading post
  const updateTradingPost = async (postId: string, data: any): Promise<void> => {
    try {
      const postRef = ref(database, `gameSession/tradingPosts/${postId}`);
      await update(postRef, data);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Update a trading post's currency
  const updateTradingPostCurrency = async (postId: string, currency: number): Promise<void> => {
    try {
      // Try to use Firebase Function first
      await callFunction('updateCurrency', { postId, amount: currency });
    } catch (error: any) {
      console.warn('Firebase Function failed, falling back to direct database update:', error);
      // Fallback to direct database update
      try {
        const currencyRef = ref(database, `gameSession/tradingPosts/${postId}/currency`);
        await set(currencyRef, currency);
      } catch (dbError: any) {
        setError(dbError.message);
        throw dbError;
      }
    }
  };

  // Update a trading post's inventory
  const updateTradingPostInventory = async (postId: string, itemId: string, quantity: number): Promise<void> => {
    try {
      // Try to use Firebase Function first
      await callFunction('updateInventory', { postId, itemId, quantity });
    } catch (error: any) {
      console.warn('Firebase Function failed, falling back to direct database update:', error);
      // Fallback to direct database update
      try {
        const inventoryRef = ref(database, `gameSession/tradingPosts/${postId}/inventory/${itemId}`);
        if (quantity <= 0) {
          // Remove the item if quantity is 0 or negative
          await remove(inventoryRef);
        } else {
          // Update the item quantity
          await update(inventoryRef, { quantity });
        }
      } catch (dbError: any) {
        setError(dbError.message);
        throw dbError;
      }
    }
  };

  // Update an item
  const updateItem = async (itemId: string, data: any): Promise<void> => {
    try {
      const itemRef = ref(database, `gameSession/items/${itemId}`);
      await update(itemRef, data);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Create the context value
  const value: FirebaseContextType = {
    saveGameSession,
    loadGameSession,
    listenToGameSession,
    updateTradingPost,
    updateTradingPostCurrency,
    updateTradingPostInventory,
    updateItem,
    loading,
    error
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Create a hook to use the context
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};


