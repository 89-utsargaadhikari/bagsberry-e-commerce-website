-- Add order tracking and management fields to orders table

-- Add tracking fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP DEFAULT NOW();

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add comments for documentation
COMMENT ON COLUMN orders.tracking_number IS 'Tracking number from courier service (Nepal Post, Pathao, etc.)';
COMMENT ON COLUMN orders.estimated_delivery IS 'Estimated delivery date for the order';
COMMENT ON COLUMN orders.notes IS 'Internal notes for admin use';
COMMENT ON COLUMN orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled';

-- Create function to update status_updated_at automatically
CREATE OR REPLACE FUNCTION update_order_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update status_updated_at
DROP TRIGGER IF EXISTS trigger_update_order_status_timestamp ON orders;
CREATE TRIGGER trigger_update_order_status_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status_timestamp();

-- Verify the changes
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('tracking_number', 'estimated_delivery', 'notes', 'status_updated_at')
ORDER BY ordinal_position;
