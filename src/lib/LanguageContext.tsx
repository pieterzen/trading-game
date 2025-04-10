'use client';

import React from 'react';

// Define translation interface
export interface Translation {
  // Common
  language: string;
  selectLanguage: string;
  
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
  
  // Currency
  currency: string;
  
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
  
  // Currency
  currency: 'Currency',
  
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
  
  // Currency
  currency: 'Valuta',
  
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
  const [language, setLanguage] = React.useState<string>(() => {
    // Try to load from localStorage on initial render (client-side only)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved && saved in languages) {
        return saved;
      }
    }
    return 'en'; // Default to English
  });

  // Save to localStorage whenever language changes
  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Get translations for current language
  const t = languages[language as keyof typeof languages];

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
