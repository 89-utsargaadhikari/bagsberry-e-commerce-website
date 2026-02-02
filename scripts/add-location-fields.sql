-- Add location fields to orders table for map pin functionality

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS delivery_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS delivery_map_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN orders.delivery_latitude IS 'Latitude of delivery location pin';
COMMENT ON COLUMN orders.delivery_longitude IS 'Longitude of delivery location pin';
COMMENT ON COLUMN orders.delivery_map_url IS 'Google Maps URL for delivery person';

-- Create index for location-based queries (if needed in future)
CREATE INDEX IF NOT EXISTS idx_orders_location ON orders(delivery_latitude, delivery_longitude);

-- Verify the changes
SELECT column_name, data_type, numeric_precision, numeric_scale, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('delivery_latitude', 'delivery_longitude', 'delivery_map_url')
ORDER BY ordinal_position;
