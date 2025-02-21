-- Enable the pgcrypto extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS assets;

-- Create the users table (only email encrypted)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,       -- Store bcrypt hash (NOT encrypted)
    encrypted_email TEXT UNIQUE NOT NULL,  -- Store hex-encoded encrypted email
    profile_picture VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Create the assets table (name, purchase_price, ticker, purchase_date encrypted)
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    encrypted_name TEXT,             -- Store hex-encoded encrypted name
    encrypted_purchase_price TEXT,    -- Store hex-encoded encrypted price
    encrypted_purchase_date TEXT,    -- Store hex-encoded purchase date
    quantity DECIMAL NOT NULL,
    currency VARCHAR(3) NOT NULL,
    encrypted_ticker TEXT,           -- Store hex-encoded encrypted ticker
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Indexes
CREATE INDEX idx_assets_user_id ON assets (user_id);
CREATE INDEX idx_users_username ON users (username);