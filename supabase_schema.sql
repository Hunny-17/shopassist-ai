-- ShopAssist AI — Supabase Schema
-- Run này trong Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TABLE: products
-- =====================
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku           TEXT UNIQUE NOT NULL,           -- PV-SKU từ Phong Vũ
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,                  -- laptop, monitor, keyboard, mouse, headset, pc
  brand         TEXT NOT NULL,                  -- ASUS, MSI, Dell, HP, Lenovo, Logitech...
  price         BIGINT NOT NULL,                -- VND
  original_price BIGINT,                        -- Giá gốc trước giảm
  stock         INTEGER NOT NULL DEFAULT 0,
  specs         JSONB NOT NULL DEFAULT '{}',    -- {cpu, ram, gpu, storage, screen, weight...}
  description   TEXT,
  image_url     TEXT,
  tags          TEXT[] DEFAULT '{}',            -- ['gaming', 'portable', 'office']
  warranty_months INTEGER DEFAULT 24,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho search
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_specs ON products USING GIN(specs);

-- Full-text search
CREATE INDEX idx_products_fts ON products 
  USING GIN(to_tsvector('simple', name || ' ' || COALESCE(description, '')));

-- =====================
-- TABLE: promotions
-- =====================
CREATE TABLE promotions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'bundle')),
  discount_value  NUMERIC NOT NULL,             -- % hoặc VND
  bundle_gift     TEXT,                         -- "Tặng chuột Logitech G304"
  label           TEXT NOT NULL,               -- "Giảm 10%" / "Flash Sale"
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promotions_product ON promotions(product_id);
CREATE INDEX idx_promotions_active ON promotions(is_active, end_date);

-- =====================
-- TABLE: chat_sessions
-- =====================
CREATE TABLE chat_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    TEXT UNIQUE NOT NULL,
  messages      JSONB NOT NULL DEFAULT '[]',   -- [{role, content, timestamp, tools_used}]
  user_context  JSONB DEFAULT '{}',            -- {budget, preferences, viewed_products}
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_session_id ON chat_sessions(session_id);

-- =====================
-- TABLE: analytics_events (Mock)
-- =====================
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      TEXT NOT NULL,
  event_type      TEXT NOT NULL,               -- 'search', 'view', 'compare', 'add_cart', 'checkout'
  product_id      UUID REFERENCES products(id),
  query           TEXT,                        -- Search query nếu có
  converted       BOOLEAN DEFAULT FALSE,       -- Có dẫn đến purchase không
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- =====================
-- REALTIME: Enable cho products
-- =====================
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE promotions;

-- =====================
-- FUNCTION: Update updated_at
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- VIEW: Active promotions with products
-- =====================
CREATE VIEW active_promotions AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.price,
  pr.discount_type,
  pr.discount_value,
  pr.bundle_gift,
  pr.label,
  pr.end_date,
  CASE 
    WHEN pr.discount_type = 'percentage' 
    THEN p.price * (1 - pr.discount_value / 100)
    WHEN pr.discount_type = 'fixed'
    THEN p.price - pr.discount_value
    ELSE p.price
  END as final_price
FROM products p
JOIN promotions pr ON pr.product_id = p.id
WHERE pr.is_active = TRUE 
  AND pr.end_date >= CURRENT_DATE
  AND p.is_active = TRUE;
