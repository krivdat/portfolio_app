-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    encrypted_email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    profile_picture TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    encrypted_name TEXT,
    encrypted_purchase_price TEXT,
    encrypted_purchase_date TEXT,
    quantity DECIMAL NOT NULL,
    currency TEXT NOT NULL,
    encrypted_ticker TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    encrypted_closing_price TEXT,
    encrypted_closing_date TEXT,
    closing_note TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table for token-based authentication
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT (datetime('now')),
  expires_at DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets (user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
