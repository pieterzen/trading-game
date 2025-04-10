-- Migration number: 0001 	 2025-04-10
-- Trading Game Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS game_sessions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS trading_posts;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS transactions;

-- Game Sessions table to track active games and their timing
CREATE TABLE IF NOT EXISTS game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_time DATETIME,
  end_time DATETIME,
  is_active BOOLEAN DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Items table to store sellable items and their base prices
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  base_price REAL NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trading Posts table to store locations
CREATE TABLE IF NOT EXISTS trading_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table to track stock and currency at each trading post
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trading_post_id INTEGER NOT NULL,
  item_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 0,
  currency REAL NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trading_post_id) REFERENCES trading_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Transactions table to track history of trades (optional, for analytics)
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_session_id INTEGER NOT NULL,
  trading_post_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit REAL NOT NULL,
  transaction_type TEXT NOT NULL, -- 'buy' or 'sell'
  transaction_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (trading_post_id) REFERENCES trading_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_game_sessions_active ON game_sessions(is_active);
CREATE INDEX idx_trading_posts_active ON trading_posts(is_active);
CREATE INDEX idx_inventory_trading_post ON inventory(trading_post_id);
CREATE INDEX idx_inventory_item ON inventory(item_id);
CREATE INDEX idx_transactions_game_session ON transactions(game_session_id);
CREATE INDEX idx_transactions_trading_post ON transactions(trading_post_id);
CREATE INDEX idx_transactions_item ON transactions(item_id);
CREATE INDEX idx_transactions_time ON transactions(transaction_time);

-- Sample data for testing (can be removed for production)
INSERT INTO items (name, base_price, description) VALUES 
  ('Wood', 10.0, 'Common building material'),
  ('Stone', 15.0, 'Durable construction material'),
  ('Iron', 25.0, 'Metal used for tools and weapons'),
  ('Gold', 50.0, 'Precious metal'),
  ('Food', 5.0, 'Basic necessity');

INSERT INTO trading_posts (name, description) VALUES
  ('North Post', 'Trading post in the northern region'),
  ('South Market', 'Bustling market in the south'),
  ('East Harbor', 'Coastal trading hub');
