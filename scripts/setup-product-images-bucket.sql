-- Setup storage policies for product_images bucket
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Allow anyone to view/download product images (public read)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product_images');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product_images');

-- Allow authenticated users to update product images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product_images');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product_images');

-- Optional: More restrictive policies for admins only
-- Uncomment these and comment out the above if you want only admins to upload

/*
CREATE POLICY IF NOT EXISTS "Only admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product_images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

CREATE POLICY IF NOT EXISTS "Only admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product_images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

CREATE POLICY IF NOT EXISTS "Only admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product_images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
*/
