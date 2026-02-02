-- Create Categories and Brands tables for product organization

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add category_id and brand_id to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public can view active categories and brands
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active brands" ON brands
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Admins can manage brands
CREATE POLICY "Admins can manage brands" ON brands
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Tote Bags', 'tote', 'Spacious and stylish tote bags for everyday use', 1),
  ('Crossbody Bags', 'crossbody', 'Hands-free convenience with crossbody bags', 2),
  ('Shoulder Bags', 'shoulder', 'Classic shoulder bags for any occasion', 3),
  ('Clutches', 'clutch', 'Elegant clutches for evening events', 4),
  ('Backpacks', 'backpack', 'Fashionable backpacks for on-the-go', 5),
  ('Satchels', 'satchel', 'Structured satchels for a polished look', 6),
  ('Hobo Bags', 'hobo', 'Slouchy and comfortable hobo bags', 7),
  ('Evening Bags', 'evening', 'Glamorous bags for special occasions', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert default luxury brands
INSERT INTO brands (name, slug, description, display_order) VALUES
  ('Gucci', 'gucci', 'Italian luxury fashion house', 1),
  ('Louis Vuitton', 'louis-vuitton', 'French fashion house and luxury goods company', 2),
  ('Chanel', 'chanel', 'French luxury fashion house', 3),
  ('Prada', 'prada', 'Italian luxury fashion house', 4),
  ('Hermès', 'hermes', 'French high fashion luxury goods manufacturer', 5),
  ('Dior', 'dior', 'French luxury fashion house', 6),
  ('Burberry', 'burberry', 'British luxury fashion house', 7),
  ('Fendi', 'fendi', 'Italian luxury fashion house', 8),
  ('Michael Kors', 'michael-kors', 'American fashion designer brand', 9),
  ('Coach', 'coach', 'American luxury fashion company', 10)
ON CONFLICT (name) DO NOTHING;

-- Add comments
COMMENT ON TABLE categories IS 'Product categories for organizing bags';
COMMENT ON TABLE brands IS 'Brand names for luxury bags';
COMMENT ON COLUMN products.category_id IS 'Foreign key to categories table';
COMMENT ON COLUMN products.brand_id IS 'Foreign key to brands table';
