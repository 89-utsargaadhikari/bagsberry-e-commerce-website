-- Update existing database schema for Bagsberry e-commerce platform
-- Run this AFTER setup-database.sql if tables already exist

-- Add missing fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255);

-- Create admin_users table for admin access control
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create subscribers table for newsletter
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY IF NOT EXISTS "Admins can view admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for subscribers (public insert, admin read)
CREATE POLICY IF NOT EXISTS "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admins can view subscribers" ON subscribers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Update products RLS policy for admin write access
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(stock_quantity - quantity, 0)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for product images (if not exists)
-- Note: This needs to be run in Supabase dashboard or via SQL if storage extension is enabled
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policy for product images
-- Note: Uncomment and run in Supabase dashboard
-- CREATE POLICY "Anyone can view product images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');
-- 
-- CREATE POLICY "Admins can upload product images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'product-images' AND
--     EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
--   );
-- 
-- CREATE POLICY "Admins can delete product images" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'product-images' AND
--     EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
--   );
