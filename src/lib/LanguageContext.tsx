'use client';

import React from 'react';

// Define translation interface
export interface Translation {
  // Common
  language: string;
  selectLanguage: string;
  tradingGame: string;
  navigation: string;
  home: string;
  tradingPosts: string;
  admin: string;
  adminDescription: string;
  gameStatus: string;

  // Trading Post
  tradingPostView: string;
  selectPost: string;
  manageInventory: string;
  manageCurrency: string;

  // Inventory
  inventory: string;
  currentInventory: string;
  item: string;
  quantity: string;
  basePrice: string;
  currentPrice: string;
  actions: string;
  noItems: string;
  updateStock: string;

  // Charts
  priceHistory?: string;
  priceHistoryDesc?: string;
  stockDistribution?: string;
  stockDistributionDesc?: string;
  price?: string;
  date?: string;

  // Currency
  currency: string;
  manualCurrencyAdjustment?: string;

  // Game Status
  gameActive: string;
  gameInactive: string;
  gameNotActive: string;
  startGameFirst: string;
}

// English translations
export const en: Translation = {
  // Common
  language: 'English',
  selectLanguage: 'Select Language',
  tradingGame: 'Trading Game',
  navigation: 'Navigation',
  home: 'Home',
  tradingPosts: 'Trading Posts',
  admin: 'Admin',
  adminDescription: 'Manage your trading game from a central location.',
  gameStatus: 'Game Status',

  // Trading Post
  tradingPostView: 'Trading Post View',
  selectPost: 'Select Trading Post',
  manageInventory: 'Manage inventory and currency at trading posts',
  manageCurrency: 'Manage Currency',

  // Inventory
  inventory: 'Inventory',
  currentInventory: 'Current Inventory',
  item: 'Item',
  quantity: 'Quantity',
  basePrice: 'Base Price',
  currentPrice: 'Current Price',
  actions: 'Actions',
  noItems: 'No items in inventory',
  updateStock: 'Update Stock',

  // Charts
  priceHistory: 'Price History',
  priceHistoryDesc: 'Price trends over the last 7 days',
  stockDistribution: 'Stock Distribution',
  stockDistributionDesc: 'Current inventory breakdown',
  price: 'Price',
  date: 'Date',

  // Currency
  currency: 'Currency',
  manualCurrencyAdjustment: 'Manual Adjustment',

  // Game Status
  gameActive: 'Game Active',
  gameInactive: 'Game Inactive',
  gameNotActive: 'Game is not active',
  startGameFirst: 'Start the game from the admin dashboard to manage inventory.'
};

// Dutch translations
export const nl: Translation = {
  // Common
  language: 'Nederlands',
  selectLanguage: 'Selecteer Taal',
  tradingGame: 'Handelsspel',
  navigation: 'Navigatie',
  home: 'Home',
  tradingPosts: 'Handelsposten',
  admin: 'Beheer',
  adminDescription: 'Beheer je handelsspel vanaf een centrale locatie.',
  gameStatus: 'Spelstatus',

  // Trading Post
  tradingPostView: 'Handelspost Weergave',
  selectPost: 'Selecteer Handelspost',
  manageInventory: 'Beheer inventaris en valuta bij handelsposten',
  manageCurrency: 'Beheer Valuta',

  // Inventory
  inventory: 'Inventaris',
  currentInventory: 'Huidige Inventaris',
  item: 'Item',
  quantity: 'Hoeveelheid',
  basePrice: 'Basisprijs',
  currentPrice: 'Huidige Prijs',
  actions: 'Acties',
  noItems: 'Geen items in inventaris',
  updateStock: 'Voorraad Bijwerken',

  // Charts
  priceHistory: 'Prijsgeschiedenis',
  priceHistoryDesc: 'Prijstrends over de laatste 7 dagen',
  stockDistribution: 'Voorraadverdeling',
  stockDistributionDesc: 'Huidige inventaris verdeling',
  price: 'Prijs',
  date: 'Datum',

  // Currency
  currency: 'Valuta',
  manualCurrencyAdjustment: 'Handmatige Aanpassing',

  // Game Status
  gameActive: 'Spel Actief',
  gameInactive: 'Spel Inactief',
  gameNotActive: 'Spel is niet actief',
  startGameFirst: 'Start het spel vanuit het admin dashboard om inventaris te beheren.'
};

// Available languages
export const languages = {
  en,
  nl
};

// Language context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Use a default value for server-side rendering
  const [mounted, setMounted] = React.useState(false);
  const [language, setLanguage] = React.useState<string>('en'); // Default to English for SSR

  // Initialize language from localStorage only on client-side
  React.useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('language');
      if (saved && (saved === 'en' || saved === 'nl')) {
        setLanguage(saved);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever language changes (client-side only)
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  // Get translations for current language
  const t = languages[language as keyof typeof languages];

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
