-- Fix RLS policy error for order_items table
-- This allows users to insert order items for orders they own

-- Add INSERT policy for order_items
DROP POLICY IF EXISTS "Users can insert order items for their orders" ON order_items;

CREATE POLICY "Users can insert order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'order_items';
