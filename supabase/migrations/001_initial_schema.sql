-- Casa La Maria - Initial Supabase Schema
-- Run this in Supabase SQL Editor

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total_price NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  cover_image TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: service role has full access (used by API)
CREATE POLICY "Service role full access reservations"
  ON reservations FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access contact"
  ON contact_submissions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Blog posts are publicly readable
CREATE POLICY "Public read blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Service role full access blog"
  ON blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, published, tags) VALUES
(
  'Lugares Imprescindibles en la Zona Colonial',
  'lugares-imprescindibles-zona-colonial',
  'La Zona Colonial de Santo Domingo es un tesoro histórico declarado Patrimonio de la Humanidad por la UNESCO...',
  'Descubre los rincones más especiales de la primera ciudad europea fundada en América.',
  true,
  ARRAY['turismo', 'zona colonial', 'historia']
),
(
  'Guía Gastronómica: Casa La Maria',
  'guia-gastronomica-casa-la-maria',
  'Santo Domingo ofrece una experiencia gastronómica única que combina influencias caribeñas, españolas y africanas...',
  'Los mejores restaurantes y sabores auténticos cerca de Casa La Maria.',
  true,
  ARRAY['gastronomia', 'restaurantes', 'cocina dominicana']
),
(
  'Playa Güibia: El Secreto de Santo Domingo',
  'playa-guibia-secreto-santo-domingo',
  'A solo 10 minutos de la Zona Colonial se encuentra Playa Güibia, una playa urbana perfecta para relajarse...',
  'La playa urbana más cercana a la Zona Colonial que muchos turistas desconocen.',
  true,
  ARRAY['playa', 'actividades', 'santo domingo']
)
ON CONFLICT (slug) DO NOTHING;
