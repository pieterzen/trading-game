// Data models for the trading game

export interface Item {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
}

export interface TradingPost {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  inventory: Inventory;
  currency: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  basePrice: number;
}

export interface Inventory {
  [itemId: string]: InventoryItem;
}

export interface GameSession {
  id: string;
  name: string;
  startTime: Date | null;
  endTime: Date | null;
  isActive: boolean;
  tradingPosts: TradingPost[];
  items: Item[];
  createdAt: Date;
}

export interface PriceCalculation {
  itemId: string;
  postId: string;
  basePrice: number;
  currentPrice: number;
  stock: number;
}

// Default data for initial game setup
export const defaultItems: Item[] = [
  { id: '1', name: 'Wood', basePrice: 10, description: 'Common building material' },
  { id: '2', name: 'Stone', basePrice: 15, description: 'Durable construction material' },
  { id: '3', name: 'Iron', basePrice: 25, description: 'Metal used for tools and weapons' },
  { id: '4', name: 'Gold', basePrice: 50, description: 'Precious metal' },
  { id: '5', name: 'Food', basePrice: 5, description: 'Basic necessity' },
];

export const defaultTradingPosts: TradingPost[] = [
  { 
    id: '1', 
    name: 'North Post', 
    description: 'Trading post in the northern region',
    isActive: false,
    inventory: {},
    currency: 0
  },
  { 
    id: '2', 
    name: 'South Market', 
    description: 'Bustling market in the south',
    isActive: false,
    inventory: {},
    currency: 0
  },
  { 
    id: '3', 
    name: 'East Harbor', 
    description: 'Coastal trading hub',
    isActive: false,
    inventory: {},
    currency: 0
  },
];

export const defaultGameSession: GameSession = {
  id: '1',
  name: 'New Game Session',
  startTime: null,
  endTime: null,
  isActive: false,
  tradingPosts: defaultTradingPosts,
  items: defaultItems,
  createdAt: new Date(),
};
