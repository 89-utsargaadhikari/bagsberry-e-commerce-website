-- Add delivery location fields to orders table
-- Run this in your Supabase SQL Editor

-- Add location columns if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS delivery_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS delivery_map_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN orders.delivery_latitude IS 'Latitude of delivery location from map pin';
COMMENT ON COLUMN orders.delivery_longitude IS 'Longitude of delivery location from map pin';
COMMENT ON COLUMN orders.delivery_map_url IS 'Google Maps URL for delivery location';

-- Create index for potential geospatial queries
CREATE INDEX IF NOT EXISTS idx_orders_location ON orders(delivery_latitude, delivery_longitude);
