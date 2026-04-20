-- Casa La Maria - Apartments Schema
-- Run in Supabase SQL Editor

-- ============================================================
-- APARTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS apartments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  bath_type_es TEXT DEFAULT 'Baño privado',
  bath_type_en TEXT DEFAULT 'Private bathroom',
  size_m2 INTEGER,
  max_guests INTEGER NOT NULL DEFAULT 4,
  bed_config_es TEXT,   -- "2 camas Queen size"
  bed_config_en TEXT,   -- "2 Queen beds"
  has_balcony BOOLEAN DEFAULT FALSE,
  has_terrace BOOLEAN DEFAULT TRUE,
  price_standard_dop NUMERIC(10,2) NOT NULL,  -- non-refundable rate
  price_flexible_dop NUMERIC(10,2) NOT NULL,  -- free cancellation rate
  amenities JSONB DEFAULT '[]',               -- list of amenity keys
  images JSONB DEFAULT '[]',                  -- Cloudinary URLs {url, alt_es, alt_en}
  available BOOLEAN DEFAULT TRUE,
  lodgify_property_id TEXT,                   -- future Lodgify sync
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read apartments"
  ON apartments FOR SELECT
  USING (available = true);

CREATE POLICY "Service role full access apartments"
  ON apartments FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER apartments_updated_at
  BEFORE UPDATE ON apartments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- EXCHANGE RATES CACHE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(10,4) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_currency, to_currency)
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read exchange rates"
  ON exchange_rates FOR SELECT USING (true);

CREATE POLICY "Service role manage exchange rates"
  ON exchange_rates FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- UPDATE RESERVATIONS TABLE - add apartment reference
-- ============================================================
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS apartment_id UUID REFERENCES apartments(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS apartment_name TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS rate_plan TEXT DEFAULT 'standard';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'DOP';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================================
-- SEED: 5 APARTMENTS
-- ============================================================
INSERT INTO apartments (
  slug, name_es, name_en, description_es, description_en,
  bedrooms, bathrooms, bath_type_es, bath_type_en,
  size_m2, max_guests, bed_config_es, bed_config_en,
  has_balcony, has_terrace,
  price_standard_dop, price_flexible_dop,
  amenities, sort_order
) VALUES

-- Apartment 1: 1BR Classic (no balcony)
(
  'suite-clasica-1-hab',
  'Suite Clásica 1 Habitación',
  'Classic 1-Bedroom Suite',
  'Elegante apartamento de un dormitorio con 2 camas Queen en un edificio histórico de la Zona Colonial. Disfruta de hermosas vistas a la ciudad desde nuestra terraza privada. Cocina totalmente equipada, baño privado y todas las comodidades modernas en un entorno de carácter único.',
  'Elegant one-bedroom apartment with 2 Queen beds in a historic building in the Colonial Zone. Enjoy stunning city views from our private terrace. Fully equipped kitchen, private bathroom, and all modern amenities in a uniquely charming setting.',
  1, 1, 'Baño privado', 'Private bathroom',
  70, 4, '2 camas Queen size', '2 Queen beds',
  FALSE, TRUE,
  5603.00, 6225.00,
  '["wifi","ac","tv","kitchen","coffee_maker","terrace","city_view","private_entrance","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"]',
  1
),

-- Apartment 2: 1BR with Balcony
(
  'suite-colonial-balcon-1-hab',
  'Suite Colonial Balcón 1 Habitación',
  'Colonial Balcony 1-Bedroom Suite',
  'Apartamento de un dormitorio con 2 camas Queen, amplio balcón privado y espectaculares vistas a la ciudad. Un espacio donde la arquitectura colonial del siglo XVI se funde con el lujo contemporáneo. Terraza, cocina privada y acceso privado incluidos.',
  'One-bedroom apartment with 2 Queen beds, a private balcony and spectacular city views. A space where 16th-century colonial architecture blends with contemporary luxury. Private terrace, kitchen, and private entrance included.',
  1, 1, 'Baño privado', 'Private bathroom',
  70, 4, '2 camas Queen size', '2 Queen beds',
  TRUE, TRUE,
  5603.00, 6225.00,
  '["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","private_entrance","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"]',
  2
),

-- Apartment 3: 2BR Standard with Balcony
(
  'suite-estandar-2-hab',
  'Suite Estándar 2 Habitaciones',
  'Standard 2-Bedroom Suite',
  'Espacioso apartamento de dos dormitorios con una cama Queen en cada habitación. Perfecto para familias o grupos. Cuenta con balcón privado, terraza, cocina equipada y hermosas vistas a la ciudad. 85 m² de espacio en el corazón de la Zona Colonial.',
  'Spacious two-bedroom apartment with one Queen bed in each room. Perfect for families or groups. Features a private balcony, terrace, fully equipped kitchen, and beautiful city views. 85 m² of space in the heart of the Colonial Zone.',
  2, 1, 'Baño privado', 'Private bathroom',
  85, 4, 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen', 'Room 1: 1 Queen bed — Room 2: 1 Queen bed',
  TRUE, TRUE,
  5603.00, 6225.00,
  '["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"]',
  3
),

-- Apartment 4: 2BR Premium (integrated bath, no balcony)
(
  'suite-premium-2-hab',
  'Suite Premium 2 Habitaciones',
  'Premium 2-Bedroom Suite',
  'Nuestra suite premium de dos habitaciones destaca por su exclusivo baño integrado de diseño contemporáneo. Dos habitaciones con cama Queen, terraza privada con vistas panorámicas a la ciudad y 85 m² de lujo en la Zona Colonial. La opción más sofisticada para una estancia memorable.',
  'Our premium two-bedroom suite features an exclusive contemporary en-suite bathroom. Two Queen bedrooms, a private terrace with panoramic city views, and 85 m² of luxury in the Colonial Zone. The most sophisticated option for a memorable stay.',
  2, 1, 'Baño integrado', 'En-suite bathroom',
  85, 4, 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen', 'Room 1: 1 Queen bed — Room 2: 1 Queen bed',
  FALSE, TRUE,
  6912.00, 7680.00,
  '["wifi","ac","tv","kitchen","coffee_maker","terrace","city_view","ensuite_bath","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"]',
  4
),

-- Apartment 5: 2BR Deluxe with Balcony
(
  'suite-deluxe-balcon-2-hab',
  'Suite Deluxe Balcón 2 Habitaciones',
  'Deluxe Balcony 2-Bedroom Suite',
  'La experiencia definitiva en Casa La Maria. Nuestra suite deluxe de dos habitaciones combina amplitud, balcón privado con vistas espectaculares y una terraza exterior. Con dos habitaciones Queen, cocina privada completa y 85 m², es el alojamiento perfecto para quien no quiere renunciar a nada en Santo Domingo.',
  'The ultimate Casa La Maria experience. Our deluxe two-bedroom suite combines spaciousness, a private balcony with spectacular views, and an outdoor terrace. With two Queen bedrooms, a full private kitchen, and 85 m², it is the perfect accommodation for those who want it all in Santo Domingo.',
  2, 1, 'Baño privado', 'Private bathroom',
  85, 4, 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen', 'Room 1: 1 Queen bed — Room 2: 1 Queen bed',
  TRUE, TRUE,
  6912.00, 7680.00,
  '["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"]',
  5
)

ON CONFLICT (slug) DO UPDATE SET
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en,
  description_es = EXCLUDED.description_es,
  description_en = EXCLUDED.description_en,
  price_standard_dop = EXCLUDED.price_standard_dop,
  price_flexible_dop = EXCLUDED.price_flexible_dop,
  amenities = EXCLUDED.amenities,
  updated_at = NOW();

-- Seed initial exchange rate (approximate, will be refreshed by API)
INSERT INTO exchange_rates (from_currency, to_currency, rate)
VALUES ('DOP', 'USD', 0.0167)
ON CONFLICT (from_currency, to_currency) DO UPDATE SET
  rate = EXCLUDED.rate,
  fetched_at = NOW();
