-- Example Migration: Add indexes for performance
-- Created: 2025-11-20

-- Add indexes to commonly queried columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_sid ON sessions(sid);

-- Add indexes for foreign keys
-- CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
-- CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);

-- Add full-text search indexes if needed
-- CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || description));
