-- ShopAssist AI Supabase schema
-- Reset-and-recreate script for MVP demo data.
-- WARNING: Running this script drops existing demo tables and their data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop dependent objects first so an old UUID-based schema can be replaced.
DROP VIEW IF EXISTS active_promotions;
DROP TRIGGER IF EXISTS products_updated_at ON products;
DROP TRIGGER IF EXISTS sessions_updated_at ON chat_sessions;
DROP FUNCTION IF EXISTS update_updated_at();
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- =====================
-- TABLE: products
-- =====================
CREATE TABLE products (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  brand           TEXT NOT NULL,
  price           BIGINT NOT NULL,
  original_price  BIGINT,
  stock           INTEGER NOT NULL DEFAULT 0,
  specs           JSONB NOT NULL DEFAULT '{}'::jsonb,
  description     TEXT,
  image_url       TEXT,
  warranty_months INTEGER DEFAULT 24,
  tags            TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_specs ON products USING GIN(specs);
CREATE INDEX idx_products_fts ON products
  USING GIN(to_tsvector('simple', name || ' ' || COALESCE(description, '')));

-- =====================
-- TABLE: promotions
-- =====================
CREATE TABLE promotions (
  id              TEXT PRIMARY KEY,
  product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'gift', 'bundle')),
  discount_value  NUMERIC NOT NULL DEFAULT 0,
  bundle_gift     TEXT,
  label           TEXT NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promotions_product ON promotions(product_id);
CREATE INDEX idx_promotions_active ON promotions(is_active, start_date, end_date);

-- =====================
-- TABLE: chat_sessions
-- =====================
CREATE TABLE chat_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT UNIQUE NOT NULL,
  messages      JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_context  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_session_id ON chat_sessions(session_id);

-- =====================
-- TABLE: analytics_events
-- =====================
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT NOT NULL,
  event_type      TEXT NOT NULL,
  event_payload   JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- =====================
-- REALTIME
-- =====================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'promotions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE promotions;
  END IF;
END $$;

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
  p.id AS product_id,
  p.name AS product_name,
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
      THEN GREATEST(p.price - pr.discount_value, 0)
    ELSE p.price
  END AS final_price
FROM products p
JOIN promotions pr ON pr.product_id = p.id
WHERE pr.is_active = TRUE
  AND pr.start_date <= CURRENT_DATE
  AND pr.end_date >= CURRENT_DATE
  AND p.is_active = TRUE;

-- Service role is used by the backend seed script and API.
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON promotions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_sessions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_events TO service_role;
GRANT SELECT ON active_promotions TO service_role;

-- Optional read grants for client-side Supabase usage.
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON promotions TO anon, authenticated;
GRANT SELECT ON active_promotions TO anon, authenticated;

-- Refresh PostgREST schema cache after replacing tables.
NOTIFY pgrst, 'reload schema';
