-- Fix RLS Policies for Bagsberry E-commerce
-- This script ensures all policies have the correct role configuration

-- ============================================
-- PRODUCTS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Products are readable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Public can view all products (anon + authenticated)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can do everything with products
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ============================================
-- CART_ITEMS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

-- Users can manage their own cart
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart" ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart" ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- ORDERS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Users can view and create their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view and manage all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ============================================
-- ORDER_ITEMS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Users can view their own order items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert order items for their own orders
CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ============================================
-- USER_PROFILES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- SUBSCRIBERS TABLE (if exists)
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;

-- Anyone can subscribe (even non-authenticated users)
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can view all subscribers
CREATE POLICY "Admins can view subscribers" ON subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ============================================
-- SUMMARY
-- ============================================

-- Show all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
