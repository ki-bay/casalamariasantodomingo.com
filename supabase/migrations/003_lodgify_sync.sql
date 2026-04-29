-- Casa La Maria — Lodgify sync schema additions
-- Run in Supabase SQL Editor AFTER 002_apartments.sql

-- ============================================================
-- SEASONAL RATES (Lodgify date-range pricing)
-- ============================================================
CREATE TABLE IF NOT EXISTS seasonal_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  price_per_night NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  min_stay INTEGER DEFAULT 1,
  source TEXT DEFAULT 'lodgify',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (starts_on <= ends_on)
);

CREATE INDEX IF NOT EXISTS idx_seasonal_rates_apartment ON seasonal_rates(apartment_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_rates_dates ON seasonal_rates(starts_on, ends_on);

ALTER TABLE seasonal_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seasonal rates"
  ON seasonal_rates FOR SELECT USING (true);
CREATE POLICY "Service role manage seasonal rates"
  ON seasonal_rates FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- AVAILABILITY BLACKOUTS (cached unavailable dates)
-- ============================================================
CREATE TABLE IF NOT EXISTS availability_blackouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  reason TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (starts_on <= ends_on)
);

CREATE INDEX IF NOT EXISTS idx_blackouts_apartment ON availability_blackouts(apartment_id);
CREATE INDEX IF NOT EXISTS idx_blackouts_dates ON availability_blackouts(starts_on, ends_on);

ALTER TABLE availability_blackouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blackouts"
  ON availability_blackouts FOR SELECT USING (true);
CREATE POLICY "Service role manage blackouts"
  ON availability_blackouts FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- PROMOTIONS / DISCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  name TEXT,
  starts_on DATE,
  ends_on DATE,
  discount_percent NUMERIC(5,2),
  min_nights INTEGER,
  source TEXT DEFAULT 'lodgify',
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promotions_apartment ON promotions(apartment_id);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read promotions"
  ON promotions FOR SELECT USING (true);
CREATE POLICY "Service role manage promotions"
  ON promotions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SYNC LOG (debug / observability)
-- ============================================================
CREATE TABLE IF NOT EXISTS lodgify_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT,
  properties_synced INTEGER DEFAULT 0,
  rates_synced INTEGER DEFAULT 0,
  blackouts_synced INTEGER DEFAULT 0,
  details JSONB
);

ALTER TABLE lodgify_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manage sync log"
  ON lodgify_sync_log FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- APARTMENTS — additional Lodgify-related columns
-- ============================================================
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS lodgify_room_type_id TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS price_currency TEXT DEFAULT 'USD';
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS price_base_usd NUMERIC(10,2);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS lodgify_synced_at TIMESTAMPTZ;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS lodgify_raw JSONB;

CREATE INDEX IF NOT EXISTS idx_apartments_lodgify_id ON apartments(lodgify_property_id);

-- ============================================================
-- RESERVATIONS — Lodgify + quote tracking
-- ============================================================
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS lodgify_reservation_id TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS quote_data JSONB;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS lodgify_synced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_reservations_lodgify ON reservations(lodgify_reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservations_stripe ON reservations(stripe_session_id);
